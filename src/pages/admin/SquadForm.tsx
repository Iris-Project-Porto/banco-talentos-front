import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { squadsApi, SquadForm as SquadFormComponent, type SquadPayload } from "@/features/squads";
import { getApiError } from "@/lib/axios";

type SavePayload = SquadPayload & {
    id?: string;
    active?: boolean;
    initialActive?: boolean;
};

const CATALOG_PAGE_SIZE = 500;

export default function SquadForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: squad, isLoading: loadingSquad, isError: squadError } = useQuery({
        queryKey: ["squads", "detail", id],
        queryFn: () => squadsApi.getById(id!),
        enabled: isEdit,
    });

    const { data: existingSquads = [], isLoading: loadingCatalog } = useQuery({
        queryKey: ["squads", "catalog"],
        queryFn: async () => {
            const [active, inactive] = await Promise.all([
                squadsApi.getActive({ page: 0, size: CATALOG_PAGE_SIZE }),
                squadsApi.getInactive({ page: 0, size: CATALOG_PAGE_SIZE }),
            ]);
            return [...(active.content ?? []), ...(inactive.content ?? [])].map((item) => ({
                id: item.id,
                name: item.name,
            }));
        },
    });

    const saveMutation = useMutation({
        mutationFn: async (payload: SavePayload) => {
            const { id: squadId, active, initialActive, ...body } = payload;

            if (squadId) {
                await squadsApi.update(squadId, body);

                if (active !== undefined && initialActive !== undefined && active !== initialActive) {
                    await (active
                        ? squadsApi.activate(squadId)
                        : squadsApi.inactivate(squadId));
                }
                return;
            }

            await squadsApi.create(body);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["squads"] });
            toast.success("Squad salva com sucesso!");
            navigate("/admin/squads");
        },
        onError: (error) => {
            const message = getApiError(
                error,
                "Ocorreu um erro ao salvar a squad. Por favor, tente novamente.",
            );

            if (message.toLowerCase().includes("duplicate") || message.toLowerCase().includes("unique")) {
                toast.error("Já existe uma squad cadastrada com este nome.");
                return;
            }

            toast.error(message);
        },
    });

    function goBack() {
        navigate("/admin/squads");
    }

    if (loadingSquad || loadingCatalog) {
        return <p className="text-sm text-slate-400">Carregando...</p>;
    }

    if (isEdit && (squadError || !squad)) {
        return <p className="text-sm text-red-500">Não foi possível carregar a squad.</p>;
    }

    return (
        <SquadFormComponent
            initial={squad ?? {}}
            existingSquads={existingSquads}
            saving={saveMutation.isPending}
            onSave={(payload) => saveMutation.mutate(payload)}
            onCancel={goBack}
        />
    );
}
