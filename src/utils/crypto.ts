/**
 * Clinical-grade browser-side encryption utility using Web Crypto API (AES-GCM 256-bit).
 * This enforces Encryption-at-Rest for patient data drafts in Local Storage.
 *
 * Keys are bound to sessionStorage (session-bound), meaning when the browser tab/session
 * is closed, the key is permanently destroyed, making any remaining storage bytes
 * mathematically unrecoverable.
 */

const SESSION_KEY_NAME = 'ha_clinical_session_entropy';

// Generate raw 256-bit entropy for the session if not present, and store in sessionStorage
const getOrCreateSessionEntropy = (): string => {
  try {
    let entropy = sessionStorage.getItem(SESSION_KEY_NAME);
    if (!entropy) {
      const buffer = new Uint8Array(32); // 256 bits of cryptographically secure random entropy
      window.crypto.getRandomValues(buffer);
      entropy = btoa(String.fromCharCode(...buffer));
      sessionStorage.setItem(SESSION_KEY_NAME, entropy);
    }
    return entropy;
  } catch (e) {
    console.error('Failed to access sessionStorage for crypto entropy:', e);
    // Fallback in-memory entropy for environments without sessionStorage access
    if (!(window as any).__clinical_entropy_fallback) {
      const buffer = new Uint8Array(32);
      window.crypto.getRandomValues(buffer);
      (window as any).__clinical_entropy_fallback = btoa(String.fromCharCode(...buffer));
    }
    return (window as any).__clinical_entropy_fallback;
  }
};

let cachedCryptoKey: CryptoKey | null = null;

// Import or derive CryptoKey from the session entropy
const getCryptoKey = async (): Promise<CryptoKey> => {
  if (cachedCryptoKey) return cachedCryptoKey;

  const entropyStr = getOrCreateSessionEntropy();
  // Use Web Crypto to derive a strong AES-GCM 256-bit key
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
};

/**
 * Encrypts a plaintext string using AES-GCM 256-bit with an ephemeral IV.
 * @returns Base64 encoded string containing IV (12 bytes) + Ciphertext + Tag
 */
export const encryptAtRest = async (plaintext: string): Promise<string> => {
  try {
    const key = await getCryptoKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit standard IV for AES-GCM
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

    // Convert combined binary to base64 safely
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption at rest failed:', error);
    throw new Error('Failed to encrypt clinical draft data');
  }
};

/**
 * Decrypts an AES-GCM 256-bit base64 encoded string.
 */
export const decryptAtRest = async (encryptedBase64: string): Promise<string> => {
  try {
    const key = await getCryptoKey();
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
    console.error('Decryption at rest failed:', error);
    throw new Error('Failed to decrypt clinical draft data (Key might have expired/closed session)');
  }
};
