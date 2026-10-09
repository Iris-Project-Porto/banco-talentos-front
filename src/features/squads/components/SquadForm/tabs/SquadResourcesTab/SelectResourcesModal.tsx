import { useCallback, useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button, Input, Pagination } from "@/components/ui";
import { recursosApi } from "@/features/recursos/api/recursos.api";
import type { Recurso } from "@/features/recursos/types/recurso";
import type { TableSelection } from "@/components/ui/Table/Table";
import { SquadResourcesTable } from "./SquadResourcesTable";

interface Props {
    onClose: () => void;
    onConfirm?: (selected: Recurso[]) => void;
    initialSelected?: Recurso[];
}

const PAGE_SIZE = 7;

export function SelectResourcesModal({ onClose, onConfirm, initialSelected = [] }: Props) {
    const [search, setSearch] = useState("");
    const [selectedRecursos, setSelectedRecursos] = useState<Recurso[]>(initialSelected);
    const [page, setPage] = useState(0);

    const { data } = useQuery({
        queryKey: ['recursos', 'modal', page, PAGE_SIZE, search],
        queryFn: () => recursosApi.listar({ nome: search }, page, PAGE_SIZE),
        placeholderData: keepPreviousData,
    });

    const recursos = data?.content || [];
    const totalPages = data?.totalPages ?? 1;

    function handleSearchChange(value: string) {
        setSearch(value);
        setPage(0);
    }

    const toggleRow = useCallback((recurso: Recurso) => {
        setSelectedRecursos((prev) =>
            prev.some((selected) => selected.id === recurso.id)
                ? prev.filter((selected) => selected.id !== recurso.id)
                : [...prev, recurso],
        );
    }, []);

    const toggleAll = useCallback((checked: boolean) => {
        const visibleIds = recursos.map((r) => r.id);

        setSelectedRecursos((prev) =>
            checked
                ? [
                    ...prev,
                    ...recursos.filter(
                        (r) => !prev.some((selected) => selected.id === r.id),
                    ),
                ]
                : prev.filter((r) => !visibleIds.includes(r.id)),
        );
    }, [recursos]);

    const selectedIds = useMemo(
        () => selectedRecursos.map((r) => r.id),
        [selectedRecursos],
    );

    const selection = useMemo<TableSelection<Recurso>>(() => ({
        selectedKeys: selectedIds,
        onToggleRow: toggleRow,
        onToggleAll: toggleAll,
    }), [selectedIds, toggleRow, toggleAll]);

    function handleConfirm() {
        onConfirm?.(selectedRecursos);
        onClose();
    }

    const selectedCount = selectedRecursos.length;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-login w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-lg font-bold text-slate-900">
                            Selecionar Recursos
                        </h2>
                        <p className="text-sm text-slate-400">Selecione um ou mais recursos para adicionar à squad.</p>
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
                    <div className="relative shrink-0">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                        <Input
                            placeholder="Buscar por nome do recurso"
                            value={search}
                            onChange={(event) => handleSearchChange(event.target.value)}
                            className="pl-9 pr-3"
                        />
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden shrink-0">
                        <SquadResourcesTable
                            data={recursos}
                            emptyMessage="Nenhum recurso encontrado"
                            selection={selection}
                        />
                    </div>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        className="shrink-0"
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
                                ? `Adicionar ${selectedCount} recursos`
                                : `Adicionar ${selectedCount} recurso`}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
