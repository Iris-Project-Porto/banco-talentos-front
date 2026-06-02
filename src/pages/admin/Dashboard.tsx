import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useVagas } from "@/contexts/VagasContext";

interface DashData {
  total: number; ativos: number; pendentes: number; skillsCount: number;
  topSkillsByProficiency?: { name: string; score: number }[];
  topSkillsByImportance?: { name: string; score: number }[];
  nivelCount: { Jr: number; Pleno: number; Sr: number };
}

const ALOCACAO_COLORS: Record<string, string> = {
  "Disponível (Bench)": "#10B981",
  "Alocado Integral (100%)": "#3B82F6",
  "Alocado Parcial": "#F59E0B",
  "Em Transição (saindo de projeto)": "#F97316",
  "Férias / Licença": "#8B5CF6",
  "Desligado": "#EF4444",
};

export default function Dashboard() {
  const [data, setData] = useState<DashData | null>(null);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const { vagas } = useVagas();
  const [skillView, setSkillView] = useState<"proficiency" | "importance">("proficiency");

  useEffect(() => { api.getDashboard().then(setData).catch(() => { }); }, []);

  useEffect(() => {
    api.getAllProfiles()
      .then((d) => setAllProfiles(Array.isArray(d) ? d : []))
      .catch(() => { });
  }, []);

  if (!data) return <p className="text-slate-400 text-sm">Carregando...</p>;

  // Distribuição de alocação a partir de todos os perfis
  const alocacaoMap: Record<string, number> = {};
  allProfiles.forEach((p) => {
    const s = p.alocacaoStatus ?? "Sem status";
    alocacaoMap[s] = (alocacaoMap[s] ?? 0) + 1;
  });
  const alocacaoEntries = Object.entries(alocacaoMap).sort((a, b) => b[1] - a[1]);
  const maxAlocacao = alocacaoEntries.reduce((m, [, v]) => Math.max(m, v), 1);

  // Quantidade de recursos disponíveis (Bench)
  const disponiveisBench = alocacaoMap["Disponível (Bench)"] ?? 0;

  const nivelRows: { label: string; key: "Jr" | "Pleno" | "Sr"; variant: "senior" | "pleno" | "junior" }[] = [
    { label: "Sênior", key: "Sr", variant: "senior" },
    { label: "Pleno", key: "Pleno", variant: "pleno" },
    { label: "Júnior", key: "Jr", variant: "junior" },
  ];

  const skillsToRender = skillView === "proficiency" ? (data.topSkillsByProficiency || []) : (data.topSkillsByImportance || []);
  const maxSkill = skillsToRender.reduce((m, s) => Math.max(m, s.score), 1);

  const vagasPorNivel: Record<string, number> = { Jr: 0, Pleno: 0, Sr: 0 };
  vagas.forEach((v) => { if (v.senioridade in vagasPorNivel) vagasPorNivel[v.senioridade]++; });

  const vagasPorStatus: Record<string, number> = {
    "Aberta": 0, "Em andamento": 0, "Fechada": 0, "Cancelada": 0,
  };
  vagas.forEach((v) => { vagasPorStatus[v.status] = (vagasPorStatus[v.status] ?? 0) + 1; });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" subtitle="Visão geral do banco de talentos" />

      {/* Stat cards — pessoas */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard label="Recursos Disponíveis" value={disponiveisBench} accentColor="#10B981" to="/admin/talentos" />
        <StatCard label="Total de cadastros" value={data.total} to="/admin/usuarios" />
        <StatCard label="Perfis ativos" value={data.ativos} accentColor="#E11D48" to="/admin/alocados" />
        <StatCard label="Aguardando revisão" value={data.pendentes} accentColor={data.pendentes > 0 ? "#D97706" : undefined} to="/admin/fila" />
      </div>

      {/* ── Distribuição de Alocação (via getAllProfiles) ────── */}
      <div className="flex items-center gap-2 pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-400">Alocação</p>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {allProfiles.length === 0 ? (
        <Card className="py-8 text-center">
          <p className="text-slate-400 text-sm">Nenhum perfil cadastrado ainda.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {/* Distribuição por status */}
          <Card className="col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500 mb-4">
              Distribuição por Status de Alocação
            </p>
            <div className="flex flex-col gap-3">
              {alocacaoEntries.map(([status, count]) => (
                <div key={status} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 truncate max-w-[220px]">{status}</span>
                    <span className="text-sm font-semibold text-slate-800 shrink-0 ml-2">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-[500ms] ease-in-out"
                      style={{
                        width: `${(count / maxAlocacao) * 100}%`,
                        backgroundColor: ALOCACAO_COLORS[status] ?? "#94A3B8",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Resumo bench vs alocados */}
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500 mb-4">
              Situação Geral
            </p>
            <div className="flex flex-col gap-4">
              {[
                {
                  label: "Disponível (Bench)",
                  value: alocacaoMap["Disponível (Bench)"] ?? 0,
                  color: "#10B981",
                },
                {
                  label: "Em Projetos",
                  value:
                    (alocacaoMap["Alocado Integral (100%)"] ?? 0) +
                    (alocacaoMap["Alocado Parcial"] ?? 0) +
                    (alocacaoMap["Em Transição (saindo de projeto)"] ?? 0),
                  color: "#3B82F6",
                },
                {
                  label: "Ausentes",
                  value: alocacaoMap["Férias / Licença"] ?? 0,
                  color: "#8B5CF6",
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm text-slate-600">{label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{value}</span>
                </div>
              ))}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">Total de perfis</span>
                <span className="text-sm font-bold text-slate-800">{allProfiles.length}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── Skills + Por nível ────── */}
      <div className="flex items-center gap-2 pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-400">Skills mapeadas</p>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">Top Skills</p>
            <div className="flex bg-slate-100 p-0.5 rounded-lg">
              <button
                onClick={() => setSkillView("proficiency")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${skillView === "proficiency" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
              >
                Por Proficiência
              </button>
              <button
                onClick={() => setSkillView("importance")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${skillView === "importance" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
              >
                Por Importância
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {skillsToRender.length === 0 && <p className="text-sm text-slate-400">Nenhuma skill ainda.</p>}
            {skillsToRender.map(({ name, score }) => (
              <div key={name} className="flex items-center gap-3">
                <span className="w-32 truncate text-sm text-slate-700 font-mono">{name}</span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-[width] duration-[400ms] ease-in-out ${skillView === "proficiency" ? "bg-pink" : "bg-indigo-500"}`}
                    style={{ width: `${(score / maxSkill) * 100}%` }}
                  />
                </div>
                <span className="text-xs w-8 text-right text-slate-400">{Math.round(score)}</span>
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
    </div>
  );
}