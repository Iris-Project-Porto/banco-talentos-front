import { Eye, Pencil } from "lucide-react";
import { Badge } from "@/components/ui";
import { Table } from "@/components/ui/Table/Table";
import type { Project } from "../../types/types";

interface Props {
    data: Project[];
    onView?: (project: Project) => void;
    onEdit?: (project: Project) => void;
}

function formatDate(date?: string) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("pt-BR");
}

export function ProjectsTable({ data, onView, onEdit }: Props) {
    const columns = [
        {
            header: "Projeto",
            render: (project: Project) => (
                <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{project.name}</p>
                    {project.description && (
                        <p className="text-xs text-slate-500 truncate mt-0.5 max-w-xs">
                            {project.description}
                        </p>
                    )}
                </div>
            ),
        },
        {
            header: "Status",
            render: (project: Project) => (
                <Badge variant={project.active ? "success" : "danger"}>
                    {project.active ? "Ativo" : "Inativo"}
                </Badge>
            ),
        },
        {
            header: "Criado em",
            render: (project: Project) => (
                <span className="text-slate-600">{formatDate(project.createdAt)}</span>
            ),
        },
        {
            header: "Atualizado em",
            render: (project: Project) => (
                <span className="text-slate-600">{formatDate(project.updatedAt)}</span>
            ),
        },
        {
            header: "Ações",
            className: "text-right",
            render: (project: Project) => (
                <div className="flex items-center justify-end gap-1">
                    <button
                        type="button"
                        onClick={() => onView?.(project)}
                        className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors p-1.5 rounded-md"
                        title="Visualizar"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit?.(project)}
                        className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors p-1.5 rounded-md"
                        title="Editar"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={data}
            keyExtractor={(project) => project.id}
            emptyMessage="Nenhum projeto encontrado"
        />
    );
}
