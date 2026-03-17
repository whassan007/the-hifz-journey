import React, { useState } from 'react';
import { X, Trophy } from 'lucide-react';
import type { UserState } from '../../types';
import { IMAMS } from '../../data/imams';

interface ImamDrillWrapperProps {
  imamId: number;
  user: UserState;
  onClose: () => void;
  onComplete: (xpAward: number, imamId: number, qualityScore: number) => void;
}

const generateQuestions = (imamId: number, user: UserState) => {
  const targetImam = IMAMS.find(i => i.id === imamId)!;
  const q = [];
  
  // Always include: Names and Order (Seedling+)
  q.push({
    question: `Who is the ${imamId}${imamId === 1 ? 'st' : imamId === 2 ? 'nd' : imamId === 3 ? 'rd' : 'th'} Imam?`,
    answer: targetImam.name,
    options: [targetImam.name, ...IMAMS.filter(i => i.id !== imamId).sort(() => 0.5 - Math.random()).slice(0, 3).map(i => i.name)].sort(() => 0.5 - Math.random())
  });

  if (imamId > 1) {
    const prev = IMAMS.find(i => i.id === imamId - 1)!;
    q.push({
      question: `Who comes after Imam ${prev.name}?`,
      answer: targetImam.name,
      options: [targetImam.name, ...IMAMS.filter(i => i.id !== imamId).sort(() => 0.5 - Math.random()).slice(0, 3).map(i => i.name)].sort(() => 0.5 - Math.random())
    });
  }

  // Sapling+ (10+)
  if (user.ageGroup !== 'seedling') {
    q.push({
      question: `Which Imam is known as ${targetImam.title}?`,
      answer: targetImam.name,
      options: [targetImam.name, ...IMAMS.filter(i => i.id !== imamId).sort(() => 0.5 - Math.random()).slice(0, 3).map(i => i.name)].sort(() => 0.5 - Math.random())
    });

    if (targetImam.burialCity !== '—') {
      q.push({
        question: `In which city is Imam ${targetImam.name} buried?`,
        answer: targetImam.burialCity,
        options: [targetImam.burialCity, 'Madinah (Baqi\')', 'Najaf', 'Karbala', 'Mashhad', 'Samarra', 'Kadhimiyya (Baghdad)'].filter((v, i, a) => a.indexOf(v) === i && v !== targetImam.burialCity).slice(0, 3).concat([targetImam.burialCity]).sort(() => 0.5 - Math.random())
      });
    }

    if (targetImam.father && targetImam.id > 1) {
      q.push({
        question: `Who is the father of Imam ${targetImam.name}?`,
        answer: targetImam.father,
        options: [targetImam.father, ...IMAMS.filter(i => i.id !== imamId && i.id !== targetImam.id - 1).sort(() => 0.5 - Math.random()).slice(0, 3).map(i => i.father)].filter((v,i,a)=>a.indexOf(v)===i).sort(() => 0.5 - Math.random())
      });
      if (q[q.length-1].options.length < 4) {
        q[q.length-1].options = [targetImam.father, 'Imam Ali', 'Imam al-Sadiq', 'Ali ibn al-Husayn', 'Imam al-Kadhim'].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4);
      }
    }
  }

  // Rising Tree+ (16+)
  if (user.ageGroup === 'rising_tree' || user.ageGroup === 'mighty_oak') {
     q.push({
       question: `Who is the mother of Imam ${targetImam.name}?`,
       answer: targetImam.mother,
       options: [targetImam.mother, ...IMAMS.filter(i => i.id !== imamId).sort(() => 0.5 - Math.random()).slice(0, 3).map(i => i.mother)].filter((v,i,a)=>a.indexOf(v)===i).sort(() => 0.5 - Math.random())
     });
     // Pad options if duplicates removed
     if (q[q.length-1].options.length < 4) {
       q[q.length-1].options = [targetImam.mother, 'Fatimah al-Zahra', 'Narjis', 'Hamidah', 'Shahrbanu'].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4);
     }

     q.push({
       question: `In what century did Imam ${targetImam.name} live?`,
       answer: `${Math.floor(targetImam.birthYear / 100) + 1}th Century CE`,
       options: [`${Math.floor(targetImam.birthYear / 100) + 1}th Century CE`, '7th Century CE', '8th Century CE', '9th Century CE'].filter((v,i,a)=>a.indexOf(v)===i).sort(() => 0.5 - Math.random())
     });
     if (q[q.length-1].options.length < 4) {
         q[q.length-1].options.push('10th Century CE');
     }
  }

  return q.slice(0, user.ageGroup === 'seedling' ? 3 : 5); // Limit questions
};

export const ImamDrillWrapper: React.FC<ImamDrillWrapperProps> = ({ imamId, user, onClose, onComplete }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Generate Questions dynamically based on Age Group
  const [questions] = useState(() => generateQuestions(imamId, user));

  const currentQ = questions[questionIndex];

  const handleOptionClick = (option: string) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);

    if (option === currentQ.answer) {
      setCorrectCount(c => c + 1);
    }

    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(i => i + 1);
        setSelectedOption(null);
        setShowResult(false);
      } else {
        // Complete
        const xp = Math.round((correctCount + (option === currentQ.answer ? 1 : 0)) / questions.length * 100);
        onComplete(xp, imamId, xp > 80 ? 5 : xp > 50 ? 3 : 1);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center rtl p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-emerald-500/10 pointer-events-none" />
      
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-lg z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Trophy size={20} />
            <span>Islamic Knowledge XP</span>
          </div>
          <div className="text-white/50 font-mono">
            {questionIndex + 1} / {questions.length}
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center leading-relaxed" dir="ltr">
            {currentQ.question}
          </h2>

          <div className="grid gap-3" dir="ltr">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.answer;
              
              let btnClass = 'bg-white/5 border-white/10 hover:bg-white/10 text-white';
              if (showResult) {
                if (isCorrect) btnClass = 'bg-emerald-500 border-emerald-400 text-white';
                else if (isSelected) btnClass = 'bg-red-500 border-red-400 text-white opacity-50';
                else btnClass = 'bg-white/5 border-white/10 text-white/50 opacity-50';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl border text-lg text-left transition-all font-medium ${btnClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
