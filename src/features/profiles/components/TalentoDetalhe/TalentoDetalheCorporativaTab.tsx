import { FloatingActionButton } from "@/components/ui";
import type { ProfileFormState, UserProfile } from "../../types/profile";
import type { ProfileFormUpdater } from "./ContactAddressFields";
import { CorporateCard } from "./CorporateCard";
import { MatriculaStatusFields } from "./MatriculaStatusFields";
import { ClientMachinesSection } from "./ClientMachinesSection";
import { ProjectDataSection } from "./ProjectDataSection";
import { TechnicalProposalSection } from "./TechnicalProposalSection";

interface Props {
    profileId: string;
    profile: UserProfile | null;
    form: ProfileFormState;
    updateField: ProfileFormUpdater;
    saving: boolean;
    onSave: () => void;
}

export function TalentoDetalheCorporativaTab({
    profileId,
    profile,
    form,
    updateField,
    saving,
    onSave,
}: Props) {
    const showRegistrationDetails = form.registrationStatus !== "NOT_REQUIRED";

    return (
        <div className="flex max-w-3xl flex-col gap-5 pb-24">
            <CorporateCard title="Matrícula e Status Geral">
                <MatriculaStatusFields
                    form={form}
                    resourceStatus={profile?.resourceStatus}
                    updateField={updateField}
                />
            </CorporateCard>

            {showRegistrationDetails && (
                <>
                    <CorporateCard title="Máquina do Cliente">
                        <ClientMachinesSection
                            profileId={profileId}
                            hasClientMachine={form.hasClientMachine}
                            onHasClientMachineChange={(v) => updateField("hasClientMachine", v)}
                        />
                    </CorporateCard>

                    <CorporateCard title="Dados do Projeto">
                        <ProjectDataSection form={form} updateField={updateField} />
                    </CorporateCard>

                    <CorporateCard title="Proposta Técnica">
                        <TechnicalProposalSection form={form} updateField={updateField} />
                    </CorporateCard>
                </>
            )}

            <FloatingActionButton
                label={saving ? "Salvando..." : "Salvar alterações"}
                loading={saving}
                onClick={onSave}
            />
        </div>
    );
}