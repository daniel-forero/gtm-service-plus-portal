import React, { useMemo, useState } from 'react';
import { ServicePlus } from '../types';
import { StarIcon } from './icons';

interface FilterSidebarProps {
  services: ServicePlus[];
  filters: {
    productTypes: Set<string>;
    categories: Set<string>;
    rating: number;
  };
  onFilterChange: (newFilters: FilterSidebarProps['filters']) => void;
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-4 border-b border-slate-200">
    <h3 className="font-semibold text-slate-800 mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const Checkbox: React.FC<{ label: string; count: number; checked: boolean; onChange: () => void }> = ({ label, count, checked, onChange }) => (
  <label className="flex items-center space-x-3 cursor-pointer group">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
    <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition-colors">
      <svg className="w-3 h-3 text-white hidden peer-checked:block" fill="none" viewBox="0 0 12 9" stroke="currentColor" stroke-width="2.5"><path d="M1 4.5L4.5 8L11 1"/></svg>
    </div>
    <span className="text-sm text-slate-600 group-hover:text-slate-900">{label}</span>
    <span className="text-sm text-slate-400 ml-auto">({count})</span>
  </label>
);

const RatingFilter: React.FC<{ rating: number; onRatingChange: (rating: number) => void }> = ({ rating, onRatingChange }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center space-x-2">
            <div className="flex" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                        key={star} 
                        onMouseEnter={() => setHoverRating(star)} 
                        onClick={() => onRatingChange(rating === star ? 0 : star)}
                        aria-label={`Calificación de ${star} estrellas`}
                    >
                        <StarIcon 
                            className="w-6 h-6 text-yellow-400 cursor-pointer" 
                            filled={star <= (hoverRating || rating)} 
                        />
                    </button>
                ))}
            </div>
            <span className="text-sm text-slate-500">{rating > 0 ? `${rating} o más` : ''}</span>
        </div>
    );
};

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ services, filters, onFilterChange }) => {
  const { productTypes, categories } = useMemo(() => {
    const productTypeCounts = new Map<string, number>();
    const categoryCounts = new Map<string, number>();

    services.forEach(service => {
      productTypeCounts.set(service.productType, (productTypeCounts.get(service.productType) || 0) + 1);
      categoryCounts.set(service.category, (categoryCounts.get(service.category) || 0) + 1);
    });

    return {
      productTypes: Array.from(productTypeCounts.entries()).sort((a,b) => a[0].localeCompare(b[0])),
      categories: Array.from(categoryCounts.entries()).sort((a,b) => a[0].localeCompare(b[0])),
    };
  }, [services]);

  const handleProductTypeChange = (type: string) => {
    const newProductTypes = new Set(filters.productTypes);
    if (newProductTypes.has(type)) {
      newProductTypes.delete(type);
    } else {
      newProductTypes.add(type);
    }
    onFilterChange({ ...filters, productTypes: newProductTypes });
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = new Set(filters.categories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    onFilterChange({ ...filters, categories: newCategories });
  };
  
  const handleRatingChange = (newRating: number) => {
    onFilterChange({ ...filters, rating: newRating });
  };
  
  const clearFilters = () => {
      onFilterChange({
          productTypes: new Set(),
          categories: new Set(),
          rating: 0
      });
  };

  return (
    <aside className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 sticky top-24">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-slate-900">Filtrar Categorías</h2>
        <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline font-medium">Limpiar Todo</button>
      </div>

      <FilterSection title="Tipo de Producto">
        {productTypes.map(([type, count]) => (
          <Checkbox 
            key={type}
            label={type === 'Propio' ? 'Productos Propios' : 'Productos Representados'}
            count={count}
            checked={filters.productTypes.has(type)}
            onChange={() => handleProductTypeChange(type)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Categoría">
        {categories.map(([category, count]) => (
          <Checkbox 
            key={category}
            label={category}
            count={count}
            checked={filters.categories.has(category)}
            onChange={() => handleCategoryChange(category)}
          />
        ))}
      </FilterSection>
      
      <div className="pt-4">
        <h3 className="font-semibold text-slate-800 mb-3">Calificación</h3>
        <RatingFilter rating={filters.rating} onRatingChange={handleRatingChange} />
      </div>

    </aside>
  );
};