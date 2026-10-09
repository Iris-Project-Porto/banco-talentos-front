import { Input, Select } from "@/components/ui";
import { REGISTRATION_STATUS_OPTIONS, RESOURCE_STATUS_LABELS } from "../../profile";
import type { ProfileFormState } from "../../types/profile";
import type { ProfileFormUpdater } from "./ContactAddressFields";

interface Props {
    form: ProfileFormState;
    resourceStatus?: string;
    updateField: ProfileFormUpdater;
}

export function MatriculaStatusFields({ form, resourceStatus, updateField }: Props) {
    const showRegistrationDetails = form.registrationStatus !== "NOT_REQUIRED";

    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
                <Input
                    label="Status do Recurso"
                    value={RESOURCE_STATUS_LABELS[resourceStatus ?? "AVAILABLE"] ?? "Disponível"}
                    readOnly
                    disabled
                    tabIndex={-1}
                    aria-readonly="true"
                    title="Campo sistêmico — preenchido automaticamente (somente leitura)"
                    className="cursor-default bg-slate-50 text-slate-700"
                />
                <Select
                    label="Status da Matrícula *"
                    value={form.registrationStatus}
                    onChange={(e) => updateField("registrationStatus", e.target.value)}
                    options={REGISTRATION_STATUS_OPTIONS}
                />
                {showRegistrationDetails && (
                    <>
                        <Input
                            label="Nº da Matrícula *"
                            value={form.registrationNumber}
                            onChange={(e) => updateField("registrationNumber", e.target.value)}
                            placeholder="Nº da Matrícula"
                        />
                        <Input
                            label="Data da Solicitação *"
                            type="date"
                            value={form.registrationRequestedAt}
                            onChange={(e) => updateField("registrationRequestedAt", e.target.value)}
                        />
                    </>
                )}
            </div>
            {showRegistrationDetails && (
                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-slate-600">Observações da Matrícula *</span>
                    <textarea
                        className="min-h-[96px] w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-500"
                        value={form.registrationNotes}
                        onChange={(e) => updateField("registrationNotes", e.target.value)}
                    />
                </label>
            )}
        </>
    );
}
