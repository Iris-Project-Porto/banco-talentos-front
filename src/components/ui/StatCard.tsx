interface Props {
  label: string;
  value: number | string;
  accentColor?: string;
}

export function StatCard({ label, value, accentColor }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card px-6 py-5">
      <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500 mb-2">{label}</p>
      <p
        className="text-3xl font-bold"
        style={{ color: accentColor ?? "#0F172A" }}
      >
        {value}
      </p>
    </div>
  );
}
