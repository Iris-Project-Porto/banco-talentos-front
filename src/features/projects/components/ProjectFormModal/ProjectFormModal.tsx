import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui";
import type { Project, ProjectPayload } from "../../types/types";
import {
    createProjectSchema,
    createProjectEditSchema,
    projectSchema,
    projectEditSchema,
    type ProjectEditFormInput,
    type ProjectEditFormData,
} from "../../validations/validations";
import { GeneralDataTab } from "./tabs/GeneralDataTab/GeneralDataTab";
import { ProjectFormTabs, type ProjectFormTab } from "./ProjectFormTabs";
import { ParticipatingSquadsTab } from "./tabs/ParticipatingSquadsTab/ParticipatingSquadsTab";

interface Props {
    initial: Partial<ProjectPayload> & { id?: string; active?: boolean };
    existingProjects?: Pick<Project, "id" | "name">[];
    saving: boolean;
    onSave: (data: ProjectPayload & { id?: string; active?: boolean; initialActive?: boolean }) => void;
    onClose: () => void;
}

export function ProjectFormModal({ initial, existingProjects = [], saving, onSave, onClose }: Props) {
    const isEdit = Boolean(initial.id);
    const [activeTab, setActiveTab] = useState<ProjectFormTab>("general");

    const schema = useMemo(
        () =>
            isEdit
                ? createProjectEditSchema(existingProjects, initial.id)
                : createProjectSchema(existingProjects, initial.id),
        [isEdit, existingProjects, initial.id],
    );

    const methods = useForm<ProjectEditFormInput>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: initial.name || "",
            description: initial.description || "",
            status: initial.active === false ? "INACTIVE" : "ACTIVE",
        },
    });

    const { handleSubmit } = methods;

    function onSubmit(data: ProjectEditFormInput) {
        if (isEdit) {
            const parsed: ProjectEditFormData = projectEditSchema.parse(data);
            onSave({
                name: parsed.name,
                description: parsed.description,
                id: initial.id,
                active: parsed.status === "ACTIVE",
                initialActive: initial.active ?? true,
            });
            return;
        }

        const parsed = projectSchema.parse(data);
        onSave({
            name: parsed.name,
            description: parsed.description,
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-login w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200 shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {isEdit ? "Editar projeto" : "Novo projeto"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">Preencha as informações do projeto</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <ProjectFormTabs active={activeTab} onChange={setActiveTab} />

                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="overflow-y-auto flex-1 flex flex-col"
                    >
                        {activeTab === "general" && <GeneralDataTab isEdit={isEdit} />}

                        {activeTab === "squads" && (
                           <ParticipatingSquadsTab isEdit={isEdit} />
                        )}
                    </form>
                </FormProvider>

                <div className="px-7 py-5 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        loading={saving}
                        onClick={handleSubmit(onSubmit)}
                    >
                        {isEdit ? "Salvar alterações" : "Criar projeto"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
