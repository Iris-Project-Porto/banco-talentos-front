import { Pencil, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar/Avatar";
import { Button } from "@/components/ui/Button/Button";
import { Table } from "@/components/ui/Table/Table";
import { SkillCategoryBadge } from "../SkillCategoryBadge/SkillCategoryBadge";
import type { Skill } from "../../types/types";

interface Props {
    data: Skill[];
    deletingSkillId?: string | null;
    onEdit?: (skill: Skill) => void;
    onDelete?: (skill: Skill) => void;
}

const columnCls = "w-1/5 px-6 py-3";
const iconButtonCls = "border-0 shadow-none !p-2 min-w-0";

function formatAverageProficiency(value?: number) {
    const proficiency = value ?? 0;
    return `${proficiency.toFixed(1)}%`;
}

export function SkillsTable({ data, deletingSkillId, onEdit, onDelete }: Props) {
    const columns = [
        {
            header: "SKILL",
            render: (skill: Skill) => (
                <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{skill.name}</p>
                    <p className="text-[11px] font-medium text-slate-400 truncate">
                        {skill.description || skill.type}
                    </p>
                </div>
            ),
            className: columnCls,
        },
        {
            header: "CATEGORIA",
            render: (skill: Skill) => <SkillCategoryBadge category={skill.category} />,
            className: columnCls,
        },
        {
            header: "QTD. RECURSOS",
            render: (skill: Skill) => (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800 min-w-[2rem]">
                        {skill.resourcesCount ?? 0}
                    </span>
                    {skill.avatarUrls && skill.avatarUrls.length > 0 && (
                        <div className="flex -space-x-2">
                            {skill.avatarUrls.slice(0, 3).map((url, index) => (
                                <Avatar
                                    key={`${skill.id}-avatar-${index}`}
                                    name={`${skill.name} ${index + 1}`}
                                    photoUrl={url}
                                    size={28}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ),
            className: columnCls,
        },
        {
            header: "NÍVEL MÉDIO",
            render: (skill: Skill) => {
                const proficiency = skill.averageProficiency ?? 0;

                return (
                    <div className="flex flex-col gap-1.5 max-w-[180px]">
                        <span className="text-sm text-slate-700">
                            {formatAverageProficiency(skill.averageProficiency)}
                        </span>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-pink transition-[width] duration-500"
                                style={{ width: `${Math.min(proficiency, 100)}%` }}
                            />
                        </div>
                    </div>
                );
            },
            className: columnCls,
        },
        {
            header: "AÇÕES",
            render: (skill: Skill) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit?.(skill)}
                        className={`${iconButtonCls} text-slate-400 hover:text-slate-700 hover:bg-slate-100`}
                        title="Editar skill"
                        aria-label="Editar skill"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete?.(skill)}
                        disabled={deletingSkillId === skill.id}
                        className={iconButtonCls}
                        title="Excluir skill"
                        aria-label="Excluir skill"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
            className: `${columnCls} text-right`,
        },
    ];

    return (
        <Table<Skill>
            className="table-fixed"
            columns={columns}
            data={data}
            keyExtractor={(skill) => skill.id}
            emptyMessage="Nenhuma skill encontrada"
        />
    );
}
