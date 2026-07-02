import { Link } from "react-router-dom";

interface Props {
  label: string;
  value: number | string;
  accentColor?: string;
  labelColor?: string;
  to?: string;
}

export function StatCard({ label, value, accentColor, labelColor, to }: Props) {
  const content = labelColor ? (
    <>
      <span className="text-xs font-semibold" style={{ color: labelColor }}>
        {label}
      </span>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
    </>
  ) : (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500 mb-2">{label}</p>
      <p
        className="text-3xl font-bold"
        style={{ color: accentColor ?? "#0F172A" }}
      >
        {value}
      </p>
    </>
  );

  const baseClasses = "bg-white border border-slate-200 rounded-xl shadow-card px-6 py-5 block";
  const hoverClasses = to ? "transition-all hover:shadow-card-hover hover:-translate-y-px cursor-pointer" : "";

  if (to) {
    return (
      <Link to={to} className={`${baseClasses} ${hoverClasses}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={baseClasses}>
      {content}
    </div>
  );
}