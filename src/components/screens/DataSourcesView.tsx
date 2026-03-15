import { useState } from 'react';
import { ArrowRight, Database, CheckCircle2, XCircle, ChevronDown, ChevronUp, Download, RefreshCw, Server, AlertTriangle } from 'lucide-react';
import validationReport from '../../data/surah-validation-report.json';

interface DataSourcesViewProps {
  onBack: () => void;
}

interface ValidationMeta {
  integrity: string;
  primaryStatus: string;
  secondaryStatus: string;
  primaryUrl: string;
  secondaryUrl: string;
  narration: string;
  fetchedAt: string;
  totalSurahs: number;
  passCount: number;
  mismatchCount: number;
  missingCount: number;
  integrityChecks: Array<{ pass: boolean; label: string; detail?: string }>;
}

interface ValidationField {
  value: string | number | boolean;
  verified: boolean;
}

interface ValidationRow {
  surahId: number;
  status: string;
  primarySource: string;
  secondarySource: string;
  mismatchDetails: string | null;
  fields: {
    juzNumber: ValidationField;
    verseCount: ValidationField;
    arabicName: ValidationField;
    transliteration: ValidationField;
    revelationType: ValidationField;
    englishMeaning?: ValidationField;
    bismillah?: ValidationField;
  };
}

export const DataSourcesView = ({ onBack }: DataSourcesViewProps) => {
  const [showIntegrity, setShowIntegrity] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [showRefreshModal, setShowRefreshModal] = useState(false);

  const meta = validationReport.meta as ValidationMeta;
  const results = validationReport.validationResults as ValidationRow[];

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} · ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    if (status === 'live' || status === 'pass') return 'bg-green-500';
    if (status === 'cached' || status === 'mismatch') return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getStatusText = (status: string) => {
    if (status === 'live' || status === 'pass') return 'text-green-500';
    if (status === 'cached' || status === 'mismatch') return 'text-amber-500';
    return 'text-red-500';
  };

  const toggleRow = (id: number) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const exportReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(validationReport, null, 2));
    const dt = new Date(meta.fetchedAt);
    const filename = `hifz-journey-surah-report-${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}.json`;
    
    // Check if Web Share API is available (Mobile Native-like share)
      if (navigator.share) {
        const file = new File([JSON.stringify(validationReport, null, 2)], filename, { type: 'application/json' });
        navigator.share({
          title: 'Hifz Journey Data Report',
          files: [file]
        }).catch(() => {
         // Fallback if user cancels or share fails
         const dlAnchorElem = document.createElement('a');
         dlAnchorElem.setAttribute("href", dataStr);
         dlAnchorElem.setAttribute("download", filename);
         dlAnchorElem.click();
      });
    } else {
      const dlAnchorElem = document.createElement('a');
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", filename);
      dlAnchorElem.click();
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 md:p-6 pb-24 text-paper" dir="ltr">
      {/* Header / Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center border border-white/10 hover:bg-black/40 transition-colors"
        >
          <ArrowRight size={20} className="rotate-180" />
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Database className="text-accent" /> التحقق من مصادر البيانات
        </h1>
      </div>

      {/* Header Metadata Card */}
      <div className="bg-black/20 rounded-3xl p-5 md:p-6 border border-white/10 shadow-lg mb-6 backdrop-blur-md">
        
        {/* Banner */}
        {meta.integrity === 'passed' ? (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl mb-6 font-bold flex items-center gap-2">
            <CheckCircle2 size={20} /> تم التحقق من كافة الـ ١١٤ سورة · بارك الله فيك
          </div>
        ) : (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3 rounded-xl mb-6 font-bold flex items-center gap-2">
            <AlertTriangle size={20} /> تحذير سلامة البيانات - فشل فحص هيكلي واحد أو أكثر
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">المصدر الأساسي</p>
              <div className="flex items-center gap-2 bg-black/30 p-2.5 rounded-lg border border-white/5">
                <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(meta.primaryStatus)}`} />
                <span className="font-mono text-sm">{meta.primaryUrl}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">المصدر الثانوي</p>
              <div className="flex items-center gap-2 bg-black/30 p-2.5 rounded-lg border border-white/5">
                <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(meta.secondaryStatus)}`} />
                <span className="font-mono text-sm">{meta.secondaryUrl}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                <p className="text-xs text-white/50 mb-1">الرواية</p>
                <p className="font-bold">{meta.narration}</p>
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                <p className="text-xs text-white/50 mb-1">تاريخ التحقق</p>
                <p className="font-bold text-sm" dir="ltr">{formatDate(meta.fetchedAt)}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-black/30 p-3 rounded-xl border border-white/5 text-center">
                <p className="text-2xl font-black">{meta.totalSurahs}</p>
                <p className="text-[10px] text-white/50 uppercase">المجموع</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20 text-center text-green-400">
                <p className="text-2xl font-black">{meta.passCount}</p>
                <p className="text-[10px] uppercase">نجاح</p>
              </div>
              <div className={`p-3 rounded-xl border text-center ${(meta.mismatchCount + meta.missingCount) > 0 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-black/30 border-white/5'}`}>
                <p className="text-2xl font-black">{meta.mismatchCount + meta.missingCount}</p>
                <p className="text-[10px] opacity-50 uppercase">مشاكل</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={exportReport}
            className="flex-1 bg-white/10 hover:bg-white/20 transition-colors border border-white/10 rounded-xl py-3 px-4 font-bold flex items-center justify-center gap-2"
          >
            <Download size={18} /> تصدير الملف
          </button>
          <button 
            onClick={() => setShowRefreshModal(true)}
            className="flex-1 bg-accent/20 hover:bg-accent/30 text-accent transition-colors border border-accent/20 rounded-xl py-3 px-4 font-bold flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> تحديث البيانات
          </button>
        </div>
      </div>

      {/* Integrity Checks Collapsible */}
      <div className="bg-black/20 rounded-2xl border border-white/10 overflow-hidden mb-6">
        <button 
          onClick={() => setShowIntegrity(!showIntegrity)}
          className="w-full flex justify-between items-center p-4 hover:bg-white/5 transition-colors text-left rtl:text-right"
        >
          <span className="font-bold">فحوصات السلامة ({meta.integrityChecks.filter((c) => c.pass).length}/{meta.integrityChecks.length})</span>
          {showIntegrity ? <ChevronUp size={20} className="text-white/50"/> : <ChevronDown size={20} className="text-white/50"/>}
        </button>
        
        {showIntegrity && (
          <div className="p-4 pt-0 border-t border-white/5 space-y-3 mt-2">
            {meta.integrityChecks.map((check: { pass: boolean, label: string, detail?: string }, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="mt-0.5">
                  {check.pass ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
                </div>
                <div>
                  <p className={`text-sm ${check.pass ? 'text-white/80' : 'text-red-400 font-bold'}`}>{check.label}</p>
                  {!check.pass && check.detail && (
                    <p className="text-xs text-red-300/70 mt-1">{check.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Validation Table Header */}
      <h2 className="text-xl font-bold mb-4 text-right">تفاصيل شاملة</h2>
      
      {/* Virtualized/Mapped List of 114 Surahs */}
      <div className="space-y-3">
        {results.map((row) => (
          <div 
            key={row.surahId} 
            className={`bg-black/20 rounded-xl overflow-hidden border border-white/10 flex flex-col transition-colors border-l-4 ${getStatusColor(row.status)}`}
          >
            {/* Row Summary (Clickable) */}
            <button 
              onClick={() => toggleRow(row.surahId)}
              className="w-full text-left p-4 flex items-center gap-4 hover:bg-white/5"
            >
              <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center font-bold text-sm shrink-0">
                {row.surahId}
              </div>
              <div className="flex-1 min-w-0" dir="rtl">
                <p className="font-arabic text-lg font-bold truncate">{row.fields.arabicName.value}</p>
                <p className="text-xs text-white/50 truncate tracking-wider">{row.fields.transliteration.value}</p>
              </div>
              <div className="hidden sm:block text-right" dir="rtl">
                <p className="text-sm font-mono">{row.fields.verseCount.value} آية</p>
                <p className="text-xs text-white/50">جزء {row.fields.juzNumber.value}</p>
              </div>
              <div className="shrink-0 flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${row.fields.revelationType.value === 'Meccan' ? 'bg-teal-500/20 text-teal-300' : 'bg-amber-500/20 text-amber-300'}`}>
                  {row.fields.revelationType.value}
                </span>
                <span className={`text-xs font-bold font-mono ${getStatusText(row.status)}`}>
                  {(Object.values(row.fields) as ValidationField[]).filter((f) => f.verified).length} / 7
                </span>
                {expandedRows[row.surahId] ? <ChevronUp size={16} className="text-white/40"/> : <ChevronDown size={16} className="text-white/40"/>}
              </div>
            </button>

            {/* Expanded Content */}
            {expandedRows[row.surahId] && (
              <div className="p-4 bg-black/40 border-t border-white/5 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4">
                  {Object.entries(row.fields).map(([key, f]) => (
                    <div key={key} className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-white/50 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{f.value.toString()}</span>
                        {f.verified ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-500" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-black/30 p-3 rounded-lg border border-white/5 space-y-2 text-right">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Server size={12} />
                    <span dir="ltr">Primary: {row.primarySource} ({meta.primaryStatus})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Server size={12} />
                    <span dir="ltr">Secondary: {row.secondarySource} ({meta.secondaryStatus})</span>
                  </div>
                  
                  {row.mismatchDetails ? (
                    <div className="mt-2 text-amber-400 text-xs font-mono bg-amber-500/10 p-2 rounded" dir="ltr">
                      {row.mismatchDetails}
                    </div>
                  ) : row.status === 'pass' ? (
                    <div className="mt-2 text-green-400 text-xs font-bold pt-2 border-t border-white/5">
                      يتوافق المصدران في جميع الحقول.
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Offline Refresh Modal Overlay */}
      {showRefreshModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowRefreshModal(false)} />
          <div className="bg-jungle-dark border border-white/10 rounded-3xl p-6 w-full max-w-sm relative z-10 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center mb-4">
              <RefreshCw size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">تحديث بيانات السور</h3>
            <p className="text-paper/70 text-sm mb-4 leading-relaxed">
              للتحديث، أعد تشغيل البرنامج النصي على جهازك واستبدل كِلا ملفي JSON في المشروع، ثم أعد بناء التطبيق.
            </p>
            <div className="bg-black/30 p-3 rounded-xl border border-white/5 mb-6 font-mono text-xs text-white/60" dir="ltr">
              <span className="text-white">fetch-surah-data.mjs → produces:</span><br/>
              • surah-ground-truth.json<br/>
              • surah-validation-report.json
            </div>
            <button 
              onClick={() => setShowRefreshModal(false)}
              className="w-full bg-accent text-white font-bold py-3 rounded-xl hover:bg-accent/90 transition-colors"
            >
              حسناً فهمت
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
