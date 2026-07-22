import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
    getProjectsCatalog,
    ProjectForm,
    projectsApi,
    type ProjectPayload,
} from "@/features/projects";
import { getApiError } from "@/lib/axios";

type SavePayload = ProjectPayload & {
    id?: string;
    active?: boolean;
    initialActive?: boolean;
};

export default function ProjetoForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: project, isLoading: loadingProject, isError: projectError } = useQuery({
        queryKey: ["projects", "detail", id],
        queryFn: () => projectsApi.getById(id!),
        enabled: isEdit,
    });

    const { data: catalog = [], isLoading: loadingCatalog } = useQuery({
        queryKey: ["projects", "catalog"],
        queryFn: getProjectsCatalog,
    });

    const existingProjects = useMemo(
        () => catalog.map((item) => ({ id: item.id, name: item.name })),
        [catalog],
    );

    const saveMutation = useMutation({
        mutationFn: async (payload: SavePayload) => {
            const { id: projectId, active, initialActive, ...body } = payload;

            if (projectId) {
                await projectsApi.update(projectId, body);

                if (active !== undefined && initialActive !== undefined && active !== initialActive) {
                    await (active
                        ? projectsApi.activate(projectId)
                        : projectsApi.inactivate(projectId));
                }
                return;
            }

            await projectsApi.create(body);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast.success("Projeto salvo com sucesso!");
            navigate("/admin/projetos");
        },
        onError: (error) => {
            const message = getApiError(
                error,
                "Ocorreu um erro ao salvar o projeto. Por favor, tente novamente.",
            );

            if (message.toLowerCase().includes("duplicate") || message.toLowerCase().includes("unique")) {
                toast.error("Já existe um projeto cadastrado com este nome.");
                return;
            }

            toast.error(message);
        },
    });

    function goBack() {
        navigate("/admin/projetos");
    }

    if (loadingProject || loadingCatalog) {
        return <p className="text-sm text-slate-400">Carregando...</p>;
    }

    if (isEdit && (projectError || !project)) {
        return <p className="text-sm text-red-500">Não foi possível carregar o projeto.</p>;
    }

    return (
        <ProjectForm
            initial={project ?? {}}
            existingProjects={existingProjects}
            saving={saveMutation.isPending}
            onSave={(payload) => saveMutation.mutate(payload)}
            onCancel={goBack}
        />
    );
}
