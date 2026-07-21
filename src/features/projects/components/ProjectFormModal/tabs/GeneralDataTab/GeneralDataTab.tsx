import { useFormContext } from "react-hook-form";
import { Input, Select } from "@/components/ui";
import type { ProjectEditFormInput } from "../../../../validations/validations";

const textareaCls =
    "w-full font-sans text-base rounded-lg px-3.5 py-2.5 outline-none transition-all bg-white border border-slate-300 focus:border-pink focus:shadow-focus-pink text-slate-900 placeholder:text-slate-400 resize-none";

const ErrorMsg = ({ msg }: { msg?: string }) =>
    msg ? <span className="text-xs text-red-500">{msg}</span> : null;

const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Ativo" },
    { value: "INACTIVE", label: "Inativo" },
];

interface Props {
    isEdit: boolean;
}

export function GeneralDataTab({ isEdit }: Props) {
    const {
        register,
        formState: { errors },
    } = useFormContext<ProjectEditFormInput>();

    return (
        <div className="flex-1 px-7 py-6 flex flex-col gap-5">
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
        </div>
    );
}
