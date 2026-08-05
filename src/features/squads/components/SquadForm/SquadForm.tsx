import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";
import type { Squad, SquadPayload } from "../../types/types";
import {
    squadSchema,
    type SquadFormData,
} from "../../validations/validations";
import { GeneralDataTab } from "./tabs/GeneralDataTab/GeneralDataTab";
import { SquadFormTabs, type SquadFormTab } from "./SquadFormTabs";
import { SquadResourcesTab } from "./tabs/SquadResourcesTab/SquadResourcesTab";

interface Props {
    initial: Partial<Squad> & { id?: string };
    saving: boolean;
    onSave: (data: SquadPayload & { id?: string; active?: boolean; initialActive?: boolean }) => void;
    onCancel: () => void;
}

export function SquadForm({ initial, saving, onSave, onCancel }: Props) {
    const isEdit = Boolean(initial.id);
    const [activeTab, setActiveTab] = useState<SquadFormTab>("general");

    const methods = useForm<SquadFormData>({
        resolver: zodResolver(squadSchema),
        defaultValues: {
            name: initial.name || "",
            description: initial.description || "",
            portoCoordinator: initial.portoCoordinator || "",
            projectManager: initial.projectManager || "",
            recursos: initial.recursos || [],
        },
    });

    const { handleSubmit, watch } = methods;
    const [name, description, portoCoordinator, projectManager] = watch([
        "name",
        "description",
        "portoCoordinator",
        "projectManager",
    ]);

    const canSave = Boolean(
        name?.trim() && description?.trim() && portoCoordinator?.trim() && projectManager?.trim()
    );

    function onSubmit(data: SquadFormData) {
        const payload: SquadPayload & { id?: string; active?: boolean; initialActive?: boolean } = {
            name: data.name,
            description: data.description,
            portoCoordinator: data.portoCoordinator,
            projectManager: data.projectManager,
            recursoIds: (data.recursos || []).map((r) => r.id),
        };

        if (isEdit) {
            payload.id = initial.id;
            payload.active = initial.active ?? true;
            payload.initialActive = initial.active ?? true;
        }

        onSave(payload);
    }

    return (
        <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        aria-label="Voltar para squads"
                        className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            {isEdit ? "Editar Squad" : "Cadastrar Squad"}
                        </h1>
                        <p className="mt-0.5 text-sm text-slate-400">
                            Preencha as informações da squad
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:justify-end">
                    <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        loading={saving}
                        onClick={handleSubmit(onSubmit)}
                        disabled={!canSave || saving}
                    >
                        Salvar
                    </Button>
                </div>
            </header>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card flex flex-col">
                <SquadFormTabs active={activeTab} onChange={setActiveTab} />

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
                        <div className={activeTab === "general" ? "block" : "hidden"}>
                            <GeneralDataTab />
                        </div>
                        <div className={activeTab === "resources" ? "block" : "hidden"}>
                            <SquadResourcesTab />
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
