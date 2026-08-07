export default function Logo({ size = 'md', withWordmark = true }) {
  const dims = { sm: 28, md: 36, lg: 48 }[size] || 36;

  return (
    <div className="flex items-center gap-3">
      <svg width={dims} height={dims} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="62" height="62" rx="16" fill="#1E2227" stroke="#333A42" strokeWidth="1.5" />
        {/* Aro del velocimetro */}
        <circle cx="32" cy="34" r="20" stroke="#333A42" strokeWidth="4" />
        <path
          d="M14 34a18 18 0 0 1 30.5-13"
          stroke="#3FA7A4"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M50 34a18 18 0 0 1 -6 13.4"
          stroke="#F2A33D"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Aguja */}
        <path d="M32 34 L41 21" stroke="#F6B45C" strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="34" r="4.5" fill="#F6B45C" />
        {/* Base tipo llave */}
        <path
          d="M22 50.5c0 1.5 4.5 3 10 3s10-1.5 10-3"
          stroke="#4A535C"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {withWordmark && (
        <div className="leading-none">
          <p className="font-display text-lg tracking-wide text-neutral-50 uppercase">
            Pavas <span className="text-headlight-500">Motor</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-asphalt-500 font-mono">Taller de motos</p>
        </div>
      )}
    </div>
  );
}
