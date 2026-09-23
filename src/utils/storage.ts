import { PsychiatricAssessment, samplePatientData } from '../types/assessment';

const STORAGE_KEY_PREFIX = 'ha_psychiatric_record_';
const INDEX_KEY = 'ha_psychiatric_records_index';

export interface PatientRecordMeta {
  hn: string;
  fullName: string;
  age: string;
  gender: string;
  assessmentDate: string;
  primaryDiagnosis: string;
  admissionType: string;
  updatedAt: string;
}

export const getRecordsIndex = (): PatientRecordMeta[] => {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read records index:', error);
    return [];
  }
};

const saveRecordsIndex = (list: PatientRecordMeta[]) => {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(list));
  } catch (error) {
    console.error('Failed to save records index:', error);
  }
};

export const saveAssessmentToStorage = (data: PsychiatricAssessment): boolean => {
  try {
    const cleanHN = data.hn.trim();
    if (!cleanHN) {
      throw new Error('HN is required to save');
    }

    const timestamp = new Date().toISOString();
    const assessmentToSave: PsychiatricAssessment = {
      ...data,
      hn: cleanHN,
      id: data.id || `rec_${cleanHN}_${Date.now()}`,
      createdAt: data.createdAt || timestamp,
      updatedAt: timestamp,
    };

    // Save individual record
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${cleanHN}`, JSON.stringify(assessmentToSave));

    // Update index list
    const index = getRecordsIndex();
    const existingIdx = index.findIndex(item => item.hn.toLowerCase() === cleanHN.toLowerCase());

    const meta: PatientRecordMeta = {
      hn: cleanHN,
      fullName: data.fullName.trim() || 'ไม่ระบุชื่อ',
      age: data.age,
      gender: data.gender,
      assessmentDate: data.assessmentDate,
      primaryDiagnosis: data.primaryDiagnosis || 'ยังไม่ระบุการวินิจฉัย',
      admissionType: data.admissionType || 'OPD',
      updatedAt: timestamp,
    };

    if (existingIdx >= 0) {
      index[existingIdx] = meta;
    } else {
      index.unshift(meta);
    }
    saveRecordsIndex(index);
    return true;
  } catch (error) {
    console.error('Error saving assessment:', error);
    return false;
  }
};

export const getAssessmentByHN = (hn: string): PsychiatricAssessment | null => {
  try {
    const cleanHN = hn.trim();
    if (!cleanHN) return null;

    // Check direct key
    const direct = localStorage.getItem(`${STORAGE_KEY_PREFIX}${cleanHN}`);
    if (direct) {
      return JSON.parse(direct);
    }

    // Try case-insensitive scan in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        const storedHN = key.replace(STORAGE_KEY_PREFIX, '');
        if (storedHN.toLowerCase() === cleanHN.toLowerCase()) {
          const item = localStorage.getItem(key);
          if (item) return JSON.parse(item);
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting assessment by HN:', error);
    return null;
  }
};

export const deleteAssessmentByHN = (hn: string): boolean => {
  try {
    const cleanHN = hn.trim();
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${cleanHN}`);

    // Remove any case-insensitive or whitespace-differing stored keys
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        const storedHN = key.slice(STORAGE_KEY_PREFIX.length).trim();
        if (storedHN.toLowerCase() === cleanHN.toLowerCase()) {
          keysToRemove.push(key);
        }
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));

    const index = getRecordsIndex();
    const filtered = index.filter(i => i.hn.trim().toLowerCase() !== cleanHN.toLowerCase());
    saveRecordsIndex(filtered);
    return true;
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return false;
  }
};

export const initializeSampleDataIfEmpty = () => {
  try {
    const hasInitialized = localStorage.getItem('ha_sample_initialized');
    if (hasInitialized) {
      return;
    }
    const index = getRecordsIndex();
    if (index.length === 0) {
      saveAssessmentToStorage(samplePatientData);
    }
    localStorage.setItem('ha_sample_initialized', 'true');
  } catch (e) {
    console.error(e);
  }
};

export const FORM_DRAFT_KEY = 'ha_form_current_draft';

export interface FormDraftPayload {
  data: PsychiatricAssessment;
  savedAt: string;
}

export const saveFormDraft = (data: PsychiatricAssessment): boolean => {
  try {
    const payload: FormDraftPayload = {
      data,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error('Error saving form draft:', error);
    return false;
  }
};

export const loadFormDraft = (): FormDraftPayload | null => {
  try {
    const raw = localStorage.getItem(FORM_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.data) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Error loading form draft:', error);
    return null;
  }
};

export const clearFormDraft = (): void => {
  try {
    localStorage.removeItem(FORM_DRAFT_KEY);
  } catch (error) {
    console.error('Error clearing form draft:', error);
  }
};
