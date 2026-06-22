import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge/Badge";
import { Table } from "@/components/ui/Table/Table";
import { type Skill } from "../../types/skills";

interface Props {
    data: Skill[];
    loading?: boolean;
    deletingSkillId?: string | null;
    minRows?: number;
    onEdit?: (skill: Skill) => void;
    onDelete?: (skill: Skill) => void;
}

const SKILL_TYPE_LABELS: Record<string, string> = {
    HARD: "Hard Skill",
    SOFT: "Soft Skill",
};

export function SkillsTable({ data, loading, deletingSkillId, minRows, onEdit, onDelete }: Props) {
    const columns = [
        {
            header: "SKILL",
            render: (skill: Skill) => (
                <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-900">{skill.name}</span>
                </div>
            ),
            className: "flex-1",
        },
        {
            header: "TIPO",
            render: (skill: Skill) => (
                <Badge variant={skill.type === "HARD" ? "info" : "success"}>
                    {SKILL_TYPE_LABELS[skill.type] ?? skill.type}
                </Badge>
            ),
            className: "w-32",
        },
        {
            header: "IMPORTÂNCIA",
            render: (skill: Skill) => (
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden max-w-xs">
                        <div
                            className="h-full rounded-full bg-pink transition-[width] duration-[500ms]"
                            style={{ width: `${Math.min((skill.importanceWeight / 10) * 100, 100)}%` }}
                        />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 min-w-[2rem]">
                        {skill.importanceWeight.toFixed(1)}
                    </span>
                </div>
            ),
            className: "w-48",
        },
        {
            header: "STATUS",
            render: (skill: Skill) => (
                <Badge variant={skill.active ? "success" : "warning"}>
                    {skill.active ? "Ativa" : "Inativa"}
                </Badge>
            ),
            className: "w-28",
        },
        {
            header: "AÇÕES",
            render: (skill: Skill) => (
                <div className="flex items-center gap-1 justify-end">
                    <button
                        onClick={() => onEdit?.(skill)}
                        className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors p-2 rounded-md"
                        title="Editar skill"
                        aria-label="Editar skill"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    {skill.active && (
                        <button
                            onClick={() => onDelete?.(skill)}
                            disabled={deletingSkillId === skill.id}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Excluir skill"
                            aria-label="Excluir skill"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ),
            className: "w-24",
        },
    ];

    if (loading) {
        return <p className="text-center text-slate-400 text-sm py-8">Carregando skills...</p>;
    }

    return (
        <Table<Skill>
            columns={columns}
            data={data}
            keyExtractor={(skill) => skill.id}
            emptyMessage="Nenhuma skill encontrada"
            minRows={minRows}
        />
    );
}
