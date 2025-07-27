import React from 'react';

// Reusable input component for form fields with consistent styling
const Input = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  required = false,
  className = '',
}) => {
  const baseInputClasses =
    'w-full px-4 py-3 rounded-lg border border-desi-accent focus:outline-none focus:ring-2 focus:ring-desi-primary text-desi-secondary transition-all duration-200';

  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={id} className="block text-desi-secondary font-medium mb-1">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={baseInputClasses}
      />
    </div>
  );
};

export default Input;
