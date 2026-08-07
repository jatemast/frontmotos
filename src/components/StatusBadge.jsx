import { ESTADO_INFO } from '../constants/estados';

export default function StatusBadge({ estado }) {
  const info = ESTADO_INFO[estado] || { label: estado, color: '#4A535C' };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium font-mono uppercase tracking-wide"
      style={{ backgroundColor: `${info.color}1A`, color: info.color, border: `1px solid ${info.color}55` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: info.color }} />
      {info.label}
    </span>
  );
}
