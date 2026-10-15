import type { Dispatch, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Section } from "@/components/ui";
import { skillsApi } from "@/features/skills";
import { StackInput, type StackItem } from "../StackInput/StackInput";
import type { ProfileFormState } from "../../types/profile";

interface Props {
    form: ProfileFormState;
    stacks: StackItem[];
    setStacks: Dispatch<SetStateAction<StackItem[]>>;
    onSoftSkillsChange: (softSkills: StackItem[]) => void;
    saving: boolean;
    onSave: () => void;
}

export function TalentoDetalheSkillsTab({
    form,
    stacks,
    setStacks,
    onSoftSkillsChange,
    saving,
    onSave,
}: Props) {
    const {
        data: activeSkillsPage,
        isError: skillsError,
    } = useQuery({
        queryKey: ["skills", "active", "assessment"],
        queryFn: () => skillsApi.getActiveSkills(0, 500),
    });
    const activeSkills = activeSkillsPage?.content ?? [];
    const hardSkills = activeSkills.filter(
        (skill) => skill.type === "HARD",
    );
    const softSkills = activeSkills.filter(
        (skill) => skill.type === "SOFT",
    );

    return (
        <div className="flex max-w-3xl flex-col gap-4">
            <Section title="Avaliação de Hard Skills (Admin)">
                {skillsError && (
                    <p className="mb-2 text-sm text-red-600">
                        Não foi possível carregar as hard skills.
                    </p>
                )}
                <StackInput
                    value={stacks}
                    onChange={setStacks}
                    skills={hardSkills}
                />
            </Section>
            <Section title="Avaliação de Soft Skills (Admin)">
                {skillsError && (
                    <p className="mb-2 text-sm text-red-600">
                        Não foi possível carregar as soft skills.
                    </p>
                )}
                <StackInput
                    value={form.softSkills}
                    onChange={onSoftSkillsChange}
                    skills={softSkills}
                />
            </Section>
            <div className="flex flex-wrap items-center gap-3 pt-2">
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
