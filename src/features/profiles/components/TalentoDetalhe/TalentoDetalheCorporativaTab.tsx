import { Button, Input, Select, Section } from "@/components/ui";
import { ALOCACAO_OPTIONS, REGISTRATION_STATUS_OPTIONS, TRILHA_OPTIONS } from "../../profile";
import type { ProfileFormState } from "../../types/profile";
import type { ProfileFormUpdater } from "./ContactAddressFields";

interface Props {
    form: ProfileFormState;
    updateField: ProfileFormUpdater;
    saving: boolean;
    onSave: () => void;
}

export function TalentoDetalheCorporativaTab({ form, updateField, saving, onSave }: Props) {
    return (
        <div className="grid max-w-3xl grid-cols-1 gap-4">
            <Section title="Identificação Corporativa">
                <Input
                    label="Matrícula"
                    value={form.registrationNumber}
                    onChange={(e) => updateField("registrationNumber", e.target.value)}
                    placeholder="Matrícula"
                />
                <Select
                    label="Status da Matrícula"
                    value={form.registrationStatus}
                    onChange={(e) => updateField("registrationStatus", e.target.value)}
                    options={REGISTRATION_STATUS_OPTIONS}
                />
            </Section>
            <Section title="Alocação e carreira">
                <Select
                    label="Situação de alocação"
                    value={form.allocationStatus}
                    onChange={(e) => updateField("allocationStatus", e.target.value)}
                    options={ALOCACAO_OPTIONS}
                />
                <Select
                    label="Trilha de carreira"
                    value={form.careerPath}
                    onChange={(e) => updateField("careerPath", e.target.value)}
                    options={TRILHA_OPTIONS}
                />
            </Section>
            <div className="flex flex-wrap items-center gap-3">
                <Button
                    type="button"
                    variant="primary"
                    onClick={onSave}
                    loading={saving}
                    disabled={saving}
                >
                    {saving ? "Salvando..." : "Salvar alterações"}
                </Button>
            </div>
        </div>
    );
}
