import React from 'react';
import { Stethoscope, Brain, Check, FlaskConical, Pill, FileCheck, CheckSquare, Sparkles } from 'lucide-react';
import { AssessmentStepProps } from './AssessmentStepProps';
import { InlineDictationButton } from '../InlineDictationButton';

const Step4PhysicalAndPlanComponent: React.FC<AssessmentStepProps> = ({
  data,
  onChange,
  errors,
  onBlurField,
  onApplyWnlPhysical,
  toggleArrayItem,
}) => {
  return (
    <div className="space-y-6">
      {/* SECTION F: Physical & Functional Assessment (Mirrors A4 Document Page 2 Box 3) */}
      <section id="section-f" className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-6 py-3.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">
                F. Physical & Functional Assessment (การตรวจร่างกายและการทำหน้าที่)
              </h3>
            </div>
            {onApplyWnlPhysical && (
              <button
                type="button"
                onClick={onApplyWnlPhysical}
                className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
                title="ตั้งค่าการตรวจร่างกายและระบบประสาททั้งหมดเป็นปกติ (WNL)"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>ปกติทั้งหมด (WNL)</span>
              </button>
            )}
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">สัญญาณชีพ และการตรวจทางกาย</span>
        </div>

        <div className="p-6 space-y-5">
          {/* Vital Signs Grid (Mirrors A4 Vitals Table) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Vital Signs (สัญญาณชีพ)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
              <div>
                <span className="text-xs text-slate-600">BP (mmHg)</span>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    value={data.bpSys}
                    onChange={e => onChange({ bpSys: e.target.value })}
                    placeholder="120"
                    className="w-14 text-sm font-mono border border-slate-300 rounded px-2 py-1.5 text-center focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    value={data.bpDia}
                    onChange={e => onChange({ bpDia: e.target.value })}
                    placeholder="80"
                    className="w-14 text-sm font-mono border border-slate-300 rounded px-2 py-1.5 text-center focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-600">PR (/min)</span>
                <input
                  type="number"
                  value={data.pulseRate}
                  onChange={e => onChange({ pulseRate: e.target.value })}
                  placeholder="76"
                  className="w-full text-sm font-mono border border-slate-300 rounded px-2 py-1.5 mt-1 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <span className="text-xs text-slate-600">RR (/min)</span>
                <input
                  type="number"
                  value={data.respRate}
                  onChange={e => onChange({ respRate: e.target.value })}
                  placeholder="18"
                  className="w-full text-sm font-mono border border-slate-300 rounded px-2 py-1.5 mt-1 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <span className="text-xs text-slate-600">Temp (°C)</span>
                <input
                  type="text"
                  value={data.temperature}
                  onChange={e => onChange({ temperature: e.target.value })}
                  placeholder="36.5"
                  className="w-full text-sm font-mono border border-slate-300 rounded px-2 py-1.5 mt-1 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <span className="text-xs text-slate-600">SpO2 (%)</span>
                <input
                  type="number"
                  value={data.spo2}
                  onChange={e => onChange({ spo2: e.target.value })}
                  placeholder="98"
                  className="w-full text-sm font-mono border border-slate-300 rounded px-2 py-1.5 mt-1 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <span className="text-xs text-slate-600">Pain Score</span>
                <input
                  type="text"
                  value={data.painScore}
                  onChange={e => onChange({ painScore: e.target.value })}
                  placeholder="No pain หรือ 0-10"
                  className="w-full text-sm font-mono border border-slate-300 rounded px-2 py-1.5 mt-1 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Physical Examination */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Physical Systems Examination (การตรวจร่างกายตามระบบ)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {[
                { label: 'General Appearance', key: 'generalAppearance', detailKey: 'generalAppearanceDetail' },
                { label: 'HEENT', key: 'heent', detailKey: 'heentDetail' },
                { label: 'CVS / RS', key: 'cvsRs', detailKey: 'cvsRsDetail' },
                { label: 'Abdomen', key: 'abdomen', detailKey: 'abdomenDetail' },
                { label: 'Extremities', key: 'extremities', detailKey: 'extremitiesDetail' },
              ].map(sys => (
                <div key={sys.key} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">{sys.label}</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => onChange({ [sys.key]: 'Normal' })}
                        className={`px-3 py-1.5 min-h-[34px] text-xs font-bold rounded-lg cursor-pointer transition-all ${
                          (data as any)[sys.key] === 'Normal'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({ [sys.key]: 'Abnormal' })}
                        className={`px-3 py-1.5 min-h-[34px] text-xs font-bold rounded-lg cursor-pointer transition-all ${
                          (data as any)[sys.key] === 'Abnormal'
                            ? 'bg-rose-600 text-white shadow-2xs ring-2 ring-rose-300/50'
                            : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Abnormal
                      </button>
                    </div>
                  </div>
                  {(data as any)[sys.key] === 'Abnormal' && (
                    <input
                      type="text"
                      value={(data as any)[sys.detailKey] || ''}
                      onChange={e => onChange({ [sys.detailKey]: e.target.value })}
                      placeholder="ระบุความผิดปกติ..."
                      className="w-full text-xs bg-white border border-rose-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Neurological Examination */}
          <div className="pt-3 border-t border-slate-100">
            <div className="bg-slate-50/90 rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="px-4 py-2.5 bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200 flex items-center flex-wrap gap-2.5 sm:gap-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Neurological Examination (การตรวจระบบประสาท)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onChange({
                      cranialNerves: 'Grossly intact',
                      cranialNervesDetail: '',
                      motorPower: 'Grade V all',
                      motorPowerDetail: '',
                      tone: 'Normal',
                      toneDetail: '',
                      sensory: 'Intact',
                      sensoryDetail: '',
                      reflexes: 'Normal',
                      reflexesDetail: '',
                      cerebellar: 'Normal',
                      cerebellarDetail: '',
                    });
                  }}
                  className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-md border border-emerald-300 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="คลิกเดียวเพื่อตั้งค่าการตรวจระบบประสาททั้งหมดเป็นปกติ (All Intact)"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>⚡ ปกติทุกข้อ (All Intact)</span>
                </button>
              </div>

              <div className="divide-y divide-slate-200 text-xs">
                {/* 1. Cranial Nerves */}
                <div className="px-4 py-3 hover:bg-slate-100/50 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                    <div className="md:col-span-3 font-semibold text-slate-800">
                      1. Cranial Nerves (CN):
                    </div>
                    <div className="md:col-span-9 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onChange({ cranialNerves: 'Grossly intact', cranialNervesDetail: '' })}
                        className={`px-3.5 py-1.5 min-h-[36px] rounded-lg cursor-pointer transition-all ${
                          data.cranialNerves === 'Grossly intact'
                            ? 'bg-blue-600 text-white font-bold shadow-2xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Grossly intact (ปกติ)
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({ cranialNerves: 'Abnormal' })}
                        className={`px-3.5 py-1.5 min-h-[36px] rounded-lg cursor-pointer transition-all ${
                          data.cranialNerves === 'Abnormal'
                            ? 'bg-rose-600 text-white font-bold shadow-xs ring-2 ring-rose-300/50'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Abnormal (ผิดปกติ)
                      </button>
                    </div>
                  </div>
                  {data.cranialNerves === 'Abnormal' && (
                    <div className="mt-2 md:ml-[25%]">
                      <input
                        type="text"
                        value={data.cranialNervesDetail}
                        onChange={e => onChange({ cranialNervesDetail: e.target.value })}
                        placeholder="ระบุเส้นประสาทสมองที่ผิดปกติ (เช่น CN VII, CN III...)..."
                        className="w-full border border-rose-300 rounded-lg px-2.5 py-1.5 bg-rose-50/30 text-xs focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Motor Power */}
                <div className="px-4 py-3 hover:bg-slate-100/50 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                    <div className="md:col-span-3 font-semibold text-slate-800">
                      2. Motor Power:
                    </div>
                    <div className="md:col-span-9 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onChange({ motorPower: 'Grade V all', motorPowerDetail: '' })}
                        className={`px-3.5 py-1.5 min-h-[36px] rounded-lg cursor-pointer transition-all ${
                          data.motorPower === 'Grade V all'
                            ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Grade V all (กำลังปกติทุกรยางค์)
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({ motorPower: 'Abnormal' })}
                        className={`px-3.5 py-1.5 min-h-[36px] rounded-lg cursor-pointer transition-all ${
                          data.motorPower === 'Abnormal'
                            ? 'bg-rose-600 text-white font-bold shadow-xs ring-2 ring-rose-300/50'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Weakness / Motor deficit (ผิดปกติ)
                      </button>
                    </div>
                  </div>
                  {data.motorPower === 'Abnormal' && (
                    <div className="mt-2 md:ml-[25%]">
                      <input
                        type="text"
                        value={data.motorPowerDetail}
                        onChange={e => onChange({ motorPowerDetail: e.target.value })}
                        placeholder="ระบุตำแหน่งและเกรดกำลังกล้ามเนื้อ (เช่น R't hemiparesis Grade IV, paraparesis...)..."
                        className="w-full border border-rose-300 rounded-lg px-2.5 py-1.5 bg-rose-50/30 text-xs focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  )}
                </div>

                {/* 3. Tone */}
                <div className="px-4 py-3 hover:bg-slate-100/50 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                    <div className="md:col-span-3 font-semibold text-slate-800">
                      3. Muscle Tone:
                    </div>
                    <div className="md:col-span-9 flex flex-wrap items-center gap-2">
                      {(['Normal', 'Rigidity', 'Spasticity', 'Flaccid'] as const).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => onChange({ tone: t, ...(t === 'Normal' ? { toneDetail: '' } : {}) })}
                          className={`px-3.5 py-1.5 min-h-[36px] rounded-lg cursor-pointer transition-all ${
                            data.tone === t
                              ? t === 'Normal'
                                ? 'bg-blue-600 text-white font-bold shadow-2xs'
                                : 'bg-rose-600 text-white font-bold shadow-xs ring-2 ring-rose-300/50'
                              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  {data.tone && data.tone !== 'Normal' && (
                    <div className="mt-2 md:ml-[25%]">
                      <input
                        type="text"
                        value={data.toneDetail}
                        onChange={e => onChange({ toneDetail: e.target.value })}
                        placeholder="ระบุรายละเอียด เช่น Lead-pipe rigidity, Cogwheel rigidity, Spasticity..."
                        className="w-full border border-rose-300 rounded-lg px-2.5 py-1.5 bg-rose-50/30 text-xs focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  )}
                </div>

                {/* 4. Sensory */}
                <div className="px-4 py-3 hover:bg-slate-100/50 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                    <div className="md:col-span-3 font-semibold text-slate-800">
                      4. Sensory:
                    </div>
                    <div className="md:col-span-9 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onChange({ sensory: 'Intact', sensoryDetail: '' })}
                        className={`px-3.5 py-1.5 min-h-[36px] rounded-lg cursor-pointer transition-all ${
                          data.sensory === 'Intact'
                            ? 'bg-blue-600 text-white font-bold shadow-2xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Intact (การรับความรู้สึกปกติ)
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({ sensory: 'Impaired' })}
                        className={`px-3.5 py-1.5 min-h-[36px] rounded-lg cursor-pointer transition-all ${
                          data.sensory === 'Impaired'
                            ? 'bg-rose-600 text-white font-bold shadow-xs ring-2 ring-rose-300/50'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Impaired / Deficit (ผิดปกติ)
                      </button>
                    </div>
                  </div>
                  {data.sensory === 'Impaired' && (
                    <div className="mt-2 md:ml-[25%]">
                      <input
                        type="text"
                        value={data.sensoryDetail}
                        onChange={e => onChange({ sensoryDetail: e.target.value })}
                        placeholder="ระบุระดับและตำแหน่ง เช่น Numbness both feet (stocking-glove pattern)..."
                        className="w-full border border-rose-300 rounded-lg px-2.5 py-1.5 bg-rose-50/30 text-xs focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  )}
                </div>

                {/* 5. DTR Reflexes */}
                <div className="px-4 py-3 hover:bg-slate-100/50 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                    <div className="md:col-span-3 font-semibold text-slate-800">
                      5. Deep Tendon Reflexes (DTR):
                    </div>
                    <div className="md:col-span-9 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onChange({ reflexes: 'Normal', reflexesDetail: '' })}
                        className={`px-3.5 py-1.5 min-h-[36px] rounded-lg cursor-pointer transition-all ${
                          data.reflexes === 'Normal'
                            ? 'bg-blue-600 text-white font-bold shadow-2xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        2+ all (Normal)
                      </button>
                      {(['Hyporeflexia', 'Hyperreflexia', 'Abnormal'] as const).map(
                        r => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => onChange({ reflexes: r })}
                            className={`px-3.5 py-1.5 min-h-[36px] rounded-lg cursor-pointer transition-all ${
                              data.reflexes === r
                                ? 'bg-rose-600 text-white font-bold shadow-xs ring-2 ring-rose-300/50'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {r}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  {data.reflexes && data.reflexes !== 'Normal' && (
                    <div className="mt-2 md:ml-[25%]">
                      <input
                        type="text"
                        value={data.reflexesDetail}
                        onChange={e => onChange({ reflexesDetail: e.target.value })}
                        placeholder="ระบุตำแหน่งรีเฟล็กซ์ที่ผิดปกติ และ Babinski sign..."
                        className="w-full border border-rose-300 rounded-lg px-2.5 py-1.5 bg-rose-50/30 text-xs focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  )}
                </div>

                {/* 6. Cerebellar Signs */}
                <div className="px-4 py-3 hover:bg-slate-100/50 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                    <div className="md:col-span-3 font-semibold text-slate-800">
                      6. Cerebellar Signs / Coordination:
                    </div>
                    <div className="md:col-span-9 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onChange({ cerebellar: 'Normal', cerebellarDetail: '' })}
                        className={`px-3.5 py-1.5 min-h-[36px] rounded-lg cursor-pointer transition-all ${
                          data.cerebellar === 'Normal'
                            ? 'bg-blue-600 text-white font-bold shadow-2xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Normal / Intact
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({ cerebellar: 'Abnormal' })}
                        className={`px-3.5 py-1.5 min-h-[36px] rounded-lg cursor-pointer transition-all ${
                          data.cerebellar === 'Abnormal'
                            ? 'bg-rose-600 text-white font-bold shadow-xs ring-2 ring-rose-300/50'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Abnormal (Ataxia, Dysmetria, Dysdiadochokinesia...)
                      </button>
                    </div>
                  </div>
                  {data.cerebellar === 'Abnormal' && (
                    <div className="mt-2 md:ml-[25%]">
                      <input
                        type="text"
                        value={data.cerebellarDetail}
                        onChange={e => onChange({ cerebellarDetail: e.target.value })}
                        placeholder="ระบุผล Finger-to-nose, Heel-to-shin, Rapid alternating movements หรือ Tandem gait..."
                        className="w-full border border-rose-300 rounded-lg px-2.5 py-1.5 bg-rose-50/30 text-xs focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Functional, Nutrition & ADL */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="font-bold text-xs text-slate-800">Nutrition:</span>
              <div className="flex gap-2">
                {(['Normal', 'Impaired'] as const).map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onChange({ nutrition: n })}
                    className={`px-3.5 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      data.nutrition === n
                        ? n === 'Normal'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold text-xs text-slate-800">ADL:</span>
              <div className="flex gap-2">
                {(['Independent', 'Dependent'] as const).map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => onChange({ adl: a })}
                    className={`px-3.5 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      data.adl === a
                        ? a === 'Independent'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION I & J: Investigation & Diagnosis (Mirrors A4 Document Page 3 Box 1) */}
      <section id="section-i-j" className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-6 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              I. Investigation & J. Diagnosis (การตรวจทางห้องปฏิบัติการและการวินิจฉัย)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Lab, Imaging และการวินิจฉัย ICD-10</span>
        </div>

        <div className="p-6 space-y-6">
          {/* Section I */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                I. การตรวจทางห้องปฏิบัติการ (Investigation):
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ investigationStatus: 'ไม่จำเป็นต้องส่งตรวจ' })}
                  className={`px-3.5 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.investigationStatus === 'ไม่จำเป็นต้องส่งตรวจ'
                      ? 'bg-slate-700 text-white border-slate-700 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ไม่จำเป็นต้องส่งตรวจ
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ investigationStatus: 'ส่งตรวจ Lab' })}
                  className={`px-3.5 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.investigationStatus === 'ส่งตรวจ Lab'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ส่งตรวจ Lab (เลือกติ๊ก)
                </button>
              </div>
            </div>

            {data.investigationStatus === 'ส่งตรวจ Lab' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex flex-wrap gap-2">
                  {['CBC', 'BUN/Cr', 'Electrolyte', 'LFT', 'TFT', 'U-Tox (สารเสพติด)', 'VDRL/Anti-HIV'].map(
                    lab => (
                      <button
                        key={lab}
                        type="button"
                        onClick={() => toggleArrayItem('labTests', lab)}
                        className={`text-xs px-2.5 py-1 rounded border cursor-pointer transition-colors ${
                          data.labTests.includes(lab)
                            ? 'bg-blue-600 text-white border-blue-600 font-medium'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {lab}
                      </button>
                    )
                  )}
                </div>
                <input
                  type="text"
                  value={data.labOther}
                  onChange={e => onChange({ labOther: e.target.value })}
                  placeholder="Lab อื่นๆ..."
                  className="w-full text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            )}

            <div className="mt-2.5">
              <label className="block text-xs text-slate-600 mb-1 font-medium">
                Neuroimaging / EEG / EKG:
              </label>
              <input
                type="text"
                value={data.neuroimaging}
                onChange={e => onChange({ neuroimaging: e.target.value })}
                placeholder="เช่น CT Brain Normal, EKG NSR..."
                className="w-full text-xs bg-white border border-slate-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Section J: Diagnosis */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                J. กลุ่มโรค (Diagnostic Category - Primary)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'F00-F09 Neurocognitive d/o',
                  'F10-F19 Substance-related',
                  'F20-F29 Schizophrenia/Psychotic',
                  'F30-F39 Mood d/o',
                  'F40-F48 Anxiety/Somatoform',
                ].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleArrayItem('diagnosticCategory', cat)}
                    className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                      data.diagnosticCategory.includes(cat)
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={data.diagnosticCategoryOther}
                onChange={e => onChange({ diagnosticCategoryOther: e.target.value })}
                placeholder="กลุ่มโรคอื่นๆ..."
                className="w-full text-xs border border-slate-300 rounded px-3 py-1.5 mt-2 bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  รายละเอียดการวินิจฉัย (Primary Dx / ICD-10) <span className="text-slate-400 font-normal text-[11px]">(ถ้ามี)</span>
                </label>
                <input
                  type="text"
                  value={data.primaryDiagnosis}
                  onChange={e => onChange({ primaryDiagnosis: e.target.value })}
                  onBlur={e => onBlurField && onBlurField('primaryDiagnosis', e.target.value)}
                  placeholder="เช่น Major Depressive Disorder (F32.1)"
                  className={`w-full text-sm font-semibold bg-white border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                    errors.primaryDiagnosis ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Differential Dx / Comorbidity
                </label>
                <input
                  type="text"
                  value={data.differentialDiagnosis}
                  onChange={e => onChange({ differentialDiagnosis: e.target.value })}
                  onBlur={e => onBlurField && onBlurField('differentialDiagnosis', e.target.value)}
                  placeholder="เช่น Adjustment disorder with depressed mood"
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION K: Care Plan & Medical Intervention (Mirrors A4 Document Page 3 Box 2) */}
      <section id="section-k" className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-6 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              K. Care Plan & Medical Intervention (แผนการดูแลและรักษา)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">แผนการให้ยา การบำบัด และสหสาขาวิชาชีพ</span>
        </div>

        <div className="p-6 space-y-5">
          {/* 1. Pharmacological */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              1. Pharmacological Treatment (กลุ่มยาที่สั่งใช้)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {(['ไม่มีการสั่งยาจิตเวช', 'มียาจิตเวชเดิม (ไม่ปรับเปลี่ยน)', 'ปรับ/เริ่มยาใหม่'] as const).map(
                opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onChange({ pharmPlan: opt })}
                    className={`px-3.5 py-2 min-h-[38px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      data.pharmPlan === opt
                        ? opt === 'ปรับ/เริ่มยาใหม่'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-700 text-white border-slate-700 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                )
              )}
            </div>

            {data.pharmPlan === 'ปรับ/เริ่มยาใหม่' && (
              <div className="p-4 bg-blue-50/30 border border-blue-200 rounded-xl space-y-3">
                <span className="text-xs font-bold text-blue-900 block">
                  เลือกกลุ่มยาที่เริ่ม/ปรับ:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Antidepressants',
                    'Antipsychotics',
                    'Mood Stabilizers',
                    'Anxiolytics/Sedatives',
                    'Anticholinergics (แก้ EPS)',
                    'อื่นๆ',
                  ].map(group => (
                    <button
                      key={group}
                      type="button"
                      onClick={() => toggleArrayItem('medicationGroups', group)}
                      className={`text-xs px-3 py-2 min-h-[36px] rounded-lg border cursor-pointer transition-all ${
                        data.medicationGroups.includes(group)
                          ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-slate-700">
                      ระบุชื่อยา / Dose คร่าวๆ:
                    </label>
                    <InlineDictationButton
                      onTranscript={text => {
                        const existing = data.medicationDetails || '';
                        onChange({ medicationDetails: existing ? `${existing} ${text}` : text });
                      }}
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={data.medicationDetails}
                    onChange={e => onChange({ medicationDetails: e.target.value })}
                    onBlur={e => onBlurField && onBlurField('medicationDetails', e.target.value)}
                    placeholder="เช่น Sertraline (50) 1 tab po pc morning, Lorazepam (0.5) 1 tab po hs prn..."
                    className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Non-Pharmacological */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              2. Non-Pharmacological Treatment (การบำบัดทางจิตสังคม)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Psychoeducation',
                'Supportive Psychotherapy',
                'CBT / Specific Psychotherapy',
                'Family Therapy / Counseling',
              ].map(tx => (
                <button
                  key={tx}
                  type="button"
                  onClick={() => toggleArrayItem('nonPharmTreatments', tx)}
                  className={`text-xs px-3 py-2 min-h-[38px] rounded-lg border cursor-pointer transition-all ${
                    data.nonPharmTreatments.includes(tx)
                      ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {tx}
                </button>
              ))}
            </div>
          </div>

          {/* 3. MDT Consult */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Multidisciplinary Team (MDT) Consult:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ mdtConsult: 'ไม่ส่ง' })}
                  className={`px-3.5 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.mdtConsult === 'ไม่ส่ง'
                      ? 'bg-slate-700 text-white border-slate-700 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ไม่ส่ง
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ mdtConsult: 'ส่ง' })}
                  className={`px-3.5 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.mdtConsult === 'ส่ง'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ส่ง Consult
                </button>
              </div>
            </div>

            {data.mdtConsult === 'ส่ง' && (
              <div className="p-3.5 bg-blue-50/40 border border-blue-200 rounded-xl space-y-2.5">
                <span className="text-xs font-semibold text-blue-900 block">เลือกทีมสหวิชาชีพที่ต้องการปรึกษา:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'นักจิตวิทยาคลินิก',
                    'นักสังคมสงเคราะห์',
                    'อายุรแพทย์',
                  ].map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleArrayItem('mdtRoles', role)}
                      className={`text-xs px-3 py-2 min-h-[36px] rounded-lg border cursor-pointer transition-all ${
                        data.mdtRoles.includes(role)
                          ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={data.mdtOther}
                  onChange={e => onChange({ mdtOther: e.target.value })}
                  placeholder="แพทย์เฉพาะทางอื่นๆ หรือบุคลากรอื่น..."
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION L & M: Involvement & Indication for Admission (Mirrors A4 Document Page 3 Box 3) */}
      <section id="section-l-m" className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-6 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              L. Patient & Family Involvement & M. Indication for Admission
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">ข้อบ่งชี้การรับไว้รักษา การติดตาม การลงชื่อแพทย์</span>
        </div>

        <div className="p-6 space-y-6">
          {/* Section L */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              L. Patient & Family Involvement (การมีส่วนร่วม)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {[
                { label: 'อธิบายการวินิจฉัยแล้ว', key: 'explainedDiagnosis' },
                { label: 'อธิบายแผนการรักษา/ทางเลือกแล้ว', key: 'explainedCarePlan' },
                { label: 'อธิบายผลข้างเคียงยาแล้ว', key: 'explainedSideEffects' },
                { label: 'แนะนำอาการเตือนที่ต้องรีบมาพบแพทย์', key: 'explainedWarningSigns' },
              ].map(item => (
                <label
                  key={item.key}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(data as any)[item.key]}
                    onChange={e => onChange({ [item.key]: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">ข้อกังวลของผู้ป่วย/ญาติ:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ concernsStatus: 'ไม่มี', concernsDetail: '' })}
                  className={`px-3.5 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.concernsStatus === 'ไม่มี'
                      ? 'bg-slate-700 text-white border-slate-700 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ไม่มีข้อกังวล
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ concernsStatus: 'มี' })}
                  className={`px-3.5 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.concernsStatus === 'มี'
                      ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  มีข้อกังวล (ระบุ)
                </button>
              </div>
              {data.concernsStatus === 'มี' && (
                <input
                  type="text"
                  value={data.concernsDetail}
                  onChange={e => onChange({ concernsDetail: e.target.value })}
                  placeholder="ระบุข้อกังวล เช่น เรื่องงาน, ผลข้างเคียงยา..."
                  className="flex-1 min-w-[200px] text-xs border border-amber-300 rounded-lg px-3 py-2 bg-amber-50/20 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Section M */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  M. Indication for Admission (ข้อบ่งชี้ในการรับไว้รักษาในโรงพยาบาล)
                </label>
                <span className="text-xs text-slate-500">เลือกข้อบ่งชี้ตามเกณฑ์การประเมิน (เลือกได้หลายข้อ)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'เป็นอันตรายต่อตนเอง (Risk of Harm to Self)',
                  'เป็นอันตรายต่อผู้อื่น (Risk of Harm to Others)',
                  'ผลการรักษาแบบผู้ป่วยนอกล้มเหลว (Failure of outpatient treatment)',
                  'ต้องการการปรับยาหรือเฝ้าระวังผลข้างเคียงอย่างใกล้ชิด',
                ].map(item => {
                  const isChecked = (data.admissionIndications || []).includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleArrayItem('admissionIndications', item)}
                      className={`p-3 text-xs rounded-lg border text-left flex items-start gap-2.5 transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-blue-50 border-blue-600 text-blue-950 font-semibold shadow-xs'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <CheckSquare
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          isChecked ? 'text-blue-600' : 'text-slate-300'
                        }`}
                      />
                      <span className="leading-snug">{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Doctor Signature & Identification (Mirrors A4 Document Page 3 Bottom Signature Block) */}
            <div className="p-5 bg-slate-50 border border-slate-300 rounded-xl space-y-3 mt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
                ข้อมูลแพทย์ผู้ประเมิน
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-700 mb-1 font-semibold flex items-center justify-between">
                    <span>
                      ชื่อแพทย์ผู้ประเมิน <span className="text-red-500">*</span>
                    </span>
                    {!data.physicianName?.trim() && (
                      <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        จำเป็นต้องระบุ
                      </span>
                    )}
                  </label>
                  <input
                    id="field-physicianName"
                    type="text"
                    value={data.physicianName}
                    onChange={e => onChange({ physicianName: e.target.value })}
                    onBlur={e => onBlurField && onBlurField('physicianName', e.target.value)}
                    placeholder="เช่น นพ. หรือ พญ. ..."
                    className={`w-full text-sm bg-white border rounded px-3 py-1.5 transition-all focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                      errors.physicianName
                        ? 'border-red-500 bg-red-50'
                        : !data.physicianName?.trim()
                        ? 'border-slate-300 border-l-4 border-l-rose-500 bg-rose-50/20'
                        : 'border-slate-300'
                    }`}
                  />
                  {errors.physicianName && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.physicianName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-slate-700 mb-1 font-semibold">
                    เลขที่ใบประกอบวิชาชีพ
                  </label>
                  <input
                    type="text"
                    value={data.licenseNumber}
                    onChange={e => onChange({ licenseNumber: e.target.value })}
                    onBlur={e => onBlurField && onBlurField('licenseNumber', e.target.value)}
                    placeholder="เช่น ว. 12345"
                    className="w-full text-sm font-mono bg-white border border-slate-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-700 mb-1 font-semibold">
                    ลายมือชื่อ / ผู้บันทึก
                  </label>
                  <input
                    type="text"
                    value={data.signatureText}
                    onChange={e => onChange({ signatureText: e.target.value })}
                    onBlur={e => onBlurField && onBlurField('signatureText', e.target.value)}
                    placeholder="ลายมือชื่อแพทย์"
                    className="w-full text-sm bg-white border border-slate-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none italic"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const Step4PhysicalAndPlan = React.memo(Step4PhysicalAndPlanComponent, (prevProps, nextProps) => {
  const step4Keys: (keyof typeof prevProps.data)[] = [
    'generalAppearance',
    'generalAppearanceDetail',
    'heent',
    'heentDetail',
    'cvsRs',
    'cvsRsDetail',
    'abdomen',
    'abdomenDetail',
    'extremities',
    'extremitiesDetail',
    'cranialNerves',
    'cranialNervesDetail',
    'motorPower',
    'motorPowerDetail',
    'tone',
    'toneDetail',
    'sensory',
    'sensoryDetail',
    'reflexes',
    'reflexesDetail',
    'cerebellar',
    'cerebellarDetail',
    'nutrition',
    'adl',
    'temperature',
    'pulseRate',
    'respRate',
    'bpSys',
    'bpDia',
    'spo2',
    'painScore',
    'investigationStatus',
    'labTests',
    'labOther',
    'neuroimaging',
    'diagnosticCategory',
    'diagnosticCategoryOther',
    'primaryDiagnosis',
    'differentialDiagnosis',
    'pharmPlan',
    'medicationGroups',
    'medicationDetails',
    'nonPharmTreatments',
    'mdtConsult',
    'mdtRoles',
    'mdtOther',
    'explainedDiagnosis',
    'explainedCarePlan',
    'explainedSideEffects',
    'explainedWarningSigns',
    'concernsStatus',
    'concernsDetail',
    'admissionIndications',
    'disposition',
    'referTo',
    'followUpDate',
    'reassessmentFocus',
    'physicianName',
    'licenseNumber',
    'signatureText'
  ];

  for (const key of step4Keys) {
    if (prevProps.data[key] !== nextProps.data[key]) {
      return false;
    }
  }

  if (prevProps.errors.physicianName !== nextProps.errors.physicianName) {
    return false;
  }

  return true;
});
