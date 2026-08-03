import { GeneralFields } from "../GeneralFields/GeneralFields";
import { SkillsSection } from "../SkillsSection/SkillsSection";
import { AdditionalInfoFields } from "../AdditionalInfoFields/AdditionalInfoFields";
import { useVagaDependencies } from "../VagaWizard/hooks/useVagaDependencies/useVagaDependencies";

interface Props {
    canEdit: boolean;
    dependencies: ReturnType<typeof useVagaDependencies>;
}

export function VagaDataForm({ canEdit, dependencies }: Props) {
    return (
        <>
            <div className="rounded-xl border border-slate-200 bg-white shadow-card px-7 py-6">
                <GeneralFields canEdit={canEdit} dependencies={dependencies} />
            </div>

            <SkillsSection canEdit={canEdit} />

            <div className="rounded-xl border border-slate-200 bg-white shadow-card px-7 py-6">
                <AdditionalInfoFields canEdit={canEdit} />
            </div>
        </>
    );
}
