import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Card, Input, Select } from "@/components/ui";
import { PersonCard, profilesApi, type UserProfile } from "@/features/profiles";

const filterLabelCls = "block text-[11px] font-semibold tracking-wide text-slate-500 mb-1.5";

const STATUS_ALOCADO = new Set([
  "Alocado Integral (100%)",
  "Alocado Parcial",
  "Em Transição (saindo de projeto)",
]);

export default function RecursosAlocados() {
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: profiles = [] as UserProfile[], isLoading: loading } = useQuery({
    queryKey: ['profiles-ativos-alocados'],
    queryFn: async (): Promise<UserProfile[]> => {
      const data = await profilesApi.getAtivos();
      let all = [];
      if (Array.isArray(data)) {
        all = data;
      } else {
        all = (data as any)?.content || (data as any)?.data || [];
      }
      return all.filter((p: UserProfile) => p.allocationStatus != null && STATUS_ALOCADO.has(p.allocationStatus));
    }
  });

  const areas = useMemo(
    () => Array.from(new Set(profiles.map((p) => p.area).filter((a): a is string => Boolean(a)))),
    [profiles],
  );

  const areaOptions = useMemo(
    () => [
      { value: "", label: "Todas" },
      ...areas.map((a) => ({ value: a, label: a })),
    ],
    [areas],
  );

  const statusOptions = [
    { value: "", label: "Todos" },
    { value: "Alocado Integral (100%)", label: "Integral" },
    { value: "Alocado Parcial", label: "Parcial" },
    { value: "Em Transição (saindo de projeto)", label: "Em Transição" },
  ];

  const filtered = useMemo(() => profiles.filter((p) => {
    const q = search.toLowerCase();
    return (
      (!q || p.name?.toLowerCase().includes(q) || p.area?.toLowerCase().includes(q) ||
        p.skills?.some((s: any) => (s.skill?.name || s.name)?.toLowerCase().includes(q))) &&
      (!area || p.area === area) &&
      (!statusFilter || p.allocationStatus === statusFilter)
    );
  }), [profiles, search, area, statusFilter]);

  const counts = useMemo(() => ({
    integral: profiles.filter((p) => p.allocationStatus === "Alocado Integral (100%)").length,
    parcial: profiles.filter((p) => p.allocationStatus === "Alocado Parcial").length,
    transicao: profiles.filter((p) => p.allocationStatus === "Em Transição (saindo de projeto)").length,
  }), [profiles]);

  if (loading) return <p className="text-slate-400 text-sm">Carregando...</p>;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Recursos Alocados" subtitle="Colaboradores atualmente em projetos" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl shadow-card px-6 py-5">
          <span className="text-xs font-semibold text-[#2563EB]">Alocado Integral</span>
          <p className="text-3xl font-bold text-slate-900 mt-1">{counts.integral}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-card px-6 py-5">
          <span className="text-xs font-semibold text-[#D97706]">Alocado Parcial</span>
          <p className="text-3xl font-bold text-slate-900 mt-1">{counts.parcial}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-card px-6 py-5">
          <span className="text-xs font-semibold text-[#DC2626]">Em Transição</span>
          <p className="text-3xl font-bold text-slate-900 mt-1">{counts.transicao}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-card px-5 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="min-w-0 lg:col-span-4">
            <label className={filterLabelCls}>BUSCA</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
              <Input
                placeholder="Buscar por nome, área ou skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3"
              />
            </div>
          </div>

          <div className="min-w-0 lg:col-span-4">
            <label className={filterLabelCls}>BUSINESS UNIT</label>
            <Select
              options={areaOptions}
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>

          <div className="min-w-0 lg:col-span-4">
            <label className={filterLabelCls}>STATUS</label>
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        {filtered.length} pessoa{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-slate-400 text-sm">Nenhum recurso alocado encontrado.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <PersonCard
              key={p.id}
              id={p.id}
              name={p.name ?? "?"}
              email={p.email}
              photoUrl={p.photoUrl}
              area={p.area}
              nivel={p.levelOverride ?? p.nivel}
              allocationStatus={p.allocationStatus}
              skills={p.skills}
              createdAt={p.createdAt}
              registrationStatus={p.registrationStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}