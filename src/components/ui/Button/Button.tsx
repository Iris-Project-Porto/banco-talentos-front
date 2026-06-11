import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

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
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "w-full py-3 text-base",
    };
    const variants = {
      primary: "bg-pink hover:bg-pink-dark text-white shadow-none",
      secondary: "bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-50",
      danger: "bg-white border border-red-200 text-red-600 hover:bg-red-50",
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
            <Loader2 className="animate-spin h-4 w-4" />
            {children}
          </span>
        ) : children}
      </button>
    );
  }
);
Button.displayName = "Button";