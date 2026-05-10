import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Home, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { login } from '../lib/auth';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);

      navigate('/dashboard');

    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="w-full max-w-md z-10 animate-fade-in">
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
          <form
            className={`space-y-6 ${shake ? 'animate-shake' : ''}`}
            onSubmit={handleSubmit}
          >

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-11 pr-4 py-3.5  border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-slate-700 placeholder:text-slate-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">Contraseña</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5  border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-slate-700 placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Botón para mostrar/ocultar contraseña */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {/* Botón de envío */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-brand-teal to-brand-green hover:shadow-lg hover:shadow-brand-teal/20 active:scale-[0.98] transition-all rounded-2xl text-white font-bold text-lg flex items-center justify-center space-x-2 group"
            >
              <span>Iniciar Sesión</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Pie de la tarjeta */}
          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm">
              ¿Aún no tienes cuenta?{' '}
              <button className="text-brand-teal font-bold hover:underline transition-all">
                ¡Registrate!
              </button>
            </p>
          </div>

        </div>
        {/* Slogan */}
        <p className="mt-8 text-center text-slate-400 text-xs tracking-widest uppercase flex items-center justify-center space-x-2">
          <span>Vivir juntos, sin caos</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>Vives House</span>
        </p>
      </div>
    </div>

  );
};


export default Login;
