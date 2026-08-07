import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: DashboardIcon, end: true },
  { to: '/ordenes', label: 'Ordenes', icon: OrdenIcon },
  { to: '/motos', label: 'Motos', icon: MotoIcon },
  { to: '/clientes', label: 'Clientes', icon: ClienteIcon },
];

export default function Layout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-asphalt-700 bg-asphalt-800/60 px-4 py-6">
        <div className="mb-8 px-2">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-headlight-500/15 text-headlight-400 border border-headlight-500/30'
                    : 'text-asphalt-500 hover:bg-asphalt-700 hover:text-neutral-100 border border-transparent'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          {usuario && (
            <div className="rounded-lg border border-asphalt-700 bg-asphalt-900 p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-neutral-200 truncate">{usuario.nombre}</p>
                <p className="text-[10px] font-mono uppercase text-asphalt-500 truncate">{usuario.rol}</p>
              </div>
              <button
                onClick={salir}
                title="Cerrar sesion"
                className="shrink-0 rounded-md p-1.5 text-asphalt-500 hover:bg-asphalt-700 hover:text-ember-400"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M15 17l5-5-5-5M20 12H9M12 19H6a1 1 0 01-1-1V6a1 1 0 011-1h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
          <div className="rounded-lg border border-asphalt-700 bg-asphalt-900 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-asphalt-500">Estado del taller</p>
            <p className="mt-1 flex items-center gap-2 text-xs text-moss-400">
              <span className="h-1.5 w-1.5 rounded-full bg-moss-400" /> Sistema operativo
            </p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex md:hidden items-center justify-between border-b border-asphalt-700 px-4 py-3">
          <Logo size="sm" />
        </header>
        <nav className="flex md:hidden overflow-x-auto gap-1 border-b border-asphalt-700 px-3 py-2">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium ${
                  isActive ? 'bg-headlight-500/15 text-headlight-400' : 'text-asphalt-500'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function DashboardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function OrdenIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 3h9l3 3v15H6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 10h6M9 14h6M9 18h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function MotoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="6" cy="17" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="17" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 17l4-7h4l2 4h2M10 10l3-4h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ClienteIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20c1-3.5 4-5.5 7-5.5s6 2 7 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
