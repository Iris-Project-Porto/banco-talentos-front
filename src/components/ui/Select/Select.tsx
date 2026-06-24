import { SelectHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface Option { value: string; label: string }

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, options, error, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-slate-600">{label}</label>}
      <select
        ref={ref}
        className={twMerge(
          "h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition-all focus:border-pink focus:shadow-focus-pink",
          error ? "border-red-400" : "border-slate-300",
          className,
        )}
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
