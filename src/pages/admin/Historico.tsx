import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { X } from "lucide-react";
import { Button, Input, PageHeader, Pagination } from "@/components/ui";
import { AdminHistoryTable } from "@/features/historico/components/AdminHistoryTable/AdminHistoryTable";
import { AuditDetailPanel } from "@/features/historico/components/AuditDetailPanel/AuditDetailPanel";
import { useAuditList } from "@/features/historico/hooks/useHistorico";
import type { AuditSummary } from "@/features/historico/types/historico";
import {
    auditCategories,
    filterAudits,
    getAuditCategory,
    type AuditCategory,
} from "@/features/historico/utils/adminHistory";

const PAGE_SIZE = 7;

function getListErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            return "Você não tem autorização para consultar o histórico de auditoria.";
        }
    }
    return "Não foi possível carregar o histórico.";
}

export default function Historico() {
    const [activeTab, setActiveTab] = useState<AuditCategory>("Projetos");
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [selectedRecord, setSelectedRecord] = useState<AuditSummary | null>(null);
    const { audits, isLoading, isError, error, refetch } = useAuditList();

    useEffect(() => {
        setPage(0);
        setSelectedRecord(null);
    }, [activeTab, search]);

    const tabRecords = useMemo(
        () =>
            filterAudits(
                audits.filter((record) => getAuditCategory(record) === activeTab),
                search,
            ),
        [audits, activeTab, search],
    );
    const totalPages = Math.ceil(tabRecords.length / PAGE_SIZE);
    const currentPage = Math.min(page, Math.max(totalPages - 1, 0));
    const visibleRecords = tabRecords.slice(
        currentPage * PAGE_SIZE,
        currentPage * PAGE_SIZE + PAGE_SIZE,
    );

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Histórico"
                subtitle="Histórico de eventos e alterações"
            />

            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-card sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                    <Input
                        label="Buscar no histórico"
                        placeholder="Usuário, entidade, descrição ou operação..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        aria-label="Buscar por usuário, entidade, descrição ou operação"
                    />
                </div>
                {search && (
                    <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={() => setSearch("")}
                        aria-label="Limpar busca"
                    >
                        <X className="mr-1 h-4 w-4" aria-hidden="true" />
                        Limpar busca
                    </Button>
                )}
            </div>

            <div className="border-b border-slate-200">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-6 overflow-x-auto" role="tablist" aria-label="Categorias do histórico">
                        {auditCategories.map((tab) => (
                            <button
                                key={tab}
                                id={`audit-tab-${tab}`}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab}
                                aria-controls="audit-tabpanel"
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

            <div id="audit-tabpanel" role="tabpanel" aria-labelledby={`audit-tab-${activeTab}`}>
                {isLoading ? (
                    <p role="status" className="text-sm text-slate-400">Carregando histórico...</p>
                ) : isError ? (
                    <div className="rounded-xl border border-red-100 bg-white py-16 text-center">
                        <p role="alert" className="mb-3 text-sm text-red-600">
                            {getListErrorMessage(error)}
                        </p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="text-sm font-medium text-slate-900 underline"
                        >
                            Tentar novamente
                        </button>
                    </div>
                ) : tabRecords.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
                        <p className="text-sm text-slate-400">
                            {search.trim()
                                ? "Nenhum registro corresponde à busca nesta categoria."
                                : "Não há histórico de eventos registrados para esta categoria."}
                        </p>
                    </div>
                ) : (
                    <div className={selectedRecord
                        ? "grid items-start gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(24rem,0.85fr)]"
                        : ""}>
                        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
                            <AdminHistoryTable
                                records={visibleRecords}
                                onView={setSelectedRecord}
                            />

                            <Pagination
                                className="mt-0 border-t-0 px-4 py-4"
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                        {selectedRecord && (
                            <AuditDetailPanel
                                record={selectedRecord}
                                onClose={() => setSelectedRecord(null)}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
