import React from 'react';
import { Link } from 'react-router-dom';

const AuthCard = ({ titulo, subtitulo, iconosFlotantes = [], pie, children }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">

      {/* Iconos decorativos flotantes del fondo */}
      {iconosFlotantes.map(({ icono: Icono, tamaño, clase, estilo }, i) => (
        <div key={i} className={clase} style={estilo}>
          <Icono size={tamaño} />
        </div>
      ))}

      {/* Tarjeta principal */}
      <div className="w-full max-w-md z-10 animate-fade-in">
        <div className="glass-card rounded-3xl p-8 md:p-10">

          {/* Cabecera: logo, título y subtítulo */}
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="w-20 h-20 mb-5 relative hover:scale-105 active:scale-95 transition-all duration-300 block cursor-pointer">
              <img
                src="/Vives.png"
                alt="Vives Logo"
                className="w-full h-full object-contain relative z-10 drop-shadow-sm"
              />
            </Link>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">
              {titulo}
            </h1>
            <p className="text-slate-500 text-center text-sm md:text-base">
              {subtitulo}
            </p>
          </div>

          {/* Contenido principal (formulario) */}
          {children}

          {/* Pie de la tarjeta (enlace a login/signup) */}
          {pie && (
            <div className="mt-8 text-center">
              {pie}
            </div>
          )}

        </div>

        {/* Eslogan de la app */}
        <p className="mt-8 text-center text-slate-400 text-xs tracking-widest uppercase flex items-center justify-center space-x-2">
          <span>Living together, no chaos</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span>Vives House</span>
        </p>
      </div>

    </div>
  );
};

export default AuthCard;
