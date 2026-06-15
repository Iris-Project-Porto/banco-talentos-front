import { PageHeader, StatCard, Card, Badge } from "@/components/ui";
import { useDashboardStats, ALOCACAO_COLORS } from "@/features/profiles";
import { vagasApi } from "@/features/vagas";
import { useQuery } from "@tanstack/react-query";

const NIVEL_ROWS = [
  { label: "Sênior", key: "Sr", variant: "senior" },
  { label: "Pleno", key: "Pleno", variant: "pleno" },
  { label: "Júnior", key: "Jr", variant: "junior" },
] as const;

export default function Dashboard() {
  const { loading: loadingProfiles, skillView, setSkillView, stats, allProfilesLength } = useDashboardStats();

  const { data: vagasAtivas, isLoading: loadingVagas } = useQuery({
    queryKey: ['dashboard-vagas-ativas'],
    queryFn: vagasApi.getActive
  });

  const loading = loadingProfiles || loadingVagas;

  if (loading || !stats) return <p className="text-slate-400 text-sm">Carregando...</p>;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" subtitle="Visão geral do banco de talentos" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Recursos Disponíveis" value={stats.disponiveisBench} accentColor="#10B981" to="/admin/talentos" />
        <StatCard label="Total de cadastros" value={stats.dashData.total} to="/admin/usuarios" />
        <StatCard label="Perfis ativos" value={stats.dashData.active} accentColor="#E11D48" to="/admin/alocados" />
        <StatCard label="Aguardando revisão" value={stats.dashData.pending} accentColor={stats.dashData.pending > 0 ? "#D97706" : undefined} to="/admin/fila" />
        <StatCard label="Vagas Ativas" value={vagasAtivas?.length ?? 0} accentColor="#8B5CF6" to="/admin/vagas" />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-400">Alocação</p>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {allProfilesLength === 0 ? (
        <Card className="py-8 text-center"><p className="text-slate-400 text-sm">Nenhum perfil cadastrado ainda.</p></Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="col-span-1 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500 mb-4">Distribuição por Status de Alocação</p>
            <div className="flex flex-col gap-3">
              {stats.alocacaoEntries.map(([status, count]) => (
                <div key={status} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 truncate max-w-[220px]">{status}</span>
                    <span className="text-sm font-semibold text-slate-800 shrink-0 ml-2">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full transition-[width] duration-[500ms]" style={{ width: `${(count / stats.maxAlocacao) * 100}%`, backgroundColor: ALOCACAO_COLORS[status] ?? "#94A3B8" }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500 mb-4">Situação Geral</p>
            <div className="flex flex-col gap-4">
              {[
                { label: "Disponível (Bench)", value: stats.alocacaoMap["Disponível (Bench)"] ?? 0, color: "#10B981" },
                { label: "Em Projetos", value: (stats.alocacaoMap["Alocado Integral (100%)"] ?? 0) + (stats.alocacaoMap["Alocado Parcial"] ?? 0) + (stats.alocacaoMap["Em Transição (saindo de projeto)"] ?? 0), color: "#3B82F6" },
                { label: "Ausentes", value: stats.alocacaoMap["Férias / Licença"] ?? 0, color: "#8B5CF6" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-sm text-slate-600">{label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{value}</span>
                </div>
              ))}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">Total de perfis</span>
                <span className="text-sm font-bold text-slate-800">{allProfilesLength}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="flex items-center gap-2 pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-400">Skills mapeadas</p>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">Top Skills</p>
            <div className="flex bg-slate-100 p-0.5 rounded-lg">
              <button onClick={() => setSkillView("proficiency")} className={`px-3 py-1 rounded-md text-xs font-medium ${skillView === "proficiency" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>Por Proficiência</button>
              <button onClick={() => setSkillView("importance")} className={`px-3 py-1 rounded-md text-xs font-medium ${skillView === "importance" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>Por Importância</button>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {stats.skillsToRender.length === 0 && <p className="text-sm text-slate-400">Nenhuma skill ainda.</p>}
            {stats.skillsToRender.map(({ name, score }) => (
              <div key={name} className="flex items-center gap-3">
                <span className="w-32 truncate text-sm text-slate-700 font-mono">{name}</span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${skillView === "proficiency" ? "bg-pink" : "bg-indigo-500"}`} style={{ width: `${(score / stats.maxSkill) * 100}%` }} />
                </div>
                <span className="text-xs w-8 text-right text-slate-400">{Math.round(score)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500 mb-4">Por Nível</p>
          <div className="flex flex-col gap-3">
            {NIVEL_ROWS.map(({ label, key, variant }) => (
              <div key={key} className="flex items-center justify-between">
                <Badge variant={variant}>{label}</Badge>
                <span className="text-sm font-semibold text-slate-800">{stats.nivelCalculado[key]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}