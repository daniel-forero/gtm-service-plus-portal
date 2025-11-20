
import React, { useState } from 'react';
import { ServicePlus, Expert, CaseStudy, SalesDocument } from '../types';
import { TrashIcon, PlusIcon, FileIcon } from './icons';

interface AddProductModalProps {
  onClose: () => void;
  onSave: (service: ServicePlus, expert: Expert | null, caseStudy: CaseStudy | null, documents: SalesDocument[]) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [businessLine, setBusinessLine] = useState<'Google Cloud' | 'AWS'>('Google Cloud');
  const [productType, setProductType] = useState<'Propio' | 'Representado'>('Propio');
  const [category, setCategory] = useState('');
  
  const [benefits, setBenefits] = useState<{title: string, description: string}[]>([]);
  const [newBenefitTitle, setNewBenefitTitle] = useState('');
  const [newBenefitDesc, setNewBenefitDesc] = useState('');

  // Expert State
  const [expertName, setExpertName] = useState('');
  const [expertEmail, setExpertEmail] = useState('');

  // Case Study State
  const [caseTitle, setCaseTitle] = useState('');
  const [caseSummary, setCaseSummary] = useState('');
  const [caseImage, setCaseImage] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=300&h=200');

  // Documents State
  const [documents, setDocuments] = useState<SalesDocument[]>([]);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState<'PDF' | 'DOC' | 'PPT'>('PDF');
  const [newDocUrl, setNewDocUrl] = useState('');


  const handleAddBenefit = () => {
    if (newBenefitTitle && newBenefitDesc) {
      setBenefits([...benefits, { title: newBenefitTitle, description: newBenefitDesc }]);
      setNewBenefitTitle('');
      setNewBenefitDesc('');
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleAddDocument = () => {
      if(newDocName && newDocUrl) {
          const newDoc: SalesDocument = {
              id: `doc-${Date.now()}`,
              serviceId: '', // Will be assigned on save
              name: newDocName,
              type: newDocType,
              url: newDocUrl
          };
          setDocuments([...documents, newDoc]);
          setNewDocName('');
          setNewDocUrl('');
          setNewDocType('PDF');
      }
  };

  const handleRemoveDocument = (index: number) => {
      setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name || !description || !category) {
        alert("Por favor completa los campos obligatorios del servicio.");
        return;
    }

    const serviceId = `new-service-${Date.now()}`;
    
    const newService: ServicePlus = {
        id: serviceId,
        name,
        description,
        businessLine,
        productType,
        category,
        rating: 0, 
        keyBenefits: benefits
        // driveFolderUrl removed to enforce individual file listing
    };

    let newExpert: Expert | null = null;
    if (expertName && expertEmail) {
        newExpert = {
            id: `expert-${Date.now()}`,
            serviceId,
            name: expertName,
            role: 'Especialista de Producto',
            email: expertEmail,
            imageUrl: 'https://ui-avatars.com/api/?name=' + expertName.replace(' ', '+') + '&background=random'
        };
    }

    let newCaseStudy: CaseStudy | null = null;
    if (caseTitle && caseSummary) {
        newCaseStudy = {
            id: `case-${Date.now()}`,
            serviceId,
            title: caseTitle,
            summary: caseSummary,
            imageUrl: caseImage
        }
    }

    const finalDocuments = documents.map(doc => ({ ...doc, serviceId }));

    onSave(newService, newExpert, newCaseStudy, finalDocuments);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <header className="p-6 border-b border-slate-200 bg-slate-50 rounded-t-xl flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Agregar Nuevo Producto</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl font-light">&times;</button>
        </header>
        
        <div className="p-8 overflow-y-auto space-y-8 flex-1">
            
            {/* General Info */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Información General</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Producto *</label>
                        <input type="text" className="w-full p-2 border border-slate-300 rounded-md bg-white" value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Migración de Datos" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Descripción *</label>
                        <textarea className="w-full p-2 border border-slate-300 rounded-md bg-white" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción corta del valor del producto..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Línea de Negocio</label>
                        <select className="w-full p-2 border border-slate-300 rounded-md bg-white" value={businessLine} onChange={e => setBusinessLine(e.target.value as any)}>
                            <option value="Google Cloud">Google Cloud</option>
                            <option value="AWS">AWS</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Producto</label>
                        <select className="w-full p-2 border border-slate-300 rounded-md bg-white" value={productType} onChange={e => setProductType(e.target.value as any)}>
                            <option value="Propio">Propio</option>
                            <option value="Representado">Representado</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Categoría *</label>
                        <input type="text" className="w-full p-2 border border-slate-300 rounded-md bg-white" value={category} onChange={e => setCategory(e.target.value)} placeholder="Ej. Data & Analytics" />
                    </div>
                </div>
            </section>

             {/* Documents Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Documentación</h3>
                <p className="text-sm text-slate-600">Registra los archivos individualmente para que el usuario pueda verlos y descargarlos directamente.</p>
                <div className="bg-slate-50 p-4 rounded-md space-y-3">
                    <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-4">
                            <input type="text" className="w-full p-2 border border-slate-300 rounded-md text-sm bg-white" placeholder="Nombre (ej. One Pager)" value={newDocName} onChange={e => setNewDocName(e.target.value)} />
                        </div>
                        <div className="col-span-3">
                            <select className="w-full p-2 border border-slate-300 rounded-md text-sm bg-white" value={newDocType} onChange={e => setNewDocType(e.target.value as any)}>
                                <option value="PDF">PDF</option>
                                <option value="DOC">DOC</option>
                                <option value="PPT">PPT</option>
                            </select>
                        </div>
                        <div className="col-span-5">
                            <input type="url" className="w-full p-2 border border-slate-300 rounded-md text-sm bg-white" placeholder="URL del archivo (Drive/Sharepoint)" value={newDocUrl} onChange={e => setNewDocUrl(e.target.value)} />
                        </div>
                    </div>
                    <button onClick={handleAddDocument} type="button" className="w-full py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 text-sm font-medium flex items-center justify-center gap-2">
                        <PlusIcon className="w-4 h-4" /> Agregar Documento
                    </button>
                </div>

                 {documents.length > 0 && (
                    <ul className="space-y-2">
                        {documents.map((doc, i) => (
                            <li key={i} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-md shadow-sm">
                                <div className="flex items-center gap-3">
                                    <FileIcon type={doc.type} className="w-6 h-6" />
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-sm text-slate-800 truncate">{doc.name}</p>
                                        <a href={doc.url} target="_blank" className="text-xs text-blue-500 hover:underline truncate block max-w-[200px]">{doc.url}</a>
                                    </div>
                                </div>
                                <button onClick={() => handleRemoveDocument(i)} className="text-red-500 hover:text-red-700 p-2"><TrashIcon className="w-4 h-4"/></button>
                            </li>
                        ))}
                    </ul>
                 )}
            </section>

            {/* Key Benefits */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Beneficios Clave</h3>
                <div className="bg-slate-50 p-4 rounded-md space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input type="text" className="p-2 border border-slate-300 rounded-md text-sm bg-white" placeholder="Título del beneficio" value={newBenefitTitle} onChange={e => setNewBenefitTitle(e.target.value)} />
                        <input type="text" className="p-2 border border-slate-300 rounded-md text-sm bg-white" placeholder="Descripción del beneficio" value={newBenefitDesc} onChange={e => setNewBenefitDesc(e.target.value)} />
                    </div>
                    <button onClick={handleAddBenefit} type="button" className="w-full py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 text-sm font-medium flex items-center justify-center gap-2">
                        <PlusIcon className="w-4 h-4" /> Agregar Beneficio
                    </button>
                </div>
                <ul className="space-y-2">
                    {benefits.map((b, i) => (
                        <li key={i} className="flex justify-between items-start p-3 bg-white border border-slate-200 rounded-md shadow-sm">
                            <div>
                                <p className="font-bold text-sm text-slate-800">{b.title}</p>
                                <p className="text-xs text-slate-600">{b.description}</p>
                            </div>
                            <button onClick={() => handleRemoveBenefit(i)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4"/></button>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Expert Info */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Experto del Producto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Experto</label>
                        <input type="text" className="w-full p-2 border border-slate-300 rounded-md bg-white" value={expertName} onChange={e => setExpertName(e.target.value)} placeholder="Nombre Completo" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Correo de Contacto</label>
                        <input type="email" className="w-full p-2 border border-slate-300 rounded-md bg-white" value={expertEmail} onChange={e => setExpertEmail(e.target.value)} placeholder="email@servinformacion.com" />
                    </div>
                </div>
            </section>

            {/* Success Case */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Caso de Éxito Principal</h3>
                 <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Título del Caso</label>
                        <input type="text" className="w-full p-2 border border-slate-300 rounded-md bg-white" value={caseTitle} onChange={e => setCaseTitle(e.target.value)} placeholder="Ej. Transformación Digital en Retail" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Resumen</label>
                        <textarea className="w-full p-2 border border-slate-300 rounded-md bg-white" rows={2} value={caseSummary} onChange={e => setCaseSummary(e.target.value)} placeholder="Breve resumen del éxito obtenido..." />
                    </div>
                 </div>
            </section>

        </div>

        <footer className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end space-x-3">
            <button onClick={onClose} className="px-6 py-2 text-slate-700 font-medium hover:bg-slate-200 rounded-md transition-colors">Cancelar</button>
            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors shadow-md">Guardar Producto</button>
        </footer>
      </div>
    </div>
  );
};
