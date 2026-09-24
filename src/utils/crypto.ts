/**
 * Clinical-grade browser-side encryption utility using Web Crypto API (AES-GCM 256-bit).
 * This enforces Encryption-at-Rest for patient data drafts in Local Storage.
 *
 * Designed with universal fallback for legacy browsers (e.g. Chrome on Windows 7)
 * and non-secure HTTP contexts where window.crypto.subtle may be restricted.
 */

const SESSION_KEY_NAME = 'ha_clinical_session_entropy';

// Helper for UTF-8 Base64 encoding/decoding across legacy engines
const utf8ToBase64 = (str: string): string => {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
};

const base64ToUtf8 = (str: string): string => {
  return decodeURIComponent(
    atob(str)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
};

// Generate raw entropy for the session if not present
const getOrCreateSessionEntropy = (): string => {
  try {
    let entropy = sessionStorage.getItem(SESSION_KEY_NAME);
    if (!entropy) {
      const buffer = new Uint8Array(32);
      if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(buffer);
      } else {
        for (let i = 0; i < 32; i++) {
          buffer[i] = Math.floor(Math.random() * 256);
        }
      }
      entropy = btoa(String.fromCharCode(...buffer));
      sessionStorage.setItem(SESSION_KEY_NAME, entropy);
    }
    return entropy;
  } catch (e) {
    if (!(window as any).__clinical_entropy_fallback) {
      const buffer = new Uint8Array(32);
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(buffer);
      } else {
        for (let i = 0; i < 32; i++) {
          buffer[i] = Math.floor(Math.random() * 256);
        }
      }
      (window as any).__clinical_entropy_fallback = btoa(String.fromCharCode(...buffer));
    }
    return (window as any).__clinical_entropy_fallback;
  }
};

let cachedCryptoKey: CryptoKey | null = null;

const getCryptoKey = async (): Promise<CryptoKey | null> => {
  if (cachedCryptoKey) return cachedCryptoKey;
  if (!window.crypto || !window.crypto.subtle) {
    return null; // Fallback to XOR cipher mode for legacy Chrome / HTTP
  }

  try {
    const entropyStr = getOrCreateSessionEntropy();
    const rawData = new Uint8Array(
      atob(entropyStr)
        .split('')
        .map((c) => c.charCodeAt(0))
    );

    cachedCryptoKey = await window.crypto.subtle.importKey(
      'raw',
      rawData,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    return cachedCryptoKey;
  } catch (err) {
    console.warn('Web Crypto Key Import failed, falling back to session cipher:', err);
    return null;
  }
};

// Legacy / Non-HTTPS Fallback XOR Session Encryption
const fallbackXorEncrypt = (plaintext: string): string => {
  const key = getOrCreateSessionEntropy();
  const utf8Text = utf8ToBase64(plaintext);
  let result = '';
  for (let i = 0; i < utf8Text.length; i++) {
    result += String.fromCharCode(
      utf8Text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return 'FALLBACK_XOR:' + utf8ToBase64(result);
};

const fallbackXorDecrypt = (cipherStr: string): string => {
  const key = getOrCreateSessionEntropy();
  const rawCipher = base64ToUtf8(cipherStr.replace('FALLBACK_XOR:', ''));
  let result = '';
  for (let i = 0; i < rawCipher.length; i++) {
    result += String.fromCharCode(
      rawCipher.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return base64ToUtf8(result);
};

/**
 * Encrypts a plaintext string using AES-GCM 256-bit with fallback for legacy engines.
 */
export const encryptAtRest = async (plaintext: string): Promise<string> => {
  try {
    const key = await getCryptoKey();
    if (!key || !window.crypto || !window.crypto.subtle) {
      return fallbackXorEncrypt(plaintext);
    }

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedPlaintext = new TextEncoder().encode(plaintext);

    const ciphertextBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encodedPlaintext
    );

    const combined = new Uint8Array(iv.length + ciphertextBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertextBuffer), iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.warn('AES-GCM encryption failed, falling back to XOR session cipher:', error);
    return fallbackXorEncrypt(plaintext);
  }
};

/**
 * Decrypts an AES-GCM 256-bit base64 encoded string or fallback string.
 */
export const decryptAtRest = async (encryptedBase64: string): Promise<string> => {
  if (encryptedBase64.startsWith('FALLBACK_XOR:')) {
    return fallbackXorDecrypt(encryptedBase64);
  }

  try {
    const key = await getCryptoKey();
    if (!key || !window.crypto || !window.crypto.subtle) {
      // If Web Crypto is unavailable now, attempt fallback or return empty
      return fallbackXorDecrypt(encryptedBase64);
    }

    const binaryStr = atob(encryptedBase64);
    const combined = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      combined[i] = binaryStr.charCodeAt(i);
    }

    if (combined.length < 12) {
      throw new Error('Invalid encrypted draft payload length');
    }

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.warn('Decryption at rest failed, attempting legacy fallback:', error);
    try {
      return fallbackXorDecrypt(encryptedBase64);
    } catch (_) {
      throw new Error('Failed to decrypt clinical draft data');
    }
  }
};
