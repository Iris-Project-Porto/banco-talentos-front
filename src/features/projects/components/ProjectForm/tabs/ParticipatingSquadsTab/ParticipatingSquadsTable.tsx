import { ReactNode, useMemo } from "react";
import { Trash2 } from "lucide-react";
import { Table, type TableSelection } from "@/components/ui/Table/Table";
import { Squad } from "@/features/squads/types/types";

interface SquadColumn {
    header: string;
    className?: string;
    render: (squad: Squad) => ReactNode;
}

interface Props {
    data: Squad[];
    onDelete?: (squad: Squad) => void;
    onEdit?: (squad: Squad) => void;
    selection?: TableSelection<Squad>;
    emptyMessage?: string;
}

const squadKey = (squad: Squad) => squad.id;

export function ParticipatingSquadsTable({ data, onDelete, selection, emptyMessage }: Props) {
    const hasSelection = Boolean(selection);
    const columns = useMemo<SquadColumn[]>(() => {
        const baseColumns: SquadColumn[] = [
            {
                header: "Squad",
                render: (squad) => (
                    <p className="font-bold text-slate-900 truncate">{squad.name}</p>
                ),
            },
            {
                header: "Liderança",
                render: (squad) => (
                    <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-slate-800 text-xs" title="Project Manager">PM: {squad.projectManager}</span>
                        <span className="text-slate-500 text-xs" title="Coordenador Porto">Coord: {squad.portoCoordinator}</span>
                    </div>
                ),
            },
            {
                header: "Membros",
                className: "text-center",
                render: (squad) => (
                    <span className="text-slate-600">{squad.members ?? 0}</span>
                ),
            },
        ];

        if (hasSelection) return baseColumns;

        return [
            ...baseColumns,
            {
                header: "Ações",
                className: "text-right",
                render: (squad) => (
                    <div className="flex items-center justify-end gap-1">
                        <button
                            type="button"
                            onClick={() => onDelete?.(squad)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors p-1.5 rounded-md"
                            title="Remover squad do projeto"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ),
            },
        ];
    }, [hasSelection, onDelete]);

    return (
        <Table
            columns={columns}
            data={data}
            keyExtractor={squadKey}
            selection={selection}
            emptyMessage={emptyMessage ?? "Nenhuma squad adicionada"}
        />
    );
}
