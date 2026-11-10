import { useCallback, useMemo, useState } from "react";
import { SearchIcon, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button, Input, Pagination } from "@/components/ui";
import { profilesApi, type UserProfile } from "@/features/profiles";
import type { Recurso } from "@/features/recursos/types/recurso";
import type { TableSelection } from "@/components/ui/Table/Table";
import { SquadResourcesTable } from "./SquadResourcesTable";

interface Props {
    onClose: () => void;
    onConfirm?: (selected: Recurso[]) => void;
    initialSelected?: Recurso[];
    existingIds?: string[];
}

const PAGE_SIZE = 7;

export function SelectResourcesModal({
    onClose,
    onConfirm,
    initialSelected = [],
    existingIds = [],
}: Props) {
    const [search, setSearch] = useState("");
    const [selectedRecursos, setSelectedRecursos] = useState<Recurso[]>(initialSelected);
    const [page, setPage] = useState(0);

    const { data, isLoading } = useQuery({
        queryKey: ["profiles", "active", "modal-selection"],
        queryFn: () => profilesApi.getAtivos(0, 200),
        staleTime: 5 * 60_000,
    });

    const allRecursos = useMemo<Recurso[]>(() => {
        const profiles: UserProfile[] = data?.content || [];
        return profiles.map((p) => ({
            id: p.id,
            name: p.name || "",
            email: p.email || "",
            jobTitle: p.jobTitle || "",
            photoUrl: p.photoUrl,
            status: p.status || "ACTIVE",
            statusRecurso: (p.resourceStatus as unknown as Recurso["statusRecurso"]) || "AVAILABLE",
            statusMatricula: (p.registrationStatus as unknown as Recurso["statusMatricula"]) || "NOT_REQUIRED",
            possuiMaquinaCliente: Boolean(p.hasClientMachine),
            maquinas: [],
        }));
    }, [data?.content]);

    const filteredRecursos = useMemo(() => {
        if (!search.trim()) return allRecursos;
        const q = search.trim().toLowerCase();
        return allRecursos.filter(
            (r) =>
                r.name.toLowerCase().includes(q) ||
                r.email.toLowerCase().includes(q) ||
                (r.jobTitle && r.jobTitle.toLowerCase().includes(q)),
        );
    }, [allRecursos, search]);

    const totalPages = Math.max(1, Math.ceil(filteredRecursos.length / PAGE_SIZE));
    const visibleRecursos = useMemo(() => {
        const start = page * PAGE_SIZE;
        return filteredRecursos.slice(start, start + PAGE_SIZE);
    }, [filteredRecursos, page]);

    function handleSearchChange(value: string) {
        setSearch(value);
        setPage(0);
    }

    const toggleRow = useCallback(
        (recurso: Recurso) => {
            if (existingIds.includes(recurso.id)) {
                toast.error(`O recurso "${recurso.name}" já está vinculado à squad.`);
                return;
            }

            setSelectedRecursos((prev) =>
                prev.some((selected) => selected.id === recurso.id)
                    ? prev.filter((selected) => selected.id !== recurso.id)
                    : [...prev, recurso],
            );
        },
        [existingIds],
    );

    const toggleAll = useCallback(
        (checked: boolean) => {
            const selectableRows = visibleRecursos.filter((r) => !existingIds.includes(r.id));
            const selectableIds = selectableRows.map((r) => r.id);

            setSelectedRecursos((prev) =>
                checked
                    ? [
                        ...prev,
                        ...selectableRows.filter(
                            (r) => !prev.some((selected) => selected.id === r.id),
                        ),
                    ]
                    : prev.filter((r) => !selectableIds.includes(r.id)),
            );
        },
        [visibleRecursos, existingIds],
    );

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
        const finalSelected = selectedRecursos.filter((r) => !existingIds.includes(r.id));
        onConfirm?.(finalSelected);
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
                            placeholder="Buscar por nome, e-mail ou cargo"
                            value={search}
                            onChange={(event) => handleSearchChange(event.target.value)}
                            className="pl-9 pr-3"
                        />
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden shrink-0 min-h-[220px]">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                                <Loader2 className="w-6 h-6 animate-spin text-pink" />
                                <span className="text-sm">Carregando recursos...</span>
                            </div>
                        ) : (
                            <SquadResourcesTable
                                data={visibleRecursos}
                                emptyMessage="Nenhum recurso encontrado"
                                selection={selection}
                                existingIds={existingIds}
                            />
                        )}
                    </div>

                    {!isLoading && totalPages > 1 && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            className="shrink-0"
                        />
                    )}
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
