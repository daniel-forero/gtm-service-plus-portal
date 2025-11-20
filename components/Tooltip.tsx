import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full mb-2 w-max max-w-xs px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md shadow-lg z-10 animate-fade-in-up">
          {text}
        </div>
      )}
    </div>
  );
};
