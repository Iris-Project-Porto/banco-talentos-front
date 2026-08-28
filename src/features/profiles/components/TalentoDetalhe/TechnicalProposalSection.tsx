import { Input, Select } from "@/components/ui";
import { TECHNICAL_PROPOSAL_STATUS_OPTIONS } from "../../profile";
import type { ProfileFormState } from "../../types/profile";
import type { ProfileFormUpdater } from "./ContactAddressFields";

interface Props {
    form: ProfileFormState;
    updateField: ProfileFormUpdater;
}

export function TechnicalProposalSection({ form, updateField }: Props) {
    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Select
                    label="Status da Proposta Técnica *"
                    value={form.technicalProposalStatus}
                    onChange={(e) => updateField("technicalProposalStatus", e.target.value)}
                    options={[
                        { value: "", label: "Selecione" },
                        ...TECHNICAL_PROPOSAL_STATUS_OPTIONS,
                    ]}
                />
                <Input
                    label="Número da Proposta Técnica *"
                    value={form.technicalProposalNumber}
                    onChange={(e) => updateField("technicalProposalNumber", e.target.value)}
                    placeholder="Número da Proposta Técnica"
                />
                <Input
                    label="Data do Envio"
                    type="date"
                    value={form.technicalProposalSentAt}
                    onChange={(e) => updateField("technicalProposalSentAt", e.target.value)}
                />
            </div>
            <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-slate-600">Observações</span>
                <textarea
                    className="min-h-[96px] w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-500"
                    value={form.technicalProposalNotes}
                    onChange={(e) => updateField("technicalProposalNotes", e.target.value)}
                />
            </label>
        </>
    );
}
