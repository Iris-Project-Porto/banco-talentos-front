import { ButtonHTMLAttributes, forwardRef } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", size = "md", loading, fullWidth, children, disabled, className = "", ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-semibold rounded-lg transition-all active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:shadow-focus-pink";
    const sizes = {
      sm:  "px-3 py-1.5 text-xs",
      md:  "px-5 py-2.5 text-sm",
      lg:  "w-full py-3 text-base",
    };
    const variants = {
      primary:   "bg-pink hover:bg-pink-dark text-white shadow-none",
      secondary: "bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-50",
      danger:    "bg-white border border-red-200 text-red-600 hover:bg-red-50",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            {children}
          </span>
        ) : children}
      </button>
    );
  }
);
Button.displayName = "Button";
