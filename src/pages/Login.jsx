import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Home, ArrowRight, CheckCircle } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Iconos flotantes */}
      <div className="absolute top-[15%] left-[15%] text-brand-teal/10 rotate-12 animate-bounce transition-all duration-1000">
        <Home size={64} />
      </div>
      <div className="absolute bottom-[20%] right-[15%] text-brand-green/10 -rotate-12 animate-bounce transition-all duration-1000" style={{ animationDelay: '0.5s' }}>
        <CheckCircle size={48} />
      </div>

      {/* Tarjeta de Login */}
      <div className="w-full max-w-md z-10">
        <div className="glass-card rounded-3xl p-8 md:p-10">
          {/* Logo y Cabecera */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 mb-6 relative">
              <img
                src="/Vives.png"
                alt="Vives Logo"
                className="w-full h-full object-contain relative z-10 drop-shadow-sm"
              />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">¡Hola de nuevo!</h1>
            <p className="text-slate-500 text-center text-sm md:text-base">
              Gestiona los gastos y tareas de tu piso de forma fácil.
            </p>
          </div>

        </div>
      </div>
    </div>

  );
};


export default Login;
