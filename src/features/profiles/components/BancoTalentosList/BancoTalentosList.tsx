import { useMemo } from "react";
import { Search, X } from "lucide-react";
import { Button, Card, Input, Pagination, Select } from "@/components/ui";
import { PersonCard } from "../PersonCard/PersonCard";
import { useBancoTalentos } from "../../hooks/useBancoTalentos/useBancoTalentos";

const filterLabelCls = "block text-[11px] font-semibold tracking-wide text-slate-500 mb-1.5";

export function BancoTalentosList() {
    const {
        search, setSearch, area, setArea, areas, filtered, loading,
        page, setPage, totalPages, totalElements,
        skillParam, clearSkillFilter,
    } = useBancoTalentos();

    const areaOptions = useMemo(
        () => [
            { value: "", label: "Todas" },
            ...areas
                .filter((a): a is string => Boolean(a))
                .map((a) => ({ value: a, label: a })),
        ],
        [areas],
    );

    function handleClearFilters() {
        setSearch("");
        setArea("");
        clearSkillFilter();
    }

    if (loading) return <p className="text-slate-400 text-sm">Carregando...</p>;

    return (
        <>
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
                        <label className={`${filterLabelCls} invisible`} aria-hidden="true">&nbsp;</label>
                        <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            fullWidth
                            onClick={handleClearFilters}
                        >
                            Limpar Filtros
                        </Button>
                    </div>
                </div>
            </div>

            {skillParam && (
                <div className="flex items-center gap-2 bg-pink/10 text-pink border border-pink/20 px-3 py-1.5 rounded-md w-fit">
                    <span className="text-sm font-semibold">Skill: {skillParam}</span>
                    <button onClick={clearSkillFilter} className="hover:text-pink-dark transition-colors" title="Remover filtro" type="button">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <p className="text-sm text-slate-500">
                {totalElements} pessoa{totalElements !== 1 ? "s" : ""} no total
            </p>

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
