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
  const [nombre,            setNombre]            = useState('');
  const [email,             setEmail]             = useState('');
  const [contrasena,        setContrasena]        = useState('');
  const [confirmar,         setConfirmar]         = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar,  setMostrarConfirmar]  = useState(false);
  const [cargando,          setCargando]          = useState(false);
  const [error,             setError]             = useState('');
  const [agitando,          setAgitando]          = useState(false);
  const navigate = useNavigate();

  const limpiarError = () => setError('');

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');

    if (contrasena !== confirmar) {
      setError('Passwords do not match.');
      setAgitando(true);
      setTimeout(() => setAgitando(false), 600);
      return;
    }

    setCargando(true);
    try {
      await register(nombre, email, contrasena);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Could not create account. Please try again.');
      setAgitando(true);
      setTimeout(() => setAgitando(false), 600);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
    </div>
  );
};

export default SignUp;
