import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select } from "@/components/ui";
import { SKILL_CATEGORIES, type Skill, type SkillPayload } from "../../types/types";
import { getSkillCategoryLabel } from "../../utils/skillDisplay";
import {
    createSkillSchema,
    skillSchema,
    type SkillFormData,
    type SkillFormInput,
} from "../../validations/validations";

const textareaCls =
    "w-full font-sans text-base rounded-lg px-3.5 py-2.5 outline-none transition-all bg-white border border-slate-300 focus:border-pink focus:shadow-focus-pink text-slate-900 placeholder:text-slate-400 resize-none";

const TYPE_OPTIONS = [
    { value: "", label: "Selecione o tipo" },
    { value: "HARD", label: "HARD" },
    { value: "SOFT", label: "SOFT" },
];

const CATEGORY_OPTIONS = [
    { value: "", label: "Selecione a categoria" },
    ...SKILL_CATEGORIES.map((category) => ({
        value: category,
        label: getSkillCategoryLabel(category),
    })),
];

const ErrorMsg = ({ msg }: { msg?: string }) =>
    msg ? <span className="text-xs text-red-500">{msg}</span> : null;

interface Props {
    initial: Partial<SkillPayload> & { id?: string };
    existingSkills?: Pick<Skill, "id" | "name">[];
    saving: boolean;
    onSave: (data: SkillPayload & { id?: string }) => void;
    onClose: () => void;
}

export function SkillFormModal({ initial, existingSkills = [], saving, onSave, onClose }: Props) {
    const isEdit = Boolean(initial.id);

    const schema = useMemo(
        () => createSkillSchema(existingSkills, initial.id),
        [existingSkills, initial.id],
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SkillFormInput>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: initial.name || "",
            type: initial.type || "",
            description: initial.description || "",
            category: initial.category || "",
        },
    });

    function onSubmit(data: SkillFormInput) {
        const parsed: SkillFormData = skillSchema.parse(data);
        onSave({
            name: parsed.name,
            type: parsed.type,
            description: parsed.description || undefined,
            category: parsed.category,
            id: initial.id,
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-login w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {isEdit ? "Editar Skill" : "Cadastrar Skill"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            {isEdit
                                ? "Atualize os dados da competência"
                                : "Adicione uma nova competência ao catálogo"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                        aria-label="Fechar modal"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto flex-1">
                    <div className="px-7 py-6 flex flex-col gap-5">
                        <Input
                            label="NOME DA SKILL"
                            placeholder="Ex: Kubernetes, Lógica de Programação, Figma..."
                            error={errors.name?.message}
                            {...register("name")}
                        />

                        <Select
                            label="TIPO"
                            options={TYPE_OPTIONS}
                            error={errors.type?.message}
                            {...register("type")}
                        />

                        <Select
                            label="CATEGORIA"
                            options={CATEGORY_OPTIONS}
                            error={errors.category?.message}
                            {...register("category")}
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-600">
                                DESCRIÇÃO DA COMPETÊNCIA
                            </label>
                            <textarea
                                className={`${textareaCls} ${errors.description ? "border-red-400" : ""}`}
                                rows={4}
                                placeholder="Descreva brevemente o que compõe essa skill e quais os critérios para avaliação"
                                {...register("description")}
                            />
                            <ErrorMsg msg={errors.description?.message} />
                        </div>
                    </div>

                    <div className="px-7 py-5 border-t border-slate-200 flex items-center justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" loading={saving}>
                            {isEdit ? "Salvar alterações" : "Salvar Skill"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
