import { Pencil, Trash2 } from "lucide-react";
import { Table, type TableSelection } from "@/components/ui/Table/Table";
import type { Recurso } from "@/features/recursos/types/recurso";

interface Props {
    data: Recurso[];
    emptyMessage?: string;
    onEdit?: (recurso: Recurso) => void;
    onRemove?: (recurso: Recurso) => void;
    selection?: TableSelection<Recurso>;
    existingIds?: string[];
}

export function SquadResourcesTable({
    data,
    emptyMessage,
    onEdit,
    onRemove,
    selection,
    existingIds = [],
}: Props) {
    const hasActions = Boolean(onEdit || onRemove);

    const columns = [
        {
            key: "recurso",
            header: "Recurso",
            render: (recurso: Recurso) => {
                const isLinked = existingIds.includes(recurso.id);
                return (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900">{recurso.name}</span>
                            {isLinked && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Já vinculado
                                </span>
                            )}
                        </div>
                        {recurso.email && <span className="text-xs text-slate-500">{recurso.email}</span>}
                    </div>
                );
            },
        },
        {
            key: "jobTitle",
            header: "Cargo/Função",
            render: (recurso: Recurso) => (
                <span className="text-slate-600">{recurso.jobTitle || "—"}</span>
            ),
        },
        ...(hasActions
            ? [
                {
                    key: "actions",
                    header: "Ações",
                    align: "right" as const,
                    render: (recurso: Recurso) => (
                        <div className="flex items-center justify-end gap-2">
                            {onEdit && (
                                <button
                                    type="button"
                                    onClick={() => onEdit(recurso)}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-md transition-colors"
                                    title="Editar"
                                    aria-label={`Editar ${recurso.name}`}
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            )}
                            {onRemove && (
                                <button
                                    type="button"
                                    onClick={() => onRemove(recurso)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-md transition-colors"
                                    title="Remover"
                                    aria-label={`Remover ${recurso.name}`}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ),
                },
            ]
            : []),
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
