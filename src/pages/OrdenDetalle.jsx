import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrdenesAPI, ItemsAPI } from '../api/endpoints';
import { ESTADO_INFO, TRANSICIONES_VALIDAS, formatoFecha, formatoMoneda } from '../constants/estados';
import StatusBadge from '../components/StatusBadge';
import StatusGauge from '../components/StatusGauge';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { Modal, ConfirmModal } from '../components/Modal';
import { Field, Input, Select, Button } from '../components/Form';
import { useAuth } from '../context/AuthContext';

const VACIO_ITEM = { tipo: 'REPUESTO', descripcion: '', cantidad: 1, precio_unitario: '' };

export default function OrdenDetalle() {
  const { esAdmin } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [orden, setOrden] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [modalItem, setModalItem] = useState(false);
  const [itemForm, setItemForm] = useState(VACIO_ITEM);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [itemAEliminar, setItemAEliminar] = useState(null);
  const [confirmarEstado, setConfirmarEstado] = useState(null);

  const cargar = () => {
    setCargando(true);
    OrdenesAPI.obtener(id)
      .then((res) => setOrden(res.data.data))
      .catch((err) => setError(err.mensaje))
      .finally(() => setCargando(false));
  };

  useEffect(cargar, [id]);

  const editable = orden && !['ENTREGADA', 'CANCELADA'].includes(orden.estado);

  const abrirNuevoItem = () => {
    setItemForm(VACIO_ITEM);
    setErrores({});
    setModalItem(true);
  };

  const guardarItem = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});
    try {
      await ItemsAPI.crear(id, itemForm);
      setModalItem(false);
      cargar();
    } catch (err) {
      if (err.details) {
        const mapa = {};
        err.details.forEach((d) => (mapa[d.campo] = d.mensaje));
        setErrores(mapa);
      } else {
        setError(err.mensaje);
      }
    } finally {
      setGuardando(false);
    }
  };

  const eliminarItem = async () => {
    try {
      await ItemsAPI.eliminar(id, itemAEliminar.id);
      setItemAEliminar(null);
      cargar();
    } catch (err) {
      setError(err.mensaje);
      setItemAEliminar(null);
    }
  };

  const cambiarEstado = async () => {
    try {
      await OrdenesAPI.cambiarEstado(id, confirmarEstado);
      setExito(`Orden actualizada a "${ESTADO_INFO[confirmarEstado]?.label}".`);
      setConfirmarEstado(null);
      cargar();
    } catch (err) {
      setError(err.mensaje);
      setConfirmarEstado(null);
    }
  };

  if (cargando) return <Loader />;
  if (!orden) return <Alert message={error || 'Orden no encontrada'} />;

  const transiciones = TRANSICIONES_VALIDAS[orden.estado] || [];

  return (
    <div>
      <button onClick={() => navigate('/ordenes')} className="text-xs font-mono text-asphalt-500 hover:text-neutral-200 mb-4 inline-block">
        ← Volver a ordenes
      </button>

      <Alert message={error} onClose={() => setError('')} />
      <Alert type="success" message={exito} onClose={() => setExito('')} />

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 rounded-xl border border-asphalt-700 bg-asphalt-800 p-6 shadow-panel">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-headlight-500 mb-1">Orden #{orden.id}</p>
              <h1 className="font-display text-2xl uppercase tracking-wide text-neutral-50">
                <span className="plate mr-2">{orden.moto?.placa}</span>
                {orden.moto?.marca} {orden.moto?.modelo}
              </h1>
            </div>
            <StatusBadge estado={orden.estado} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-xs text-asphalt-500 font-mono uppercase">Cliente</p>
              <p className="text-neutral-100">{orden.cliente?.nombre}</p>
              <p className="text-asphalt-500 text-xs">{orden.cliente?.telefono}</p>
            </div>
            <div>
              <p className="text-xs text-asphalt-500 font-mono uppercase">Fechas</p>
              <p className="text-neutral-100">Ingreso: {formatoFecha(orden.fecha_ingreso)}</p>
              <p className="text-neutral-100">Entrega: {formatoFecha(orden.fecha_entrega)}</p>
            </div>
          </div>

          <div className="mb-2">
            <p className="text-xs text-asphalt-500 font-mono uppercase mb-1">Falla reportada</p>
            <p className="text-neutral-200 text-sm">{orden.descripcion_falla}</p>
          </div>
          {orden.observaciones && (
            <div className="mt-3">
              <p className="text-xs text-asphalt-500 font-mono uppercase mb-1">Observaciones</p>
              <p className="text-neutral-300 text-sm">{orden.observaciones}</p>
            </div>
          )}
          {orden.responsable && (
            <p className="mt-3 text-xs text-asphalt-500">
              Responsable: <span className="text-neutral-200">{orden.responsable}</span>
            </p>
          )}
        </div>

        <div className="rounded-xl border border-asphalt-700 bg-asphalt-800 p-6 shadow-panel flex flex-col items-center">
          <StatusGauge estado={orden.estado} size={140} />
          <p className="mt-2 font-display text-xl" style={{ color: ESTADO_INFO[orden.estado]?.color }}>
            {ESTADO_INFO[orden.estado]?.label}
          </p>

          {transiciones.length > 0 && (
            <div className="mt-5 w-full space-y-2">
              <p className="text-xs font-mono uppercase text-asphalt-500 text-center mb-1">Cambiar estado</p>
              {transiciones.map((t) => (
                <button
                  key={t}
                  onClick={() => setConfirmarEstado(t)}
                  className="w-full rounded-md border px-3 py-2 text-xs font-mono uppercase tracking-wide transition-colors"
                  style={{
                    borderColor: `${ESTADO_INFO[t].color}55`,
                    color: ESTADO_INFO[t].color,
                    backgroundColor: `${ESTADO_INFO[t].color}12`,
                  }}
                >
                  {t === 'CANCELADA' ? 'Cancelar orden' : `Pasar a ${ESTADO_INFO[t].label}`}
                </button>
              ))}
            </div>
          )}
          {transiciones.length === 0 && (
            <p className="mt-4 text-xs text-asphalt-500 text-center">Esta orden se encuentra en un estado final.</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-asphalt-700 bg-asphalt-800 shadow-panel overflow-hidden">
        <div className="px-5 py-4 border-b border-asphalt-700 flex items-center justify-between">
          <h2 className="font-display text-lg uppercase tracking-wide text-neutral-50">Mano de obra y repuestos</h2>
          {editable && <Button onClick={abrirNuevoItem}>+ Agregar item</Button>}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-asphalt-500 font-mono text-xs uppercase tracking-wide border-b border-asphalt-700">
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Descripcion</th>
              <th className="px-5 py-3 text-right">Cantidad</th>
              <th className="px-5 py-3 text-right">Precio unit.</th>
              <th className="px-5 py-3 text-right">Subtotal</th>
              {editable && <th className="px-5 py-3 text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {orden.items?.map((item) => (
              <tr key={item.id} className="border-b border-asphalt-700/60 last:border-0">
                <td className="px-5 py-3 text-asphalt-500 text-xs">{item.tipo === 'MANO_DE_OBRA' ? 'Mano de obra' : 'Repuesto'}</td>
                <td className="px-5 py-3 text-neutral-100">{item.descripcion}</td>
                <td className="px-5 py-3 text-right font-mono text-neutral-300">{Number(item.cantidad)}</td>
                <td className="px-5 py-3 text-right font-mono text-neutral-300">{formatoMoneda(item.precio_unitario)}</td>
                <td className="px-5 py-3 text-right font-mono text-neutral-100">{formatoMoneda(item.subtotal)}</td>
                {editable && (
                  <td className="px-5 py-3 text-right">
                    {esAdmin && (
                      <button onClick={() => setItemAEliminar(item)} className="text-xs text-ember-400 hover:underline">
                        Eliminar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {(!orden.items || orden.items.length === 0) && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-asphalt-500">
                  Aun no se han agregado items a esta orden.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-asphalt-700">
              <td colSpan={editable ? 5 : 4} className="px-5 py-4 text-right font-mono text-xs uppercase text-asphalt-500">
                Total de la orden
              </td>
              <td className="px-5 py-4 text-right font-display text-xl text-headlight-400">{formatoMoneda(orden.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <Modal open={modalItem} onClose={() => setModalItem(false)} title="Agregar item">
        <form onSubmit={guardarItem}>
          <Field label="Tipo" required>
            <Select value={itemForm.tipo} onChange={(e) => setItemForm({ ...itemForm, tipo: e.target.value })}>
              <option value="REPUESTO">Repuesto</option>
              <option value="MANO_DE_OBRA">Mano de obra</option>
            </Select>
          </Field>
          <Field label="Descripcion" required error={errores.descripcion}>
            <Input required value={itemForm.descripcion} onChange={(e) => setItemForm({ ...itemForm, descripcion: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Cantidad" required error={errores.cantidad}>
              <Input type="number" min="0.01" step="0.01" required value={itemForm.cantidad} onChange={(e) => setItemForm({ ...itemForm, cantidad: e.target.value })} />
            </Field>
            <Field label="Precio unitario" required error={errores.precio_unitario}>
              <Input type="number" min="0" step="0.01" required value={itemForm.precio_unitario} onChange={(e) => setItemForm({ ...itemForm, precio_unitario: e.target.value })} />
            </Field>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setModalItem(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Agregar'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!itemAEliminar}
        title="Eliminar item"
        message={`¿Deseas eliminar "${itemAEliminar?.descripcion}"? El total de la orden se recalculara automaticamente.`}
        confirmLabel="Eliminar"
        danger
        onConfirm={eliminarItem}
        onCancel={() => setItemAEliminar(null)}
      />

      <ConfirmModal
        open={!!confirmarEstado}
        title="Cambiar estado de la orden"
        message={`¿Confirmas pasar la orden #${orden.id} a "${ESTADO_INFO[confirmarEstado]?.label}"?`}
        confirmLabel="Confirmar cambio"
        danger={confirmarEstado === 'CANCELADA'}
        onConfirm={cambiarEstado}
        onCancel={() => setConfirmarEstado(null)}
      />
    </div>
  );
}
