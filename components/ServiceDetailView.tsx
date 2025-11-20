
import React from 'react';
import { ServicePlus, SalesDocument, CaseStudy, Expert } from '../types';
import { Accordion } from './Accordion';
import { FileIcon, DownloadIcon, CheckCircleIcon, ArrowLeftIcon, FolderIcon } from './icons';

interface ServiceDetailViewProps {
  service: ServicePlus;
  relatedDocuments: SalesDocument[];
  relatedCaseStudies: CaseStudy[];
  relatedExperts: Expert[];
  onBack: () => void;
  onGenerateQuote: () => void;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({ 
    service, 
    relatedDocuments, 
    relatedCaseStudies, 
    relatedExperts, 
    onBack, 
    onGenerateQuote 
}) => {

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-6 font-medium">
        <ArrowLeftIcon className="w-4 h-4" />
        Volver al Portafolio
      </button>

      <header className="mb-8">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-4xl font-bold text-slate-900">{service.name}</h1>
                <div className="flex gap-2 mt-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{service.businessLine}</span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">{service.category}</span>
                </div>
            </div>
        </div>
        <p className="mt-4 text-lg text-slate-600 leading-relaxed">{service.description}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <Accordion title="Beneficios Clave">
              <ul className="space-y-4 mt-2">
                {service.keyBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-800">{benefit.title}</h4>
                      <p className="text-sm text-slate-600">{benefit.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Documentos de Habilitación de Ventas">
                <div className="mt-4 space-y-4">
                    {service.driveFolderUrl && (
                        <a 
                            href={service.driveFolderUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors group"
                        >
                            <div className="bg-white p-2 rounded-full shadow-sm text-blue-600">
                                <FolderIcon className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-blue-900 group-hover:underline">Carpeta de Recursos en Drive</h4>
                                <p className="text-sm text-blue-700">Accede a presentaciones, contratos y material actualizado.</p>
                            </div>
                        </a>
                    )}

                    {relatedDocuments.length > 0 && (
                        <ul className="space-y-3">
                            {relatedDocuments.map(doc => (
                                <li key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                                    <div className="flex items-center gap-3">
                                        <FileIcon type={doc.type} />
                                        <span className="font-medium text-sm text-slate-700">{doc.name}</span>
                                    </div>
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
                                        <DownloadIcon className="w-4 h-4" />
                                        Descargar
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                    {!service.driveFolderUrl && relatedDocuments.length === 0 && <p className="text-sm text-slate-500 p-2">No hay documentos disponibles.</p>}
                </div>
            </Accordion>
          </div>
          
           {relatedCaseStudies.length > 0 && (
             <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Casos de Éxito Destacados</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedCaseStudies.map(cs => (
                        <div key={cs.id} className="border border-slate-200 rounded-lg overflow-hidden flex flex-col">
                            <img src={cs.imageUrl} alt={cs.title} className="w-full h-32 object-cover"/>
                            <div className="p-4 flex-1">
                                <h4 className="font-semibold text-slate-800 text-sm mb-2">{cs.title}</h4>
                                <p className="text-xs text-slate-600 line-clamp-3">{cs.summary}</p>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
           )}
        </div>

        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 sticky top-24">
                 <h3 className="text-lg font-bold text-slate-800 mb-4">Acciones</h3>
                 <button 
                    onClick={onGenerateQuote} 
                    className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:bg-gray-400 mb-2"
                    // Enable quote if we have documents OR a drive link OR experts
                    disabled={!relatedDocuments.length && !relatedCaseStudies.length && !relatedExperts.length && !service.driveFolderUrl}
                >
                    Generar Cotización
                </button>
                 {!relatedDocuments.length && !relatedCaseStudies.length && !relatedExperts.length && !service.driveFolderUrl && (
                     <p className="text-xs text-center text-red-500 mt-2">Falta información para cotizar.</p>
                 )}
            </div>

            {relatedExperts.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Expertos del Producto</h3>
                <ul className="space-y-4">
                  {relatedExperts.map(expert => (
                    <li key={expert.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <img src={expert.imageUrl} alt={expert.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{expert.name}</h4>
                        <p className="text-xs text-slate-500 mb-1">{expert.role}</p>
                        {expert.email && (
                            <a href={`mailto:${expert.email}`} className="text-xs text-blue-600 hover:underline break-all">
                                {expert.email}
                            </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
