import { Trash2 } from "lucide-react";
import { Table, type TableSelection } from "@/components/ui/Table/Table";
import type { Recurso } from "@/features/recursos/types/recurso";

interface Props {
    data: Recurso[];
    emptyMessage?: string;
    onRemove?: (recurso: Recurso) => void;
    selection?: TableSelection<Recurso>;
}

export function SquadResourcesTable({ data, emptyMessage, onRemove, selection }: Props) {
    const columns = [
        {
            key: "recurso",
            header: "Recurso",
            render: (recurso: Recurso) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{recurso.name}</span>
                    <span className="text-xs text-slate-500">{recurso.email}</span>
                </div>
            ),
        },
        {
            key: "jobTitle",
            header: "Cargo/Função",
            render: (recurso: Recurso) => (
                <span className="text-slate-600">{recurso.jobTitle || "—"}</span>
            ),
        },
        {
            key: "actions",
            header: "Ações",
            align: "right" as const,
            render: (recurso: Recurso) => (
                <div className="flex items-center justify-end gap-2">
                    {onRemove && (
                        <button
                            type="button"
                            onClick={() => onRemove(recurso)}
                            className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-md transition-colors"
                            title="Remover"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Table<Recurso>
            columns={columns}
            data={data}
            keyExtractor={(recurso) => recurso.id}
            emptyMessage={emptyMessage}
            selection={selection}
        />
    );
}
