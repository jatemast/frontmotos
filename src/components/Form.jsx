export function Field({ label, error, children, required }) {
  return (
    <label className="block mb-4">
      <span className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-asphalt-500">
        {label} {required && <span className="text-headlight-500">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-ember-400">{error}</span>}
    </label>
  );
}

const baseInput =
  'w-full rounded-md border border-asphalt-600 bg-asphalt-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-asphalt-500 focus:border-headlight-500 focus:outline-none';

export function Input(props) {
  return <input {...props} className={`${baseInput} ${props.className || ''}`} />;
}

export function Textarea(props) {
  return <textarea {...props} className={`${baseInput} ${props.className || ''}`} />;
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${baseInput} ${props.className || ''}`}>
      {children}
    </select>
  );
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-headlight-500 text-asphalt-950 hover:bg-headlight-400',
    secondary: 'border border-asphalt-600 text-neutral-200 hover:bg-asphalt-700',
    danger: 'bg-ember-500 text-asphalt-950 hover:bg-ember-400',
    ghost: 'text-asphalt-500 hover:text-neutral-100',
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
