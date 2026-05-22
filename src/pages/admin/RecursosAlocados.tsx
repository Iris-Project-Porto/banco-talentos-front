import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { PersonCard } from "@/components/ui/PersonCard";
import { Card } from "@/components/ui/Card";

const STATUS_ALOCADO = new Set([
  "Alocado Integral (100%)",
  "Alocado Parcial",
  "Em Transição (saindo de projeto)",
]);

export default function RecursosAlocados() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAtivos()
      .then((data) => {
        const all = Array.isArray(data) ? data : [];
        setProfiles(all.filter((p) => STATUS_ALOCADO.has(p.alocacaoStatus)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const areas = useMemo(() => Array.from(new Set(profiles.map((p) => p.area).filter(Boolean))), [profiles]);

  const filtered = useMemo(() => profiles.filter((p) => {
    const q = search.toLowerCase();
    return (
      (!q || p.user?.name?.toLowerCase().includes(q) || p.area?.toLowerCase().includes(q) ||
        p.cargo?.toLowerCase().includes(q) || p.skills?.some((s: any) => s.skill?.name?.toLowerCase().includes(q))) &&
      (!area || p.area === area) &&
      (!statusFilter || p.alocacaoStatus === statusFilter)
    );
  }), [profiles, search, area, statusFilter]);

  const counts = useMemo(() => ({
    integral:  profiles.filter((p) => p.alocacaoStatus === "Alocado Integral (100%)").length,
    parcial:   profiles.filter((p) => p.alocacaoStatus === "Alocado Parcial").length,
    transicao: profiles.filter((p) => p.alocacaoStatus === "Em Transição (saindo de projeto)").length,
  }), [profiles]);

  if (loading) return <p className="text-slate-400 text-sm">Carregando...</p>;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Recursos Alocados" subtitle="Colaboradores atualmente em projetos" />

      {/* Alloc stats */}
      <div className="grid grid-cols-3 gap-4">
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

      {/* Filtros */}
      <Card padding="sm" className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Business Unit:</span>
          <select
            value={area} onChange={(e) => setArea(e.target.value)}
            className="text-sm border border-slate-300 rounded-md px-3 py-1.5 outline-none focus:border-pink focus:shadow-focus-pink bg-white text-slate-900"
          >
            <option value="">All</option>
            {areas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Status:</span>
          <select
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-slate-300 rounded-md px-3 py-1.5 outline-none focus:border-pink focus:shadow-focus-pink bg-white text-slate-900"
          >
            <option value="">Todos</option>
            <option value="Alocado Integral (100%)">Integral</option>
            <option value="Alocado Parcial">Parcial</option>
            <option value="Em Transição (saindo de projeto)">Em Transição</option>
          </select>
        </div>
        <div className="flex-1">
          <input
            placeholder="Search..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-md px-3 py-1.5 outline-none focus:border-pink focus:shadow-focus-pink bg-white text-slate-900"
          />
        </div>
        <span className="text-xs text-slate-400">{filtered.length} pessoa{filtered.length !== 1 ? "s" : ""}</span>
      </Card>

      {filtered.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-slate-400 text-sm">Nenhum recurso alocado encontrado.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((p) => (
            <PersonCard
              key={p.id}
              id={p.id}
              name={p.user?.name ?? "?"}
              email={p.user?.email}
              cargo={p.cargo}
              photoUrl={p.photoUrl}
              area={p.area}
              nivel={p.nivelOverride ?? p.nivel}
              alocacaoStatus={p.alocacaoStatus}
              skills={p.skills}
              createdAt={p.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
