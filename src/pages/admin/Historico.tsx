import { useEffect, useMemo, useState } from "react";
import { PageHeader, Pagination } from "@/components/ui";
import { AdminHistoryTable } from "@/features/historico/components/AdminHistoryTable/AdminHistoryTable";
import { useAuditList } from "@/features/historico/hooks/useHistorico";
import type { AuditSummary } from "@/features/historico/types/historico";

const tabs = ["Projetos", "Squads", "Recursos"] as const;
type HistoryTab = (typeof tabs)[number];
const PAGE_SIZE = 7;

function entityMatchesTab(record: AuditSummary, tab: HistoryTab) {
    const entityType = record.entityType.toUpperCase();

    if (tab === "Projetos") {
        return entityType.includes("PROJECT");
    }
    if (tab === "Squads") {
        return entityType.includes("SQUAD");
    }
    return (
        entityType.includes("PROFILE") ||
        entityType.includes("RESOURCE") ||
        entityType.includes("SKILL") ||
        entityType.includes("EQUIPMENT") ||
        entityType.includes("JOB_POSTING")
    );
}

export default function Historico() {
    const [activeTab, setActiveTab] = useState<HistoryTab>("Projetos");
    const [page, setPage] = useState(0);
    const { audits, isLoading, isError, refetch } = useAuditList();

    useEffect(() => {
        setPage(0);
    }, [activeTab]);

    const tabRecords = useMemo(
        () => audits.filter((record) => entityMatchesTab(record, activeTab)),
        [audits, activeTab],
    );
    const totalPages = Math.ceil(tabRecords.length / PAGE_SIZE);
    const currentPage = Math.min(page, Math.max(totalPages - 1, 0));
    const startIndex = currentPage * PAGE_SIZE;
    const visibleRecords = tabRecords.slice(startIndex, startIndex + PAGE_SIZE);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Histórico"
                subtitle="Histórico de eventos e alterações"
            />

            <div className="border-b border-slate-200">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-6 overflow-x-auto" role="tablist" aria-label="Categorias do histórico">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                                    activeTab === tab
                                        ? "border-slate-900 text-slate-900"
                                        : "border-transparent text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <span className="pb-3 text-xs font-medium text-slate-500">
                        Total de registros: {tabRecords.length}
                    </span>
                </div>
            </div>

            {isLoading ? (
                <p className="text-sm text-slate-400">Carregando histórico...</p>
            ) : isError ? (
                <div className="rounded-xl border border-red-100 bg-white py-16 text-center">
                    <p className="mb-3 text-sm text-red-600">Não foi possível carregar o histórico.</p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="text-sm font-medium text-slate-900 underline"
                        >
                            Tentar novamente
                        </button>
                </div>
            ) : tabRecords.length === 0 ? (
                <div className="rounded-xl border bg-white py-16 text-center">
                    <p className="text-sm text-slate-400">Não há histórico de eventos registrados para esta aba</p>
                </div>
            ) : (
                <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
                    <AdminHistoryTable records={visibleRecords} />

                    <Pagination
                        className="mt-0 border-t-0 px-4 py-4"
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </div>
    );
}
