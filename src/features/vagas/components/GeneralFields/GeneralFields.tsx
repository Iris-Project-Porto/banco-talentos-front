import { useFormContext, Controller } from "react-hook-form";
import { Input, Select } from "@/components/ui";
import { type VagaFormData } from "../../validations/validations";
import { useVagaDependencies } from "../VagaModal/hooks/useVagaDependencies/useVagaDependencies";

const EXPERIENCE_LEVEL_OPTIONS = [
    { value: "JUNIOR", label: "Júnior" },
    { value: "PLENO", label: "Pleno" },
    { value: "SENIOR", label: "Sênior" },
    { value: "ESPECIALISTA", label: "Especialista" },
];

const MODALITY_OPTIONS = [
    { value: "", label: "Selecione..." },
    { value: "REMOTO", label: "Remoto" },
    { value: "HIBRIDO", label: "Híbrido" },
    { value: "PRESENCIAL", label: "Presencial" },
];

const STATUS_OPTIONS = [
    { value: "OPEN", label: "Aberta" },
    { value: "SCREENING", label: "Em Triagem" },
    { value: "ALLOCATING", label: "Em Alocação" },
    { value: "FILLED", label: "Preenchida" },
    { value: "CLOSED", label: "Encerrada" },
    { value: "CANCELLED", label: "Cancelada" },
];

interface Props {
    canEdit: boolean;
    dependencies: ReturnType<typeof useVagaDependencies>;
}

export function GeneralFields({ canEdit, dependencies }: Props) {
    const { register, control, formState: { errors } } = useFormContext<VagaFormData>();
    const { projects, filteredSquads, loadingProjects, loadingSquads } = dependencies;

    return (
        <fieldset disabled={!canEdit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Código da Vaga *"
                    placeholder="Ex: VAG-001"
                    error={errors.vacancyCode?.message}
                    {...register("vacancyCode")}
                />
                <Input
                    label="Título da Vaga *"
                    placeholder="Ex: Desenvolvedor React Sênior"
                    error={errors.title?.message}
                    {...register("title")}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                    name="projectId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Projeto *"
                            options={[
                                { value: "", label: loadingProjects ? "Carregando..." : "Selecione um projeto" },
                                ...projects.map((p: { id: string; name: string }) => ({ value: p.id, label: p.name })),
                            ]}
                            error={errors.projectId?.message}
                            disabled={loadingProjects || !canEdit}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="squadId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Squad Responsável *"
                            options={[
                                {
                                    value: "",
                                    label: loadingSquads
                                        ? "Carregando..."
                                        : filteredSquads.length === 0
                                            ? "Nenhuma squad neste projeto"
                                            : "Selecione uma squad",
                                },
                                ...filteredSquads.map((s: { id: string; name: string }) => ({ value: s.id, label: s.name })),
                            ]}
                            error={errors.squadId?.message}
                            disabled={(!loadingProjects && filteredSquads.length === 0) || loadingSquads || !canEdit}
                            {...field}
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Nível de Experiência (Senioridade) *"
                    options={EXPERIENCE_LEVEL_OPTIONS}
                    error={errors.experienceLevel?.message}
                    {...register("experienceLevel")}
                />
                <Select
                    label="Modalidade *"
                    options={MODALITY_OPTIONS}
                    error={errors.modality?.message}
                    {...register("modality")}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                    label="Status da Vaga *"
                    options={STATUS_OPTIONS}
                    error={errors.status?.message}
                    {...register("status")}
                />
                <Input
                    label="Data de Abertura *"
                    type="date"
                    error={errors.openingDate?.message}
                    {...register("openingDate")}
                />
                <Input
                    label="Data de Encerramento (Opcional)"
                    type="date"
                    {...register("closingDate")}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Recrutador *"
                    placeholder="Nome do recrutador"
                    error={errors.recruiter?.message}
                    {...register("recruiter")}
                />
                <Input
                    label="Semanas de Alocação Estimadas *"
                    type="number"
                    error={errors.estimatedAllocationWeeks?.message}
                    {...register("estimatedAllocationWeeks")}
                />
                <div className="flex items-center mt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                        <input type="checkbox" className="w-4 h-4 text-pink rounded focus:ring-pink" {...register("isUrgent")} />
                        Vaga Urgente
                    </label>
                </div>
            </div>
        </fieldset>
    );
}
