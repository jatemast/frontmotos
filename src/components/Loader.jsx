export default function Loader({ label = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-asphalt-500">
      <svg className="animate-spin h-8 w-8 text-headlight-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
      </svg>
      <p className="font-mono text-xs uppercase tracking-widest">{label}</p>
    </div>
  );
}
