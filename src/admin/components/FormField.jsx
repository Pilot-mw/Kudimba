export default function FormField({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  helperText,
  options = [],
  placeholder,
  accept,
  rows,
  className = '',
  disabled = false,
  ...props
}) {
  const baseInputClass = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-colors ${
    error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows || 4}
            disabled={disabled}
            className={baseInputClass + ' resize-y min-h-[80px]'}
            {...props}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={onChange}
            disabled={disabled}
            className={baseInputClass}
            {...props}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((opt) => {
              const optValue = typeof opt === 'string' ? opt : opt.value;
              const optLabel = typeof opt === 'string' ? opt : opt.label;
              return (
                <option key={optValue} value={optValue}>
                  {optLabel}
                </option>
              );
            })}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!value}
              onChange={onChange}
              disabled={disabled}
              className="w-4 h-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
              {...props}
            />
            <span className="text-sm text-brand-ink">{label}</span>
          </div>
        );

      case 'file':
        return (
          <input
            type="file"
            onChange={onChange}
            accept={accept}
            disabled={disabled}
            className="block w-full text-sm text-brand-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-pale file:text-brand-green hover:file:bg-brand-green/10 cursor-pointer"
            {...props}
          />
        );

      default:
        return (
          <input
            type={type}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={baseInputClass}
            {...props}
          />
        );
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {type !== 'checkbox' && label && (
        <label className="block text-sm font-medium text-brand-ink">
          {label}
          {required && <span className="text-brand-hot ml-0.5">*</span>}
        </label>
      )}
      {renderInput()}
      {helperText && !error && (
        <p className="text-xs text-brand-gray">{helperText}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
