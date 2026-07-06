import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/components/ui";
import { squadSchema, type SquadFormData } from "../../validations/validations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { squadsApi } from "../../api/squads.api";
import toast from "react-hot-toast";

interface Props {
    initial: Partial<SquadFormData> & { id?: string; active?: boolean };
    saving: boolean;
    onSave: (data: SquadFormData & { id?: string }) => void;
    onClose: () => void;
}

export function SquadFormModal({ initial, saving, onSave, onClose }: Props) {
    const isEdit = Boolean(initial.id);
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<SquadFormData>({
        resolver: zodResolver(squadSchema),
        defaultValues: {
            name: initial.name || "",
            description: initial.description || "",
            portoCoordinator: initial.portoCoordinator || "",
            projectManager: initial.projectManager || "",
            projectId: initial.projectId || "",
        }
    });

    useEffect(() => {
        reset({
            name: initial.name || "",
            description: initial.description || "",
            portoCoordinator: initial.portoCoordinator || "",
            projectManager: initial.projectManager || "",
            projectId: initial.projectId || "",
        });
    }, [initial, reset]);

    const toggleStatusMutation = useMutation({
        mutationFn: (currentStatus: boolean) => currentStatus ? squadsApi.inactivate(initial.id!) : squadsApi.activate(initial.id!),
        onSuccess: () => {
            toast.success("Status atualizado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['squad', initial.id] });
            queryClient.invalidateQueries({ queryKey: ['squads'] });
            onClose();
        },
        onError: () => toast.error("Não foi possível alterar o status da squad.")
    });

    function onSubmit(data: SquadFormData) {
        onSave({ ...data, id: initial.id });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-login w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-slate-900">
                            {isEdit ? "Editar Squad" : "Nova Squad"}
                        </h2>
                        {isEdit && initial.active !== undefined && (
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${initial.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {initial.active ? 'Ativa' : 'Inativa'}
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="overflow-y-auto flex-1 px-7 py-6 flex flex-col gap-5"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Nome da Squad *" {...register("name")} error={errors.name?.message} />
                        <Input label="ID do Projeto *" placeholder="UUID do Projeto" {...register("projectId")} error={errors.projectId?.message} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Project Manager *" {...register("projectManager")} error={errors.projectManager?.message} />
                        <Input label="Coordenador Porto *" {...register("portoCoordinator")} error={errors.portoCoordinator?.message} />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-600 mb-1.5 block">Descrição *</label>
                        <textarea 
                            {...register("description")} 
                            placeholder="Responsável pelo desenvolvimento..." 
                            className={`w-full rounded-lg px-3.5 py-2.5 text-sm outline-none border transition-all resize-none ${errors.description ? 'border-red-400' : 'border-slate-300 focus:border-pink focus:shadow-focus-pink'} bg-white text-slate-900`}
                            rows={4}
                        />
                        {errors.description && <span className="text-xs text-red-500 mt-1 block">{errors.description.message}</span>}
                    </div>
                </form>

                <div className="px-7 py-5 border-t border-slate-200 flex items-center justify-between shrink-0">
                    <div>
                        {isEdit && (
                            <Button
                                type="button"
                                variant={initial.active ? "danger" : "primary"}
                                loading={toggleStatusMutation.isPending}
                                onClick={() => toggleStatusMutation.mutate(initial.active!)}
                            >
                                {initial.active ? "Inativar Squad" : "Reativar Squad"}
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={saving || toggleStatusMutation.isPending}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            loading={saving}
                            onClick={handleSubmit(onSubmit)}
                            disabled={toggleStatusMutation.isPending}
                        >
                            {isEdit ? "Salvar alterações" : "Criar squad"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
