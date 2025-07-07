import React from "react";

const Button = React.forwardRef(({ className = "", children, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={`font-brand rounded-xl px-4 py-2 font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-desi-primary ${className}`}
    {...props}
  >
    {children}
  </button>
));

export default Button;
