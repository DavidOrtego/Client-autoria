import React from 'react';

const FormField = ({
  id,
  etiqueta,
  icono: Icono,
  tipo = 'text',
  placeholder,
  valor,
  alCambiar,
  hayError = false,
  requerido = true,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700 ml-1">
        {etiqueta}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
          <Icono size={18} />
        </div>
        <input
          id={id}
          type={tipo}
          required={requerido}
          placeholder={placeholder}
          value={valor}
          onChange={alCambiar}
          className={`w-full pl-11 pr-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 transition-all text-slate-700 placeholder:text-slate-400 ${
            hayError
              ? 'border-red-400 focus:ring-red-200 focus:border-red-400 bg-red-50'
              : 'border-slate-200 focus:ring-brand-teal/20 focus:border-brand-teal'
          }`}
        />
      </div>
    </div>
  );
};

export default FormField;
