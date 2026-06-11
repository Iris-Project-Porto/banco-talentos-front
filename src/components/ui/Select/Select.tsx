import { SelectHTMLAttributes, forwardRef } from "react";

interface Option { value: string; label: string }

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, options, error, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <select
        ref={ref}
        className={`w-full rounded-lg px-3 py-2 text-sm outline-none bg-white border focus:border-pink-500 focus:ring-1 focus:ring-pink-500 ${error ? "border-red-400" : "border-gray-200"} ${className}`}
        style={{ color: "var(--text)" }}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Select.displayName = "Select";
