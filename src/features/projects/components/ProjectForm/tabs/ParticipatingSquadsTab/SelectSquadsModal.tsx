import { useCallback, useEffect, useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { Button, Input, Pagination } from "@/components/ui";
import { Squad } from "@/features/squads/types/types";
import { ParticipatingSquadsTable } from "./ParticipatingSquadsTable";
import type { TableSelection } from "@/components/ui/Table/Table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { squadsApi } from "@/features/squads";

interface Props {
    onClose: () => void;
    onConfirm?: (selected: Squad[]) => void;
}

export function SelectSquadsModal({  onClose, onConfirm }: Props) {
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const { data, isLoading } = useQuery({
        queryKey: ['squads', page, search],
        queryFn: () => squadsApi.getActive({ page, size: 10, search }),
        placeholderData: keepPreviousData,
    });
    const squads = data?.content || [];
    const totalPages = data?.totalPages ?? 1;
    useEffect(() => setPage(0), [search]);


    const toggleRow = useCallback((squad: Squad) => {
        setSelectedIds((prev) =>
            prev.includes(squad.id)
                ? prev.filter((id) => id !== squad.id)
                : [...prev, squad.id],
        );
    }, []);

    const toggleAll = useCallback((checked: boolean) => {
        const visibleIds = squads.map((squad) => squad.id);
        setSelectedIds((prev) =>
            checked
                ? Array.from(new Set([...prev, ...visibleIds]))
                : prev.filter((id) => !visibleIds.includes(id)),
        );
    }, [squads]);

    const selection = useMemo<TableSelection<Squad>>(() => ({
        selectedKeys: selectedIds,
        onToggleRow: toggleRow,
        onToggleAll: toggleAll,
    }), [selectedIds, toggleRow, toggleAll]);

    function handleConfirm() {
        const selected = squads.filter((squad) => selectedIds.includes(squad.id));
        onConfirm?.(selected);
        onClose();
    }

    const selectedCount = selectedIds.length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-login w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-lg font-bold text-slate-900">
                            Selecionar Squads
                        </h2>
                        <p className="text-sm text-slate-400">Selecione uma ou mais squads para adicionar ao projeto.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-7 py-5 flex flex-col gap-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                        <Input
                            placeholder="Buscar por nome da squad"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="pl-9 pr-3"
                        />
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <ParticipatingSquadsTable
                            data={squads}
                            emptyMessage="Nenhuma squad encontrada"
                            selection={selection}
                        />
                    </div>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>

                <div className="px-7 py-5 border-t border-slate-200 flex items-center justify-between shrink-0">
                    <p className="text-sm text-slate-500">
                        Total selecionados: <span className="font-semibold text-slate-900">{selectedCount}</span>
                    </p>

                    <div className="flex items-center gap-3">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            disabled={selectedCount === 0}
                            onClick={handleConfirm}
                        >
                            {selectedCount > 1
                                ? `Adicionar ${selectedCount} squads`
                                : `Adicionar ${selectedCount} squad`}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
