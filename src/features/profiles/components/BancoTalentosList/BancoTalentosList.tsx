import { Card } from "@/components/ui";
import { PersonCard } from "../PersonCard/PersonCard";
import { useBancoTalentos } from "../../hooks/useBancoTalentos/useBancoTalentos";

export function BancoTalentosList() {
    const { search, setSearch, area, setArea, areas, filtered, loading } = useBancoTalentos();

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
                <span className="text-xs text-slate-400">{filtered.length} pessoa{filtered.length !== 1 ? "s" : ""}</span>
            </Card>

            {filtered.length === 0 ? (
                <Card className="py-12 text-center">
                    <p className="text-slate-400 text-sm">Nenhum talento encontrado.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((p) => (
                        <PersonCard
                            key={p.id} id={p.id} name={p.user?.name ?? "?"} email={p.user?.email} photoUrl={p.photoUrl} area={p.area} nivel={p.nivelOverride ?? p.nivel} alocacaoStatus={p.alocacaoStatus} skills={p.skills} createdAt={p.createdAt} registrationStatus={p.registrationStatus}
                        />
                    ))}
                </div>
            )}
        </>
    );
}