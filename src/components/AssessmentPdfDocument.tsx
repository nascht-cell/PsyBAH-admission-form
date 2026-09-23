import React from 'react';
import { PsychiatricAssessment } from '../types/assessment';

interface Props {
  data: PsychiatricAssessment;
  showPageBadges?: boolean;
}

interface FooterProps {
  data: PsychiatricAssessment;
  pageNumber: number;
  totalPages: number;
}

/**
 * 1-line multi-page footer required for Page 2 onwards:
 * "ชื่อ-สกุล: [ชื่อ-สกุล]   |   อายุ: [อายุ]   |   เพศ: [เพศ]   |   HN: [HN]   |   AN: [AN]   (หน้า X/Y)"
 */
const DocumentFooter: React.FC<FooterProps> = ({ data, pageNumber, totalPages }) => {
  const fullName = data.fullName?.trim() || 'ไม่ระบุชื่อ-สกุล';
  const age = data.age?.trim() ? `${data.age.trim()} ปี` : '-';
  const gender = data.gender || '-';
  const hn = data.hn?.trim() || '-';
  const an = data.an?.trim() || '-';

  return (
    <div className="a4-document-footer mt-auto pt-1.5 border-t border-black text-black" style={{ fontFamily: "'TH Sarabun PSK', 'TH Sarabun New', 'Sarabun', sans-serif" }}>
      <div className="flex justify-between items-center text-[12pt] leading-tight">
        <div className="truncate">
          <span className="font-bold">ชื่อ-สกุล:</span> {fullName} &nbsp;&nbsp;|&nbsp;&nbsp;{' '}
          <span className="font-bold">อายุ:</span> {age} &nbsp;&nbsp;|&nbsp;&nbsp;{' '}
          <span className="font-bold">เพศ:</span> {gender} &nbsp;&nbsp;|&nbsp;&nbsp;{' '}
          <span className="font-bold">HN:</span> <strong className="font-bold">{hn}</strong> &nbsp;&nbsp;|&nbsp;&nbsp;{' '}
          <span className="font-bold">AN:</span> <span className="font-bold">{an}</span>
        </div>
        <div className="shrink-0 pl-2 font-bold text-[12pt] text-black">
          (หน้า {pageNumber}/{totalPages})
        </div>
      </div>
    </div>
  );
};

const PageContinuationHeader: React.FC<{ data: PsychiatricAssessment; pageNumber: number; totalPages: number }> = ({
  data,
}) => (
  <div
    className="w-full max-w-full border-b border-black pb-1 mb-2 flex items-center justify-between overflow-hidden whitespace-nowrap leading-none"
    style={{ fontFamily: "'TH Sarabun PSK', 'TH Sarabun New', 'Sarabun', sans-serif" }}
  >
    <div className="flex items-center gap-1.5 min-w-0 flex-1 truncate text-[12pt]">
      <img
        src="/Official_emblem_of_Bhumibol_Adulyadej_Hospital.jpg"
        alt="ตราสัญลักษณ์"
        className="w-auto h-4 object-contain shrink-0"
        style={{ aspectRatio: '200 / 283' }}
        referrerPolicy="no-referrer"
      />
      <span className="font-bold text-black truncate">
        แบบบันทึกแรกรับผู้ป่วยจิตเวช (ต่อ) · กองจิตเวชและประสาทวิทยา รพ.ภูมิพลอดุลยเดช
      </span>
    </div>
    <div
      className="shrink-0 text-right text-black whitespace-nowrap pl-2 flex items-center gap-2 text-[12pt]"
      style={{ fontFamily: "'TH Sarabun PSK', 'TH Sarabun New', 'Sarabun', sans-serif" }}
    >
      <span className="flex items-center">
        <span className="font-bold">HN:</span>&nbsp;
        <strong className="font-bold text-black">{data.hn || '-'}</strong>
      </span>
      <span className="text-slate-400">|</span>
      <span className="flex items-center">
        <span className="font-bold">AN:</span>&nbsp;
        <strong className="font-bold text-black">{data.an || '-'}</strong>
      </span>
    </div>
  </div>
);

const renderCheck = (checked: boolean) => (
  <span className="inline-block font-mono font-bold mr-1 text-black">
    {checked ? '☑' : '☐'}
  </span>
);

const pageSheetStyle: React.CSSProperties = {
  width: '210mm',
  minHeight: '297mm',
  maxHeight: '297mm',
  height: '297mm',
  padding: '9mm 14mm 9mm 14mm',
  fontFamily: "'TH Sarabun PSK', 'TH Sarabun New', 'THSarabunNew', 'Sarabun', sans-serif",
  fontSize: '15pt',
  lineHeight: '1.25',
  boxSizing: 'border-box',
  color: '#000000',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  overflow: 'hidden',
};

const AssessmentPdfDocumentComponent: React.FC<Props> = ({ data, showPageBadges = false }) => {
  // Define pages in an array. This lets us support ANY number of pages dynamically.
  // Adding page 4, 5, etc. is as simple as adding another function in this array.
  // Memoized to prevent heavy re-allocation on every render.
  const pages = React.useMemo(() => [
    // =========================================================================
    // PAGE 1: Header + Section A (ID) + Section B (HPI) + Section C (History)
    // =========================================================================
    (pageNumber: number, totalPages: number) => (
      <div className="a4-page-sheet shadow-xl print:shadow-none" style={pageSheetStyle}>
        <div>
          {/* Official Header */}
          <div className="border-b-2 border-black pb-1.5 mb-2">
            {/* Top Row: Authentic Full-Color Emblem + Hospital Name | Date & Time Box */}
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="shrink-0 flex items-center justify-center">
                  <img
                    src="/Official_emblem_of_Bhumibol_Adulyadej_Hospital.jpg"
                    alt="ตราสัญลักษณ์ โรงพยาบาลภูมิพลอดุลยเดช"
                    className="w-auto object-contain shrink-0"
                    style={{
                      height: '50pt',
                      maxHeight: '50pt',
                      aspectRatio: '200 / 283',
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div
                    className="uppercase tracking-wider font-bold text-black leading-tight"
                    style={{ fontSize: '13pt' }}
                  >
                    Bhumibol Adulyadej Hospital
                  </div>
                  <div
                    className="text-black font-normal leading-snug"
                    style={{ fontSize: '12.5pt' }}
                  >
                    กองจิตเวชและประสาทวิทยา โรงพยาบาลภูมิพลอดุลยเดช
                  </div>
                </div>
              </div>

              {/* Dept, Date, Time Box */}
              <div
                className="text-right leading-snug border border-black p-1 px-2.5 rounded-xs bg-white shrink-0 min-w-40 text-black"
                style={{ fontSize: '12.5pt' }}
              >
                <div>
                  <span className="font-bold">แผนก:</span> {data.department || 'จิตเวชศาสตร์'}
                </div>
                <div>
                  <span className="font-bold">วันที่:</span> {data.assessmentDate || '-'}
                </div>
                <div>
                  <span className="font-bold">เวลา:</span> {data.assessmentTime || '-'} น.
                </div>
              </div>
            </div>

            {/* Framed Title Box: แบบบันทึกแรกรับผู้ป่วยจิตเวช (Mental Health Admission Form) */}
            <div className="border-2 border-black rounded-xs px-3 py-1 text-center bg-[#fcfcfc] my-1.5">
              <h1
                className="font-bold text-black tracking-wide"
                style={{ fontSize: '16.5pt', lineHeight: '1.15' }}
              >
                แบบบันทึกแรกรับผู้ป่วยจิตเวช
              </h1>
              <div
                className="font-bold text-black tracking-wide"
                style={{ fontSize: '13.5pt', lineHeight: '1.1' }}
              >
                (Mental Health Admission Form)
              </div>
            </div>

            {/* Admission Type & Identification Strip */}
            <div
              className="flex items-center justify-between pt-0.5 border-t border-black text-black"
              style={{ fontSize: '13.5pt' }}
            >
              <div className="flex items-center space-x-6">
                <span className="font-bold">ประเภทการรับผู้ป่วย:</span>
                <span>{renderCheck(data.admissionType === 'OPD')} OPD</span>
                <span>{renderCheck(data.admissionType === 'IPD')} IPD</span>
                <span>{renderCheck(data.admissionType === 'ER')} ER</span>
              </div>
              <div className="text-[13.5pt]">
                <span className="font-bold">HN:</span> <strong className="font-bold text-black">{data.hn || '________'}</strong>
                <span className="ml-4">
                  <span className="font-bold">AN:</span> <strong className="font-bold text-black">{data.an || '-'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* SECTION A: Patient Identification */}
          <div className="mb-2 avoid-break-inside">
            <div className="border-b border-black pb-0.5 mb-1 text-black font-bold text-[15pt]">
              A. Patient Identification (ข้อมูลระบุตัวผู้ป่วย)
            </div>
            <div className="space-y-0.5 text-[14.5pt]">
              <div className="grid grid-cols-12 gap-1.5">
                <div className="col-span-6">
                  <span className="font-bold">ชื่อ-สกุล:</span> {data.fullName || '-'}
                </div>
                <div className="col-span-3">
                  <span className="font-bold">อายุ:</span> {data.age ? `${data.age} ปี` : '-'}
                </div>
                <div className="col-span-3">
                  <span className="font-bold">เพศ:</span> {data.gender || '-'}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-1.5">
                <div className="col-span-4">
                  <span className="font-bold">สถานภาพ:</span> {data.maritalStatus || '-'}
                </div>
                <div className="col-span-4">
                  <span className="font-bold">อาชีพ:</span> {data.occupation || '-'}
                </div>
                <div className="col-span-4">
                  <span className="font-bold">ระดับการศึกษา:</span> {data.educationLevel || '-'}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-1.5 pt-0.5 border-t border-dotted border-slate-300">
                <div className="col-span-8">
                  <span className="font-bold">ผู้ให้ข้อมูลหลัก:</span>{' '}
                  {renderCheck(data.informant === 'ผู้ป่วยเอง')} ผู้ป่วยเอง{' '}
                  {renderCheck(data.informant === 'ญาติ/ผู้ดูแล')} ญาติ/ผู้ดูแล
                  {data.informantDetail && ` (${data.informantDetail})`}
                </div>
                <div className="col-span-4">
                  <span className="font-bold">ความน่าเชื่อถือ:</span> {data.reliability || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: Chief Complaint & HPI */}
          <div className="mb-2 avoid-break-inside">
            <div className="border-b border-black pb-0.5 mb-1 text-black font-bold text-[15pt]">
              B. Chief Complaint & History of Present Illness (อาการสำคัญและประวัติปัจจุบัน)
            </div>
            <div className="space-y-0.5 text-[14.5pt]">
              <div>
                <span className="font-bold">อาการสำคัญ (CC):</span>{' '}
                {data.chiefComplaint && data.chiefComplaint.length > 0 ? data.chiefComplaint.join(', ') : '-'}
                {data.chiefComplaintOther && ` (${data.chiefComplaintOther})`}
              </div>

              <div className="grid grid-cols-12 gap-1.5">
                <div className="col-span-4">
                  <span className="font-bold">ระยะเวลา:</span> {data.duration || '-'}
                </div>
                <div className="col-span-4">
                  <span className="font-bold">Onset:</span> {data.onset || '-'}
                </div>
                <div className="col-span-4">
                  <span className="font-bold">Course:</span> {data.course || '-'}
                </div>
              </div>

              {data.precipitatingFactors && data.precipitatingFactors.length > 0 && (
                <div>
                  <span className="font-bold">ปัจจัยกระตุ้น:</span> {data.precipitatingFactors.join(', ')}
                  {data.precipitatingFactorsOther && ` (${data.precipitatingFactorsOther})`}
                </div>
              )}

              {data.associatedSymptoms && data.associatedSymptoms.length > 0 && (
                <div>
                  <span className="font-bold">อาการร่วม:</span> {data.associatedSymptoms.join(', ')}
                </div>
              )}

              {data.hpiDetails && (
                <div className="p-1 bg-[#fcfcfc] border border-slate-300 rounded mt-0.5">
                  <span className="font-bold">รายละเอียดประวัติปัจจุบัน (HPI):</span>
                  <p className="whitespace-pre-wrap mt-0.5 text-justify leading-snug line-clamp-4">
                    {data.hpiDetails}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-12 gap-1.5 pt-0.5">
                <div className="col-span-6">
                  <span className="font-bold">ประวัติการรักษาเดิม:</span> {data.previousTreatment || '-'}
                  {data.previousHospital && ` (รพ. ${data.previousHospital})`}
                </div>
                <div className="col-span-6">
                  <span className="font-bold">การตอบสนอง:</span> {data.previousResponse || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION C: Psychiatric, Medical & Substance History */}
          <div className="mb-1 avoid-break-inside">
            <div className="border-b border-black pb-0.5 mb-1 text-black font-bold text-[15pt]">
              C. Psychiatric, Medical & Substance History (ประวัติการเจ็บป่วยและสารเสพติด)
            </div>
            <div className="space-y-0.5 text-[14.5pt]">
              <div className="grid grid-cols-12 gap-1.5">
                <div className="col-span-6">
                  <span className="font-bold">ประวัติจิตเวชเดิม:</span> {data.psychiatricHistory}
                  {data.psychiatricDisorders && data.psychiatricDisorders.length > 0 && (
                    <span> [{data.psychiatricDisorders.join(', ')}]</span>
                  )}
                  {data.psychiatricDisorderOther && ` (${data.psychiatricDisorderOther})`}
                </div>
                <div className="col-span-6">
                  <span className="font-bold">ประวัติ Admit จิตเวช:</span> {data.admitHistory}
                  {data.admitLastYear && ` (ช่วง 1 ปี: ${data.admitLastYear})`}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-1.5">
                <div className="col-span-6">
                  <span className="font-bold">โรคประจำตัวทางกาย:</span> {data.medicalHistory}
                  {data.medicalConditions && data.medicalConditions.length > 0 && (
                    <span> [{data.medicalConditions.join(', ')}]</span>
                  )}
                  {data.medicalHistoryOther && ` (${data.medicalHistoryOther})`}
                </div>
                <div className="col-span-6">
                  <span className="font-bold">ประวัติการแพ้:</span> {data.allergy}
                  {data.allergyDetail && ` (แพ้: ${data.allergyDetail})`}
                </div>
              </div>

              <div className="pt-0.5 border-t border-dotted border-slate-300">
                <span className="font-bold">ประวัติสารเสพติด:</span> {data.substanceHistory}
                <div className="grid grid-cols-4 gap-1.5 mt-0.5">
                  <div>
                    • สุรา: <strong>{data.alcoholUse || 'ปฏิเสธ'}</strong>
                  </div>
                  <div>
                    • บุหรี่: <strong>{data.smokingUse || 'ปฏิเสธ'}</strong>
                    {data.cigarettesPerDay && ` (${data.cigarettesPerDay} มวน/วัน)`}
                  </div>
                  <div>
                    • ยาบ้า: <strong>{data.methUse || 'ปฏิเสธ'}</strong>
                  </div>
                  <div>
                    • อื่นๆ: <strong>{data.otherSubstances && data.otherSubstances.length > 0 ? data.otherSubstances.join(', ') : 'ไม่มี'}</strong>
                    {data.otherSubstancesDetail && ` (${data.otherSubstancesDetail})`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Note: Page 1 has NO footer as requested by user */}
      </div>
    ),

    // =========================================================================
    // PAGE 2: Section D (MSE) + Section E (Safety) + Section F (Physical) + G/H
    // =========================================================================
    (pageNumber: number, totalPages: number) => (
      <div className="a4-page-sheet shadow-xl print:shadow-none" style={pageSheetStyle}>
        <div>
          <PageContinuationHeader data={data} pageNumber={pageNumber} totalPages={totalPages} />

          {/* SECTION D: Mental Status Examination (MSE) */}
          <div className="mb-2.5 avoid-break-inside">
            <div className="border-b border-black pb-0.5 mb-1 text-black font-bold text-[15pt]">
              D. Mental Status Examination (การตรวจสภาพจิต - MSE)
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[14.5pt]">
              <div>
                <span className="font-bold">1. Appearance & Psychomotor:</span>{' '}
                {data.appearanceBehavior && data.appearanceBehavior.length > 0 ? data.appearanceBehavior.join(', ') : '-'}
              </div>
              <div>
                <span className="font-bold">2. Speech:</span>{' '}
                {data.speech && data.speech.length > 0 ? data.speech.join(', ') : '-'}
              </div>
              <div>
                <span className="font-bold">3. Mood & Affect:</span>{' '}
                {data.moodAffect && data.moodAffect.length > 0 ? data.moodAffect.join(', ') : '-'}
              </div>
              <div>
                <span className="font-bold">4. Thought Process:</span>{' '}
                {data.thoughtProcess && data.thoughtProcess.length > 0 ? data.thoughtProcess.join(', ') : '-'}
              </div>
              <div className="col-span-2">
                <span className="font-bold">5. Thought Content:</span>{' '}
                {data.thoughtContent && data.thoughtContent.length > 0 ? data.thoughtContent.join(', ') : '-'}
                {data.delusionDetail && ` (Delusion: ${data.delusionDetail})`}
              </div>
              <div>
                <span className="font-bold">6. Perception:</span>{' '}
                {data.perception && data.perception.length > 0 ? data.perception.join(', ') : 'Normal'}
              </div>
              <div>
                <span className="font-bold">7. Orientation:</span>{' '}
                Time: {data.orientationTime ? '✓' : '✗'}, Place: {data.orientationPlace ? '✓' : '✗'}, Person: {data.orientationPerson ? '✓' : '✗'}
              </div>
              <div>
                <span className="font-bold">8. Attention & Memory:</span> {data.attentionMemory || '-'}
              </div>
              <div>
                <span className="font-bold">9. Insight & Judgment:</span> Insight: {data.insight || '-'}, Judgment: {data.judgment || '-'}
              </div>
            </div>
          </div>

          {/* SECTION E: Safety & Risk Assessment */}
          <div className="mb-2.5 avoid-break-inside">
            <div className="border-b border-black pb-0.5 mb-1 text-black font-bold text-[15pt]">
              E. Safety & Risk Assessment (การประเมินความเสี่ยงและความปลอดภัย)
            </div>
            <div className="grid grid-cols-12 gap-2 text-[14.5pt]">
              <div className="col-span-6 p-1 border border-slate-300 rounded bg-[#fcfcfc]">
                <span className="font-bold">1. ความเสี่ยงฆ่าตัวตาย/ทำร้ายตนเอง:</span>{' '}
                <strong className="underline">{data.suicideRisk || 'No Risk'}</strong>
              </div>
              <div className="col-span-6 p-1 border border-slate-300 rounded bg-[#fcfcfc]">
                <span className="font-bold">2. ความเสี่ยงก้าวร้าวรุนแรง (Violence):</span>{' '}
                <strong className="underline">{data.violenceRisk || 'No Risk'}</strong>
              </div>
              {data.otherRisks && data.otherRisks.length > 0 && (
                <div className="col-span-12">
                  <span className="font-bold">ความเสี่ยงอื่นๆ:</span> {data.otherRisks.join(', ')}
                </div>
              )}
              {data.safetyPlan && data.safetyPlan.length > 0 && (
                <div className="col-span-12 p-1 bg-[#fffdf0] border border-amber-300 rounded">
                  <span className="font-bold text-[#451a03]">Safety Plan:</span>{' '}
                  {data.safetyPlan.join(', ')}
                  {data.safetyPlanOther && ` (${data.safetyPlanOther})`}
                </div>
              )}
            </div>
          </div>

          {/* SECTION F: Physical & Functional Assessment */}
          <div className="mb-2.5 avoid-break-inside">
            <div className="border-b border-black pb-0.5 mb-1 text-black font-bold text-[15pt]">
              F. Physical & Functional Assessment (การประเมินทางกายและการทำหน้าที่)
            </div>
            <div className="space-y-1 text-[14.5pt]">
              <div className="p-1 border border-slate-300 rounded bg-[#fcfcfc] grid grid-cols-6 gap-1.5 text-center">
                <div>BP: <strong>{data.bpSys && data.bpDia ? `${data.bpSys}/${data.bpDia}` : '-'}</strong> mmHg</div>
                <div>PR: <strong>{data.pulseRate || '-'}</strong> bpm</div>
                <div>RR: <strong>{data.respRate || '-'}</strong> /min</div>
                <div>Temp: <strong>{data.temperature || '-'}</strong> °C</div>
                <div>SpO2: <strong>{data.spo2 || '-'}</strong> %</div>
                <div>Pain: <strong>{data.painScore || '-'}</strong></div>
              </div>

              <div className="grid grid-cols-12 gap-x-3 text-[14pt]">
                <div className="col-span-5 space-y-0.5">
                  <span className="font-bold block">Physical Exam:</span>
                  <div>• GA: {data.generalAppearance || '-'}{data.generalAppearanceDetail && ` (${data.generalAppearanceDetail})`}</div>
                  <div>• HEENT: {data.heent || '-'}{data.heentDetail && ` (${data.heentDetail})`}</div>
                  <div>• CVS/RS: {data.cvsRs || '-'}{data.cvsRsDetail && ` (${data.cvsRsDetail})`}</div>
                  <div>• Abd: {data.abdomen || '-'}{data.abdomenDetail && ` (${data.abdomenDetail})`}, Ext: {data.extremities || '-'}</div>
                </div>
                <div className="col-span-7 space-y-0.5 border-l border-slate-200 pl-2.5">
                  <span className="font-bold block">Neurological Exam:</span>
                  <div>• CN: {data.cranialNerves || 'Intact'}{data.cranialNervesDetail && ` (${data.cranialNervesDetail})`}</div>
                  <div>• Motor Power: {data.motorPower || data.motorSensory || 'Grade V all'}{data.motorPowerDetail && ` (${data.motorPowerDetail})`}</div>
                  <div>• Tone: {data.tone || 'Normal'} | Sensory: {data.sensory || 'Intact'}{data.sensoryDetail && ` (${data.sensoryDetail})`}</div>
                  <div>
                    • Reflex: {data.reflexes || data.reflexesCerebellar || 'Normal'}{data.reflexesDetail && ` (${data.reflexesDetail})`}
                    {' | '}Cerebellar: {data.cerebellar || 'Normal'}{data.cerebellarDetail && ` (${data.cerebellarDetail})`}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5 border-t border-dotted border-slate-300">
                <div><span className="font-bold">โภชนาการ:</span> {data.nutrition || '-'}</div>
                <div><span className="font-bold">กิจวัตรประจำวัน (ADL):</span> {data.adl || '-'}</div>
              </div>
            </div>
          </div>

          {/* SECTION G & H: Psychosocial & Standardized Assessment */}
          <div className="avoid-break-inside">
            <div className="border-b border-black pb-0.5 mb-1 text-black font-bold text-[15pt]">
              G. Psychosocial & H. Standardized Assessment (จิตสังคมและแบบประเมินมาตรฐาน)
            </div>
            <div className="grid grid-cols-2 gap-3 text-[14.5pt]">
              <div>
                <div>
                  <span className="font-bold">Psychosocial Stressors:</span>{' '}
                  {data.psychosocialStressors && data.psychosocialStressors.length > 0 ? data.psychosocialStressors.join(', ') : 'ไม่มี'}
                </div>
                <div>
                  <span className="font-bold">สภาพแวดล้อมที่อยู่:</span> {data.livingEnvironment || '-'}
                  {data.livingEnvironmentDetail && ` (${data.livingEnvironmentDetail})`}
                </div>
              </div>
              <div>
                <span className="font-bold">ผลแบบประเมินมาตรฐาน:</span>
                {data.standardizedAssessmentStatus === 'ไม่ได้ประเมิน' ? (
                  <span className="ml-1 text-slate-600">ไม่ได้ประเมิน</span>
                ) : (
                  <div className="space-y-0.5 mt-0.5">
                    {data.phq9Score && <div>• PHQ-9: <strong>{data.phq9Score}</strong> คะแนน</div>}
                    {data.nineQScore && <div>• 9Q: <strong>{data.nineQScore}</strong> คะแนน</div>}
                    {data.mmseMocaScore && <div>• MMSE/MoCA: <strong>{data.mmseMocaScore}</strong> คะแนน</div>}
                    {data.otherToolName && (
                      <div>• {data.otherToolName}: <strong>{data.otherToolScore}</strong> คะแนน</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <DocumentFooter data={data} pageNumber={pageNumber} totalPages={totalPages} />
      </div>
    ),

    // =========================================================================
    // PAGE 3: Section I & J (Dx) + Section K (Care Plan) + L/M/N + Signature
    // =========================================================================
    (pageNumber: number, totalPages: number) => (
      <div className="a4-page-sheet shadow-xl print:shadow-none" style={pageSheetStyle}>
        <div>
          <PageContinuationHeader data={data} pageNumber={pageNumber} totalPages={totalPages} />

          {/* SECTION I: Investigation */}
          <div className="mb-2 avoid-break-inside">
            <div className="border-b border-black pb-0.5 mb-1 text-black font-bold text-[15pt]">
              I. Investigation (การตรวจทางห้องปฏิบัติการและการตรวจพิเศษ)
            </div>
            <div className="space-y-0.5 text-[14.5pt]">
              <div>
                <span className="font-bold">การตรวจทางห้องปฏิบัติการ:</span> {data.investigationStatus}
                {data.investigationStatus === 'ส่งตรวจ Lab' && (
                  <span className="ml-2">[{data.labTests && data.labTests.join(', ')} {data.labOther && `, ${data.labOther}`}]</span>
                )}
                {data.neuroimaging && <span className="ml-3">Neuroimaging/EEG/EKG: {data.neuroimaging}</span>}
              </div>
            </div>
          </div>

          {/* SECTION J: Diagnosis */}
          <div className="mb-2 avoid-break-inside">
            <div className="border-b border-black pb-0.5 mb-1 text-black font-bold text-[15pt]">
              J. Diagnosis (การวินิจฉัยโรค)
            </div>
            <div className="space-y-0.5 text-[14.5pt]">
              <div>
                <span className="font-bold">กลุ่มโรค (Category):</span>{' '}
                {data.diagnosticCategory && data.diagnosticCategory.join(', ') || '-'}
                {data.diagnosticCategoryOther && ` (${data.diagnosticCategoryOther})`}
              </div>
              <div className="mt-0.5">
                <span className="font-bold text-black">Primary Diagnosis (ICD-10):</span>{' '}
                <strong className="underline text-black font-bold">{data.primaryDiagnosis || '-'}</strong>
              </div>
              {data.differentialDiagnosis && (
                <div className="mt-0.5">
                  <span className="font-bold">Differential Dx / Comorbidity:</span> {data.differentialDiagnosis}
                </div>
              )}
            </div>
          </div>

          {/* SECTION K: Care Plan & Medical Intervention */}
          <div className="mb-2.5 avoid-break-inside">
            <div className="border-b border-black pb-0.5 mb-1 text-black font-bold text-[15pt]">
              K. Care Plan & Medical Intervention (แผนการดูแลและรักษา)
            </div>
            <div className="space-y-0.5 text-[14.5pt]">
              <div>
                <span className="font-bold">1. Pharmacological:</span> {data.pharmPlan}
                {data.medicationGroups && data.medicationGroups.length > 0 && (
                  <span className="ml-2">[{data.medicationGroups.join(', ')}]</span>
                )}
                {data.medicationDetails && (
                  <div className="pl-3 font-medium text-black">
                    คำสั่งยา: {data.medicationDetails}
                  </div>
                )}
              </div>
              <div>
                <span className="font-bold">2. Non-Pharmacological:</span>{' '}
                {data.nonPharmTreatments && data.nonPharmTreatments.join(', ') || '-'}
              </div>
              <div>
                <span className="font-bold">3. MDT Consult:</span> {data.mdtConsult}
                {data.mdtConsult === 'ส่ง' && (
                  <span className="ml-2">
                    [{data.mdtRoles && data.mdtRoles.join(', ')} {data.mdtOther && `, ${data.mdtOther}`}]
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION L: Patient Involvement */}
          <div className="mb-2 avoid-break-inside">
            <div className="border-b border-black pb-0.5 mb-1 text-black font-bold text-[15pt]">
              L. Patient Involvement (การมีส่วนร่วมในการรักษา)
            </div>
            <div className="space-y-0.5 text-[14pt]">
              <div className="grid grid-cols-2 gap-1.5">
                <span>{renderCheck(data.explainedDiagnosis)} อธิบายการวินิจฉัยแล้ว</span>
                <span>{renderCheck(data.explainedCarePlan)} อธิบายแผนการรักษา/ทางเลือกแล้ว</span>
                <span>{renderCheck(data.explainedSideEffects)} อธิบายผลข้างเคียงยาแล้ว</span>
                <span>{renderCheck(data.explainedWarningSigns)} แนะนำอาการเตือนที่ต้องรีบมาพบแพทย์</span>
              </div>
              <div>
                <span className="font-bold">ข้อกังวลของผู้ป่วย/ญาติ:</span> {data.concernsStatus}{' '}
                {data.concernsDetail && `(${data.concernsDetail})`}
              </div>
            </div>
          </div>

          {/* Group Section M, Section N, and Physician Signature block together */}
          <div
            className="section-m-n-signature-block"
            style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
          >
            {/* SECTION M: Indication for Admission */}
            <div className="mb-2">
              <div className="border-b border-black pb-0.5 mb-1 text-black font-bold text-[15pt]">
                M. Indication for Admission (ข้อบ่งชี้ในการรับไว้รักษาในโรงพยาบาล)
              </div>
              {data.admissionIndications && data.admissionIndications.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[13.5pt]">
                  {data.admissionIndications.map((item, idx) => (
                    <span key={item} className="flex items-start">
                      {renderCheck(true)}{' '}
                      <span>{idx + 1}. {item}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-[13.5pt] text-slate-600">
                  - ไม่มีข้อบ่งชี้การรับไว้รักษาในโรงพยาบาล (รักษาแบบผู้ป่วยนอก OPD) -
                </div>
              )}
            </div>

            {/* Signature Box */}
            <div className="mt-8 pt-4 flex justify-end">
              <div className="w-84 text-center space-y-1.5 text-[14.5pt]">
                <div className="pb-1.5">
                  ลงชื่อ ............................................................................ แพทย์ผู้ประเมิน
                </div>
                <div className="font-bold text-black pt-0.5">
                  ({data.physicianName || '............................................................................'})
                </div>
                <div>
                  เลขที่ใบประกอบวิชาชีพ: {data.licenseNumber || '....................................'}
                </div>
                <div className="text-slate-600 text-[13pt]">
                  วันที่บันทึก: {data.assessmentDate} {data.assessmentTime} น.
                </div>
              </div>
            </div>
          </div>
        </div>
        <DocumentFooter data={data} pageNumber={pageNumber} totalPages={totalPages} />
      </div>
    ),
  ], [data]);

  const totalPagesCount = pages.length;

  return (
    <div
      id="psychiatric-assessment-pdf-document"
      data-fullname={data.fullName || ''}
      data-age={data.age || ''}
      data-gender={data.gender || ''}
      data-hn={data.hn || ''}
      data-an={data.an || ''}
      className="sarabun-document bg-transparent text-black mx-auto flex flex-col items-center gap-6 print:gap-0"
    >
      {pages.map((renderPage, index) => {
        const pageNumber = index + 1;
        return (
          <div key={pageNumber} className="w-full flex flex-col items-center">
            {showPageBadges && (
              <div
                className="w-[210mm] text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between no-print px-1"
                data-html2canvas-ignore="true"
              >
                <span className="bg-slate-700/80 text-slate-200 px-3 py-1 rounded-full text-xs font-medium shadow-xs">
                  หน้า {pageNumber} จาก {totalPagesCount}
                </span>
              </div>
            )}
            {renderPage(pageNumber, totalPagesCount)}
          </div>
        );
      })}
    </div>
  );
};

export const AssessmentPdfDocument = React.memo(AssessmentPdfDocumentComponent);
