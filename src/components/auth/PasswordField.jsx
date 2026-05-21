import React from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const PasswordField = ({
  id,
  etiqueta,
  valor,
  alCambiar,
  mostrar,
  alAlternar,
  hayError = false,
  valorReferencia = null,
}) => {
  const obtenerClaseBorde = () => {
    if (valorReferencia !== null) {
      if (!valor) return 'border-slate-200 focus:ring-brand-teal/20 focus:border-brand-teal';
      if (valor === valorReferencia) return 'border-brand-green focus:ring-brand-green/20 focus:border-brand-green bg-green-50';
      return 'border-red-400 focus:ring-red-200 focus:border-red-400 bg-red-50';
    }
    return hayError
      ? 'border-red-400 focus:ring-red-200 focus:border-red-400 bg-red-50'
      : 'border-slate-200 focus:ring-brand-teal/20 focus:border-brand-teal';
  };

  const mostrarIndicador = valorReferencia !== null && valor.length > 0;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700 ml-1">
        {etiqueta}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
          <Lock size={18} />
        </div>

        <input
          id={id}
          type={mostrar ? 'text' : 'password'}
          required
          placeholder="••••••••"
          value={valor}
          onChange={alCambiar}
          className={`w-full pl-11 pr-12 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 transition-all text-slate-700 placeholder:text-slate-400 ${obtenerClaseBorde()}`}
        />

        <button
          type="button"
          onClick={alAlternar}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
        >
          {mostrar ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

        {mostrarIndicador && (
          <div className="absolute inset-y-0 right-10 flex items-center pr-1">
            {valor === valorReferencia
              ? <CheckCircle size={16} className="text-brand-green" />
              : <AlertCircle  size={16} className="text-red-400" />
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordField;
