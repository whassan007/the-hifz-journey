import UI from "../../../data/ui-text.json";
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Share2, Download, X, QrCode, Hash, RefreshCw } from 'lucide-react';
import type { Class } from '../../../types';
interface ClassCodeCardProps {
  classData: Class;
  teacherName?: string;
  onResetCode?: () => void;
}
export const ClassCodeCard = ({
  classData,
  teacherName = UI.ui_69,
  onResetCode
}: ClassCodeCardProps) => {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(classData.joinCode);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };
  const handleShareText = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Join ${classData.name}`,
          text: `Join my class on Hifz Journey using code: ${classData.joinCode}`
        });
      } else {
        handleCopyText();
      }
    } catch (err) {
      console.error('Error sharing text', err);
    }
  };
  const downloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      // Create a canvas with padding and background
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);

        // Trigger download
        const a = document.createElement('a');
        a.download = `${classData.name.replace(/\s+/g, '-')}-QR.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };
  return <>
      <div className="bg-black/30 border border-white/10 p-5 rounded-3xl backdrop-blur-md mb-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl rounded-full" />
        
        <h3 className="text-sm font-bold text-paper/80 mb-4 uppercase tracking-wider flex justify-between items-center">
          <span>الوصول إلى الصف</span>
          {onResetCode && <button onClick={onResetCode} className="text-[10px] text-white/40 hover:text-white flex items-center gap-1 transition-colors bg-white/5 px-2 py-1 rounded-full">
              <RefreshCw size={10} /> إعادة تعيين الرمز
            </button>}
        </h3>
        
        <div className="flex items-center gap-4 mb-5">
          {/* Left: Text Code */}
          <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-center gap-2 relative group text-right">
            <span className="text-xs text-white/50 font-medium tracking-wide">رمز الانضمام</span>
            <div className="flex items-center justify-between" dir="ltr">
              <span className="font-mono text-xl font-bold text-accent tracking-wider select-all">{classData.joinCode}</span>
              <button onClick={handleCopyText} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent" title={UI.ui_68}>
                <Copy size={14} />
              </button>
            </div>
            {copiedText && <span className="absolute -top-3 right-4 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded animate-bounce">
                تم النسخ!
              </span>}
          </div>

          {/* Right: QR Code */}
          <button onClick={() => setIsQrModalOpen(true)} className="w-24 h-24 shrink-0 bg-white rounded-2xl p-2 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all cursor-zoom-in relative group flex items-center justify-center" title={UI.ui_67}>
            <QRCodeSVG value={classData.joinCode} size={80} level={"M"} includeMargin={false} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center transition-opacity">
               <QrCode className="text-white" size={24} />
            </div>
          </button>
        </div>

        {/* Share Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleShareText} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 transition-all text-white/90 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm">
            <Share2 size={16} /> مشاركة الرمز كنص
          </button>
          <button onClick={() => {
          downloadQR();
        }} className="flex-1 bg-accent/20 hover:bg-accent/30 border border-accent/20 active:scale-95 transition-all text-accent font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm">
            <Download size={16} /> حفظ صورة QR
          </button>
        </div>
      </div>

      {/* Full-Screen QR Modal */}
      <AnimatePresence>
        {isQrModalOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} onClick={() => setIsQrModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{
          opacity: 0,
          scale: 0.9,
          y: 20
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 0.9,
          y: 20
        }} className="relative w-full max-w-sm bg-jungle-dark/95 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center">
              <button onClick={() => setIsQrModalOpen(false)} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10">
                <X size={20} />
              </button>

              <div className="bg-white p-6 rounded-3xl shadow-xl w-64 h-64 flex items-center justify-center mb-8 relative">
                {/* Reference for downloading the large one */}
                <QRCodeSVG value={classData.joinCode} size={208} level={"M"} includeMargin={false} ref={qrRef} />
              </div>

              <h2 className="text-3xl font-black text-paper mb-1">{classData.name}</h2>
              <p className="text-paper/60 font-medium mb-6">المعلم: {teacherName}</p>

              <div className="px-4 py-2 bg-black/40 rounded-full border border-white/10 mb-8 inline-flex items-center gap-2">
                <Hash size={14} className="text-accent" />
                <span className="font-mono font-bold text-white tracking-widest">{classData.joinCode}</span>
              </div>

              <p className="text-sm font-bold text-accent uppercase tracking-widest mb-6 px-8 leading-relaxed">
                امسح باستخدام تطبيق رحلة الحفظ للانضمام
              </p>

              <div className="w-full flex gap-3">
                 <button onClick={downloadQR} className="flex-1 bg-white hover:bg-paper text-black font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Download size={18} /> تحميل
                 </button>
              </div>

            </motion.div>
          </div>}
      </AnimatePresence>
    </>;
};