export default function Card({ 
  children, 
  variant = 'default',
  interactive = false,
  className = '',
  ...props 
}) {
  const baseStyles = 'bg-white border border-neutral rounded-lg p-6 shadow-md transition-shadow';
  
  const variants = {
    default: 'hover:shadow-lg',
    elevated: 'shadow-xl',
    flat: 'shadow-none',
    interactive: 'hover:shadow-lg cursor-pointer hover:scale-[1.02] transition-transform',
  };

  const variantStyle = interactive ? variants.interactive : variants[variant];

  return (
    <div
      className={`${baseStyles} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
