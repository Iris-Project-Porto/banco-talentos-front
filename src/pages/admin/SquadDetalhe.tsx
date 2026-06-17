import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button, Input, Card } from "@/components/ui";
import { squadSchema, type SquadFormData } from "@/features/squads/validations/validations";
import { squadsApi } from "@/features/squads/api/squads.api";
import { ArrowLeft } from "lucide-react";

export default function SquadDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = Boolean(id && id !== "nova");
    const [activeTab, setActiveTab] = useState("dados");

    const { data: squad, isLoading } = useQuery({
        queryKey: ['squad', id],
        queryFn: () => squadsApi.getById(id!),
        enabled: isEdit
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<SquadFormData>({
        resolver: zodResolver(squadSchema),
    });

    useEffect(() => {
        if (squad) {
            reset({
                name: squad.name,
                description: squad.description,
                portoCoordinator: squad.portoCoordinator,
                projectManager: squad.projectManager,
                projectId: squad.projectId,
            });
        }
    }, [squad, reset]);

    const saveMutation = useMutation({
        mutationFn: (data: SquadFormData) => isEdit ? squadsApi.update(id!, data) : squadsApi.create(data),
        onSuccess: () => {
            toast.success("Squad salva com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['squads'] });
            navigate("/admin/squads");
        },
        onError: () => toast.error("Ocorreu um erro ao salvar a squad.")
    });

    const toggleStatusMutation = useMutation({
        mutationFn: (currentStatus: boolean) => currentStatus ? squadsApi.inactivate(id!) : squadsApi.activate(id!),
        onSuccess: () => {
            toast.success("Status atualizado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['squad', id] });
            queryClient.invalidateQueries({ queryKey: ['squads'] });
        },
        onError: () => toast.error("Não foi possível alterar o status da squad.")
    });

    if (isEdit && isLoading) return <p className="text-slate-400 text-sm">Carregando...</p>;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-700 transition-colors p-2 -ml-2">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold text-slate-900">{isEdit ? "Editar Squad" : "Cadastrar Squad"}</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
                    <Button variant="primary" loading={saveMutation.isPending} onClick={handleSubmit((d) => saveMutation.mutate(d))}>
                        Salvar Squad
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1 w-full bg-white rounded-xl shadow-card border border-slate-200 overflow-hidden">
                    <div className="flex border-b border-slate-200 px-6 pt-2 gap-6 text-sm font-medium overflow-x-auto">
                        <button className={`py-4 whitespace-nowrap outline-none ${activeTab === 'dados' ? 'text-pink border-b-2 border-pink' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveTab('dados')}>Dados Gerais</button>
                        <button className={`py-4 whitespace-nowrap outline-none ${activeTab === 'recursos' ? 'text-pink border-b-2 border-pink' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveTab('recursos')}>Recursos da Squad</button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'dados' && (
                            <form className="flex flex-col gap-5">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">Informações Gerais</h3>
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
                                    <textarea {...register("description")} placeholder="Responsável pelo desenvolvimento..." className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none border border-slate-300 focus:border-pink focus:shadow-focus-pink min-h-[100px] resize-y bg-white text-slate-900"></textarea>
                                    {errors.description && <span className="text-xs text-red-500 mt-1 block">{errors.description.message}</span>}
                                </div>

                                {isEdit && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 border-t border-slate-100 pt-4">
                                        <Input label="Criado Por" disabled value={squad?.createdBy || "-"} className="bg-slate-50 text-slate-500" />
                                        <Input label="Data de Criação" disabled value={squad?.createdAt ? new Date(squad.createdAt).toLocaleString("pt-BR") : "-"} className="bg-slate-50 text-slate-500" />
                                    </div>
                                )}
                            </form>
                        )}
                        {activeTab !== 'dados' && (
                            <div className="py-12 text-center text-sm text-slate-400">Em desenvolvimento.</div>
                        )}
                    </div>
                </div>

                {isEdit && squad && (
                    <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
                        <Card padding="md" className="flex flex-col gap-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-800">Status da Squad</h3>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${squad.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {squad.active ? 'Ativa' : 'Inativa'}
                                </span>
                            </div>

                            <div className="flex flex-col gap-3 text-sm text-slate-600">
                                <div className="flex justify-between items-center"><span>Recursos Alocados</span><span className="font-bold text-slate-900">{squad.metrics?.allocatedResources || 0}</span></div>
                                <div className="flex justify-between items-center"><span>Vagas Abertas</span><span className="font-bold text-slate-900">{squad.metrics?.openRoles || 0}</span></div>
                            </div>
                        </Card>

                        <Button
                            type="button"
                            variant={squad.active ? "danger" : "primary"}
                            fullWidth
                            loading={toggleStatusMutation.isPending}
                            onClick={() => toggleStatusMutation.mutate(squad.active)}
                        >
                            {squad.active ? "Inativar Squad" : "Reativar Squad"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}