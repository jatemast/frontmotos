export const ORDEN_ESTADOS = ['RECIBIDA', 'DIAGNOSTICO', 'EN_PROCESO', 'LISTA', 'ENTREGADA', 'CANCELADA'];

export const ESTADO_INFO = {
  RECIBIDA: { label: 'Recibida', color: '#5FC2BE', paso: 1 },
  DIAGNOSTICO: { label: 'Diagnostico', color: '#3FA7A4', paso: 2 },
  EN_PROCESO: { label: 'En proceso', color: '#F2A33D', paso: 3 },
  LISTA: { label: 'Lista', color: '#F6B45C', paso: 4 },
  ENTREGADA: { label: 'Entregada', color: '#6FCF7B', paso: 5 },
  CANCELADA: { label: 'Cancelada', color: '#E5484D', paso: 0 },
};

export const TRANSICIONES_VALIDAS = {
  RECIBIDA: ['DIAGNOSTICO', 'CANCELADA'],
  DIAGNOSTICO: ['EN_PROCESO', 'CANCELADA'],
  EN_PROCESO: ['LISTA', 'CANCELADA'],
  LISTA: ['ENTREGADA', 'CANCELADA'],
  ENTREGADA: [],
  CANCELADA: [],
};

export function formatoMoneda(valor) {
  const numero = Number(valor || 0);
  return numero.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
}

export function formatoFecha(fecha) {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: '2-digit' });
}
