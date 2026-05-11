import React from 'react';

const etiquetas    = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const coloresBarra = ['', 'bg-red-400', 'bg-amber-400', 'bg-brand-teal', 'bg-brand-green'];
const coloresTexto = ['', 'text-red-400', 'text-amber-500', 'text-brand-teal', 'text-brand-green'];

const calcularFortaleza = (contrasena) => {
  let puntuacion = 0;
  if (contrasena.length >= 8)          puntuacion++;
  if (/[A-Z]/.test(contrasena))        puntuacion++;
  if (/[0-9]/.test(contrasena))        puntuacion++;
  if (/[^A-Za-z0-9]/.test(contrasena)) puntuacion++;
  return puntuacion;
};

const PasswordStrength = ({ contrasena }) => {
  if (!contrasena) return null;

  const fortaleza = calcularFortaleza(contrasena);

  return (
    <div className="pt-1 space-y-1.5 px-1">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= fortaleza ? coloresBarra[fortaleza] : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-slate-400">
        Strength:{' '}
        <span className={`font-semibold ${coloresTexto[fortaleza]}`}>
          {etiquetas[fortaleza]}
        </span>
      </p>
    </div>
  );
};

export default PasswordStrength;
