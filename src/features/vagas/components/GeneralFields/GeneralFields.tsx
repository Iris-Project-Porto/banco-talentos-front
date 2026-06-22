import { useFormContext, Controller } from "react-hook-form";
import { type VagaFormData } from "../../validations/validations";
import { Field, ErrorMsg, INPUT_CLS } from "../FormHelpers/FormHelpers";
import { useVagaDependencies } from "../VagaModal/hooks/useVagaDependencies/useVagaDependencies";

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
                <Field label="Código da Vaga *">
                    <input className={`${INPUT_CLS} ${errors.vacancyCode ? 'border-red-400' : ''}`} placeholder="Ex: VAG-001" {...register("vacancyCode")} />
                    <ErrorMsg msg={errors.vacancyCode?.message} />
                </Field>
                <Field label="Título da Vaga *">
                    <input className={`${INPUT_CLS} ${errors.title ? 'border-red-400' : ''}`} placeholder="Ex: Desenvolvedor React Sênior" {...register("title")} />
                    <ErrorMsg msg={errors.title?.message} />
                </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Projeto *">
                    <Controller
                        name="projectId"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                className={`${INPUT_CLS} ${errors.projectId ? 'border-red-400' : ''}`}
                                disabled={loadingProjects || !canEdit}
                            >
                                <option value="">{loadingProjects ? "Carregando..." : "Selecione um projeto"}</option>
                                {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        )}
                    />
                    <ErrorMsg msg={errors.projectId?.message} />
                </Field>

                <Field label="Squad Responsável *">
                    <Controller
                        name="squadId"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                className={`${INPUT_CLS} ${errors.squadId ? 'border-red-400' : ''}`}
                                disabled={(!loadingProjects && filteredSquads.length === 0) || loadingSquads || !canEdit}
                            >
                                <option value="">{loadingSquads ? "Carregando..." : filteredSquads.length === 0 ? "Nenhuma squad neste projeto" : "Selecione uma squad"}</option>
                                {filteredSquads.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        )}
                    />
                    <ErrorMsg msg={errors.squadId?.message} />
                </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nível de Experiência (Senioridade) *">
                    <select className={`${INPUT_CLS} ${errors.experienceLevel ? 'border-red-400' : ''}`} {...register("experienceLevel")}>
                        <option value="JUNIOR">Júnior</option><option value="PLENO">Pleno</option>
                        <option value="SENIOR">Sênior</option><option value="ESPECIALISTA">Especialista</option>
                    </select>
                    <ErrorMsg msg={errors.experienceLevel?.message} />
                </Field>
                <Field label="Modalidade *">
                    <select className={`${INPUT_CLS} ${errors.modality ? 'border-red-400' : ''}`} {...register("modality")}>
                        <option value="">Selecione...</option><option value="REMOTO">Remoto</option>
                        <option value="HIBRIDO">Híbrido</option><option value="PRESENCIAL">Presencial</option>
                    </select>
                    <ErrorMsg msg={errors.modality?.message} />
                </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Status da Vaga *">
                    <select className={`${INPUT_CLS} ${errors.status ? 'border-red-400' : ''}`} {...register("status")}>
                        <option value="OPEN">Aberta</option><option value="SCREENING">Em Triagem</option>
                        <option value="ALLOCATING">Em Alocação</option><option value="FILLED">Preenchida</option>
                        <option value="CLOSED">Encerrada</option><option value="CANCELLED">Cancelada</option>
                    </select>
                    <ErrorMsg msg={errors.status?.message} />
                </Field>
                <Field label="Data de Abertura *">
                    <input type="date" className={`${INPUT_CLS} ${errors.openingDate ? 'border-red-400' : ''}`} {...register("openingDate")} />
                    <ErrorMsg msg={errors.openingDate?.message} />
                </Field>
                <Field label="Data de Encerramento (Opcional)">
                    <input type="date" className={INPUT_CLS} {...register("closingDate")} />
                </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Recrutador *">
                    <input className={`${INPUT_CLS} ${errors.recruiter ? 'border-red-400' : ''}`} placeholder="Nome do recrutador" {...register("recruiter")} />
                    <ErrorMsg msg={errors.recruiter?.message} />
                </Field>
                <Field label="Semanas de Alocação Estimadas *">
                    <input type="number" className={`${INPUT_CLS} ${errors.estimatedAllocationWeeks ? 'border-red-400' : ''}`} {...register("estimatedAllocationWeeks")} />
                    <ErrorMsg msg={errors.estimatedAllocationWeeks?.message} />
                </Field>
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