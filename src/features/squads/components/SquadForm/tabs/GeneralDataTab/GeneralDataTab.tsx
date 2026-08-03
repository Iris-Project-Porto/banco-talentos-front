import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui";
import type { SquadFormData } from "../../../../validations/validations";

export function GeneralDataTab() {
    const {
        register,
        formState: { errors },
    } = useFormContext<SquadFormData>();

    return (
        <div className="p-6">
            <div className="flex flex-col gap-6 max-w-3xl">
                <Input
                    label="Nome da Squad"
                    placeholder="Digite o nome da squad"
                    {...register("name")}
                    error={errors.name?.message}
                />

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Descrição</label>
                    <textarea
                        placeholder="Descreva o propósito e os objetivos da squad"
                        rows={4}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none transition-colors hover:border-slate-300 focus:border-pink focus:ring-4 focus:ring-pink/10 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed resize-y min-h-[100px]"
                        {...register("description")}
                    />
                    {errors.description?.message && (
                        <p className="text-sm text-red-500">{errors.description.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                        label="Coordenador Porto"
                        placeholder="Nome do coordenador"
                        {...register("portoCoordinator")}
                        error={errors.portoCoordinator?.message}
                    />

                    <Input
                        label="Project Manager"
                        placeholder="Nome do PM"
                        {...register("projectManager")}
                        error={errors.projectManager?.message}
                    />
                </div>
            </div>
        </div>
    );
}
