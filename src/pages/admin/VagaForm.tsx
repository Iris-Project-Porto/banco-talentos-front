import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { vagasApi, VagaWizard, type JobPostingPayload } from "@/features/vagas";
import { getApiError } from "@/lib/axios";

type SavePayload = JobPostingPayload & { id?: string };

export default function VagaForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: vaga, isLoading: loadingVaga, isError: vagaError } = useQuery({
        queryKey: ["vagas", "detail", id],
        queryFn: () => vagasApi.getById(id!),
        enabled: isEdit,
    });

    const saveMutation = useMutation({
        mutationFn: async ({ id: vagaId, ...body }: SavePayload) =>
            vagaId ? vagasApi.update(vagaId, body) : vagasApi.create(body),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["vagas"] });
            toast.success("Vaga salva com sucesso!");
            navigate("/admin/vagas");
        },
        onError: (error) => {
            toast.error(
                getApiError(
                    error,
                    "Ocorreu um erro ao salvar a vaga. Verifique os dados e tente novamente.",
                ),
            );
        },
    });

    function goBack() {
        navigate("/admin/vagas");
    }

    if (loadingVaga) {
        return <p className="text-sm text-slate-400">Carregando...</p>;
    }

    if (isEdit && (vagaError || !vaga)) {
        return <p className="text-sm text-red-500">Não foi possível carregar a vaga.</p>;
    }

    return (
        <VagaWizard
            initial={vaga ?? {}}
            saving={saveMutation.isPending}
            onSave={(payload) => saveMutation.mutate(payload)}
            onCancel={goBack}
        />
    );
}
