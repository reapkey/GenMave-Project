export default function Input({
  label,
  error,
  type = 'text',
  className = '',
  ...props
}) {
  const baseStyles = 'w-full px-3 py-2 border rounded transition-colors focus:outline-none focus:ring-2';
  const stateStyles = error 
    ? 'border-error text-error focus:border-error focus:ring-error' 
    : 'border-neutral focus:border-primary focus:ring-primary-light';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`${baseStyles} ${stateStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
}
