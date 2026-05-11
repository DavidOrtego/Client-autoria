import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, User, HousePlus, UserRoundPlus } from 'lucide-react';
import { register } from '../lib/auth';
import AuthCard            from '../components/auth/AuthCard';
import FormField           from '../components/auth/FormField';
import PasswordField       from '../components/auth/PasswordField';
import PasswordStrength    from '../components/auth/PasswordStrength';
import ErrorBanner         from '../components/auth/ErrorBanner';
import SubmitButton        from '../components/auth/SubmitButton';

const ICONOS_FLOTANTES = [
  {
    icono: HousePlus,
    tamaño: 72,
    clase: 'absolute top-[12%] left-[12%] text-brand-teal/10 rotate-12 animate-bounce',
  },
  {
    icono: UserRoundPlus,
    tamaño: 56,
    clase: 'absolute bottom-[18%] right-[12%] text-brand-green/10 -rotate-12 animate-bounce',
    estilo: { animationDelay: '0.4s' },
  },
];

const SignUp = () => {
  return (
    <div>
    </div>
  );
};

export default SignUp;
