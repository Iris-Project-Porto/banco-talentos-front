import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Button, FloatingActionButton, PageHeader, Stepper, type StepperStep } from "@/components/ui";
import { getApiError } from "@/lib/axios";
import { STATUS_ONLY_STATUSES, type JobPosting, type JobPostingPayload, type JobStatus, type Match } from "../../types/types";
import { vagaSchema, type VagaFormData } from "../../validations/validations";
import { useVagaDependencies } from "./hooks/useVagaDependencies/useVagaDependencies";
import { VagaDataForm } from "../VagaDataForm/VagaDataForm";
import { MatchResources } from "../ResourceMatch/ResourceMatch";
import { AllocationStep, type AllocationResourceData } from "../AllocationStep/AllocationStep";
import { FilledAllocationInfo } from "../FilledAllocationInfo/FilledAllocationInfo";
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

function getInitialStep(status?: string): VagaWizardStep {
    if (status === "ALLOCATING") return 2;
    if (status === "SCREENING") return 1;
    return 0;
}

export function VagaWizard({ initial, saving, onSave, onStatusChange, onCancel, onAllocationSuccess }: Props) {
    const [step, setStep] = useState<VagaWizardStep>(() => getInitialStep(initial.status));
    const [savedVagaId, setSavedVagaId] = useState(initial.id);
    const [selectedMatches, setSelectedMatches] = useState<Match[]>(() => {
        const vagaId = initial.id;
        if (vagaId) {
            try {
                const stored = localStorage.getItem(`vaga_selected_matches_${vagaId}`);
                if (stored) return JSON.parse(stored);
            } catch {}
        }
        return [];
    });
    const [isAllocating, setIsAllocating] = useState(false);
    const [isAdvancingToAllocation, setIsAdvancingToAllocation] = useState(false);

    function handleSelectedMatchesChange(matches: Match[]) {
        setSelectedMatches(matches);
        const vagaId = savedVagaId ?? initial.id;
        if (vagaId) {
            try {
                localStorage.setItem(`vaga_selected_matches_${vagaId}`, JSON.stringify(matches));
            } catch {}
        }
    }
    const isEdit = Boolean(initial.id);
    const isFilled = isEdit && initial.status === "FILLED";
    const canEdit = isEdit ? EDITABLE_STATUSES.includes(initial.status || "") : true;
    const canChangeOnlyStatus = isEdit && STATUS_ONLY_STATUSES.includes(initial.status as JobStatus);

    const initialCandidateIds = initial.selectedCandidateIds;
    const { data: initialMatchesPage } = useQuery({
        queryKey: ["vagas", initial.id, "matches-hydration", initialCandidateIds],
        queryFn: () => vagasApi.getMatches(initial.id!, { page: 0, size: 100 }),
        enabled: Boolean(initial.id && initialCandidateIds && initialCandidateIds.length > 0),
    });

    useEffect(() => {
        if (!initialCandidateIds?.length || !initialMatchesPage?.content?.length) return;
        const idSet = new Set(initialCandidateIds);
        const hydrated = initialMatchesPage.content.filter((m) => idSet.has(m.id));
        if (hydrated.length > 0) {
            setSelectedMatches(hydrated);
        }
    }, [initialCandidateIds, initialMatchesPage]);

    const {
        data: filledAllocations = [],
        isLoading: loadingFilledAllocations,
        isError: filledAllocationsError,
    } = useQuery({
        queryKey: ["vagas", initial.id, "allocations"],
        queryFn: () => vagasApi.getAllocations(initial.id!),
        enabled: Boolean(isFilled && initial.id),
    });

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

    const [submittingAction, setSubmittingAction] = useState<"saveAndExit" | "advance" | null>(null);

    async function onSubmit(data: VagaFormData, action: "saveAndExit" | "advance" = "advance") {
        setSubmittingAction(action);
        const targetStatus: JobStatus = action === "saveAndExit" ? "OPEN" : "SCREENING";
        methods.setValue("status", targetStatus);

        const payload = {
            ...data,
            status: targetStatus,
            description: data.description || "", requirements: data.requirements || "", notes: data.notes || "",
            openingDate: new Date(data.openingDate).toISOString(),
            closingDate: data.closingDate ? new Date(data.closingDate).toISOString() : undefined,
            selectedCandidateIds: selectedMatches.length > 0 ? selectedMatches.map((m) => m.id) : (initial.selectedCandidateIds ?? []),
            id: savedVagaId ?? initial.id,
        };

        try {
            const saved = await onSave(payload);
            setSavedVagaId(saved.id);
            if (action === "saveAndExit") {
                onCancel();
            } else {
                setStep(1);
            }
        } catch {
        } finally {
            setSubmittingAction(null);
        }
    }

    async function handleProceedToAllocation() {
        const vagaIdToSave = savedVagaId ?? initial.id;
        if (vagaIdToSave) {
            setIsAdvancingToAllocation(true);
            const currentData = methods.getValues();
            methods.setValue("status", "ALLOCATING");
            const payload = {
                ...currentData,
                status: "ALLOCATING" as JobStatus,
                description: currentData.description || "",
                requirements: currentData.requirements || "",
                notes: currentData.notes || "",
                openingDate: currentData.openingDate ? new Date(currentData.openingDate).toISOString() : new Date().toISOString(),
                closingDate: currentData.closingDate ? new Date(currentData.closingDate).toISOString() : undefined,
                selectedCandidateIds: selectedMatches.map((m) => m.id),
                id: vagaIdToSave,
            };

            try {
                const saved = await onSave(payload);
                setSavedVagaId(saved.id);
                setStep(2);
            } catch {
            } finally {
                setIsAdvancingToAllocation(false);
            }
        } else {
            setStep(2);
        }
    }

    async function handleConfirmAllocation(allocation: AllocationResourceData) {
        if (!savedVagaId) {
            toast.error("Salve a vaga antes de confirmar a alocação.");
            return;
        }
        setIsAllocating(true);
        try {
            await vagasApi.allocate(savedVagaId, {
                resourceId: allocation.resourceId,
                startDate: allocation.startDate,
                role: allocation.role.trim(),
            });
            try {
                localStorage.removeItem(`vaga_selected_matches_${savedVagaId}`);
            } catch {}
            toast.success(`Alocação de ${allocation.resourceName} confirmada! Vaga preenchida.`);
            if (onAllocationSuccess) {
                onAllocationSuccess();
            } else {
                onCancel();
            }
        } catch (error) {
            toast.error(
                getApiError(
                    error,
                    "Não foi possível confirmar a alocação da vaga. Tente novamente.",
                ),
            );
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
        <div className="flex flex-col gap-6 pb-24">
            <PageHeader
                title={isEdit ? "Editar Vaga" : "Cadastrar Vaga"}
                subtitle={
                    step === 2
                        ? "Escolha o candidato que preencherá a vaga e confirme os dados de alocação"
                        : step === 1
                            ? "Avalie e selecione os candidatos compatíveis com a vaga"
                            : "Preencha as informações da vaga"
                }
                onBack={step === 2 ? () => setStep(1) : step === 1 ? () => setStep(0) : onCancel}
                backLabel={step === 2 ? "Voltar ao Match" : step === 1 ? "Voltar aos dados da vaga" : "Voltar para vagas"}
                actions={
                    <>
                        <Button type="button" variant="secondary" onClick={onCancel} disabled={saving || isAllocating}>
                            Cancelar
                        </Button>
                        {step === 0 && canEdit && (
                            <Button
                                type="button"
                                variant="primary"
                                className="gap-2"
                                loading={saving && submittingAction === "advance"}
                                disabled={saving || isAllocating}
                                onClick={methods.handleSubmit((data) => onSubmit(data, "advance"), onInvalid)}
                            >
                                <span>Avançar para Match</span>
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Button>
                        )}
                    </>
                }
            />

            <Stepper
                steps={VAGA_WIZARD_STEPS}
                currentStep={step}
                onStepClick={(target) => {
                    if (target < step) {
                        setStep(target as VagaWizardStep);
                    }
                }}
            />

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
            {isFilled && (
                <FilledAllocationInfo
                    allocations={filledAllocations}
                    loading={loadingFilledAllocations}
                    error={filledAllocationsError}
                />
            )}

            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit((data) => onSubmit(data, "advance"), onInvalid)}
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
                            vagaId={savedVagaId ?? initial.id}
                            selectedMatches={selectedMatches}
                            onSelectedMatchesChange={handleSelectedMatchesChange}
                            onProceedToAllocation={handleProceedToAllocation}
                            isAdvancing={isAdvancingToAllocation}
                        />
                    )}

                    {step === 2 && (
                        <AllocationStep
                            vaga={vagaSummary}
                            selectedMatches={selectedMatches}
                            onConfirm={handleConfirmAllocation}
                            saving={isAllocating}
                        />
                    )}
                </form>
            </FormProvider>

            {step === 0 && canEdit && (
                <FloatingActionButton
                    label={isEdit ? "Salvar alterações" : "Salvar"}
                    loading={saving && submittingAction === "saveAndExit"}
                    disabled={saving || isAllocating}
                    onClick={methods.handleSubmit((data) => onSubmit(data, "saveAndExit"), onInvalid)}
                />
            )}

            {canChangeOnlyStatus && (
                <FloatingActionButton
                    label="Salvar status"
                    loading={saving}
                    disabled={!onStatusChange || saving}
                    onClick={() => onStatusChange?.(methods.getValues("status"))}
                />
            )}
        </div>
    );
}
