import { useState, useEffect } from "react";
import { Search, Pencil } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PageHeader, Button, Badge, Input, Pagination, StatCard } from "@/components/ui";
import { Table } from "@/components/ui/Table/Table";
import { squadsApi, type Squad } from "@/features/squads";

export default function Squads() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [statusType, setStatusType] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
    const [page, setPage] = useState(0);
    const viewActive = statusType === "ACTIVE";

    useEffect(() => {
        setPage(0);
    }, [search, statusType]);

    function openNew() {
        navigate("/admin/squads/novo");
    }

    function openEdit(squad: Squad) {
        navigate(`/admin/squads/${squad.id}`);
    }

    const { data: counts } = useQuery({
        queryKey: ["squads", "counts"],
        queryFn: async () => {
            const [active, inactive] = await Promise.all([
                squadsApi.getActive({ page: 0, size: 1 }),
                squadsApi.getInactive({ page: 0, size: 1 }),
            ]);
            const activeCount = active.totalElements ?? 0;
            const inactiveCount = inactive.totalElements ?? 0;
            return {
                active: activeCount,
                inactive: inactiveCount,
                total: activeCount + inactiveCount,
            };
        },
    });

    const { data, isLoading } = useQuery({
        queryKey: ["squads", statusType, page, search],
        queryFn: () =>
            statusType === "ACTIVE"
                ? squadsApi.getActive({ page, size: 10, search })
                : squadsApi.getInactive({ page, size: 10, search }),
    });

    const squads: Squad[] = data?.content || [];
    const totalPages = data?.totalPages || 1;

    function handleClearFilters() {
        setSearch("");
        setStatusType("ACTIVE");
        setPage(0);
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Squads"
                subtitle="Gerencie as squads da sua empresa"
                actions={
                    <Button variant="primary" onClick={openNew}>
                        + Nova Squad
                    </Button>
                }
            />

            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card">
                <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                    <button
                        type="button"
                        onClick={() => setStatusType("ACTIVE")}
                        className={`rounded-md px-4 py-1.5 text-xs font-semibold ${
                            viewActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                        }`}
                    >
                        Ativas
                    </button>
                    <button
                        type="button"
                        onClick={() => setStatusType("INACTIVE")}
                        className={`rounded-md px-4 py-1.5 text-xs font-semibold ${
                            !viewActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                        }`}
                    >
                        Inativas / Histórico
                    </button>
                </div>

                <div className="relative min-w-[280px] flex-1">
                    <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Buscar por nome da squad..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-3"
                    />
                </div>

                <Button type="button" variant="secondary" size="md" onClick={handleClearFilters}>
                    Limpar Filtros
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total de squads" value={counts?.total ?? 0} labelColor="#2563EB" />
                <StatCard label="Ativas" value={counts?.active ?? 0} labelColor="#16A34A" />
                <StatCard label="Inativas" value={counts?.inactive ?? 0} labelColor="#DC2626" />
            </div>

            {isLoading ? (
                <p className="text-sm text-slate-400">Carregando...</p>
            ) : squads.length === 0 ? (
                <div className="rounded-xl border bg-white py-16 text-center">
                    <p className="text-sm text-slate-400">Nenhuma squad encontrada.</p>
                </div>
            ) : (
                <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
                    <Table
                        columns={[
                            {
                                header: "Squad",
                                render: (squad) => (
                                    <p className="max-w-xs truncate font-bold text-slate-900" title={squad.name}>
                                        {squad.name}
                                    </p>
                                ),
                            },
                            {
                                header: "Liderança",
                                render: (squad) => (
                                    <div className="flex min-w-0 max-w-xs flex-col gap-0.5">
                                        <span
                                            className="truncate text-xs font-medium text-slate-800"
                                            title={`GP: ${squad.projectManager}`}
                                        >
                                            GP: {squad.projectManager}
                                        </span>
                                        <span
                                            className="truncate text-xs text-slate-500"
                                            title={`Coord: ${squad.portoCoordinator}`}
                                        >
                                            Coord: {squad.portoCoordinator}
                                        </span>
                                    </div>
                                ),
                            },
                            {
                                header: "Projeto",
                                render: (squad) => (
                                    <span
                                        className="max-w-xs truncate font-medium text-slate-600"
                                        title={squad.projectName || "N/A"}
                                    >
                                        {squad.projectName || "N/A"}
                                    </span>
                                ),
                            },
                            {
                                header: "Status",
                                className: "text-center",
                                render: (squad) => (
                                    <Badge variant={squad.active ? "success" : "danger"}>
                                        {squad.active ? "Ativa" : "Inativa"}
                                    </Badge>
                                ),
                            },
                            {
                                header: "Ações",
                                className: "text-right",
                                render: (squad) => (
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(squad)}
                                            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                            title="Visualizar/Editar"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        data={squads}
                        keyExtractor={(squad) => squad.id}
                        emptyMessage="Nenhuma squad encontrada."
                    />

                    <Pagination
                        className="mt-0 border-t-0 px-4 py-4"
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </div>
    );
}
