import { ESTADO_INFO } from '../constants/estados';

const PASOS = ['RECIBIDA', 'DIAGNOSTICO', 'EN_PROCESO', 'LISTA', 'ENTREGADA'];

/**
 * Aguja de velocimetro que recorre 5 posiciones (una por cada estado del flujo).
 * Si la orden esta CANCELADA, la aguja se muestra en rojo apuntando al centro.
 */
export default function StatusGauge({ estado, size = 96 }) {
  const cancelada = estado === 'CANCELADA';
  const pasoIndex = cancelada ? -1 : PASOS.indexOf(estado);
  const total = PASOS.length - 1;
  const anguloInicio = -90;
  const anguloFin = 90;
  const angulo = cancelada
    ? 0
    : anguloInicio + (pasoIndex / total) * (anguloFin - anguloInicio);

  const r = 40;
  const cx = 50;
  const cy = 52;

  const arcPoint = (deg) => {
    const rad = (Math.PI / 180) * deg;
    return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
  };
  const start = arcPoint(-90);
  const end = arcPoint(90);

  const needleColor = cancelada ? '#E5484D' : ESTADO_INFO[estado]?.color || '#F2A33D';
  const needleEnd = arcPoint(angulo);

  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 100 65" className="overflow-visible">
      <path
        d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`}
        stroke="#262B31"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      {!cancelada && (
        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${needleEnd.x} ${needleEnd.y}`}
          stroke={needleColor}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
      )}
      <line x1={cx} y1={cy} x2={needleEnd.x} y2={needleEnd.y} stroke="#F5F3EE" strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill="#F5F3EE" />
    </svg>
  );
}
