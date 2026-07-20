import { Pencil, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar/Avatar";
import { Table } from "@/components/ui/Table/Table";
import { SkillCategoryBadge } from "../SkillCategoryBadge/SkillCategoryBadge";
import type { Skill } from "../../types/types";

interface Props {
    data: Skill[];
    deletingSkillId?: string | null;
    onEdit?: (skill: Skill) => void;
    onDelete?: (skill: Skill) => void;
}

const MAX_VISIBLE_AVATARS = 2;

function getResourcesTotal(skill: Skill) {
    const avatarCount = skill.avatars?.length ?? 0;
    return skill.resourcesCount ?? avatarCount;
}

function shouldShowMoreResources(skill: Skill) {
    const avatarCount = skill.avatars?.length ?? 0;
    const total = getResourcesTotal(skill);
    return total > MAX_VISIBLE_AVATARS || avatarCount > MAX_VISIBLE_AVATARS;
}

function ResourcesCell({ skill }: { skill: Skill }) {
    const avatars = skill.avatars ?? [];
    const total = getResourcesTotal(skill);
    const showMore = shouldShowMoreResources(skill);
    const visibleAvatars = avatars.slice(0, MAX_VISIBLE_AVATARS);

    return (
        <div className="flex items-center gap-2.5">
            <span className="font-semibold text-slate-900 tabular-nums shrink-0">{total}</span>

            {(visibleAvatars.length > 0 || showMore) && (
                <div className="flex items-center -space-x-2">
                    {visibleAvatars.map((avatar, index) => (
                        <Avatar
                            key={`${skill.id}-avatar-${index}`}
                            name={avatar.type === "INITIALS" && avatar.value ? avatar.value : `${skill.name} ${index + 1}`}
                            photoUrl={avatar.type === "PHOTO" ? avatar.value : undefined}
                            size={28}
                        />
                    ))}

                    {showMore && (
                        <div
                            className="size-7 rounded-full flex items-center justify-center shrink-0 bg-slate-100 border-2 border-white text-slate-500 text-sm font-semibold leading-none"
                            aria-label="Mais recursos"
                        >
                            +
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function formatAverageProficiency(value?: number) {
    const proficiency = value ?? 0;
    return `${proficiency.toFixed(1)}%`;
}

export function SkillsTable({ data, deletingSkillId, onEdit, onDelete }: Props) {
    const columns = [
        {
            header: "Skill",
            render: (skill: Skill) => (
                <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{skill.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                        {skill.type}
                    </p>
                </div>
            ),
        },
        {
            header: "Categoria",
            render: (skill: Skill) => <SkillCategoryBadge category={skill.category} />,
        },
        {
            header: "Qtd. Recursos",
            render: (skill: Skill) => <ResourcesCell skill={skill} />,
        },
        {
            header: "Nível Médio",
            render: (skill: Skill) => {
                const proficiency = skill.averageProficiency ?? 0;

                return (
                    <div className="flex flex-col gap-1.5 max-w-[180px]">
                        <span>{formatAverageProficiency(skill.averageProficiency)}</span>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-pink transition-[width] duration-500"
                                style={{ width: `${Math.min(proficiency, 100)}%` }}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Ações",
            className: "text-right",
            render: (skill: Skill) => (
                <div className="flex items-center justify-end gap-1">
                    <button
                        type="button"
                        onClick={() => onEdit?.(skill)}
                        className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors p-1.5 rounded-md"
                        title="Detalhes/Editar"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete?.(skill)}
                        disabled={deletingSkillId === skill.id}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-400"
                        title="Excluir skill"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={data}
            keyExtractor={(skill) => skill.id}
            emptyMessage="Nenhuma skill encontrada"
        />
    );
}
