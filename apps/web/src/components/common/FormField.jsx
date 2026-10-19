export default function FormField({
  label,
  id,
  error,
  required = false,
  helperText,
  children,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </span>
          {helperText && <span className="text-xs text-slate-400 font-normal">{helperText}</span>}
        </label>
      )}

      {children}

      {error && (
        <p className="text-xs text-rose-600 font-medium mt-0.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
