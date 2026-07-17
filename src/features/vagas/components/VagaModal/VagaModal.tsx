import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui";
import { type JobPostingPayload } from "../../types/types";
import { vagaSchema, type VagaFormData } from "../../validations/validations";
import { useVagaDependencies } from "./hooks/useVagaDependencies/useVagaDependencies";
import { GeneralFields } from "../GeneralFields/GeneralFields";
import { SkillsSection } from "../SkillsSection/SkillsSection";
import { AdditionalInfoFields } from "../AdditionalInfoFields/AdditionalInfoFields";


interface VagaModalProps {
    initial: Partial<JobPostingPayload> & { id?: string };
    saving: boolean;
    onSave: (v: JobPostingPayload & { id?: string }) => void;
    onClose: () => void;
}

export function VagaModal({ initial, saving, onSave, onClose }: VagaModalProps) {
    const isEdit = Boolean(initial.id);
    const canEdit = isEdit ? ["OPEN", "SCREENING", "ALLOCATING"].includes(initial.status || "") : true;

    const methods = useForm<VagaFormData>({
        resolver: zodResolver(vagaSchema),
        defaultValues: {
            vacancyCode: initial.vacancyCode || "", title: initial.title || "",
            projectId: initial.projectId || "", squadId: initial.squadId || "",
            experienceLevel: initial.experienceLevel || "PLENO", modality: initial.modality || "",
            description: initial.description || "", requirements: initial.requirements || "",
            recruiter: initial.recruiter || "", estimatedAllocationWeeks: initial.estimatedAllocationWeeks || 0,
            status: initial.status || "OPEN", notes: initial.notes || "",
            openingDate: initial.openingDate ? new Date(initial.openingDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            closingDate: initial.closingDate ? new Date(initial.closingDate).toISOString().slice(0, 10) : "",
            isUrgent: initial.isUrgent || false, skills: initial.skills || []
        }
    });

    const selectedProjectId = methods.watch("projectId");
    const selectedSquadId = methods.watch("squadId");

    const vagaDependencies = useVagaDependencies(selectedProjectId, selectedSquadId, methods.setValue);


    const onSubmit = (data: VagaFormData) => {
        onSave({
            ...data,
            description: data.description || "", requirements: data.requirements || "", notes: data.notes || "",
            openingDate: new Date(data.openingDate).toISOString(),
            closingDate: data.closingDate ? new Date(data.closingDate).toISOString() : undefined,
            id: initial.id
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-login w-full max-w-8xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900">{isEdit ? "Editar vaga" : "Nova vaga"}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
                </div>

                <FormProvider {...methods}>
                    <form
                        onSubmit={methods.handleSubmit(onSubmit, (err) => console.error("Erros de Validação:", err))}
                        className="overflow-y-auto flex-1 px-7 py-6 flex flex-col gap-5"
                    >
                        {!canEdit && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm">
                                Vagas com status <b>{initial.status}</b> não podem ser editadas (Apenas Abertas, Em Triagem ou Em Alocação).
                            </div>
                        )}

                        <GeneralFields canEdit={canEdit} dependencies={vagaDependencies} />
                        <SkillsSection canEdit={canEdit} />
                        <AdditionalInfoFields canEdit={canEdit} />

                    </form>
                </FormProvider>

                <div className="px-7 py-5 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
                    <Button disabled={saving} onClick={onClose} type="button" variant="secondary">Cancelar</Button>
                    {canEdit && (
                        <Button loading={saving} onClick={methods.handleSubmit(onSubmit)} type="button" variant="primary">
                            {isEdit ? "Salvar alterações" : "Criar vaga"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}