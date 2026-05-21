import React from 'react';
import { ArrowRight } from 'lucide-react';

const SubmitButton = ({ id, cargando, textoCarga = 'Loading...', children }) => {
  return (
    <button
      id={id}
      type="submit"
      className="w-full py-4 bg-gradient-to-r from-brand-teal to-brand-green hover:shadow-lg hover:shadow-brand-teal/20 active:scale-[0.98] transition-all rounded-2xl text-white font-bold text-lg flex items-center justify-center space-x-2 group disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {cargando ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>{textoCarga}</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
};

export default SubmitButton;
