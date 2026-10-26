import { Eye } from "lucide-react";
import { Avatar, Badge, ProgressRing, Tag } from "@/components/ui";
import { Table } from "@/components/ui/Table/Table";
import type { Match } from "../../types/types";

interface Props {
    data: Match[];
    onView?: (match: Match) => void;
}

export function MatchTable({ data, onView }: Props) {
    const columns = [
        {
            header: "Ranking",
            className: "w-24 text-center",
            render: (match: Match) => (
                <span className="font-semibold tabular-nums text-slate-700">
                    {match.rankingScore}
                </span>
            ),
        },
        {
            header: "Recurso",
            render: (match: Match) => (
                <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={match.name} photoUrl={match.photoUrl} size={38} />
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-slate-900">{match.name}</p>
                        {match.description && (
                            <p className="mt-0.5 truncate text-xs text-slate-500">
                                {match.description}
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            header: "Squad",
            render: (match: Match) => (
                <p className="whitespace-nowrap text-slate-600">{match.squadName || "—"}</p>
            ),
        },
        {
            header: "Disponibilidade",
            render: (match: Match) => {
                const avail = (match.availability || "").toLowerCase();
                const isAvailable = avail === "available";
                const isWaiting = avail === "waiting";
                const label = isAvailable ? "Disponível" : isWaiting ? "Aguardando" : "Em projeto";
                const variant = isAvailable ? "success" : isWaiting ? "info" : "warning";
                return (
                    <Badge variant={variant}>
                        {label}
                    </Badge>
                );
            },
        },
        {
            header: "Match",
            className: "w-24 text-center",
            render: (match: Match) => (
                <ProgressRing value={match.matchScore} className="mx-auto" />
            ),
        },
        {
            header: "Skills que mais contribuíram",
            render: (match: Match) => (
                <div className="flex flex-wrap gap-1.5">
                    {(match.mainSkills || []).map((skill) => (
                        <Tag key={skill.name} kind="skill">
                            {skill.name} ({skill.contributionPercent}%)
                        </Tag>
                    ))}
                    {(!match.mainSkills || match.mainSkills.length === 0) && (
                        <span className="text-xs text-slate-400">—</span>
                    )}
                </div>
            ),
        },
        {
            header: "Ações",
            className: "text-right",
            render: (match: Match) => (
                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        onClick={() => onView?.(match)}
                        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        title="Visualizar"
                    >
                        <Eye className="size-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={data}
            keyExtractor={(match) => match.id}
            emptyMessage="Nenhum recurso encontrado"
        />
    );
}
