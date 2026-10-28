import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, PageHeader, Stepper, type StepperStep } from "@/components/ui";
import { STATUS_ONLY_STATUSES, type JobPostingPayload, type JobStatus } from "../../types/types";
import { vagaSchema, type VagaFormData } from "../../validations/validations";
import { useVagaDependencies } from "./hooks/useVagaDependencies/useVagaDependencies";
import { VagaDataForm } from "../VagaDataForm/VagaDataForm";
import { MatchResources } from "../ResourceMatch/ResourceMatch";

const EDITABLE_STATUSES = ["OPEN", "SCREENING", "ALLOCATING"];

const VAGA_WIZARD_STEPS: StepperStep[] = [
    { label: "Dados da Vaga", description: "Informações gerais" },
    { label: "Match de Recursos", description: "Ranking automático" },
];

type VagaWizardStep = 0 | 1;

const STATUS_DICTIONARY = {
    "FILLED": "Preenchida",
    "CLOSED": "Encerrada",
    "CANCELLED": "Cancelada",
};

interface Props {
    initial: Partial<JobPostingPayload> & { id?: string };
    saving: boolean;
    onSave: (v: JobPostingPayload & { id?: string }) => void;
    onStatusChange?: (status: JobStatus) => void;
    onCancel: () => void;
}

export function VagaForm({ initial, saving, onSave, onStatusChange, onCancel }: VagaFormProps) {
    const isEdit = Boolean(initial.id);
    const canEdit = isEdit ? EDITABLE_STATUSES.includes(initial.status || "") : true;
    const canChangeOnlyStatus = isEdit && STATUS_ONLY_STATUSES.includes(initial.status as JobStatus);

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

    async function onSubmit(data: VagaFormData) {
        const payload = {
            ...data,
            description: data.description || "", requirements: data.requirements || "", notes: data.notes || "",
            openingDate: new Date(data.openingDate).toISOString(),
            closingDate: data.closingDate ? new Date(data.closingDate).toISOString() : undefined,
            id: savedVagaId ?? initial.id,
        };

        try {
            const saved = await onSave(payload);
            setSavedVagaId(saved.id);
            setStep(1);
        } catch {
            // Erro tratado no pai (toast). Permanece no step 0.
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title={isEdit ? "Editar Vaga" : "Cadastrar Vaga"}
                subtitle="Preencha as informações da vaga"
                onBack={onCancel}
                backLabel="Voltar para vagas"
                actions={
                    <>
                        <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
                            Cancelar
                        </Button>
                        {canEdit && (
                            <Button
                                type="button"
                                variant="primary"
                                loading={saving}
                                onClick={methods.handleSubmit(onSubmit)}
                            >
                                {isEdit ? "Salvar alterações" : "Salvar"}
                            </Button>
                        )}
                    </>
                }
            />

            <Stepper steps={VAGA_WIZARD_STEPS} currentStep={step} />

            {!canEdit && !canChangeOnlyStatus && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm">
                    Vagas com status <b>{STATUS_DICTIONARY[initial.status as keyof typeof STATUS_DICTIONARY]}</b> não podem ser editadas (Apenas Abertas, Em Triagem ou Em Alocação).
                </div>
            )}
            {canChangeOnlyStatus && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm">
                    Esta vaga está somente para leitura. Apenas o status pode ser alterado.
                </div>
            )}

            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="flex flex-col gap-5"
                >
                    <div className="rounded-xl border border-slate-200 bg-white shadow-card px-7 py-6">
                        <GeneralFields
                            canEdit={canEdit}
                            canEditStatus={canEdit || canChangeOnlyStatus}
                            dependencies={vagaDependencies}
                        />
                    </div>

                    {step === 1 && (
                        <MatchResources vagaId={savedVagaId} />
                    )}
                </form>
            </FormProvider>
        </div>
    );
}
