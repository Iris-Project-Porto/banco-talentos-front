import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    projectsApi,
    ProjectFormModal,
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
    type ProjectPayload,
} from "@/features/projects";
import { Button, PageHeader, Pagination, StatCard } from "@/components/ui";
import { getApiError } from "@/lib/axios";

export default function Projetos() {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [detailProject, setDetailProject] = useState<Project | null>(null);
    const [editing, setEditing] = useState<(Partial<ProjectPayload> & { id?: string; active?: boolean }) | null>(null);
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
        enabled: modalOpen || hasSearch,
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

    const existingProjects = useMemo(
        () => catalog.map((project) => ({ id: project.id, name: project.name })),
        [catalog],
    );

    const projects = listResult.content;
    const totalPages = listResult.totalPages;
    const isLoading = hasSearch ? loadingCatalog : loadingList;

    const saveMutation = useMutation({
        mutationFn: async (payload: ProjectPayload & { id?: string; active?: boolean; initialActive?: boolean }) => {
            const { id, active, initialActive, ...body } = payload;

            if (id) {
                await projectsApi.update(id, body);

                if (active !== undefined && initialActive !== undefined && active !== initialActive) {
                    await (active ? projectsApi.activate(id) : projectsApi.inactivate(id));
                }
                return;
            }

            return projectsApi.create(body);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["projects"] });
            closeModal();
            toast.success("Projeto salvo com sucesso!");
        },
        onError: (error) => {
            const message = getApiError(error, "Ocorreu um erro ao salvar o projeto. Por favor, tente novamente.");

            if (message.toLowerCase().includes("duplicate") || message.toLowerCase().includes("unique")) {
                toast.error("Já existe um projeto cadastrado com este nome.");
                return;
            }

            toast.error(message);
        },
    });

    function openNew() {
        setEditing({});
        setModalOpen(true);
    }

    function openEdit(project: Project) {
        setDetailProject(null);
        setEditing({
            id: project.id,
            name: project.name,
            description: project.description,
            active: project.active,
        });
        setModalOpen(true);
    }

    function openView(project: Project) {
        setDetailProject(project);
    }

    function closeModal() {
        setModalOpen(false);
        setEditing(null);
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

            {modalOpen && editing && (
                <ProjectFormModal
                    initial={editing}
                    existingProjects={existingProjects}
                    saving={saveMutation.isPending}
                    onSave={(payload) => saveMutation.mutate(payload)}
                    onClose={closeModal}
                />
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
