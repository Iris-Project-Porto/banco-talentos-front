import { Badge, Tag } from "@/components/ui";
import { type JobPosting, type ExperienceLevel } from "../types";


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
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
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
                            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9v6m-4.5-6v6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        ) : (
                            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
                            </svg>
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
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Alocação: {vaga.estimatedAllocationWeeks} semanas
                </span>
                <span className="flex items-center gap-1">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    {new Date(vaga.openingDate).toLocaleDateString("pt-BR")}
                </span>
            </div>
        </div>
    );
}