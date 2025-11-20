
import React, { useState, useMemo, useCallback } from 'react';
import { ServicePlus, Quote } from '../types';
import { ServiceCard } from './ServiceCard';
import { MOCK_SERVICES } from '../services/mockData';
import { FilterSidebar } from './FilterSidebar';

interface PortfolioViewProps {
  services: ServicePlus[];
  quotes: Quote[];
  onSelectService: (service: ServicePlus) => void;
}

const QuickAccessCard: React.FC<{service: ServicePlus, onSelect: (service: ServicePlus) => void}> = ({ service, onSelect }) => (
    <div onClick={() => onSelect(service)} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-slate-200 flex flex-col justify-between">
        <h4 className="font-bold text-sm text-slate-800">{service.name}</h4>
        <p className="text-xs text-slate-500 mt-2">{service.businessLine}</p>
    </div>
);


export const PortfolioView: React.FC<PortfolioViewProps> = ({ services, quotes, onSelectService }) => {
  const [activeTab, setActiveTab] = useState<'Google Cloud' | 'AWS'>('Google Cloud');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    productTypes: new Set<string>(),
    categories: new Set<string>(),
    rating: 0,
  });

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const recentlyQuotedServices = useMemo(() => {
    const recentServiceIds = [...new Set(quotes.map(q => q.serviceId))].slice(0, 4);
    return recentServiceIds.map(id => services.find(s => s.id === id)).filter(Boolean) as ServicePlus[];
  }, [quotes, services]);

  const popularServices = useMemo(() => {
    return MOCK_SERVICES.filter(s => ['workspace-support', 'workspace-managed'].includes(s.id));
  }, []);

  const servicesForCurrentTab = useMemo(() => {
    return services.filter(service => service.businessLine === activeTab);
  }, [services, activeTab]);

  const filteredServices = useMemo(() => {
    return servicesForCurrentTab
      .filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(service => {
        if (filters.productTypes.size === 0) return true;
        return filters.productTypes.has(service.productType);
      })
      .filter(service => {
        if (filters.categories.size === 0) return true;
        return filters.categories.has(service.category);
      })
      .filter(service => {
        return service.rating >= filters.rating;
      });
  }, [servicesForCurrentTab, searchTerm, filters]);

  const TabButton = ({ label }: { label: 'Google Cloud' | 'AWS' }) => (
    <button
      onClick={() => setActiveTab(label)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeTab === label
          ? 'bg-blue-600 text-white shadow'
          : 'text-slate-600 hover:bg-slate-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Portafolio de Service Plus</h2>
          <p className="text-slate-600">Encuentra, comprende y cotiza nuestras ofertas de servicios estandarizados.</p>
          <div className="mt-4 max-w-lg">
            <input 
              type="text"
              placeholder="Buscar por nombre de servicio..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Acceso Rápido</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <h4 className="text-sm font-bold text-slate-600 mb-3">Populares</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {popularServices.map(service => <QuickAccessCard key={service.id} service={service} onSelect={onSelectService} />)}
                  </div>
              </div>
              <div>
                  <h4 className="text-sm font-bold text-slate-600 mb-3">Cotizados Recientemente</h4>
                  {recentlyQuotedServices.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {recentlyQuotedServices.map(service => <QuickAccessCard key={service.id} service={service} onSelect={onSelectService} />)}
                      </div>
                  ) : (
                      <p className="text-sm text-slate-500">Aún no has generado cotizaciones.</p>
                  )}
              </div>
          </div>
        </div>
        
        <div className="flex space-x-2 border-b border-slate-200 mb-6">
          <TabButton label="Google Cloud" />
          <TabButton label="AWS" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} onSelect={onSelectService} />
          ))}
        </div>
        {filteredServices.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-slate-700">No se encontraron servicios</h3>
              <p className="text-slate-500 mt-1">Intenta con otra búsqueda o ajusta los filtros.</p>
          </div>
        )}
      </div>
      <div className="lg:col-span-1">
          <FilterSidebar 
            services={services}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
      </div>
    </div>
  );
};