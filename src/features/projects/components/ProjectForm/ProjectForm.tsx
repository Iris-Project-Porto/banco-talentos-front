import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, PageHeader } from "@/components/ui";
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
    initial: Partial<Project> & { id?: string };
    existingProjects?: Pick<Project, "id" | "name">[];
    saving: boolean;
    onSave: (data: ProjectPayload & { id?: string; active?: boolean; initialActive?: boolean }) => void;
    onCancel: () => void;
}

export function ProjectForm({ initial, existingProjects = [], saving, onSave, onCancel }: Props) {
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
            squads: initial.squads ?? [],
        },
    });

    const { handleSubmit, watch } = methods;
    const [name, description] = watch(["name", "description"]);
    const canSave = Boolean(name?.trim() && description?.trim());

    function onSubmit(data: ProjectEditFormInput) {
        if (isEdit) {
            const parsed: ProjectEditFormData = projectEditSchema.parse(data);
            onSave({
                name: parsed.name,
                description: parsed.description,
                id: initial.id,
                active: parsed.status === "ACTIVE",
                initialActive: initial.active ?? true,
                squadIds: (parsed.squads ?? []).map((squad) => squad.id),
            });
            return;
        }

        const parsed = projectSchema.parse(data);
        onSave({
            name: parsed.name,
            description: parsed.description,
            squadIds: (parsed.squads ?? []).map((squad) => squad.id),
        });
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title={isEdit ? "Editar Projeto" : "Cadastrar Projeto"}
                subtitle="Preencha as informações do projeto"
                onBack={onCancel}
                backLabel="Voltar para projetos"
                actions={
                    <>
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
                    </>
                }
            />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
                <ProjectFormTabs active={activeTab} onChange={setActiveTab} />

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {activeTab === "general" && <GeneralDataTab isEdit={isEdit} />}
                        {activeTab === "squads" && <ParticipatingSquadsTab isEdit={isEdit} />}
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
