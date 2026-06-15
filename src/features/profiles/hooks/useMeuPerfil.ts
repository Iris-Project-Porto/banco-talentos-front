import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { StackItem } from "../components/StackInput/StackInput";
import type { UserProfile } from "../types/profile";
import { profilesApi } from "../api/profiles.api";

const profileSchema = z.object({
    photoUrl: z.string().optional(),
    area: z.string().min(1, "Obrigatório"),
    about: z.string().optional(),
    experienceYears: z.string().optional(),
    linkedinUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    registrationNumber: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useMeuPerfil() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [saved, setSaved] = useState(false);
    const [stacks, setStacks] = useState<StackItem[]>([]);

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    const { data: fetchedProfile, isLoading: loading } = useQuery({
        queryKey: ['meu-perfil'],
        queryFn: profilesApi.getMyProfile,
        retry: false,
    });

    useEffect(() => {
        if (!fetchedProfile) return;
        setProfile(fetchedProfile);
        form.reset({
            photoUrl: fetchedProfile.photoUrl ?? "",
            area: fetchedProfile.area ?? "",
            about: fetchedProfile.about ?? "",
            experienceYears: fetchedProfile.experienceYears != null ? String(fetchedProfile.experienceYears) : "",
            linkedinUrl: fetchedProfile.linkedinUrl ?? "",
            githubUrl: fetchedProfile.githubUrl ?? "",
            registrationNumber: fetchedProfile.registrationNumber ?? "",
        });

        if (fetchedProfile.skills?.length) {
            const hardSkills = fetchedProfile.skills.filter((ps: any) => ps.skill?.type !== "SOFT" && ps.type !== "SOFT");
            setStacks(
                hardSkills.map((ps: any) => ({
                    name: ps.skill?.name ?? ps.name ?? "",
                    level: Number(ps.proficiencyLevel ?? ps.level ?? 5),
                }))
            );
        }
    }, [fetchedProfile, form]);

    const submitMutation = useMutation({
        mutationFn: profilesApi.submitProfile,
        onSuccess: (result) => {
            setProfile(result);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        },
        onError: (error) => {
            console.error("Erro ao salvar perfil", error);
            toast.error("Ocorreu um erro ao atualizar o recurso. Por favor, tente novamente.");
        }
    });

    const onSubmit = async (data: ProfileFormData) => {
        const skillList = stacks.map((s) => ({ name: s.name, type: "HARD", proficiencyLevel: s.level }));
        const payload = {
            ...data,
            experienceYears: data.experienceYears ? Number(data.experienceYears) : undefined,
            skills: skillList
        };
        submitMutation.mutate(payload);
    };

    return {
        profile, loading, saved, stacks, setStacks, form, onSubmit
    };
}