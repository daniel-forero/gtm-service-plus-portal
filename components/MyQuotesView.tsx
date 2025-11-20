import React from 'react';
import { Quote, ServicePlus } from '../types';
import { MOCK_SERVICES } from '../services/mockData';

interface MyQuotesViewProps {
  quotes: Quote[];
  onDuplicate: (quote: Quote) => void;
  onSelectService: (service: ServicePlus) => void;
}

export const MyQuotesView: React.FC<MyQuotesViewProps> = ({ quotes, onDuplicate, onSelectService }) => {
  
  const handleServiceClick = (serviceId: string) => {
    const service = MOCK_SERVICES.find(s => s.id === serviceId);
    if (service) {
        onSelectService(service);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Mis Cotizaciones</h2>
      <p className="text-slate-600 mb-8">Aquí encontrarás todas las cotizaciones que has generado.</p>

      {quotes.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
          <ul className="divide-y divide-slate-200">
            {quotes.map(quote => {
              const serviceExists = MOCK_SERVICES.some(s => s.id === quote.serviceId);
              return (
              <li key={quote.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors duration-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-sm font-semibold text-blue-600 cursor-pointer hover:underline" onClick={() => handleServiceClick(quote.serviceId)}>
                      {quote.serviceName}
                      {!serviceExists && <span className="text-xs text-red-500 ml-2">(Servicio no disponible)</span>}
                    </p>
                    <h3 className="text-lg font-bold text-slate-800">{quote.customerName}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Generada el: {new Date(quote.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button 
                      onClick={() => onDuplicate(quote)}
                      disabled={!serviceExists}
                      className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors shadow disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                      Duplicar Cotización
                    </button>
                  </div>
                </div>
              </li>
            )})}
          </ul>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <h3 className="text-xl font-medium text-slate-700">Aún no tienes cotizaciones</h3>
          <p className="text-slate-500 mt-2">Navega al portafolio para empezar a generar tu primera cotización.</p>
        </div>
      )}
    </div>
  );
};
