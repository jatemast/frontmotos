export function Modal({ open, onClose, title, children, wide = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${wide ? 'max-w-2xl' : 'max-w-md'} rounded-xl border border-asphalt-600 bg-asphalt-800 shadow-panel`}
      >
        <div className="flex items-center justify-between border-b border-asphalt-700 px-5 py-4">
          <h3 className="font-display text-lg uppercase tracking-wide text-neutral-50">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-asphalt-500 hover:bg-asphalt-700 hover:text-neutral-100"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmModal({ open, title = 'Confirmar accion', message, confirmLabel = 'Confirmar', danger = false, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-asphalt-500 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-md border border-asphalt-600 px-4 py-2 text-sm text-neutral-200 hover:bg-asphalt-700"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className={`rounded-md px-4 py-2 text-sm font-medium text-asphalt-950 ${
            danger ? 'bg-ember-500 hover:bg-ember-400' : 'bg-headlight-500 hover:bg-headlight-400'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
