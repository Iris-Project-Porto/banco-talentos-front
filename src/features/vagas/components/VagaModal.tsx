import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui";
import { type JobPostingPayload } from "../types";
import { vagaSchema, type VagaFormData } from "../validations";
import { vagasApi } from "../api/vagas.api";

const inputCls = "w-full font-sans text-base rounded-lg px-3.5 py-2.5 outline-none transition-all bg-white border border-slate-300 focus:border-pink focus:shadow-focus-pink text-slate-900 placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed";
const ErrorMsg = ({ msg }: { msg?: string }) => msg ? <span className="text-xs text-red-500">{msg}</span> : null;
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-slate-600">{label}</label>{children}</div>;
}

interface Props {
    initial: Partial<JobPostingPayload> & { id?: string };
    saving: boolean;
    onSave: (v: JobPostingPayload & { id?: string }) => void;
    onClose: () => void;
}

export function VagaModal({ initial, saving, onSave, onClose }: Props) {
    const isEdit = Boolean(initial.id);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<VagaFormData>({
        resolver: zodResolver(vagaSchema),
        defaultValues: {
            projectId: initial.projectId || "",
            squadId: initial.squadId || "",
            experienceLevel: initial.experienceLevel || "PLENO",
            description: initial.description || "",
            requirements: initial.requirements || "",
            recruiter: initial.recruiter || "",
            estimatedAllocationWeeks: initial.estimatedAllocationWeeks || 0,
            status: initial.status || "Aberta",
            notes: initial.notes || "",
            openingDate: initial.openingDate ? new Date(initial.openingDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            isUrgent: initial.isUrgent || false,
        }
    });

    const selectedProjectId = watch("projectId");
    const selectedSquadId = watch("squadId");

    const { data: projects = [], isLoading: loadingProjects } = useQuery({
        queryKey: ['projects', 'active'],
        queryFn: vagasApi.getProjects
    });

    const { data: allSquads = [], isLoading: loadingSquads } = useQuery({
        queryKey: ['squads', 'active'],
        queryFn: vagasApi.getSquads
    });

    const filteredSquads = allSquads.filter((s: any) => s.projectId === selectedProjectId);

    useEffect(() => {
        if (selectedProjectId && selectedSquadId) {
            const squadAindaValida = filteredSquads.find((s: any) => s.id === selectedSquadId);
            if (!squadAindaValida && filteredSquads.length > 0) {
                setValue("squadId", "");
            }
        }
    }, [selectedProjectId, filteredSquads, selectedSquadId, setValue]);

    function onSubmit(data: VagaFormData) {
        onSave({
            ...data,
            description: data.description || "",
            requirements: data.requirements || "",
            notes: data.notes || "",
            openingDate: new Date(data.openingDate).toISOString(),
            id: initial.id
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-login w-full max-w-2xl max-h-[90vh] flex flex-col">

                <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900">{isEdit ? "Editar vaga" : "Nova vaga"}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto flex-1">
                    <div className="px-7 py-6 flex flex-col gap-5">

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Projeto">
                                <select className={`${inputCls} ${errors.projectId ? 'border-red-400' : ''}`} {...register("projectId")} disabled={loadingProjects}>
                                    <option value="">{loadingProjects ? "Carregando..." : "Selecione um projeto"}</option>
                                    {projects.map((p: any) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                                <ErrorMsg msg={errors.projectId?.message} />
                            </Field>

                            <Field label="Squad">
                                <select className={`${inputCls} ${errors.squadId ? 'border-red-400' : ''}`} {...register("squadId")} disabled={!selectedProjectId || loadingSquads}>
                                    <option value="">
                                        {!selectedProjectId
                                            ? "Selecione o projeto primeiro"
                                            : loadingSquads
                                                ? "Carregando..."
                                                : filteredSquads.length === 0
                                                    ? "Nenhuma squad neste projeto"
                                                    : "Selecione uma squad"}
                                    </option>
                                    {filteredSquads.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                <ErrorMsg msg={errors.squadId?.message} />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Nível de Experiência">
                                <select className={inputCls} {...register("experienceLevel")}>
                                    <option value="JUNIOR">Júnior</option>
                                    <option value="PLENO">Pleno</option>
                                    <option value="SENIOR">Sênior</option>
                                    <option value="ESPECIALISTA">Especialista</option>
                                </select>
                                <ErrorMsg msg={errors.experienceLevel?.message} />
                            </Field>
                            <Field label="Recrutador">
                                <input className={`${inputCls} ${errors.recruiter ? 'border-red-400' : ''}`} placeholder="Nome do recrutador" {...register("recruiter")} />
                                <ErrorMsg msg={errors.recruiter?.message} />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Semanas de Alocação (Estimativa)">
                                <input type="number" className={inputCls} {...register("estimatedAllocationWeeks")} />
                                <ErrorMsg msg={errors.estimatedAllocationWeeks?.message} />
                            </Field>
                            <Field label="Data de Abertura">
                                <input type="date" className={inputCls} {...register("openingDate")} />
                                <ErrorMsg msg={errors.openingDate?.message} />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Status">
                                <input className={inputCls} placeholder="Ex: Aberta, Entrevistas..." {...register("status")} />
                                <ErrorMsg msg={errors.status?.message} />
                            </Field>
                            <div className="flex items-center mt-6">
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                                    <input type="checkbox" className="w-4 h-4 text-pink rounded focus:ring-pink" {...register("isUrgent")} />
                                    Vaga Urgente
                                </label>
                            </div>
                        </div>

                        <Field label="Descrição">
                            <textarea className={`${inputCls} min-h-[80px] resize-y`} placeholder="Descrição da vaga" {...register("description")} />
                        </Field>
                        <Field label="Requisitos">
                            <textarea className={`${inputCls} min-h-[80px] resize-y`} placeholder="Requisitos esperados" {...register("requirements")} />
                        </Field>
                        <Field label="Anotações Internas">
                            <textarea className={`${inputCls} min-h-[60px] resize-y`} placeholder="Notas..." {...register("notes")} />
                        </Field>
                    </div>

                    <div className="px-7 py-5 border-t border-slate-200 flex items-center justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>Cancelar</Button>
                        <Button type="submit" variant="primary" loading={saving}>{isEdit ? "Salvar alterações" : "Criar vaga"}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}