import React from 'react';

interface ConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800">Confirmación</h2>
          <p className="mt-2 text-slate-600">
            Estás a punto de abrir el cotizador para el servicio. ¿Deseas continuar?
          </p>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow"
          >
            Continuar al Cotizador
          </button>
        </div>
      </div>
    </div>
  );
};
