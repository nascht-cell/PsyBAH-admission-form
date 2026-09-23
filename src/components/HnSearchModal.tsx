import React, { useState, useEffect, useMemo } from 'react';
import { Search, FileText, Trash2, Edit3, ArrowRight, UserCheck, AlertCircle, Clock, AlertTriangle, X } from 'lucide-react';
import { getAssessmentByHN, getRecordsIndex, deleteAssessmentByHN, PatientRecordMeta } from '../utils/storage';
import { PsychiatricAssessment } from '../types/assessment';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord: (record: PsychiatricAssessment) => void;
  onRecordsChange?: () => void;
}

export const HnSearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectRecord,
  onRecordsChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<PatientRecordMeta[]>([]);
  const [searchResult, setSearchResult] = useState<PsychiatricAssessment | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<{ hn: string; fullName: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadRecords();
      setSearchQuery('');
      setSearchResult(null);
      setHasSearched(false);
      setActionMessage(null);
      setRecordToDelete(null);
    }
  }, [isOpen]);

  const loadRecords = () => {
    const list = getRecordsIndex();
    setRecords(list);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    const record = getAssessmentByHN(query);
    setSearchResult(record);
    setHasSearched(true);
  };

  const handleLoadRecord = (record: PsychiatricAssessment) => {
    onSelectRecord(record);
    onClose();
  };

  const promptDelete = (hn: string, fullName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecordToDelete({ hn, fullName });
  };

  const handleConfirmDelete = () => {
    if (!recordToDelete) return;
    const targetHN = recordToDelete.hn;

    const success = deleteAssessmentByHN(targetHN);
    if (success) {
      loadRecords();
      if (searchResult?.hn.trim().toLowerCase() === targetHN.trim().toLowerCase()) {
        setSearchResult(null);
      }
      if (onRecordsChange) {
        onRecordsChange();
      }
      setActionMessage(`ลบข้อมูล HN: ${targetHN} สำเร็จแล้ว`);
      setTimeout(() => setActionMessage(null), 3500);
    } else {
      setActionMessage(`เกิดข้อผิดพลาดในการลบข้อมูล HN: ${targetHN}`);
      setTimeout(() => setActionMessage(null), 3500);
    }
    setRecordToDelete(null);
  };

  const filteredRecords = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return records;
    return records.filter(
      r =>
        r.hn.toLowerCase().includes(query) ||
        r.fullName.toLowerCase().includes(query) ||
        r.primaryDiagnosis.toLowerCase().includes(query)
    );
  }, [records, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] relative">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Search className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-semibold text-base text-white">ค้นหาและแก้ไขข้อมูลด้วย HN</h3>
              <p className="text-xs text-slate-400">
                ดึงประวัติการประเมินจาก Local Storage เพื่อแก้ไขหรือส่งออก PDF ได้ทันที
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 text-xl leading-none cursor-pointer"
            aria-label="ปิด"
          >
            &times;
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setHasSearched(false);
                  setSearchResult(null);
                }}
                placeholder="พิมพ์เลข HN (เช่น 67001234) หรือชื่อผู้ป่วย..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
            >
              ค้นหา HN
            </button>
          </form>

          {actionMessage && (
            <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 flex items-center justify-between">
              <span>{actionMessage}</span>
              <button
                onClick={() => setActionMessage(null)}
                className="text-emerald-500 hover:text-emerald-700"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Quick Result Callout if searched */}
          {hasSearched && (
            <div className="mt-3">
              {searchResult ? (
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-6 h-6 text-blue-600 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        HN: {searchResult.hn} — {searchResult.fullName} ({searchResult.gender}, {searchResult.age} ปี)
                      </div>
                      <div className="text-xs text-slate-600">
                        วันที่ประเมิน: {searchResult.assessmentDate} | วินิจฉัย: {searchResult.primaryDiagnosis || 'ยังไม่ระบุ'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLoadRecord(searchResult)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      โหลดเพื่อแก้ไข <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => promptDelete(searchResult.hn, searchResult.fullName, e)}
                      className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                      title="ลบข้อมูลรายการนี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    ไม่พบข้อมูลผู้ป่วยที่มี HN: <strong>{searchQuery}</strong> ใน Local Storage ท่านสามารถตรวจทานเลข HN หรือสร้างบันทึกใหม่ได้
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stored Records List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              ประวัติที่เคยบันทึกไว้ ({records.length} รายการ)
            </h4>
            <span className="text-xs text-slate-400">คลิกที่รายการเพื่อโหลดเข้าแบบฟอร์มทันที</span>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
              <FileText className="w-9 h-9 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">
                {records.length === 0 ? 'ยังไม่มีประวัติผู้ป่วยในระบบ' : 'ไม่พบข้อมูลที่ตรงกับคำค้นหา'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                เมื่อกรอกข้อมูลและกดบันทึก ข้อมูลจะถูกจัดเก็บลงใน Local Storage อัตโนมัติ
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRecords.map(item => (
                <div
                  key={item.hn}
                  onClick={() => {
                    const full = getAssessmentByHN(item.hn);
                    if (full) handleLoadRecord(full);
                  }}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                      HN
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 font-mono">{item.hn}</span>
                        <span className="text-sm font-medium text-slate-800">{item.fullName}</span>
                        {item.age && (
                          <span className="text-xs text-slate-500">({item.age} ปี, {item.gender})</span>
                        )}
                        <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">
                          {item.admissionType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                        <span>วันที่: {item.assessmentDate}</span>
                        <span>•</span>
                        <span className="truncate max-w-[280px]">Dx: {item.primaryDiagnosis}</span>
                        {item.updatedAt && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <Clock className="w-3 h-3" />
                              {new Date(item.updatedAt).toLocaleTimeString('th-TH', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        const full = getAssessmentByHN(item.hn);
                        if (full) handleLoadRecord(full);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
                      title="แก้ไขข้อมูล"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>แก้ไข</span>
                    </button>
                    <button
                      type="button"
                      onClick={e => promptDelete(item.hn, item.fullName, e)}
                      className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded transition-colors cursor-pointer"
                      title="ลบข้อมูล"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <div>ระบบจัดเก็บข้อมูลปลอดภัยในเครื่อง (Local Storage) ไม่ส่งข้อมูลออกภายนอก</div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded text-slate-700 font-medium transition-colors cursor-pointer"
          >
            ปิด
          </button>
        </div>

        {/* In-Modal Delete Confirmation Dialog (Avoids window.confirm blocked in iframe) */}
        {recordToDelete && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-60 animate-in fade-in duration-150">
            <div className="bg-white rounded-xl shadow-2xl border border-red-200 p-5 max-w-md w-full">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-slate-900">
                    ยืนยันการลบประวัติผู้ป่วย
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">
                    คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลประเมินของ:
                  </p>
                  <div className="my-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-500">เลข HN:</span>{' '}
                      <span className="font-mono font-bold text-blue-700">{recordToDelete.hn}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500">ชื่อ-สกุล:</span>{' '}
                      <span className="font-bold">{recordToDelete.fullName || 'ไม่ระบุชื่อ'}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 mt-2">
                    <p className="text-xs text-red-600 font-medium">
                      * เมื่อยืนยัน ระบบจะลบข้อมูลประวัติของผู้ป่วยรายนี้ออกจาก Local Storage ของเบราว์เซอร์อย่างถาวร
                    </p>
                    <p className="text-[11px] text-slate-500 bg-amber-50/80 border border-amber-200 rounded p-2">
                      💡 <strong>ข้อชี้แจงความปลอดภัยของเบราว์เซอร์:</strong> หากท่านเคยดาวน์โหลดเอกสารเป็นไฟล์ PDF หรือไฟล์เก็บไว้ในคอมพิวเตอร์ PC (เช่น ในโฟลเดอร์ Downloads) ระบบเว็บจะไม่สามารถเข้าถึงเพื่อลบไฟล์ในเครื่อง PC ให้ได้ตามมาตรฐานความปลอดภัยของเบราว์เซอร์ ท่านสามารถลบไฟล์ PDF ดังกล่าวออกจากโฟลเดอร์ในคอมพิวเตอร์ได้ด้วยตนเอง
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRecordToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ยืนยันลบข้อมูล</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
