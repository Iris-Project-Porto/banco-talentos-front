import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui";
import { type CreateSkillPayload } from "../../types/skills";
import { skillSchema, type SkillFormData, type SkillFormInput } from "../../validations/validations";

const inputCls =
    "w-full font-sans text-base rounded-lg px-3.5 py-2.5 outline-none transition-all bg-white border border-slate-300 focus:border-pink focus:shadow-focus-pink text-slate-900 placeholder:text-slate-400";

const ErrorMsg = ({ msg }: { msg?: string }) =>
    msg ? <span className="text-xs text-red-500">{msg}</span> : null;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">{label}</label>
            {children}
        </div>
    );
}

interface Props {
    initial: Partial<CreateSkillPayload> & { id?: string };
    saving: boolean;
    onSave: (data: CreateSkillPayload & { id?: string }) => void;
    onClose: () => void;
}

export function SkillFormModal({ initial, saving, onSave, onClose }: Props) {
    const isEdit = Boolean(initial.id);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SkillFormInput>({
        resolver: zodResolver(skillSchema),
        defaultValues: {
            name: initial.name || "",
            type: initial.type || "",
            importanceWeight: initial.importanceWeight ?? 5,
        },
    });

    const importanceWeight = watch("importanceWeight");

    function onSubmit(data: SkillFormInput) {
        const parsed: SkillFormData = skillSchema.parse(data);
        onSave({ ...parsed, id: initial.id });
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
                        <Field label="Nome da Skill">
                            <input
                                className={`${inputCls} ${errors.name ? "border-red-400" : ""}`}
                                placeholder="Ex: Kubernetes, Lógica de Programação, Figma..."
                                {...register("name")}
                            />
                            <ErrorMsg msg={errors.name?.message} />
                        </Field>

                        <Field label="Tipo">
                            <select
                                className={`${inputCls} ${errors.type ? "border-red-400" : ""}`}
                                {...register("type")}
                            >
                                <option value="">Selecione o tipo</option>
                                <option value="HARD">Hard Skill</option>
                                <option value="SOFT">Soft Skill</option>
                            </select>
                            <ErrorMsg msg={errors.type?.message} />
                        </Field>

                        <Field label={`Importância (${importanceWeight})`}>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink"
                                {...register("importanceWeight")}
                            />
                            <p className="text-xs text-slate-500">0 (baixa) a 10 (alta)</p>
                            <ErrorMsg msg={errors.importanceWeight?.message} />
                        </Field>
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
