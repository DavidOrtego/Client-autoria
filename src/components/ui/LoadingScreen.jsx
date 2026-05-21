import React from 'react';
import VivesTransparente from '../../assets/VivesTransparente.png';

const LoadingScreen = ({ type = 'login', message, duration = 1500 }) => {
  const defaultMessage = type === 'signup' ? 'Creating account...' : 'Connecting to your home...';

  return (
    <div className="fixed inset-0 bg-linear-to-br from-sky-50/90 via-white/80 to-sky-100/90 backdrop-blur-xl flex flex-col items-center justify-center z-9999 overflow-hidden select-none animate-fade-in">
      {/* Efectos de brillo de fondo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-teal/15 rounded-full filter blur-[80px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-green/15 rounded-full filter blur-[80px] pointer-events-none animate-float"></div>

      {/* Contenedor principal */}
      <div className="flex flex-col items-center max-w-sm px-6 text-center z-10">
        {/* Contenedor del logotipo y el spinner de carga */}
        <div className="relative flex items-center justify-center w-40 h-40 mb-8">
          {/* Anillo exterior */}
          <div className="absolute inset-0 border-2 border-dashed border-brand-teal/30 rounded-full animate-spin-slow"></div>
          
          {/* Círculo de brillo */}
          <div className="absolute inset-4 bg-linear-to-tr from-brand-teal/30 to-brand-green/20 rounded-full filter blur-xl animate-pulse-glow"></div>

          {/* Anillo interior */}
          <div className="absolute inset-2 border-2 border-transparent border-t-brand-teal border-r-brand-green rounded-full animate-spin"></div>

          {/* Logo centrado */}
          <img
            src={VivesTransparente}
            alt="Vives House"
            className="w-40 h-36 object-contain animate-pulse-glow"
          />
        </div>

        {/* Título de carga */}
        <h3 className="font-outfit text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-linear-to-r from-teal-600 via-emerald-600 to-teal-600 bg-300% animate-gradient">
          Vives House
        </h3>

        {/* Mensaje personalizado o por defecto */}
        <p className="text-slate-600 mt-2 text-sm font-semibold tracking-wide h-6 ">
          {message || defaultMessage}
        </p>

        {/* Barra de carga */}
        <div className="w-48 h-1.5 bg-slate-200/80 rounded-full mt-6 overflow-hidden border border-slate-300/30 relative">
          <div
            className="absolute top-0 bottom-0 left-0 bg-linear-to-r from-brand-teal to-brand-green rounded-full"
            style={{
              animation: `progressFill ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
