import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OrdenesAPI } from '../api/endpoints';
import { ORDEN_ESTADOS, formatoFecha, formatoMoneda } from '../constants/estados';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { Button } from '../components/Form';

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [paginacion, setPaginacion] = useState({ page: 1, totalPages: 1 });
  const [estado, setEstado] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const cargar = (page = 1) => {
    setCargando(true);
    OrdenesAPI.listar({ page, limit: 10, estado: estado || undefined })
      .then((res) => {
        setOrdenes(res.data.data);
        setPaginacion(res.data.pagination);
      })
      .catch((err) => setError(err.mensaje))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargar(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-headlight-500 mb-1">Taller</p>
          <h1 className="font-display text-3xl uppercase tracking-wide text-neutral-50">Ordenes de trabajo</h1>
        </div>
        <Link to="/ordenes/nueva">
          <Button>+ Nueva orden</Button>
        </Link>
      </div>

      <Alert message={error} onClose={() => setError('')} />

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setEstado('')}
          className={`rounded-full px-3 py-1.5 text-xs font-mono uppercase tracking-wide border ${
            estado === '' ? 'bg-headlight-500/15 text-headlight-400 border-headlight-500/30' : 'border-asphalt-600 text-asphalt-500'
          }`}
        >
          Todas
        </button>
        {ORDEN_ESTADOS.map((e) => (
          <button
            key={e}
            onClick={() => setEstado(e)}
            className={`rounded-full px-3 py-1.5 text-xs font-mono uppercase tracking-wide border ${
              estado === e ? 'bg-headlight-500/15 text-headlight-400 border-headlight-500/30' : 'border-asphalt-600 text-asphalt-500'
            }`}
          >
            {e.replace('_', ' ')}
          </button>
        ))}
      </div>

      {cargando ? (
        <Loader />
      ) : (
        <div className="rounded-xl border border-asphalt-700 bg-asphalt-800 shadow-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-asphalt-500 font-mono text-xs uppercase tracking-wide border-b border-asphalt-700">
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Moto</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Ingreso</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr
                  key={orden.id}
                  onClick={() => navigate(`/ordenes/${orden.id}`)}
                  className="border-b border-asphalt-700/60 last:border-0 hover:bg-asphalt-700/30 cursor-pointer"
                >
                  <td className="px-5 py-3 font-mono text-asphalt-500">#{orden.id}</td>
                  <td className="px-5 py-3">
                    <span className="plate text-xs">{orden.moto?.placa}</span>
                    <span className="ml-2 text-asphalt-500">{orden.moto?.marca} {orden.moto?.modelo}</span>
                  </td>
                  <td className="px-5 py-3 text-neutral-200">{orden.cliente?.nombre}</td>
                  <td className="px-5 py-3 text-asphalt-500">{formatoFecha(orden.fecha_ingreso)}</td>
                  <td className="px-5 py-3"><StatusBadge estado={orden.estado} /></td>
                  <td className="px-5 py-3 text-right font-mono text-neutral-200">{formatoMoneda(orden.total)}</td>
                </tr>
              ))}
              {ordenes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-asphalt-500">
                    No hay ordenes con este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {paginacion.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-asphalt-700 text-xs text-asphalt-500">
              <span>Pagina {paginacion.page} de {paginacion.totalPages}</span>
              <div className="space-x-2">
                <button disabled={paginacion.page <= 1} onClick={() => cargar(paginacion.page - 1)} className="rounded border border-asphalt-600 px-2 py-1 disabled:opacity-40">
                  Anterior
                </button>
                <button disabled={paginacion.page >= paginacion.totalPages} onClick={() => cargar(paginacion.page + 1)} className="rounded border border-asphalt-600 px-2 py-1 disabled:opacity-40">
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
