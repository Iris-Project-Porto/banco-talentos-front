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

    if (loadingSquad) {
        return <p className="text-sm text-slate-400">Carregando...</p>;
    }

    if (isEdit && (squadError || !squad)) {
        return <p className="text-sm text-red-500">Não foi possível carregar a squad.</p>;
    }

    return (
        <SquadFormComponent
            initial={squad ?? {}}
            saving={saveMutation.isPending}
            onSave={(payload) => saveMutation.mutate(payload)}
            onCancel={goBack}
        />
    );
}
