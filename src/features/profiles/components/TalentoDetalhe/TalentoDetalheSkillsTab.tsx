import { useState, type Dispatch, type SetStateAction } from "react";
import { Button, Select, Section } from "@/components/ui";
import { StackInput, type StackItem } from "../StackInput/StackInput";
import { SOFTSKILLS_LIST } from "../../profile";
import type { ProfileFormState } from "../../types/profile";

interface Props {
    form: ProfileFormState;
    stacks: StackItem[];
    setStacks: Dispatch<SetStateAction<StackItem[]>>;
    saving: boolean;
    onAddSoftSkill: (name: string, level: number) => void;
    onRemoveSoftSkill: (name: string) => void;
    onSave: () => void;
}

export function TalentoDetalheSkillsTab({
    form,
    stacks,
    setStacks,
    saving,
    onAddSoftSkill,
    onRemoveSoftSkill,
    onSave,
}: Props) {
    const [selectedSoftSkill, setSelectedSoftSkill] = useState("");
    const [selectedSoftLevel, setSelectedSoftLevel] = useState<number | "">("");

    const availableSoftSkills = SOFTSKILLS_LIST.filter(
        (skill) => !form.softSkills.some((s) => s.name === skill),
    );

    function handleAdd() {
        onAddSoftSkill(selectedSoftSkill, Number(selectedSoftLevel));
        setSelectedSoftSkill("");
        setSelectedSoftLevel("");
    }

    return (
        <div className="flex max-w-3xl flex-col gap-4">
            <Section title="Stack tecnológica">
                <StackInput value={stacks} onChange={setStacks} />
            </Section>
            <Section title="Avaliação de Soft Skills (Admin)">
                <div className="mb-5 rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Legenda da Escala (1 a 10)
                    </p>
                    <ul className="space-y-1 text-xs text-slate-500">
                        <li>
                            <strong className="text-slate-700">1 a 3</strong> - Em desenvolvimento inicial
                        </li>
                        <li>
                            <strong className="text-slate-700">4 a 6</strong> - Pratica com regularidade
                        </li>
                        <li>
                            <strong className="text-slate-700">7 a 8</strong> - Domínio e aplicação consistente
                        </li>
                        <li>
                            <strong className="text-slate-700">9 a 10</strong> - Referência no time
                        </li>
                    </ul>
                </div>
                <div className="mb-2 flex flex-col items-stretch gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <Select
                            label="Soft Skill"
                            value={selectedSoftSkill}
                            onChange={(e) => setSelectedSoftSkill(e.target.value)}
                            options={[
                                { value: "", label: "Selecione uma skill..." },
                                ...availableSoftSkills.map((s) => ({ value: s, label: s })),
                            ]}
                        />
                    </div>
                    <div className="w-32">
                        <Select
                            label="Nota (1 a 10)"
                            value={String(selectedSoftLevel)}
                            onChange={(e) =>
                                setSelectedSoftLevel(e.target.value ? Number(e.target.value) : "")
                            }
                            options={[
                                { value: "", label: "-" },
                                ...Array.from({ length: 10 }, (_, i) => ({
                                    value: String(i + 1),
                                    label: String(i + 1),
                                })),
                            ]}
                        />
                    </div>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleAdd}
                        disabled={!selectedSoftSkill || !selectedSoftLevel}
                    >
                        Adicionar
                    </Button>
                </div>
                {form.softSkills.length > 0 && (
                    <div className="mt-4 flex flex-col gap-2">
                        {form.softSkills.map((s) => (
                            <div
                                key={s.name}
                                className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                            >
                                <span className="text-sm text-slate-700">
                                    {s.name} — {s.level}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => onRemoveSoftSkill(s.name)}
                                    className="text-xs text-slate-400 hover:text-red-500"
                                >
                                    Remover
                                </button>
                            </div>
                        ))}
                    </div>
                )}
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
