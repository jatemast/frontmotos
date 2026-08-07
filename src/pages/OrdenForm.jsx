import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MotosAPI, OrdenesAPI } from '../api/endpoints';
import { Field, Input, Select, Textarea, Button } from '../components/Form';
import Alert from '../components/Alert';

export default function OrdenForm() {
  const [motos, setMotos] = useState([]);
  const [form, setForm] = useState({ moto_id: '', descripcion_falla: '', observaciones: '', responsable: '' });
  const [error, setError] = useState('');
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    MotosAPI.listar({ limit: 200 }).then((res) => setMotos(res.data.data));
  }, []);

  const motoSeleccionada = motos.find((m) => String(m.id) === String(form.moto_id));

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});
    try {
      const res = await OrdenesAPI.crear(form);
      navigate(`/ordenes/${res.data.data.id}`);
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

  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-widest text-headlight-500 mb-1">Recepcion</p>
      <h1 className="font-display text-3xl uppercase tracking-wide text-neutral-50 mb-6">Nueva orden de trabajo</h1>

      <Alert message={error} onClose={() => setError('')} />
      {motos.length === 0 && (
        <Alert type="error" message="No hay motos registradas. Registra primero un cliente y su moto." />
      )}

      <form onSubmit={guardar} className="rounded-xl border border-asphalt-700 bg-asphalt-800 p-6 shadow-panel">
        <Field label="Moto" required error={errores.moto_id}>
          <Select required value={form.moto_id} onChange={(e) => setForm({ ...form, moto_id: e.target.value })}>
            <option value="">Selecciona la moto que ingresa</option>
            {motos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.placa} — {m.marca} {m.modelo} ({m.cliente?.nombre})
              </option>
            ))}
          </Select>
        </Field>

        {motoSeleccionada && (
          <div className="mb-4 rounded-md border border-asphalt-600 bg-asphalt-900 px-4 py-3 text-xs text-asphalt-500">
            Propietario: <span className="text-neutral-200">{motoSeleccionada.cliente?.nombre}</span> · Tel: {motoSeleccionada.cliente?.telefono}
          </div>
        )}

        <Field label="Descripcion de la falla reportada" required error={errores.descripcion_falla}>
          <Textarea
            required
            rows={4}
            placeholder="Ej. Ruido en el motor al acelerar, no enciende, frenos suenan..."
            value={form.descripcion_falla}
            onChange={(e) => setForm({ ...form, descripcion_falla: e.target.value })}
          />
        </Field>

        <Field label="Observaciones adicionales">
          <Textarea rows={2} value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} />
        </Field>

        <Field label="Mecanico / responsable asignado">
          <Input value={form.responsable} onChange={(e) => setForm({ ...form, responsable: e.target.value })} />
        </Field>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando || motos.length === 0}>
            {guardando ? 'Creando orden...' : 'Crear orden'}
          </Button>
        </div>
      </form>
    </div>
  );
}
