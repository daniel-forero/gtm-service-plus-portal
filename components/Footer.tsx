import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Servinformación. Todos los derechos reservados.</p>
        <p className="mt-1">Una herramienta interna para el equipo GTM.</p>
      </div>
    </footer>
  );
};
