import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Hash, School, Users, CheckCircle2, Camera } from 'lucide-react';
import { BrowserQRCodeReader } from '@zxing/browser';
import type { Class } from '../../../types';

interface JoinClassModalProps {
  onClose: () => void;
  onJoin: (classData: Class) => void;
  alreadyJoinedClasses: string[];
}

export const JoinClassModal = ({ onClose, onJoin, alreadyJoinedClasses }: JoinClassModalProps) => {
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [foundClass, setFoundClass] = useState<Class | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);

  useEffect(() => {
    if (isScanning && videoRef.current) {
      const codeReader = new BrowserQRCodeReader();
      codeReaderRef.current = codeReader;
      
      codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, _err) => {
        if (result) {
          const text = result.getText().toLowerCase().trim();
          if (!text.startsWith('class-')) {
            setError("That QR code didn't work. Ask your teacher for the current code.");
            setIsScanning(false);
            return;
          }
          if (alreadyJoinedClasses.includes(text)) {
            setError("You're already a member of this class.");
            setIsScanning(false);
            return;
          }
          
          // Successful scan
          setCode(text);
          setIsScanning(false);
          setFoundClass({
            id: `mock-${Date.now()}`,
            name: 'Weekend Hifz Program',
            joinCode: text,
            teacherId: 'teacher-x', // Mock teacher association
            createdAt: new Date().toISOString()
          });
          setStep('preview');
        }
      }).catch(e => {
        console.error("Camera error:", e);
        setError("Camera access needed to scan. Enter the code manually instead.");
        setIsScanning(false);
      });

      return () => {
        const stream = videoRef.current?.srcObject as MediaStream | null;
        if (stream) {
          stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        }
      };
    }
  }, [isScanning, alreadyJoinedClasses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const formattedCode = code.toLowerCase().trim();
    if (!formattedCode) return;

    // Simulate search
    if (!formattedCode.startsWith('class-')) {
      setError("That code doesn't match any class. Check with your teacher.");
      return;
    }

    if (alreadyJoinedClasses.includes(formattedCode)) {
      setError("You're already a member of this class.");
      return;
    }

    // Mock found class
    setFoundClass({
      id: `mock-${Date.now()}`,
      name: 'Weekend Hifz Program',
      joinCode: formattedCode,
      teacherId: 'teacher-x', // Mock teacher association
      createdAt: new Date().toISOString()
    });
    setStep('preview');
  };

  const confirmJoin = () => {
    if (!foundClass) return;
    setIsJoining(true);
    // Simulate network delay
    setTimeout(() => {
      onJoin(foundClass);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-jungle-dark/95 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 transition-colors"
        >
          <X size={18} />
        </button>

        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center border border-accent/40 shadow-inner mb-6 mx-auto">
                <Hash className="text-accent" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-center text-paper mb-2">Join a class · انضم إلى صف</h2>
              <p className="text-center text-paper/60 text-sm mb-8">Enter the join code provided by your teacher.</p>

              <form onSubmit={handleSearch} className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="class-xxx-xxx"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        setError(null);
                      }}
                      className={`w-full bg-black/40 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-accent'} rounded-xl py-4 px-5 text-center font-mono text-lg text-paper outline-none transition-colors h-[60px]`}
                      autoFocus
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setError(null);
                      setIsScanning(true);
                    }}
                    className="w-[60px] h-[60px] flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 transition-colors"
                  >
                    <Camera size={24} />
                  </button>
                </div>
                {error && <p className="text-red-400 text-sm mt-1 text-center font-medium animate-pulse">{error}</p>}
                
                <button 
                  type="submit"
                  disabled={!code.trim()}
                  className="w-full bg-accent hover:bg-amber-600 disabled:opacity-50 disabled:bg-white/10 text-white font-bold py-4 rounded-xl shadow-lg mt-2 transition-all active:scale-95 text-lg"
                >
                  Search Code
                </button>
              </form>
            </motion.div>
          )}

          {step === 'input' && isScanning && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-2xl font-bold text-center text-paper mb-2">Scan QR Code</h2>
              <p className="text-center text-paper/60 text-sm mb-6">Position the QR code within the frame</p>
              
              <div className="relative w-64 h-64 bg-black rounded-3xl overflow-hidden mb-6 border-2 border-accent">
                <video ref={videoRef} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjIwLDIwIi8+PC9zdmc+')] pointer-events-none opacity-50" />
              </div>

              <button 
                onClick={() => setIsScanning(false)}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all"
              >
                Cancel Scan
              </button>
            </motion.div>
          )}

          {step === 'preview' && foundClass && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/40">
                <School className="text-blue-400" size={40} />
              </div>
              
              <h2 className="text-lg text-paper/60 font-medium mb-1">You're joining</h2>
              <h3 className="text-3xl font-black text-paper mb-6">{foundClass.name}</h3>

              <div className="w-full bg-black/30 border border-white/5 rounded-xl p-4 mb-8 flex justify-center gap-6">
                 <div className="flex flex-col items-center gap-1">
                   <div className="flex items-center gap-1.5 text-paper/80 font-medium">
                     <Users size={16} /> <span>Teacher</span>
                   </div>
                   <span className="text-white text-sm">Ustadh Ahmed</span> {/* Mocked since Teacher ID only available */}
                 </div>
                 <div className="w-px h-10 bg-white/10" />
                 <div className="flex flex-col items-center gap-1">
                   <div className="flex items-center gap-1.5 text-paper/80 font-medium">
                     <Hash size={16} /> <span>Code</span>
                   </div>
                   <span className="text-white text-sm font-mono">{foundClass.joinCode}</span>
                 </div>
              </div>

              <div className="w-full flex gap-3">
                <button 
                  onClick={() => setStep('input')}
                  disabled={isJoining}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmJoin}
                  disabled={isJoining}
                  className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isJoining ? (
                    <span className="animate-pulse">Joining...</span>
                  ) : (
                    <>
                      <CheckCircle2 size={20} /> Join {foundClass.name}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
