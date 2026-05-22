import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  labelRight?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, labelRight, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {(label || labelRight) && (
        <div className="flex items-center justify-between">
          {label && <label className="text-xs font-medium text-slate-600">{label}</label>}
          {labelRight}
        </div>
      )}
      <input
        ref={ref}
        className={`w-full font-sans text-base rounded-lg px-3.5 py-2.5 outline-none transition-all bg-white border
          ${error ? "border-red-400" : "border-slate-300"}
          focus:border-pink focus:shadow-focus-pink
          placeholder:text-slate-400 text-slate-900 ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";
