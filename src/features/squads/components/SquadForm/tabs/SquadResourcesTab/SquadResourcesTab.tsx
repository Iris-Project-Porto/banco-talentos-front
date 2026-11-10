import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Button, ConfirmModal } from "@/components/ui";
import { SquadResourcesTable } from "./SquadResourcesTable";
import { SelectResourcesModal } from "./SelectResourcesModal";
import { EditSquadResourceModal } from "./EditSquadResourceModal";
import type { SquadFormData } from "../../../../validations/validations";
import type { Recurso } from "@/features/recursos/types/recurso";

interface Props {
    onBack?: () => void;
}

export function SquadResourcesTab({ onBack }: Props) {
    const { control, setValue } = useFormContext<SquadFormData>();
    const recursos = useWatch({ control, name: "recursos" }) ?? [];

    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
    const [recursoToRemove, setRecursoToRemove] = useState<Recurso | null>(null);
    const [editingRecurso, setEditingRecurso] = useState<Recurso | null>(null);

    const existingIds = useMemo(() => recursos.map((r) => r.id), [recursos]);

    function handleAddRecursos(selected: Recurso[]) {
        const newRecursos = [...recursos];
        let addedCount = 0;
        let duplicateCount = 0;

        selected.forEach((recurso) => {
            const isDuplicate = newRecursos.some((r) => r.id === recurso.id);
            if (!isDuplicate) {
                newRecursos.push({
                    id: recurso.id,
                    name: recurso.name,
                    email: recurso.email,
                    jobTitle: recurso.jobTitle,
                });
                addedCount++;
            } else {
                duplicateCount++;
            }
        });

        if (addedCount > 0) {
            setValue("recursos", newRecursos, { shouldDirty: true });
        }

        if (duplicateCount > 0) {
            toast.error(
                duplicateCount === 1
                    ? "O recurso selecionado já está vinculado à squad."
                    : `${duplicateCount} recursos já estão vinculados à squad.`,
            );
        } else if (addedCount > 0) {
            toast.success(
                addedCount === 1
                    ? "Recurso adicionado com sucesso."
                    : `${addedCount} recursos adicionados com sucesso.`,
            );
        }
    }

    function confirmRemove(recurso: Recurso) {
        setRecursoToRemove(recurso);
    }

    function handleRemove() {
        if (!recursoToRemove) return;

        const newRecursos = recursos.filter((r) => r.id !== recursoToRemove.id);
        setValue("recursos", newRecursos, { shouldDirty: true });
        setRecursoToRemove(null);
        toast.success("Recurso removido da squad.");
    }

    function handleSaveEditedResource(recurso: Recurso, newJobTitle: string) {
        const updated = recursos.map((r) =>
            r.id === recurso.id ? { ...r, jobTitle: newJobTitle } : r,
        );
        setValue("recursos", updated, { shouldDirty: true });
        setEditingRecurso(null);
        toast.success("Cargo do recurso atualizado com sucesso.");
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex flex-col gap-1">
                    <h2 className="text-base font-semibold text-slate-900">
                        Recursos Vinculados
                    </h2>
                    <p className="text-sm text-slate-500">
                        Gerencie os recursos que fazem parte desta squad.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsSelectModalOpen(true)}
                >
                    <Plus className="w-4 h-4" />
                    Adicionar Recurso
                </Button>
            </div>

            <div className="p-6 flex-1 bg-slate-50/50 flex flex-col justify-between gap-6">
                <div className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-sm">
                    <SquadResourcesTable
                        data={recursos as Recurso[]}
                        emptyMessage="Nenhum recurso vinculado a esta squad."
                        onEdit={(recurso) => setEditingRecurso(recurso)}
                        onRemove={confirmRemove}
                    />
                </div>

                {onBack && (
                    <div className="flex justify-start pt-2">
                        <Button type="button" variant="secondary" onClick={onBack}>
                            Voltar: Dados Gerais
                        </Button>
                    </div>
                )}
            </div>

            {isSelectModalOpen && (
                <SelectResourcesModal
                    onClose={() => setIsSelectModalOpen(false)}
                    onConfirm={handleAddRecursos}
                    existingIds={existingIds}
                />
            )}

            {!!editingRecurso && (
                <EditSquadResourceModal
                    recurso={editingRecurso}
                    onClose={() => setEditingRecurso(null)}
                    onSave={handleSaveEditedResource}
                />
            )}

            {!!recursoToRemove && (
                <ConfirmModal
                    title="Remover Recurso"
                    message={`Tem certeza que deseja remover o recurso "${recursoToRemove?.name}" da squad?`}
                    confirmLabel="Remover"
                    onConfirm={handleRemove}
                    onClose={() => setRecursoToRemove(null)}
                />
            )}
        </div>
    );
}
