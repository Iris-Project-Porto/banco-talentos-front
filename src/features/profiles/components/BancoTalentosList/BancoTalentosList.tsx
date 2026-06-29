import { Card, Pagination } from "@/components/ui";
import { PersonCard } from "../PersonCard/PersonCard";
import { useBancoTalentos } from "../../hooks/useBancoTalentos/useBancoTalentos";
import { X } from "lucide-react";

export function BancoTalentosList() {
    const {
        search, setSearch, area, setArea, areas, filtered, loading,
        page, setPage, totalPages, totalElements,
        skillParam, clearSkillFilter
    } = useBancoTalentos();

    if (loading) return <p className="text-slate-400 text-sm">Carregando...</p>;

    return (
        <>
            <Card padding="sm" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Business Unit:</span>
                    <select value={area} onChange={(e) => setArea(e.target.value)} className="text-sm border border-slate-300 rounded-md px-3 py-1.5 outline-none focus:border-pink focus:shadow-focus-pink bg-white text-slate-900">
                        <option value="">All</option>
                        {areas.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <input placeholder="Buscar por nome, área ou skill..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full text-sm border border-slate-300 rounded-md px-3 py-1.5 outline-none focus:border-pink focus:shadow-focus-pink bg-white text-slate-900" />
                </div>

                {skillParam && (
                    <div className="flex items-center gap-2 bg-pink/10 text-pink border border-pink/20 px-3 py-1.5 rounded-md">
                        <span className="text-sm font-semibold">Skill: {skillParam}</span>
                        <button onClick={clearSkillFilter} className="hover:text-pink-dark transition-colors" title="Remover filtro">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <span className="text-xs text-slate-400 shrink-0">{totalElements} pessoa{totalElements !== 1 ? "s" : ""} no total</span>
            </Card>

            {filtered.length === 0 ? (
                <Card className="py-12 text-center">
                    <p className="text-slate-400 text-sm">Nenhum talento encontrado.</p>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((p) => (
                            <PersonCard
                                key={p.id}
                                id={p.id}
                                name={p.name ?? "?"}
                                email={p.email}
                                photoUrl={p.photoUrl}
                                area={p.area}
                                nivel={p.levelOverride ?? p.level ?? p.nivel}
                                allocationStatus={p.allocationStatus}
                                skills={p.skills}
                                createdAt={p.createdAt}
                                registrationStatus={p.registrationStatus}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}
        </>
    );
}