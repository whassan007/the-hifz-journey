import React from 'react';

interface XPRingProps {
  progressPercent: number;
  icon: React.ReactNode;
}

export const XPRing = ({ progressPercent, icon }: XPRingProps) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = Math.max(0, circumference - (progressPercent / 100) * circumference);

  return (
    <div className="relative w-32 h-32 mb-6 flex items-center justify-center mt-4 mx-auto">
      <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <circle 
          cx="50" cy="50" r="45" 
          fill="none" 
          stroke="#D97706" 
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-5xl">
        {icon}
      </div>
    </div>
  );
};
