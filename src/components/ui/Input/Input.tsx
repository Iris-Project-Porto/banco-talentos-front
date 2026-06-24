import { InputHTMLAttributes, forwardRef, ReactNode, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  labelRight?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, labelRight, className = "", type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = type === "password";
    const inputType = isPasswordType && showPassword ? "text" : type;

    return (
      <div className="flex flex-col gap-1.5">
        {(label || labelRight) && (
          <div className="flex items-center justify-between">
            {label && <label className="text-xs font-medium text-slate-600">{label}</label>}
            {labelRight}
          </div>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={twMerge(
              "h-10 w-full rounded-lg border bg-white px-3 font-sans text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-pink focus:shadow-focus-pink",
              error ? "border-red-400" : "border-slate-300",
              isPasswordType ? "pr-11" : "",
              className,
            )}
            {...props}
          />

          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink transition-all"
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" strokeWidth={2.5} />
              ) : (
                <Eye className="w-4 h-4" strokeWidth={2.5} />
              )}
            </button>
          )}
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";