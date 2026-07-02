import { Badge, Button } from "@/components/ui";
import type { Project } from "../../types/types";

function formatDateTime(date?: string) {
    if (!date) return "—";
    return new Date(date).toLocaleString("pt-BR");
}

interface Props {
    project: Project;
    onClose: () => void;
    onEdit: () => void;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                {label}
            </span>
            <span className="text-sm text-slate-800 break-words">{value}</span>
        </div>
    );
}

export function ProjectDetailModal({ project, onClose, onEdit }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-login w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900">Detalhes do projeto</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 px-7 py-6 flex flex-col gap-5">
                    <DetailRow label="Nome do projeto" value={project.name} />
                    <DetailRow
                        label="Descrição"
                        value={project.description || <span className="text-slate-400">—</span>}
                    />
                    <DetailRow
                        label="Status"
                        value={
                            <Badge variant={project.active ? "success" : "danger"}>
                                {project.active ? "Ativo" : "Inativo"}
                            </Badge>
                        }
                    />
                    <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailRow label="Criado em" value={formatDateTime(project.createdAt)} />
                        <DetailRow label="Criado por" value={project.createdBy || "—"} />
                        <DetailRow label="Última modificação" value={formatDateTime(project.updatedAt)} />
                        <DetailRow label="Modificado por" value={project.updatedBy || "—"} />
                    </div>
                </div>

                <div className="px-7 py-5 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Fechar
                    </Button>
                    <Button type="button" variant="primary" onClick={onEdit}>
                        Editar projeto
                    </Button>
                </div>
            </div>
        </div>
    );
}
