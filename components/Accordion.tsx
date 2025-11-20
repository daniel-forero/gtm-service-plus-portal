
import React, { useState } from 'react';
import { ChevronDownIcon } from './icons';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-4 text-left"
      >
        <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
        <ChevronDownIcon
          className={`w-5 h-5 text-slate-500 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="pb-4 text-slate-600">
          {children}
        </div>
      </div>
    </div>
  );
};
