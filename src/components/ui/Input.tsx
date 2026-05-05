import { InputHTMLAttributes, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <input
        ref={ref}
        className={`w-full rounded-lg px-3 py-2 text-sm outline-none transition-all bg-white border focus:border-pink-500 focus:ring-1 focus:ring-pink-500 ${error ? "border-red-400" : "border-gray-200"} ${className}`}
        style={{ color: "var(--text)" }}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";
