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
          {/* Contenido de la tarjeta */}
        </div>
      </div>
    </div>

  );
};


export default Login;
