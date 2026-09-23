import React, { useCallback, useRef } from 'react';
import { PsychiatricAssessment } from '../types/assessment';
import { Step1PatientAndComplaint } from './assessment/Step1PatientAndComplaint';
import { Step2PastAndPsychosocial } from './assessment/Step2PastAndPsychosocial';
import { Step3MseAndRisk } from './assessment/Step3MseAndRisk';
import { Step4PhysicalAndPlan } from './assessment/Step4PhysicalAndPlan';

interface Props {
  data: PsychiatricAssessment;
  onChange: (updated: Partial<PsychiatricAssessment>) => void;
  errors: Record<string, string>;
  onBlurField?: (field: string, value: any) => void;
  onOpenDictation?: (field: string) => void;
  collapsedSections?: Record<string, boolean>;
  onToggleSection?: (sectionKey: string) => void;
  onApplyWnlMse?: () => void;
  onApplyWnlPhysical?: () => void;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  viewMode?: 'wizard' | 'full';
  onViewModeChange?: (mode: 'wizard' | 'full') => void;
}

const PsychiatricAssessmentFormComponent: React.FC<Props> = ({
  data,
  onChange,
  errors,
  onBlurField,
  onOpenDictation,
  onApplyWnlMse,
  onApplyWnlPhysical,
}) => {
  const dataRef = useRef(data);
  dataRef.current = data;

  const toggleArrayItem = useCallback((field: keyof PsychiatricAssessment, item: string) => {
    const current = (dataRef.current[field] as string[]) || [];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    onChange({ [field]: updated });
  }, [onChange]);

  const isNormalMseOption = useCallback((field: keyof PsychiatricAssessment, item: string): boolean => {
    const lower = item.toLowerCase().trim();
    if (lower === 'normal') return true;
    if (field === 'moodAffect' && lower === 'euthymic') return true;
    if (field === 'thoughtProcess' && (lower === 'logical/coherent' || lower.includes('coherent'))) return true;
    return false;
  }, []);

  const toggleMseItem = useCallback((field: keyof PsychiatricAssessment, item: string) => {
    const current = (dataRef.current[field] as string[]) || [];
    const isNormal = isNormalMseOption(field, item);

    if (current.includes(item)) {
      onChange({ [field]: current.filter(i => i !== item) });
    } else {
      if (isNormal) {
        const extraUpdates: Partial<PsychiatricAssessment> = {};
        if (field === 'thoughtContent') {
          extraUpdates.delusionDetail = '';
        }
        onChange({ [field]: [item], ...extraUpdates });
      } else {
        const filtered = current.filter(i => !isNormalMseOption(field, i));
        onChange({ [field]: [...filtered, item] });
      }
    }
  }, [onChange, isNormalMseOption]);

  const handleDurationChange = useCallback((dur: string) => {
    let newOnset = dataRef.current.onset;
    if (dur === '1 วัน' || dur === '< 1 สัปดาห์' || dur === '1-4 สัปดาห์') {
      newOnset = 'เฉียบพลัน (Acute)';
    } else if (dur === '1-6 เดือน' || dur === '> 6 เดือน') {
      newOnset = 'ค่อยเป็นค่อยไป (Gradual)';
    }
    onChange({ duration: dur as any, onset: newOnset });
  }, [onChange]);

  const handleSuicideRiskChange = useCallback((risk: 'No Risk' | 'Low Risk' | 'Moderate Risk' | 'High Risk') => {
    const indications = new Set(dataRef.current.admissionIndications || []);
    const item = 'เป็นอันตรายต่อตนเอง (Risk of Harm to Self)';
    if (risk === 'Moderate Risk' || risk === 'High Risk') {
      indications.add(item);
    } else {
      indications.delete(item);
    }
    onChange({ suicideRisk: risk, admissionIndications: Array.from(indications) });
  }, [onChange]);

  const handleViolenceRiskChange = useCallback((risk: 'No Risk' | 'Low Risk' | 'Moderate Risk' | 'High Risk') => {
    const indications = new Set(dataRef.current.admissionIndications || []);
    const item = 'เป็นอันตรายต่อผู้อื่น (Risk of Harm to Others)';
    if (risk === 'Moderate Risk' || risk === 'High Risk') {
      indications.add(item);
    } else {
      indications.delete(item);
    }
    onChange({ violenceRisk: risk, admissionIndications: Array.from(indications) });
  }, [onChange]);

  const stepProps = {
    data,
    onChange,
    errors,
    onBlurField,
    onOpenDictation,
    onApplyWnlMse,
    onApplyWnlPhysical,
    toggleArrayItem,
    toggleMseItem,
    handleDurationChange,
    handleSuicideRiskChange,
    handleViolenceRiskChange,
  };

  return (
    <div className="space-y-6 pb-16">
      <Step1PatientAndComplaint {...stepProps} />
      <Step2PastAndPsychosocial {...stepProps} />
      <Step3MseAndRisk {...stepProps} />
      <Step4PhysicalAndPlan {...stepProps} />
    </div>
  );
};

export const PsychiatricAssessmentForm = React.memo(PsychiatricAssessmentFormComponent);
