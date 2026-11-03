import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { STATUS_ONLY_STATUSES, vagasApi, VagaWizard as VagaWizardComponent, type JobPostingPayload, type JobStatus } from "@/features/vagas";
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
        mutationFn: async ({ id: vagaId, ...body }: SavePayload) => {
            if (vaga && STATUS_ONLY_STATUSES.includes(vaga.status)) {
                throw new Error("Vagas canceladas ou preenchidas permitem somente alteração do status.");
            }
            return vagaId ? vagasApi.update(vagaId, body) : vagasApi.create(body);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["vagas"] });
            toast.success("Vaga salva com sucesso!");
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

    const statusMutation = useMutation({
        mutationFn: async (status: JobStatus) => {
            if (!id || !vaga || !STATUS_ONLY_STATUSES.includes(vaga.status)) {
                throw new Error("A alteração isolada de status está disponível apenas para vagas canceladas ou preenchidas.");
            }
            return vagasApi.updateStatus(id, status);
        },
        onSuccess: async (_result, status) => {
            queryClient.setQueryData(["vagas", "detail", id], (current: typeof vaga) =>
                current ? { ...current, status } : current,
            );
            await queryClient.invalidateQueries({ queryKey: ["vagas"] });
            toast.success("Status da vaga atualizado com sucesso!");
            navigate("/admin/vagas");
        },
        onError: (error) => {
            toast.error(
                getApiError(
                    error,
                    "Não foi possível atualizar o status da vaga. Tente novamente.",
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
        <VagaWizardComponent
            initial={vaga ?? {}}
            saving={saveMutation.isPending || statusMutation.isPending}
            onSave={(payload) => saveMutation.mutateAsync(payload)}
            onStatusChange={(status) => statusMutation.mutate(status)}
            onCancel={goBack}
        />
    );
}
