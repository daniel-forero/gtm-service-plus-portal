import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ServicePlus, PricingPlan, Quote } from '../types';
import { MOCK_PRICING } from '../services/mockData';
import { Tooltip } from './Tooltip';
import { InformationCircleIcon } from './icons';

declare const jspdf: any;
declare const html2canvas: any;

interface QuoterModalProps {
  service: ServicePlus;
  onClose: () => void;
  onSaveQuote: (quote: Omit<Quote, 'id' | 'createdAt'>) => void;
  initialQuote?: Quote | null;
}

export const QuoterModal: React.FC<QuoterModalProps> = ({ service, onClose, onSaveQuote, initialQuote }) => {
  const pricingRules = MOCK_PRICING.find(p => p.serviceId === service.id);
  
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(pricingRules?.plans[0] ?? null);
  const [licenses, setLicenses] = useState<number>(10);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [discount, setDiscount] = useState<number>(0);
  const [customerName, setCustomerName] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialQuote && pricingRules) {
      const plan = pricingRules.plans.find(p => p.planName === initialQuote.planName) || pricingRules.plans[0];
      setSelectedPlan(plan);
      setLicenses(initialQuote.licenses);
      setSelectedAddons(new Set(initialQuote.selectedAddons));
      setDiscount(initialQuote.discount);
      setCustomerName(initialQuote.customerName);
    }
  }, [initialQuote, pricingRules]);


  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => {
      const newAddons = new Set(prev);
      if (newAddons.has(addonId)) {
        newAddons.delete(addonId);
      } else {
        newAddons.add(addonId);
      }
      return newAddons;
    });
  };

  const { totalCost, totalPrice, lineItems } = useMemo(() => {
    if (!selectedPlan) return { totalCost: 0, totalPrice: 0, lineItems: [] };
    
    let cost = 0;
    let price = 0;
    const items: {name: string; unitPrice: number; qty: number; total: number}[] = [];

    items.push({
        name: `Plan: ${selectedPlan.planName}`,
        unitPrice: selectedPlan.price,
        qty: licenses,
        total: selectedPlan.price * licenses,
    });
    cost += selectedPlan.cost * licenses;
    price += selectedPlan.price * licenses;

    pricingRules?.addons.forEach(addon => {
        if (selectedAddons.has(addon.id)) {
            items.push({
                name: `Add-on: ${addon.name}`,
                unitPrice: addon.price,
                qty: licenses,
                total: addon.price * licenses,
            });
            cost += addon.cost * licenses;
            price += addon.price * licenses;
        }
    });

    return { totalCost: cost, totalPrice: price, lineItems: items };
  }, [selectedPlan, licenses, selectedAddons, pricingRules]);

  const finalPrice = useMemo(() => totalPrice * (1 - discount / 100), [totalPrice, discount]);
  const customerSaving = useMemo(() => totalPrice - finalPrice, [totalPrice, finalPrice]);
  const contributionMargin = useMemo(() => {
    if (finalPrice === 0) return 0;
    return ((finalPrice - totalCost) / finalPrice) * 100;
  }, [finalPrice, totalCost]);

  const marginColor = useMemo(() => {
    if (contributionMargin > 20) return 'text-green-600 bg-green-100';
    if (contributionMargin >= 10) return 'text-amber-500 bg-amber-100';
    return 'text-red-600 bg-red-100';
  }, [contributionMargin]);

  const approvalRequired = useMemo(() => {
    if (discount > 50) return 'Aprobación del CEO';
    if (discount > 20) return 'Aprobación de Gerencia Comercial';
    return 'No requiere aprobación';
  }, [discount]);

  const generatePDF = useCallback(async () => {
    if (!customerName.trim()) {
        alert('Por favor, ingresa el nombre del cliente.');
        return;
    }
    setIsGenerating(true);
    const quoteElement = document.getElementById('quote-summary');
    if (quoteElement) {
        try {
            const canvas = await html2canvas(quoteElement, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps= pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            let heightLeft = imgHeight;
            let position = 45;

            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(22);
            pdf.setTextColor(45, 55, 72);
            pdf.text('Propuesta Service Plus', pdfWidth / 2, 20, { align: 'center' });
            
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(14);
            pdf.setTextColor(100, 116, 139);
            pdf.text(`Preparado para: ${customerName}`, pdfWidth / 2, 30, { align: 'center' });
            pdf.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, pdfWidth / 2, 38, { align: 'center' });


            pdf.addImage(imgData, 'PNG', 15, position, pdfWidth - 30, imgHeight);
            heightLeft -= (pdfHeight - position - 15);
             
            while (heightLeft >= 0) {
              position = heightLeft - imgHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 15, position, pdfWidth - 30, imgHeight);
              heightLeft -= pdfHeight;
            }

            pdf.save(`Propuesta_${customerName.replace(/\s+/g, '_')}_${service.name.replace(/\s+/g, '_')}.pdf`);

            if (selectedPlan) {
                onSaveQuote({
                    serviceId: service.id,
                    serviceName: service.name,
                    customerName,
                    planName: selectedPlan.planName,
                    licenses,
                    selectedAddons: Array.from(selectedAddons),
                    discount
                });
            }
            onClose();

        } catch(e) {
            console.error("Error generando PDF", e);
            alert("Lo sentimos, hubo un error al generar el PDF.");
        } finally {
            setIsGenerating(false);
        }
    }
  }, [customerName, service.name, service.id, selectedPlan, licenses, selectedAddons, discount, onSaveQuote, onClose]);


  if (!pricingRules || !selectedPlan) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
                <p>La información de precios no está disponible para este servicio.</p>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-200 rounded">Cerrar</button>
            </div>
        </div>
    );
  }

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <header className="p-5 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{initialQuote ? 'Duplicar Cotización' : 'Generador de Cotizaciones'}</h2>
            <p className="text-slate-600">{service.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl font-light">&times;</button>
        </header>

        <div className="flex-grow p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
          {/* Col 1: Configuration */}
          <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200 self-start">
            <div>
              <label htmlFor="customerName" className="block text-sm font-bold text-slate-700 mb-2">Nombre del Cliente</label>
              <input type="text" id="customerName" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"/>
            </div>
            
            <div>
              <span className="block text-sm font-bold text-slate-700 mb-2">Seleccionar Plan</span>
              <div className="grid grid-cols-3 gap-2">
                {pricingRules.plans.map(plan => (
                  <button key={plan.planName} onClick={() => setSelectedPlan(plan)} className={`px-2 py-3 text-center rounded-md text-sm font-semibold transition-all duration-200 ${selectedPlan.planName === plan.planName ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                    {plan.planName}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="licenses" className="block text-sm font-bold text-slate-700 mb-2">Número de Licencias</label>
              <input type="number" id="licenses" value={licenses} onChange={e => setLicenses(Math.max(1, parseInt(e.target.value, 10) || 1))} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"/>
            </div>
            
            {pricingRules.addons.length > 0 && (
              <div>
                <span className="block text-sm font-bold text-slate-700 mb-2">Add-ons Opcionales</span>
                <div className="space-y-2">
                  {pricingRules.addons.map(addon => (
                    <label key={addon.id} className="flex items-center p-3 bg-white border border-slate-200 rounded-md hover:bg-slate-100 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedAddons.has(addon.id)}
                        onChange={() => handleAddonToggle(addon.id)}
                        className="sr-only peer"
                      />
                      <div className="w-4 h-4 bg-white border border-slate-400 rounded-sm peer-checked:bg-blue-600 peer-checked:border-blue-600 flex-shrink-0 flex items-center justify-center transition-colors">
                        <svg className="w-2.5 h-2.5 text-white hidden peer-checked:block" fill="none" viewBox="0 0 12 9" stroke="currentColor" strokeWidth="3"><path d="M1 4.5L4.5 8L11 1"/></svg>
                      </div>
                      <span className="ml-3 text-sm text-slate-800">{addon.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="discount" className="block text-sm font-bold text-slate-700 mb-2">Descuento (%)</label>
              <div className="flex items-center gap-4">
                <input type="range" id="discount" min="0" max="60" value={discount} onChange={e => setDiscount(parseInt(e.target.value, 10))} className="w-full h-2 bg-white border border-slate-300 rounded-lg appearance-none cursor-pointer"/>
                <span className="font-bold text-blue-600 w-12 text-center">{discount}%</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quote Summary */}
          <div className="lg:col-span-2 space-y-4">
             <div id="quote-summary" className="p-8 bg-white rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Resumen de la Cotización</h3>
                <p className="text-sm text-slate-500 mb-6">{service.name}</p>
                <div className="flow-root">
                    <table className="min-w-full text-sm">
                        <thead className="text-slate-500">
                            <tr>
                                <th scope="col" className="py-2 pr-3 text-left font-semibold">Concepto</th>
                                <th scope="col" className="px-3 py-2 text-right font-semibold hidden sm:table-cell">Precio Unitario</th>
                                <th scope="col" className="px-3 py-2 text-right font-semibold">Cantidad</th>
                                <th scope="col" className="py-2 pl-3 text-right font-semibold">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-700">
                            {lineItems.map((item, i) => (
                                <tr key={i}>
                                    <td className="py-3 pr-3 text-left">{item.name}</td>
                                    <td className="px-3 py-3 text-right hidden sm:table-cell">{formatCurrency(item.unitPrice)}</td>
                                    <td className="px-3 py-3 text-right">{item.qty}</td>
                                    <td className="py-3 pl-3 text-right">{formatCurrency(item.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th scope="row" colSpan={3} className="pt-4 pr-3 text-right font-normal text-slate-500 hidden sm:table-cell">Subtotal</th>
                                <th scope="row" className="pt-4 pr-3 text-left font-normal text-slate-500 sm:hidden">Subtotal</th>
                                <td className="pt-4 pl-3 text-right font-medium text-slate-700">{formatCurrency(totalPrice)}</td>
                            </tr>
                            <tr>
                                <th scope="row" colSpan={3} className="py-1 pr-3 text-right font-normal text-slate-500 hidden sm:table-cell">Descuento ({discount}%)</th>
                                <th scope="row" className="py-1 pr-3 text-left font-normal text-slate-500 sm:hidden">Descuento ({discount}%)</th>
                                <td className="py-1 pl-3 text-right font-medium text-red-500">-{formatCurrency(customerSaving)}</td>
                            </tr>
                            <tr>
                                <th scope="row" colSpan={3} className="pt-2 pr-3 text-right font-bold text-slate-800 hidden sm:table-cell">Total Final (USD)</th>
                                <th scope="row" className="pt-2 pr-3 text-left font-bold text-slate-800 sm:hidden">Total Final (USD)</th>
                                <td className="pt-2 pl-3 text-right font-bold text-lg text-slate-900">{formatCurrency(finalPrice)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Internal Financials */}
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    Análisis Financiero (Uso Interno)
                    <Tooltip text="Esta sección no aparecerá en el PDF final. Es solo para tu referencia.">
                       <InformationCircleIcon className="w-5 h-5 text-blue-600"/>
                    </Tooltip>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-white p-3 rounded-md">
                        <span className="text-xs text-slate-500 block">Costo Total</span>
                        <span className="font-bold text-slate-800">{formatCurrency(totalCost)}</span>
                    </div>
                     <div className="bg-white p-3 rounded-md">
                        <span className="text-xs text-slate-500 block">Precio Final</span>
                        <span className="font-bold text-slate-800">{formatCurrency(finalPrice)}</span>
                    </div>
                     <div className="bg-white p-3 rounded-md">
                        <span className="text-xs text-slate-500 block">Margen Contrib.</span>
                        <span className={`font-bold text-lg ${marginColor} px-2 py-0.5 rounded-md`}>{contributionMargin.toFixed(1)}%</span>
                    </div>
                     <div className="bg-white p-3 rounded-md">
                        <span className="text-xs text-slate-500 block">Aprobación</span>
                        <span className="font-bold text-slate-800 text-xs">{approvalRequired}</span>
                    </div>
                </div>
            </div>
            
             <div className="pt-4 flex justify-end">
                <button 
                  onClick={generatePDF} 
                  disabled={isGenerating}
                  className="bg-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generando...' : (initialQuote ? 'Guardar y Generar PDF' : 'Crear y Exportar PDF')}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};