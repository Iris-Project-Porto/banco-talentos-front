import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
    ProjectDetailModal,
    ProjectsTable,
    ProjectsFilters,
    filterProjects,
    paginateLocally,
    listProjectsSafe,
    getProjectsCounts,
    getProjectsCatalog,
    PROJECTS_PAGE_SIZE,
    type Project,
} from "@/features/projects";
import { Button, PageHeader, Pagination, StatCard } from "@/components/ui";

export default function Projetos() {
    const navigate = useNavigate();
    const [detailProject, setDetailProject] = useState<Project | null>(null);
    const [search, setSearch] = useState("");
    const [statusType, setStatusType] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
    const [page, setPage] = useState(0);

    const trimmedSearch = search.trim();
    const hasSearch = trimmedSearch.length > 0;

    useEffect(() => {
        setPage(0);
    }, [search, statusType]);

    const { data: counts } = useQuery({
        queryKey: ["projects", "counts"],
        queryFn: getProjectsCounts,
    });

    const { data: listData, isLoading: loadingList } = useQuery({
        queryKey: ["projects", "list", statusType, page],
        queryFn: () => listProjectsSafe(statusType, { page, size: PROJECTS_PAGE_SIZE }),
        enabled: !hasSearch,
    });

    const { data: catalog = [], isLoading: loadingCatalog } = useQuery({
        queryKey: ["projects", "catalog"],
        queryFn: getProjectsCatalog,
        enabled: hasSearch,
    });

    const listResult = useMemo(() => {
        if (hasSearch) {
            const filtered = filterProjects(catalog, { statusType, search: trimmedSearch });
            return paginateLocally(filtered, page, PROJECTS_PAGE_SIZE);
        }

        return {
            content: listData?.content ?? [],
            totalPages: listData?.totalPages ?? 1,
            totalElements: listData?.totalElements ?? 0,
        };
    }, [hasSearch, catalog, statusType, trimmedSearch, page, listData]);

    const projects = listResult.content;
    const totalPages = listResult.totalPages;
    const isLoading = hasSearch ? loadingCatalog : loadingList;

    function openNew() {
        navigate("/admin/projetos/novo");
    }

    function openEdit(project: Project) {
        setDetailProject(null);
        navigate(`/admin/projetos/${project.id}/editar`);
    }

    function openView(project: Project) {
        setDetailProject(project);
    }

    function handleClearFilters() {
        setSearch("");
        setStatusType("ACTIVE");
        setPage(0);
    }

    function handleEditFromDetail() {
        if (detailProject) {
            openEdit(detailProject);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Projetos"
                subtitle="Gerencie os projetos da empresa"
                actions={
                    <Button variant="primary" size="md" onClick={openNew}>
                        + Novo Projeto
                    </Button>
                }
            />

            <ProjectsFilters
                search={search}
                statusType={statusType}
                onSearchChange={setSearch}
                onStatusChange={setStatusType}
                onClear={handleClearFilters}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Total de projetos" value={counts?.total ?? 0} labelColor="#2563EB" />
                <StatCard label="Ativos" value={counts?.active ?? 0} labelColor="#D97706" />
                <StatCard label="Inativos" value={counts?.inactive ?? 0} labelColor="#DC2626" />
            </div>

            {isLoading ? (
                <p className="text-sm text-slate-400">Carregando...</p>
            ) : projects.length === 0 ? (
                <div className="bg-white border rounded-xl py-16 text-center">
                    <p className="text-slate-400 text-sm">Nenhum projeto encontrado.</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-xl shadow-card overflow-hidden flex flex-col">
                    <ProjectsTable
                        data={projects}
                        onView={openView}
                        onEdit={openEdit}
                    />

                    <Pagination
                        className="mt-0 py-4 px-4 border-t-0"
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}

            {detailProject && (
                <ProjectDetailModal
                    project={detailProject}
                    onClose={() => setDetailProject(null)}
                    onEdit={handleEditFromDetail}
                />
            )}
        </div>
    );
}
