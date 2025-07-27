import React from 'react';

// Reusable button component with consistent UI behavior
const Button = ({
  type = 'button',
  children,
  onClick,
  className = '',
  disabled = false,
  isLoading = false,
  variant = 'primary',
}) => {
  // Base classes for all buttons
  const baseClasses =
    'w-full font-brand font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 scale-100 active:scale-95';

  // Variant-specific classes
  const variantClasses = {
    primary:
      'bg-orange-300 hover:bg-orange-400 text-white focus:ring-orange-400',
    secondary:
      'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 focus:ring-gray-400',
  };

  // Disabled/loading state classes
  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${
        disabled || isLoading ? disabledClasses : 'hover:scale-105'
      } ${className}`}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
