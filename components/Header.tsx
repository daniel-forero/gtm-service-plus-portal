
import React from 'react';
import { Logo } from './Logo';
import { PlusIcon } from './icons';

interface HeaderProps {
    onNavigate: (view: 'portfolio' | 'my_quotes') => void;
    onAddProduct: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onAddProduct }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="cursor-pointer flex items-center gap-4"
            onClick={() => onNavigate('portfolio')}
          >
            <Logo />
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">GTM Service Plus Portal</h1>
          </div>
          <nav className="flex items-center space-x-2 sm:space-x-4">
              <button onClick={() => onNavigate('portfolio')} className="text-sm font-medium text-slate-600 hover:text-blue-600">Portafolio</button>
              <button onClick={() => onNavigate('my_quotes')} className="text-sm font-medium text-slate-600 hover:text-blue-600">Mis Cotizaciones</button>
              <button 
                onClick={onAddProduct}
                className="flex items-center gap-1 ml-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Nuevo Servicio</span>
              </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
