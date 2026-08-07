export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;
  const styles = {
    error: 'border-ember-500/40 bg-ember-500/10 text-ember-400',
    success: 'border-moss-500/40 bg-moss-500/10 text-moss-400',
  };
  return (
    <div className={`mb-4 flex items-start justify-between gap-3 rounded-md border px-4 py-3 text-sm ${styles[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-current opacity-70 hover:opacity-100">
          ✕
        </button>
      )}
    </div>
  );
}
