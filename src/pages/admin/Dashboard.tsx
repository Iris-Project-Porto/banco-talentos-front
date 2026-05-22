import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useVagas } from "@/contexts/VagasContext";

interface DashData {
  total: number; ativos: number; pendentes: number; skillsCount: number;
  topSkills: { name: string; count: number }[];
  nivelCount: { Jr: number; Pleno: number; Sr: number };
}

const NIVEL_COLORS: Record<string, string> = {
  Jr:    "#3B82F6",
  Pleno: "#F59E0B",
  Sr:    "#10B981",
};

const STATUS_COLORS: Record<string, string> = {
  "Aberta":       "#10B981",
  "Em andamento": "#3B82F6",
  "Fechada":      "#94A3B8",
  "Cancelada":    "#EF4444",
};

export default function Dashboard() {
  const [data, setData] = useState<DashData | null>(null);
  const { vagas } = useVagas();

  useEffect(() => { api.getDashboard().then(setData).catch(() => {}); }, []);

  if (!data) return <p className="text-slate-400 text-sm">Carregando...</p>;

  const nivelRows: { label: string; key: keyof DashData["nivelCount"]; variant: "senior" | "pleno" | "junior" }[] = [
    { label: "Sênior", key: "Sr",    variant: "senior" },
    { label: "Pleno",  key: "Pleno", variant: "pleno" },
    { label: "Júnior", key: "Jr",    variant: "junior" },
  ];

  const maxSkill = data.topSkills.reduce((m, s) => Math.max(m, s.count), 1);

  // Vagas stats
  const vagasAbertas = vagas.filter((v) => v.status === "Aberta" || v.status === "Em andamento").length;

  const vagasPorNivel: Record<string, number> = { Jr: 0, Pleno: 0, Sr: 0 };
  vagas.forEach((v) => { if (v.senioridade in vagasPorNivel) vagasPorNivel[v.senioridade]++; });

  const vagasPorStatus: Record<string, number> = {
    "Aberta": 0, "Em andamento": 0, "Fechada": 0, "Cancelada": 0,
  };
  vagas.forEach((v) => { vagasPorStatus[v.status] = (vagasPorStatus[v.status] ?? 0) + 1; });

  const maxVagasNivel  = Math.max(...Object.values(vagasPorNivel), 1);
  const maxVagasStatus = Math.max(...Object.values(vagasPorStatus), 1);

  // Gap analysis: vagas abertas vs recursos disponíveis por nível
  const nivelLabels: { key: "Jr" | "Pleno" | "Sr"; label: string; variant: "senior" | "pleno" | "junior" }[] = [
    { key: "Jr",    label: "Júnior", variant: "junior" },
    { key: "Pleno", label: "Pleno",  variant: "pleno" },
    { key: "Sr",    label: "Sênior", variant: "senior" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" subtitle="Visão geral do banco de talentos" />

      {/* Stat cards — pessoas */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total de cadastros"   value={data.total} />
        <StatCard label="Perfis ativos"        value={data.ativos}    accentColor="#E11D48" />
        <StatCard label="Aguardando revisão"   value={data.pendentes} accentColor={data.pendentes > 0 ? "#D97706" : undefined} />
        <StatCard label="Skills mapeadas"      value={data.skillsCount} />
      </div>

      {/* Skills + Por nível */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500 mb-4">Top Skills</p>
          <div className="flex flex-col gap-2.5">
            {data.topSkills.length === 0 && <p className="text-sm text-slate-400">Nenhuma skill ainda.</p>}
            {data.topSkills.map(({ name, count }) => (
              <div key={name} className="flex items-center gap-3">
                <span className="w-32 truncate text-sm text-slate-700">{name}</span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-pink transition-[width] duration-[400ms] ease-in-out"
                    style={{ width: `${(count / maxSkill) * 100}%` }}
                  />
                </div>
                <span className="text-xs w-4 text-right text-slate-400">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500 mb-4">Por Nível</p>
          <div className="flex flex-col gap-3">
            {nivelRows.map(({ label, key, variant }) => (
              <div key={key} className="flex items-center justify-between">
                <Badge variant={variant}>{label}</Badge>
                <span className="text-sm font-semibold text-slate-800">{data.nivelCount[key]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Vagas ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-400">Vagas</p>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Vagas abertas" value={vagasAbertas} accentColor={vagasAbertas > 0 ? "#E11D48" : undefined} />
        <StatCard label="Total de vagas" value={vagas.length} />
        <StatCard label="Vagas encerradas" value={vagas.filter((v) => v.status === "Fechada" || v.status === "Cancelada").length} />
      </div>

      {vagas.length === 0 ? (
        <Card className="py-10 text-center">
          <p className="text-slate-400 text-sm">Nenhuma vaga cadastrada. Acesse <strong>Vagas</strong> para cadastrar.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {/* Vagas por nível */}
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500 mb-4">Vagas por Nível</p>
            <div className="flex flex-col gap-3">
              {nivelLabels.map(({ key, label, variant }) => (
                <div key={key} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <Badge variant={variant}>{label}</Badge>
                    <span className="text-sm font-semibold text-slate-800">{vagasPorNivel[key]}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-[400ms] ease-in-out"
                      style={{
                        width: `${(vagasPorNivel[key] / maxVagasNivel) * 100}%`,
                        backgroundColor: NIVEL_COLORS[key],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Vagas por status */}
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500 mb-4">Vagas por Status</p>
            <div className="flex flex-col gap-3">
              {Object.entries(vagasPorStatus).map(([status, count]) => (
                <div key={status} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">{status}</span>
                    <span className="text-sm font-semibold text-slate-800">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-[400ms] ease-in-out"
                      style={{
                        width: `${(count / maxVagasStatus) * 100}%`,
                        backgroundColor: STATUS_COLORS[status],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Gap analysis */}
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500 mb-1">Vagas vs Recursos</p>
            <p className="text-[11px] text-slate-400 mb-4">Demanda aberta x pessoas ativas por nível</p>
            <div className="flex flex-col gap-4">
              {nivelLabels.map(({ key, label, variant }) => {
                const demanda  = vagasPorNivel[key];
                const recursos = data.nivelCount[key];
                const gap      = demanda - recursos;
                return (
                  <div key={key} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <Badge variant={variant}>{label}</Badge>
                      <span className={`text-xs font-semibold ${gap > 0 ? "text-red-500" : "text-green-600"}`}>
                        {gap > 0 ? `−${gap} faltando` : gap < 0 ? `+${Math.abs(gap)} disponível` : "OK"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{demanda} vaga{demanda !== 1 ? "s" : ""}</span>
                      <span>/</span>
                      <span>{recursos} recurso{recursos !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
