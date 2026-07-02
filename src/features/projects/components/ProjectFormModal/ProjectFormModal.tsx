import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select } from "@/components/ui";
import type { Project, ProjectPayload } from "../../types/types";
import {
    createProjectSchema,
    createProjectEditSchema,
    projectSchema,
    projectEditSchema,
    type ProjectEditFormInput,
    type ProjectEditFormData,
} from "../../validations/validations";

const textareaCls =
    "w-full font-sans text-base rounded-lg px-3.5 py-2.5 outline-none transition-all bg-white border border-slate-300 focus:border-pink focus:shadow-focus-pink text-slate-900 placeholder:text-slate-400 resize-none";

const ErrorMsg = ({ msg }: { msg?: string }) =>
    msg ? <span className="text-xs text-red-500">{msg}</span> : null;

const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Ativo" },
    { value: "INACTIVE", label: "Inativo" },
];

interface Props {
    initial: Partial<ProjectPayload> & { id?: string; active?: boolean };
    existingProjects?: Pick<Project, "id" | "name">[];
    saving: boolean;
    onSave: (data: ProjectPayload & { id?: string; active?: boolean; initialActive?: boolean }) => void;
    onClose: () => void;
}

export function ProjectFormModal({ initial, existingProjects = [], saving, onSave, onClose }: Props) {
    const isEdit = Boolean(initial.id);

    const schema = useMemo(
        () =>
            isEdit
                ? createProjectEditSchema(existingProjects, initial.id)
                : createProjectSchema(existingProjects, initial.id),
        [isEdit, existingProjects, initial.id],
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProjectEditFormInput>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: initial.name || "",
            description: initial.description || "",
            status: initial.active === false ? "INACTIVE" : "ACTIVE",
        },
    });

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

            <div className="relative bg-white rounded-2xl shadow-login w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900">
                        {isEdit ? "Editar projeto" : "Novo projeto"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="overflow-y-auto flex-1 px-7 py-6 flex flex-col gap-5"
                >
                    <Input
                        label="NOME DO PROJETO"
                        placeholder="Ex: Migração de Cloud, Portal do Cliente..."
                        error={errors.name?.message}
                        required
                        {...register("name")}
                    />

                    {isEdit && (
                        <Select
                            label="STATUS"
                            options={STATUS_OPTIONS}
                            {...register("status")}
                        />
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-600">
                            DESCRIÇÃO
                        </label>
                        <textarea
                            className={`${textareaCls} ${errors.description ? "border-red-400" : ""}`}
                            rows={4}
                            placeholder="Descreva brevemente o objetivo do projeto"
                            required
                            {...register("description")}
                        />
                        <ErrorMsg msg={errors.description?.message} />
                    </div>
                </form>

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
