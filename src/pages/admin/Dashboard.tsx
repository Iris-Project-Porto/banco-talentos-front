import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface DashData {
  total: number; ativos: number; pendentes: number; skillsCount: number;
  topSkills: { name: string; count: number }[];
  nivelCount: { Jr: number; Pleno: number; Sr: number };
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-syne)", color: accent ?? "var(--text)" }}>{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashData | null>(null);

  useEffect(() => { api.getDashboard().then(setData).catch(() => {}); }, []);

  if (!data) return <p className="text-gray-400 text-sm">Carregando...</p>;

  const nivelRows = [
    { label: "Sênior", key: "Sr" as const, color: "#92400e", bg: "#fef3c7" },
    { label: "Pleno",  key: "Pleno" as const, color: "#065f46", bg: "#d1fae5" },
    { label: "Júnior", key: "Jr" as const, color: "#1e40af", bg: "#dbeafe" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Visão geral do banco de talentos</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total de cadastros" value={data.total} />
        <StatCard label="Perfis ativos" value={data.ativos} accent="var(--pink)" />
        <StatCard label="Aguardando revisão" value={data.pendentes} accent={data.pendentes > 0 ? "#f59e0b" : undefined} />
        <StatCard label="Skills mapeadas" value={data.skillsCount} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Top Skills</p>
          <div className="flex flex-col gap-2.5">
            {data.topSkills.length === 0 && <p className="text-sm text-gray-400">Nenhuma skill ainda.</p>}
            {data.topSkills.map(({ name, count }) => (
              <div key={name} className="flex items-center gap-3">
                <span className="w-32 truncate text-sm text-gray-700">{name}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-100">
                  <div className="h-full rounded-full" style={{ width: `${data.total > 0 ? (count / data.total) * 100 : 0}%`, background: "var(--pink)" }} />
                </div>
                <span className="text-xs w-5 text-right text-gray-400">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Por Nível</p>
          <div className="flex flex-col gap-3">
            {nivelRows.map(({ label, key, color, bg }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: bg, color }}>{label}</span>
                <span className="text-sm font-semibold text-gray-800">{data.nivelCount[key]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
