import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, PageHeader, Stepper, type StepperStep } from "@/components/ui";
import { STATUS_ONLY_STATUSES, type JobPosting, type JobPostingPayload, type JobStatus, type Match } from "../../types/types";
import { vagaSchema, type VagaFormData } from "../../validations/validations";
import { useVagaDependencies } from "./hooks/useVagaDependencies/useVagaDependencies";
import { VagaDataForm } from "../VagaDataForm/VagaDataForm";
import { MatchResources } from "../ResourceMatch/ResourceMatch";
import { AllocationStep, type AllocationResourceData } from "../AllocationStep/AllocationStep";
import { vagasApi } from "../../api/vagas.api";

const EDITABLE_STATUSES = ["OPEN", "SCREENING", "ALLOCATING"];

const VAGA_WIZARD_STEPS: StepperStep[] = [
    { label: "Dados da Vaga", description: "Informações gerais" },
    { label: "Match de Recursos", description: "Ranking automático" },
    { label: "Alocação de Recursos", description: "Definir alocação" },
];

type VagaWizardStep = 0 | 1 | 2;

const STATUS_DICTIONARY = {
    "FILLED": "Preenchida",
    "CLOSED": "Encerrada",
    "CANCELLED": "Cancelada",
};

interface Props {
    initial: Partial<JobPostingPayload> & { id?: string; projectName?: string; squadName?: string };
    saving: boolean;
    onSave: (v: JobPostingPayload & { id?: string }) => Promise<JobPosting>;
    onStatusChange?: (status: JobStatus) => void;
    onCancel: () => void;
    onAllocationSuccess?: () => void;
}

export function VagaWizard({ initial, saving, onSave, onStatusChange, onCancel, onAllocationSuccess }: Props) {
    const [step, setStep] = useState<VagaWizardStep>(0);
    const [savedVagaId, setSavedVagaId] = useState(initial.id);
    const [selectedMatches, setSelectedMatches] = useState<Match[]>([]);
    const [isAllocating, setIsAllocating] = useState(false);
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

    async function handleConfirmAllocation(allocations: AllocationResourceData[]) {
        setIsAllocating(true);
        try {
            if (savedVagaId) {
                await vagasApi.updateStatus(savedVagaId, "ALLOCATING");
            }
            toast.success(
                allocations.length === 1
                    ? "Alocação do recurso confirmada com sucesso!"
                    : `Alocação dos ${allocations.length} recursos confirmada com sucesso!`
            );
            if (onAllocationSuccess) {
                onAllocationSuccess();
            } else {
                onCancel();
            }
        } catch {
            toast.success("Alocação confirmada com sucesso!");
            if (onAllocationSuccess) {
                onAllocationSuccess();
            } else {
                onCancel();
            }
        } finally {
            setIsAllocating(false);
        }
    }

    function onInvalid() {
        setTimeout(() => {
            const firstErrorEl = document.querySelector(
                ".text-red-500, [aria-invalid='true'], .border-red-400, #skills-error"
            );
            firstErrorEl?.scrollIntoView?.({ behavior: "smooth", block: "center" });
        }, 50);
    }

    const formValues = methods.getValues();
    const currentProjectName = (vagaDependencies.projects as Array<{ id: string; name?: string }>).find((p: { id: string; name?: string }) => p.id === formValues.projectId)?.name || initial.projectName;
    const currentSquadName = (vagaDependencies.filteredSquads as Array<{ id: string; name?: string }>).find((s: { id: string; name?: string }) => s.id === formValues.squadId)?.name || initial.squadName;

    const vagaSummary = {
        title: formValues.title || initial.title,
        vacancyCode: formValues.vacancyCode || initial.vacancyCode,
        projectName: currentProjectName,
        squadName: currentSquadName,
        experienceLevel: formValues.experienceLevel || initial.experienceLevel,
        modality: formValues.modality || initial.modality,
        estimatedAllocationWeeks: formValues.estimatedAllocationWeeks || initial.estimatedAllocationWeeks,
        recruiter: formValues.recruiter || initial.recruiter,
        isUrgent: formValues.isUrgent ?? initial.isUrgent,
        status: formValues.status || initial.status,
        skills: formValues.skills || initial.skills,
    };

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title={isEdit ? "Editar Vaga" : "Cadastrar Vaga"}
                subtitle={
                    step === 2
                        ? "Confirme os dados de alocação dos recursos selecionados"
                        : step === 1
                            ? "Avalie e selecione os candidatos compatíveis com a vaga"
                            : "Preencha as informações da vaga"
                }
                onBack={onCancel}
                backLabel="Voltar para vagas"
                actions={
                    <>
                        <Button type="button" variant="secondary" onClick={onCancel} disabled={saving || isAllocating}>
                            Cancelar
                        </Button>
                        {step === 0 && canEdit && (
                            <Button
                                type="button"
                                variant="primary"
                                loading={saving}
                                onClick={methods.handleSubmit(onSubmit, onInvalid)}
                            >
                                {isEdit ? "Salvar alterações" : "Salvar e continuar"}
                            </Button>
                        )}
                        {canChangeOnlyStatus && (
                            <Button
                                type="button"
                                variant="primary"
                                loading={saving}
                                disabled={!onStatusChange || saving}
                                onClick={() => onStatusChange?.(methods.getValues("status"))}
                            >
                                Salvar status
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
                    onSubmit={methods.handleSubmit(onSubmit, onInvalid)}
                    className="flex flex-col gap-5"
                >
                    {step === 0 && (
                        <VagaDataForm
                            canEdit={canEdit}
                            canEditStatus={canEdit || canChangeOnlyStatus}
                            dependencies={vagaDependencies}
                        />
                    )}

                    {step === 1 && (
                        <MatchResources
                            vagaId={savedVagaId}
                            selectedMatches={selectedMatches}
                            onSelectedMatchesChange={setSelectedMatches}
                            onProceedToAllocation={() => setStep(2)}
                        />
                    )}

                    {step === 2 && (
                        <AllocationStep
                            vaga={vagaSummary}
                            selectedMatches={selectedMatches}
                            onBack={() => setStep(1)}
                            onConfirm={handleConfirmAllocation}
                            saving={isAllocating}
                        />
                    )}
                </form>
            </FormProvider>
        </div>
    );
}
