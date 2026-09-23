import { PsychiatricAssessment } from '../types/assessment';

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
