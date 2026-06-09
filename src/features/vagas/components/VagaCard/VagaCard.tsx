import { Badge, Tag } from "@/components/ui";
import { type JobPosting, type ExperienceLevel } from "../../types";
import { Pencil, PauseCircle, PlayCircle, Clock, Calendar } from "lucide-react";

const SENIORIDADE_BADGE: Record<ExperienceLevel, "junior" | "pleno" | "senior" | "warning"> = {
    JUNIOR: "junior",
    PLENO: "pleno",
    SENIOR: "senior",
    ESPECIALISTA: "warning"
};

const SENIORIDADE_LABEL: Record<ExperienceLevel, string> = {
    JUNIOR: "Júnior",
    PLENO: "Pleno",
    SENIOR: "Sênior",
    ESPECIALISTA: "Especialista"
};

interface Props {
    vaga: JobPosting;
    onEdit: (v: JobPosting) => void;
    onToggleActive: (id: string, currentActive: boolean) => void;
}

export function VagaCard({ vaga, onEdit, onToggleActive }: Props) {
    const title = vaga.projectName || vaga.projectId;
    const squad = vaga.squadName || vaga.squadId;

    return (
        <div className={`bg-white border border-slate-200 rounded-xl shadow-card p-5 flex flex-col transition-all hover:shadow-card-hover hover:-translate-y-px ${!vaga.active && 'opacity-60 grayscale-[0.5]'}`}>

            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-base text-slate-900 truncate" title={title}>
                        {title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Squad: {squad} • Recrutador: {vaga.recruiter}
                    </p>
                </div>

                <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1">
                    <button
                        onClick={() => onEdit(vaga)}
                        className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors p-1.5 rounded-md"
                        title="Editar vaga"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onToggleActive(vaga.id, vaga.active)}
                        className={`p-1.5 rounded-md transition-colors ${vaga.active
                            ? 'text-red-400 hover:text-red-600 hover:bg-red-50'
                            : 'text-green-500 hover:text-green-700 hover:bg-green-50'
                            }`}
                        title={vaga.active ? "Desativar vaga" : "Ativar vaga"}
                    >
                        {vaga.active ? (
                            <PauseCircle className="w-4 h-4" />
                        ) : (
                            <PlayCircle className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5 items-center mb-3">
                <Badge variant={SENIORIDADE_BADGE[vaga.experienceLevel]}>
                    {SENIORIDADE_LABEL[vaga.experienceLevel]}
                </Badge>
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600">
                    {vaga.status}
                </span>
                {vaga.isUrgent && <Tag kind="status-alert">Urgente</Tag>}
                <Tag kind={vaga.active ? "status-success" : "skill"}>
                    {vaga.active ? "Ativa" : "Inativa"}
                </Tag>
            </div>

            {vaga.description && (
                <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
                    {vaga.description}
                </p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400 mt-auto">
                <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Alocação: {vaga.estimatedAllocationWeeks} semanas
                </span>
                <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(vaga.openingDate).toLocaleDateString("pt-BR")}
                </span>
            </div>
        </div>
    );
}