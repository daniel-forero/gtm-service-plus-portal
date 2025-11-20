
import React from 'react';
import { ServicePlus } from '../types';

interface ServiceCardProps {
  service: ServicePlus;
  onSelect: (service: ServicePlus) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(service)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col overflow-hidden"
    >
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{service.name}</h3>
        <p className="text-slate-600 text-sm">{service.description}</p>
      </div>
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{service.businessLine}</span>
      </div>
    </div>
  );
};
