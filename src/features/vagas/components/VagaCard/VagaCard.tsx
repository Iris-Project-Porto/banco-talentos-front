import { Badge, Tag } from "@/components/ui";
import { type JobPosting, type ExperienceLevel, type JobSkill } from "../../types/types";
import { Pencil, Clock, Calendar, Trash2 } from "lucide-react";

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

const STATUS_LABEL: Record<string, string> = {
    OPEN: "Aberta",
    SCREENING: "Em Triagem",
    ALLOCATING: "Em Alocação",
    FILLED: "Preenchida",
    CLOSED: "Encerrada",
    CANCELLED: "Cancelada"
};

const STATUS_COLOR: Record<string, "status-success" | "status-info" | "status-warning" | "status-alert"> = {
    OPEN: "status-success",
    SCREENING: "status-info",
    ALLOCATING: "status-warning",
    FILLED: "status-info",
    CLOSED: "status-info",
    CANCELLED: "status-alert"
};

interface Props {
    vaga: JobPosting;
    onEdit: (v: JobPosting) => void;
    onCancel: (vaga: JobPosting) => void;
}

export function VagaCard({ vaga, onEdit, onCancel }: Props) {
    const title = vaga.title || vaga.projectName || vaga.projectId;
    const squad = vaga.squadName || vaga.squadId;
    const normalizedStatus = vaga.status?.toUpperCase() || "OPEN";
    const displayStatus = STATUS_LABEL[normalizedStatus] || vaga.status;
    const tagKind = STATUS_COLOR[normalizedStatus] || "status-info";
    const isCancelled = normalizedStatus === "CANCELLED";

    return (
        <div className={`bg-white border border-slate-200 rounded-xl shadow-card p-5 flex flex-col transition-all hover:shadow-card-hover hover:-translate-y-px ${isCancelled && 'opacity-60 grayscale-[0.5]'}`}>
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-base text-slate-900 truncate" title={title}>
                        {title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        <span className="font-semibold text-slate-700">{vaga.vacancyCode}</span> • Squad: {squad} • Recrutador: {vaga.recruiter}
                    </p>
                </div>
                <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1">
                    <button
                        onClick={() => onEdit(vaga)}
                        className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors p-1.5 rounded-md"
                        title="Detalhes/Editar"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    {!isCancelled && (
                        <button
                            onClick={() => onCancel(vaga)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                            title="Cancelar Vaga"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center mb-3">
                <Badge variant={SENIORIDADE_BADGE[vaga.experienceLevel]}>
                    {SENIORIDADE_LABEL[vaga.experienceLevel]}
                </Badge>
                {vaga.isUrgent && <Tag kind="status-alert">Urgente</Tag>}
                {vaga.modality && <Tag kind="area">{vaga.modality}</Tag>}
                <Tag kind={tagKind}>
                    {displayStatus}
                </Tag>
            </div>

            {vaga.skills && vaga.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {vaga.skills.slice(0, 3).map((skill: JobSkill, idx: number) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm">{skill.name}</span>
                    ))}
                    {vaga.skills.length > 3 && <span className="text-[10px] text-slate-400 px-1 py-0.5">+{vaga.skills.length - 3}</span>}
                </div>
            )}

            {vaga.description && (
                <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
                    {vaga.description}
                </p>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400 mt-auto">
                <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Alocação: {vaga.estimatedAllocationWeeks} sem
                </span>
                <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(vaga.openingDate).toLocaleDateString("pt-BR")}
                </span>
            </div>
        </div>
    );
}