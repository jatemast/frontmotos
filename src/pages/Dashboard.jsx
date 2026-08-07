import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OrdenesAPI } from '../api/endpoints';
import { ESTADO_INFO, formatoFecha, formatoMoneda } from '../constants/estados';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import Alert from '../components/Alert';

const ESTADOS_ACTIVOS = ['RECIBIDA', 'DIAGNOSTICO', 'EN_PROCESO', 'LISTA'];

export default function Dashboard() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    OrdenesAPI.listar({ limit: 100 })
      .then((res) => setOrdenes(res.data.data))
      .catch((err) => setError(err.mensaje))
      .finally(() => setCargando(false));
  }, []);

  const conteos = ESTADOS_ACTIVOS.reduce((acc, estado) => {
    acc[estado] = ordenes.filter((o) => o.estado === estado).length;
    return acc;
  }, {});
  const entregadasMes = ordenes.filter((o) => o.estado === 'ENTREGADA').length;
  const ingresosActivos = ordenes
    .filter((o) => ESTADOS_ACTIVOS.includes(o.estado))
    .reduce((acc, o) => acc + Number(o.total), 0);

  return (
    <div>
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-headlight-500 mb-1">Panel general</p>
          <h1 className="font-display text-3xl uppercase tracking-wide text-neutral-50">Estado del taller</h1>
        </div>
        <Link to="/ordenes/nueva">
          <span className="inline-flex items-center gap-2 rounded-md bg-headlight-500 px-4 py-2.5 text-sm font-medium text-asphalt-950 hover:bg-headlight-400">
            + Nueva orden
          </span>
        </Link>
      </div>

      <Alert message={error} onClose={() => setError('')} />

      {cargando ? (
        <Loader label="Cargando panel" />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {ESTADOS_ACTIVOS.map((estado) => (
              <div key={estado} className="rounded-xl border border-asphalt-700 bg-asphalt-800 p-4 shadow-panel">
                <StatusBadge estado={estado} />
                <p className="mt-3 font-display text-3xl text-neutral-50">{conteos[estado]}</p>
                <p className="text-xs text-asphalt-500 mt-0.5">ordenes</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl border border-asphalt-700 bg-asphalt-800 p-5">
              <p className="text-xs font-mono uppercase tracking-wide text-asphalt-500">Valor en taller (activas)</p>
              <p className="mt-2 font-display text-2xl text-headlight-400">{formatoMoneda(ingresosActivos)}</p>
            </div>
            <div className="rounded-xl border border-asphalt-700 bg-asphalt-800 p-5">
              <p className="text-xs font-mono uppercase tracking-wide text-asphalt-500">Entregadas</p>
              <p className="mt-2 font-display text-2xl text-moss-400">{entregadasMes}</p>
            </div>
            <div className="rounded-xl border border-asphalt-700 bg-asphalt-800 p-5">
              <p className="text-xs font-mono uppercase tracking-wide text-asphalt-500">Total de ordenes</p>
              <p className="mt-2 font-display text-2xl text-neutral-50">{ordenes.length}</p>
            </div>
          </div>

          <div className="rounded-xl border border-asphalt-700 bg-asphalt-800 shadow-panel overflow-hidden">
            <div className="px-5 py-4 border-b border-asphalt-700 flex items-center justify-between">
              <h2 className="font-display text-lg uppercase tracking-wide text-neutral-50">Ordenes recientes</h2>
              <Link to="/ordenes" className="text-xs font-mono uppercase text-headlight-500 hover:underline">
                Ver todas →
              </Link>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-asphalt-500 font-mono text-xs uppercase tracking-wide border-b border-asphalt-700">
                  <th className="px-5 py-3">Moto</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3">Ingreso</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.slice(0, 8).map((orden) => (
                  <tr
                    key={orden.id}
                    className="border-b border-asphalt-700/60 last:border-0 hover:bg-asphalt-700/40 cursor-pointer"
                    onClick={() => (window.location.href = `/ordenes/${orden.id}`)}
                  >
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
                    <td colSpan={5} className="px-5 py-8 text-center text-asphalt-500">
                      Aun no hay ordenes registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
