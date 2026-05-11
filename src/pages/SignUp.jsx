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

  const pie = (
    <p className="text-slate-500 text-sm">
      Already have an account?{' '}
      <button
        id="goto-login"
        onClick={() => navigate('/login')}
        className="text-brand-teal font-bold hover:underline transition-all"
      >
        Log in
      </button>
    </p>
  );

  return (
    <AuthCard
      titulo="Create account"
      subtitulo="Join your house and manage everything together."
      iconosFlotantes={ICONOS_FLOTANTES}
      pie={pie}
    >
      <form
        className={`space-y-5 ${agitando ? 'animate-shake' : ''}`}
        onSubmit={manejarEnvio}
      >
        {/* Campo: Nombre completo */}
        <FormField
          id="signup-name"
          etiqueta="Full name"
          icono={User}
          tipo="text"
          placeholder="David Marcuello"
          valor={nombre}
          alCambiar={(e) => { setNombre(e.target.value); limpiarError(); }}
        />

        {/* Campo: Email */}
        <FormField
          id="signup-email"
          etiqueta="Email"
          icono={Mail}
          tipo="email"
          placeholder="example@email.com"
          valor={email}
          alCambiar={(e) => { setEmail(e.target.value); limpiarError(); }}
          hayError={!!error}
        />

        {/* Campo: Contraseña con barra de fortaleza */}
        <div className="space-y-0">
          <PasswordField
            id="signup-password"
            etiqueta="Password"
            valor={contrasena}
            alCambiar={(e) => { setContrasena(e.target.value); limpiarError(); }}
            mostrar={mostrarContrasena}
            alAlternar={() => setMostrarContrasena(!mostrarContrasena)}
            hayError={!!error}
          />
          {/* Barra de fortaleza de la contraseña */}
          <PasswordStrength contrasena={contrasena} />
        </div>

        {/* Campo: Confirmar contraseña (activa indicador de coincidencia) */}
        <PasswordField
          id="signup-confirm"
          etiqueta="Confirm password"
          valor={confirmar}
          alCambiar={(e) => { setConfirmar(e.target.value); limpiarError(); }}
          mostrar={mostrarConfirmar}
          alAlternar={() => setMostrarConfirmar(!mostrarConfirmar)}
          valorReferencia={contrasena}
        />

        {/* Banner de error cuando algo falla */}
        <ErrorBanner mensaje={error} />

        {/* Botón de envío del formulario */}
        <SubmitButton id="signup-submit" cargando={cargando} textoCarga="Creating account...">
          Create account
        </SubmitButton>
      </form>
    </AuthCard>
  );
};

export default SignUp;
