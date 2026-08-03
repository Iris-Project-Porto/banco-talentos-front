import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Button, Input, Select } from "@/components/ui";
import { authApi } from "@/features/auth/api/auth.api";
import { formatCpf, formatEmail } from "@/utils/masks";
import {
    resourceCreateSchema,
    type ResourceCreateFormData,
    type ResourceCreatePayload,
} from "../../validations/resourceCreate";

interface Props {
    saving: boolean;
    onSave: (data: ResourceCreatePayload) => void;
    onClose: () => void;
}

export function ResourceCreateModal({ saving, onSave, onClose }: Props) {
    const { data: groupsData, isLoading: loadingGroups } = useQuery({
        queryKey: ["groups", "resource-create"],
        queryFn: () => authApi.getGroups(0, 100),
    });

    const groups = groupsData?.content ?? [];
    const groupOptions = loadingGroups
        ? [{ value: "", label: "Carregando grupos..." }]
        : [
              { value: "", label: "Selecione o grupo" },
              ...groups.map((g: { id: string; name: string }) => ({ value: g.id, label: g.name })),
          ];

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ResourceCreateFormData>({
        resolver: zodResolver(resourceCreateSchema),
        defaultValues: { name: "", email: "", cpf: "", groupId: "" },
    });

    const emailRegister = register("email");
    const cpfRegister = register("cpf");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-login">
                <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-7 py-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Cadastra Recurso</h2>
                        <p className="mt-0.5 text-sm text-slate-400">Cadastre um novo recurso na plataforma</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xl leading-none text-slate-400 hover:text-slate-600"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSave)} className="flex-1 overflow-y-auto px-7 py-6">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Dados do recurso
                    </p>
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Nome completo *"
                            placeholder="Digite o nome completo"
                            {...register("name")}
                            error={errors.name?.message}
                        />
                        <Input
                            label="E-mail corporativo *"
                            type="email"
                            placeholder="usuario@empresa.com"
                            {...emailRegister}
                            onChange={(e) => {
                                const formatted = formatEmail(e.target.value);
                                e.target.value = formatted;
                                emailRegister.onChange(e);
                                setValue("email", formatted, { shouldValidate: true });
                            }}
                            error={errors.email?.message}
                        />
                        <Input
                            label="CPF *"
                            placeholder="000.000.000-00"
                            inputMode="numeric"
                            maxLength={14}
                            {...cpfRegister}
                            onChange={(e) => {
                                const formatted = formatCpf(e.target.value);
                                e.target.value = formatted;
                                cpfRegister.onChange(e);
                                setValue("cpf", formatted, { shouldValidate: true });
                            }}
                            error={errors.cpf?.message}
                        />
                        <Select
                            label="Grupo *"
                            options={groupOptions}
                            disabled={loadingGroups}
                            {...register("groupId")}
                            error={errors.groupId?.message}
                        />
                        <p className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                            Após o cadastro, o recurso receberá um e-mail com as credenciais de acesso. Demais
                            informações serão preenchidas nas próximas etapas.
                        </p>
                    </div>
                </form>

                <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 px-7 py-5">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        loading={saving}
                        onClick={handleSubmit(onSave)}
                    >
                        Cadastrar
                    </Button>
                </div>
            </div>
        </div>
    );
}
