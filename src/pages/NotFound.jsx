import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-6xl text-headlight-500">404</p>
      <p className="mt-2 text-asphalt-500">Esta pagina no existe en el taller.</p>
      <Link to="/" className="mt-6 text-sm text-headlight-500 hover:underline">
        Volver al panel
      </Link>
    </div>
  );
}
