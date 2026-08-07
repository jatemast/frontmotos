import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Field, Input, Button } from '../components/Form';
import Alert from '../components/Alert';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const destino = location.state?.from?.pathname || '/';

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await login(email, password);
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err.mensaje || 'No fue posible iniciar sesion.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="w-full max-w-sm rounded-2xl border border-asphalt-700 bg-asphalt-800 p-9 shadow-panel relative overflow-hidden"
      >
        <div
          className="absolute -top-16 -right-16 h-44 w-44 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(242,163,61,0.18), transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col items-center mb-7">
          <Logo withWordmark={false} size="lg" />
          <h1 className="mt-4 font-display text-xl uppercase tracking-wide text-neutral-50 text-center">
            Pavas Motor
          </h1>
          <p className="text-xs font-mono text-asphalt-500 text-center">Acceso al sistema del taller</p>
        </div>

        <Alert message={error} onClose={() => setError('')} />

        <form onSubmit={enviar} className="relative z-10">
          <Field label="Correo" required>
            <Input
              type="email"
              required
              autoFocus
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Contraseña" required>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Button type="submit" disabled={cargando} className="w-full mt-2">
            {cargando ? 'Ingresando...' : 'Ingresar al taller'}
          </Button>
        </form>

        <p className="relative z-10 mt-6 text-center text-[11px] font-mono text-asphalt-500">
          PAVAS S.A.S. · Sistema de gestion v1.0
        </p>
      </div>
    </div>
  );
}
