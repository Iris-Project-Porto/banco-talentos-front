import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Button, ConfirmModal } from "@/components/ui";
import { SquadResourcesTable } from "./SquadResourcesTable";
import { SelectResourcesModal } from "./SelectResourcesModal";
import type { SquadFormData } from "../../../../validations/validations";
import type { Recurso } from "@/features/recursos/types/recurso";

export function SquadResourcesTab() {
    const { watch, setValue } = useFormContext<SquadFormData>();
    const recursos = watch("recursos") || [];

    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
    const [recursoToRemove, setRecursoToRemove] = useState<Recurso | null>(null);

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
            toast.error(`${duplicateCount} recurso(s) já pertencem à squad e não foram adicionados novamente.`);
        } else if (addedCount > 0) {
            toast.success(`${addedCount} recurso(s) adicionado(s) com sucesso.`);
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

            <div className="p-6 flex-1 bg-slate-50/50">
                <div className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-sm">
                    <SquadResourcesTable
                        data={recursos as Recurso[]}
                        emptyMessage="Nenhum recurso vinculado a esta squad."
                        onRemove={confirmRemove}
                    />
                </div>
            </div>

            {isSelectModalOpen && (
                <SelectResourcesModal
                    onClose={() => setIsSelectModalOpen(false)}
                    onConfirm={handleAddRecursos}
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
