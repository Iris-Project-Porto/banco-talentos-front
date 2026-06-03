import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import type { StackItem } from "@/components/ui/StackInput";
import type { UserProfile, ProfileFormState } from "@/types/profile";
import { SOFTSKILLS_LIST } from "@/constants/profile";

export function useTalentoDetalhe(id: string | undefined) {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stacks, setStacks] = useState<StackItem[]>([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState<ProfileFormState>({
        area: "", sobre: "", alocacaoStatus: "", trilhaCarreira: "",
        experienceYears: "", linkedinUrl: "", githubUrl: "", nivelOverride: "",
        registrationNumber: "", registrationStatus: "NOT_REQUESTED", softSkills: [],
    });

    useEffect(() => {
        if (!id) return;

        api.getProfileById(id)
            .then((p: UserProfile) => {
                const loadedStacks: StackItem[] = [];
                const loadedSofts: { name: string; level: number }[] = [];

                p.skills?.forEach((ps) => {
                    const skillName = ps.skill?.name ?? ps.name ?? "";
                    const level = Number(ps.proficiencyLevel ?? ps.level ?? 5);

                    const isSoftSkill = SOFTSKILLS_LIST.some((soft) => soft.toUpperCase() === skillName.toUpperCase())
                        || ps.skill?.type === "SOFT"
                        || ps.type === "SOFT";

                    if (isSoftSkill) {
                        loadedSofts.push({ name: skillName, level });
                    } else {
                        loadedStacks.push({ name: skillName, level });
                    }
                });

                setProfile(p);
                setStacks(loadedStacks);
                setForm({
                    area: p.area ?? "",
                    sobre: p.sobre ?? "",
                    alocacaoStatus: p.alocacaoStatus ?? "",
                    trilhaCarreira: p.trilhaCarreira ?? "",
                    experienceYears: p.experienceYears ?? "",
                    linkedinUrl: p.linkedinUrl ?? "",
                    githubUrl: p.githubUrl ?? "",
                    nivelOverride: p.nivelOverride ?? "",
                    registrationNumber: p.registrationNumber ?? "",
                    registrationStatus: p.registrationStatus ?? "NOT_REQUESTED",
                    softSkills: loadedSofts,
                });
            })
            .finally(() => setLoading(false));
    }, [id]);

    const updateField = <K extends keyof ProfileFormState>(field: K, value: ProfileFormState[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddSoftSkill = (name: string, level: number) => {
        if (!name || !level) return;
        setForm((prev) => ({
            ...prev,
            softSkills: [...prev.softSkills, { name, level }],
        }));
    };

    const handleRemoveSoftSkill = (skillName: string) => {
        setForm((prev) => ({
            ...prev,
            softSkills: prev.softSkills.filter((s) => s.name !== skillName),
        }));
    };

    const handleSave = async (activate = false) => {
        if (!id) return;
        setSaving(true);

        const payload = {
            ...form,
            nivelOverride: form.nivelOverride || null,
            skills: stacks.map((s) => ({ name: s.name, level: s.level })),
            softSkills: form.softSkills.map((s) => ({ name: s.name, level: s.level })),
            status: activate ? "ATIVO" : profile?.status,
        };

        try {
            const updated = await api.updateProfile(id, payload);
            setProfile(updated);

            if (activate) {
                navigate("/admin/talentos");
            } else {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (error) {
            console.error("Erro ao salvar", error);
        } finally {
            setSaving(false);
        }
    };

    return {
        profile, form, stacks, saving, saved, loading,
        setStacks, updateField, handleAddSoftSkill, handleRemoveSoftSkill, handleSave
    };
}