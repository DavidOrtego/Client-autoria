import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Home, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/authContext';
import AuthCard      from '../components/auth/AuthCard';
import FormField     from '../components/auth/FormField';
import PasswordField from '../components/auth/PasswordField';
import ErrorBanner   from '../components/auth/ErrorBanner';
import SubmitButton  from '../components/auth/SubmitButton';

const ICONOS_FLOTANTES = [
  {
    icono: Home,
    tamaño: 64,
    clase: 'absolute top-[15%] left-[15%] text-brand-teal/10 rotate-12 animate-bounce transition-all duration-1000',
  },
  {
    icono: CheckCircle,
    tamaño: 48,
    clase: 'absolute bottom-[20%] right-[15%] text-brand-green/10 -rotate-12 animate-bounce transition-all duration-1000',
    estilo: { animationDelay: '0.5s' },
  },
];

const Login = () => {
  const [email,             setEmail]             = useState('');
  const [contrasena,        setContrasena]        = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando,          setCargando]          = useState(false);
  const [error,             setError]             = useState('');
  const [agitando,          setAgitando]          = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await login(email, contrasena);
      navigate('/vives/home');
    } catch (err) {
      setError(err.message || 'Failed to log in. Please try again.');
      setAgitando(true);
      setTimeout(() => setAgitando(false), 600);
    } finally {
      setCargando(false);
    }
  };

  const pie = (
    <p className="text-slate-500 text-sm">
      Don't have an account yet?{' '}
      <button
        id="goto-signup"
        onClick={() => navigate('/signup')}
        className="text-brand-teal font-bold hover:underline transition-all"
      >
        Sign up!
      </button>
    </p>
  );

  return (
    <AuthCard
      titulo="Welcome back!"
      subtitulo="Manage your apartment expenses and tasks easily."
      iconosFlotantes={ICONOS_FLOTANTES}
      pie={pie}
    >
      <form
        className={`space-y-6 ${agitando ? 'animate-shake' : ''}`}
        onSubmit={manejarEnvio}
      >
        {/* Campo de email */}
        <FormField
          id="login-email"
          etiqueta="Email"
          icono={Mail}
          tipo="email"
          placeholder="example@email.com"
          valor={email}
          alCambiar={(e) => { setEmail(e.target.value); setError(''); }}
          hayError={!!error}
        />

        {/* Campo de contraseña */}
        <PasswordField
          id="login-password"
          etiqueta="Password"
          valor={contrasena}
          alCambiar={(e) => { setContrasena(e.target.value); setError(''); }}
          mostrar={mostrarContrasena}
          alAlternar={() => setMostrarContrasena(!mostrarContrasena)}
          hayError={!!error}
        />

        {/* Mensaje de error visible cuando las credenciales son incorrectas */}
        <ErrorBanner mensaje={error} />

        {/* Botón de envío */}
        <SubmitButton id="login-submit" cargando={cargando} textoCarga="Logging in...">
          Log in
        </SubmitButton>
      </form>
    </AuthCard>
  );
};

export default Login;
