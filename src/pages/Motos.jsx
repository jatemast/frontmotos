import { useEffect, useState } from 'react';
import { MotosAPI, ClientesAPI } from '../api/endpoints';
import { Modal, ConfirmModal } from '../components/Modal';
import { Field, Input, Select, Textarea, Button } from '../components/Form';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

const VACIO = { placa: '', marca: '', modelo: '', cilindraje: '', color: '', kilometraje: '', observaciones: '', cliente_id: '' };

export default function Motos() {
  const { esAdmin } = useAuth();
  const [motos, setMotos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [paginacion, setPaginacion] = useState({ page: 1, totalPages: 1 });
  const [buscar, setBuscar] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [aEliminar, setAEliminar] = useState(null);

  useEffect(() => {
    ClientesAPI.listar({ limit: 200 }).then((res) => setClientes(res.data.data));
  }, []);

  const cargar = (page = 1) => {
    setCargando(true);
    MotosAPI.listar({ page, limit: 10, buscar })
      .then((res) => {
        setMotos(res.data.data);
        setPaginacion(res.data.pagination);
      })
      .catch((err) => setError(err.mensaje))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    const t = setTimeout(() => cargar(1), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buscar]);

  const abrirNuevo = () => {
    setEditando(null);
    setForm(VACIO);
    setErrores({});
    setModalAbierto(true);
  };

  const abrirEditar = (moto) => {
    setEditando(moto);
    setForm({ ...VACIO, ...moto, cliente_id: moto.cliente_id });
    setErrores({});
    setModalAbierto(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});
    try {
      const payload = { ...form, cilindraje: form.cilindraje || null, kilometraje: form.kilometraje || 0 };
      if (editando) await MotosAPI.actualizar(editando.id, payload);
      else await MotosAPI.crear(payload);
      setModalAbierto(false);
      cargar(paginacion.page);
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

  const confirmarEliminar = async () => {
    try {
      await MotosAPI.eliminar(aEliminar.id);
      setAEliminar(null);
      cargar(paginacion.page);
    } catch (err) {
      setError(err.mensaje);
      setAEliminar(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-headlight-500 mb-1">Taller</p>
          <h1 className="font-display text-3xl uppercase tracking-wide text-neutral-50">Motos</h1>
        </div>
        <Button onClick={abrirNuevo} disabled={clientes.length === 0} title={clientes.length === 0 ? 'Primero registra un cliente' : ''}>
          + Nueva moto
        </Button>
      </div>

      <Alert message={error} onClose={() => setError('')} />
      {clientes.length === 0 && !cargando && (
        <Alert type="error" message="Debes registrar al menos un cliente antes de poder ingresar motos." />
      )}

      <div className="mb-4">
        <input
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          placeholder="Buscar por placa, marca o modelo..."
          className="w-full max-w-sm rounded-md border border-asphalt-600 bg-asphalt-800 px-3 py-2 text-sm placeholder:text-asphalt-500 focus:border-headlight-500 focus:outline-none"
        />
      </div>

      {cargando ? (
        <Loader />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {motos.map((m) => (
            <div key={m.id} className="rounded-xl border border-asphalt-700 bg-asphalt-800 p-4 shadow-panel">
              <div className="flex items-start justify-between mb-3">
                <span className="plate">{m.placa}</span>
                <div className="space-x-3">
                  <button onClick={() => abrirEditar(m)} className="text-xs text-headlight-500 hover:underline">
                    Editar
                  </button>
                  {esAdmin && (
                    <button onClick={() => setAEliminar(m)} className="text-xs text-ember-400 hover:underline">
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
              <p className="font-display text-lg text-neutral-50 uppercase">{m.marca} {m.modelo}</p>
              <p className="text-xs text-asphalt-500 mt-1">
                {m.cilindraje ? `${m.cilindraje}cc` : 'Cilindraje s/d'} · {m.color || 'Color s/d'} · {Number(m.kilometraje || 0).toLocaleString()} km
              </p>
              <p className="mt-3 text-sm text-neutral-300">Propietario: <span className="text-neutral-100">{m.cliente?.nombre}</span></p>
            </div>
          ))}
          {motos.length === 0 && (
            <p className="col-span-full text-center text-asphalt-500 py-10">No se encontraron motos registradas.</p>
          )}
        </div>
      )}

      {paginacion.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-xs text-asphalt-500">
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

      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)} title={editando ? 'Editar moto' : 'Nueva moto'} wide>
        <form onSubmit={guardar}>
          <div className="grid sm:grid-cols-2 gap-x-4">
            <Field label="Placa" required error={errores.placa}>
              <Input required value={form.placa} onChange={(e) => setForm({ ...form, placa: e.target.value })} />
            </Field>
            <Field label="Propietario" required error={errores.cliente_id}>
              <Select required value={form.cliente_id} onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}>
                <option value="">Selecciona un cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </Select>
            </Field>
            <Field label="Marca" required error={errores.marca}>
              <Input required value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} />
            </Field>
            <Field label="Modelo" required error={errores.modelo}>
              <Input required value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} />
            </Field>
            <Field label="Cilindraje (cc)" error={errores.cilindraje}>
              <Input type="number" min="0" value={form.cilindraje || ''} onChange={(e) => setForm({ ...form, cilindraje: e.target.value })} />
            </Field>
            <Field label="Color">
              <Input value={form.color || ''} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </Field>
            <Field label="Kilometraje" error={errores.kilometraje}>
              <Input type="number" min="0" value={form.kilometraje || ''} onChange={(e) => setForm({ ...form, kilometraje: e.target.value })} />
            </Field>
          </div>
          <Field label="Observaciones">
            <Textarea rows={3} value={form.observaciones || ''} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar moto'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!aEliminar}
        title="Eliminar moto"
        message={`¿Deseas eliminar la moto con placa "${aEliminar?.placa}"? Esta accion no se puede deshacer.`}
        confirmLabel="Eliminar"
        danger
        onConfirm={confirmarEliminar}
        onCancel={() => setAEliminar(null)}
      />
    </div>
  );
}
