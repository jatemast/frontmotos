import { useEffect, useState } from 'react';
import { ClientesAPI } from '../api/endpoints';
import { Modal, ConfirmModal } from '../components/Modal';
import { Field, Input, Button } from '../components/Form';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

const VACIO = { nombre: '', documento: '', telefono: '', email: '', direccion: '' };

export default function Clientes() {
  const { esAdmin } = useAuth();
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

  const cargar = (page = 1) => {
    setCargando(true);
    ClientesAPI.listar({ page, limit: 10, buscar })
      .then((res) => {
        setClientes(res.data.data);
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

  const abrirEditar = (cliente) => {
    setEditando(cliente);
    setForm({ ...VACIO, ...cliente });
    setErrores({});
    setModalAbierto(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});
    try {
      if (editando) await ClientesAPI.actualizar(editando.id, form);
      else await ClientesAPI.crear(form);
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
      await ClientesAPI.eliminar(aEliminar.id);
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
          <p className="font-mono text-xs uppercase tracking-widest text-headlight-500 mb-1">Base de datos</p>
          <h1 className="font-display text-3xl uppercase tracking-wide text-neutral-50">Clientes</h1>
        </div>
        <Button onClick={abrirNuevo}>+ Nuevo cliente</Button>
      </div>

      <Alert message={error} onClose={() => setError('')} />

      <div className="mb-4">
        <input
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          placeholder="Buscar por nombre, documento o telefono..."
          className="w-full max-w-sm rounded-md border border-asphalt-600 bg-asphalt-800 px-3 py-2 text-sm placeholder:text-asphalt-500 focus:border-headlight-500 focus:outline-none"
        />
      </div>

      {cargando ? (
        <Loader />
      ) : (
        <div className="rounded-xl border border-asphalt-700 bg-asphalt-800 shadow-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-asphalt-500 font-mono text-xs uppercase tracking-wide border-b border-asphalt-700">
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Documento</th>
                <th className="px-5 py-3">Telefono</th>
                <th className="px-5 py-3">Correo</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id} className="border-b border-asphalt-700/60 last:border-0 hover:bg-asphalt-700/30">
                  <td className="px-5 py-3 text-neutral-100 font-medium">{c.nombre}</td>
                  <td className="px-5 py-3 font-mono text-asphalt-500">{c.documento}</td>
                  <td className="px-5 py-3 text-neutral-300">{c.telefono}</td>
                  <td className="px-5 py-3 text-asphalt-500">{c.email || '—'}</td>
                  <td className="px-5 py-3 text-right space-x-3">
                    <button onClick={() => abrirEditar(c)} className="text-xs text-headlight-500 hover:underline">
                      Editar
                    </button>
                    {esAdmin && (
                      <button onClick={() => setAEliminar(c)} className="text-xs text-ember-400 hover:underline">
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {clientes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-asphalt-500">
                    No se encontraron clientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {paginacion.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-asphalt-700 text-xs text-asphalt-500">
              <span>
                Pagina {paginacion.page} de {paginacion.totalPages}
              </span>
              <div className="space-x-2">
                <button
                  disabled={paginacion.page <= 1}
                  onClick={() => cargar(paginacion.page - 1)}
                  className="rounded border border-asphalt-600 px-2 py-1 disabled:opacity-40"
                >
                  Anterior
                </button>
                <button
                  disabled={paginacion.page >= paginacion.totalPages}
                  onClick={() => cargar(paginacion.page + 1)}
                  className="rounded border border-asphalt-600 px-2 py-1 disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)} title={editando ? 'Editar cliente' : 'Nuevo cliente'}>
        <form onSubmit={guardar}>
          <Field label="Nombre completo" required error={errores.nombre}>
            <Input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </Field>
          <Field label="Documento de identidad" required error={errores.documento}>
            <Input required value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} />
          </Field>
          <Field label="Telefono" required error={errores.telefono}>
            <Input required value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          </Field>
          <Field label="Correo electronico" error={errores.email}>
            <Input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Direccion">
            <Input value={form.direccion || ''} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cliente'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!aEliminar}
        title="Eliminar cliente"
        message={`¿Deseas eliminar a "${aEliminar?.nombre}"? Esta accion no se puede deshacer.`}
        confirmLabel="Eliminar"
        danger
        onConfirm={confirmarEliminar}
        onCancel={() => setAEliminar(null)}
      />
    </div>
  );
}
