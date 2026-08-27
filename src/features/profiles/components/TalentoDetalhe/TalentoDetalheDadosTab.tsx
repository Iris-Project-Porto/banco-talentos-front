import { Button, Input, Select, Section } from "@/components/ui";
import { AREA_OPTIONS, EXPERIENCE_OPTIONS, NIVEL_OPTIONS } from "../../profile";
import type { ProfileFormState, UserProfile } from "../../types/profile";
import { ContactAddressFields, type ProfileFormUpdater } from "./ContactAddressFields";
import { MatriculaStatusFields } from "./MatriculaStatusFields";

interface Props {
    form: ProfileFormState;
    profile: UserProfile;
    updateField: ProfileFormUpdater;
    isPendente: boolean;
    saving: boolean;
    onSave: (activate?: boolean) => void;
}

export function TalentoDetalheDadosTab({
    form,
    profile,
    updateField,
    isPendente,
    saving,
    onSave,
}: Props) {
    return (
        <div className="flex max-w-3xl flex-col gap-4">
            <Section title="Matrícula e Status Geral">
                <MatriculaStatusFields
                    form={form}
                    resourceStatus={profile.resourceStatus}
                    updateField={updateField}
                />
            </Section>
            <Section title="Override de nível">
                <Select
                    value={form.levelOverride}
                    onChange={(e) => updateField("levelOverride", e.target.value)}
                    options={NIVEL_OPTIONS}
                />
            </Section>
            <Section title="Identificação">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Select
                        label="Área"
                        value={form.area}
                        onChange={(e) => updateField("area", e.target.value)}
                        options={[{ value: "", label: "-" }, ...AREA_OPTIONS]}
                    />
                    <Select
                        label="Anos de exp."
                        value={String(form.experienceYears)}
                        onChange={(e) => updateField("experienceYears", e.target.value)}
                        options={[{ value: "", label: "-" }, ...EXPERIENCE_OPTIONS]}
                    />
                </div>
                <div className="mt-2">
                    <label className="mb-1 block text-xs text-gray-400">Sobre</label>
                    <textarea
                        value={form.about}
                        onChange={(e) => updateField("about", e.target.value)}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-pink-400"
                    />
                </div>
            </Section>
            <Section title="Contato e Endereço">
                <ContactAddressFields form={form} updateField={updateField} />
            </Section>
            <Section title="Links">
                <Input
                    label="LinkedIn"
                    value={form.linkedinUrl}
                    onChange={(e) => updateField("linkedinUrl", e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                />
                <Input
                    label="GitHub"
                    value={form.githubUrl}
                    onChange={(e) => updateField("githubUrl", e.target.value)}
                    placeholder="https://github.com/..."
                />
            </Section>
            <div className="flex flex-wrap items-center gap-3 pt-2">
                {isPendente && (
                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => onSave(true)}
                        loading={saving}
                        disabled={saving}
                    >
                        {saving ? "Salvando..." : "Salvar e Ativar →"}
                    </Button>
                )}
                <Button
                    type="button"
                    variant={isPendente ? "secondary" : "primary"}
                    onClick={() => onSave(false)}
                    loading={saving}
                    disabled={saving}
                >
                    {saving ? "Salvando..." : "Salvar alterações"}
                </Button>
            </div>
        </div>
    );
}
