import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { StackItem } from "../components/StackInput/StackInput";
import { SOFTSKILLS_LIST } from "../profile";
import { profilesApi } from "../api/profiles.api";
import type { ProfileFormState, UserProfile } from "../types/profile";

export function useTalentoDetalhe(id: string | undefined) {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stacks, setStacks] = useState<StackItem[]>([]);
    const [saved, setSaved] = useState(false);
    const queryClient = useQueryClient();

    const [form, setForm] = useState<ProfileFormState>({
        area: "", sobre: "", alocacaoStatus: "", trilhaCarreira: "",
        experienceYears: "", linkedinUrl: "", githubUrl: "", nivelOverride: "",
        registrationNumber: "", registrationStatus: "NOT_REQUESTED", softSkills: [],
    });

    const { data: fetchedProfile, isLoading: loading } = useQuery({
        queryKey: ['talento', id],
        queryFn: () => profilesApi.getProfileById(id!),
        enabled: !!id,
    });

    useEffect(() => {
        if (!fetchedProfile) return;

        const p = fetchedProfile;
        const loadedStacks: StackItem[] = [];
        const loadedSofts: { name: string; level: number }[] = [];

        p.skills?.forEach((ps: any) => {
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
    }, [fetchedProfile]);

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

    const saveMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: string, payload: any }) => profilesApi.updateProfile(id, payload),
        onSuccess: (updated, variables) => {
            setProfile(updated);
            queryClient.invalidateQueries({ queryKey: ['talento', variables.id] });

            if (variables.payload.status === "ATIVO") {
                navigate("/admin/talentos");
            } else {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        },
        onError: (error) => {
            console.error("Erro ao salvar", error);
        }
    });

    const handleSave = async (activate = false) => {
        if (!id) return;

        const payload = {
            ...form,
            nivelOverride: form.nivelOverride || null,
            skills: stacks.map((s) => ({ name: s.name, level: s.level })),
            softSkills: form.softSkills.map((s) => ({ name: s.name, level: s.level })),
            status: activate ? "ATIVO" : profile?.status,
        };

        saveMutation.mutate({ id, payload });
    };

    return {
        profile, form, stacks, saving: saveMutation.isPending, saved, loading,
        setStacks, updateField, handleAddSoftSkill, handleRemoveSoftSkill, handleSave
    };
}