import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, PageHeader, Stepper, type StepperStep } from "@/components/ui";
import { type JobPostingPayload } from "../../types/types";
import { vagaSchema, type VagaFormData } from "../../validations/validations";
import { useVagaDependencies } from "./hooks/useVagaDependencies/useVagaDependencies";
import { VagaDataForm } from "../VagaDataForm/VagaDataForm";
import { MatchRecursos } from "../MatchRecursos/MatchRecursos";

const EDITABLE_STATUSES = ["OPEN", "SCREENING", "ALLOCATING"];

const VAGA_WIZARD_STEPS: StepperStep[] = [
    { label: "Dados da Vaga", description: "Informações gerais" },
    { label: "Match de Recursos", description: "Ranking automático" },
];

type VagaWizardStep = 0 | 1;

interface Props {
    initial: Partial<JobPostingPayload> & { id?: string };
    saving: boolean;
    onSave: (v: JobPostingPayload & { id?: string }) => void;
    onCancel: () => void;
}

export function VagaWizard({ initial, saving, onSave, onCancel }: Props) {
    const [step] = useState<VagaWizardStep>(0);
    const isEdit = Boolean(initial.id);
    const canEdit = isEdit ? EDITABLE_STATUSES.includes(initial.status || "") : true;

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
        <div className="flex flex-col gap-6">
            <PageHeader
                title={isEdit ? "Editar vaga" : "Nova vaga"}
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
                                {isEdit ? "Salvar alterações" : "Salvar e continuar"}
                            </Button>
                        )}
                    </>
                }
            />

            <Stepper steps={VAGA_WIZARD_STEPS} currentStep={step} />

            {!canEdit && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm">
                    Vagas com status <b>{initial.status}</b> não podem ser editadas (Apenas Abertas, Em Triagem ou Em Alocação).
                </div>
            )}

            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="flex flex-col gap-5"
                >
                    {step === 0 && (
                        <VagaDataForm canEdit={canEdit} dependencies={vagaDependencies} />
                    )}

                    {step === 1 && (
                        <MatchRecursos vagaId={initial.id} />
                    )}
                </form>
            </FormProvider>
        </div>
    );
}
