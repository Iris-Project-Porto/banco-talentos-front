import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getApiError } from "@/lib/axios";
import { useAuth } from "@/features/auth";
import type { StackItem } from "../components/StackInput/StackInput";
import { profilesApi } from "../api/profiles.api";
import type { ProfileSkill, UserProfile } from "../types/profile";
import { formatCep, formatEmail, formatTelephone } from "@/utils/masks";
import { needsFirstProfileSubmit } from "../utils/profileUtils";

export interface MeuPerfilEditForm {
    photoUrl: string;
    area: string;
    about: string;
    experienceYears: string;
    contact: string;
    contactEmail: string;
    phone: string;
    address: string;
    postalCode: string;
    cityState: string;
    linkedinUrl: string;
    githubUrl: string;
}

const EMPTY_FORM: MeuPerfilEditForm = {
    photoUrl: "",
    area: "",
    about: "",
    experienceYears: "",
    contact: "",
    contactEmail: "",
    phone: "",
    address: "",
    postalCode: "",
    cityState: "",
    linkedinUrl: "",
    githubUrl: "",
};

function mapProfileToForm(p: UserProfile): MeuPerfilEditForm {
    return {
        photoUrl: p.photoUrl ?? "",
        area: p.area ?? "",
        about: p.about ?? "",
        experienceYears: p.experienceYears != null ? String(p.experienceYears) : "",
        contact: p.contact ?? "",
        contactEmail: formatEmail(p.contactEmail ?? ""),
        phone: formatTelephone(p.phone ?? ""),
        address: p.address ?? "",
        postalCode: formatCep(p.postalCode ?? ""),
        cityState: p.cityState ?? "",
        linkedinUrl: p.linkedinUrl ?? "",
        githubUrl: p.githubUrl ?? "",
    };
}

export function useMeuPerfilEditar() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, markProfileCreated } = useAuth();
    const [form, setForm] = useState<MeuPerfilEditForm>(EMPTY_FORM);
    const [stacks, setStacks] = useState<StackItem[]>([]);

    const {
        data: profile,
        isLoading,
        isError,
        error,
    } = useQuery<UserProfile>({
        queryKey: ["meu-perfil"],
        queryFn: profilesApi.getMyProfile,
        retry: false,
        enabled: user?.hasProfile === true,
    });

    const profileMissing =
        user?.hasProfile === false ||
        (isError && (error as { response?: { status?: number } })?.response?.status === 404);

    const isFirstSubmit = profileMissing || needsFirstProfileSubmit(profile ?? null);

    useEffect(() => {
        if (!profile) return;
        setForm(mapProfileToForm(profile));
        const hardSkills = (profile.skills ?? []).filter(
            (ps: ProfileSkill) => ps.skill?.type !== "SOFT" && ps.type !== "SOFT",
        );
        setStacks(
            hardSkills.map((ps: ProfileSkill) => ({
                name: ps.skill?.name ?? ps.name ?? "",
                level: Number(ps.proficiencyLevel ?? ps.level ?? 5),
            })),
        );
    }, [profile]);

    function updateField<K extends keyof MeuPerfilEditForm>(key: K, value: MeuPerfilEditForm[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    const saveMutation = useMutation({
        mutationFn: async (payload: Record<string, unknown>) => {
            if (isFirstSubmit) {
                return profilesApi.submitProfile(payload);
            }
            return profilesApi.updateMyProfile(payload);
        },
        onSuccess: (updated) => {
            markProfileCreated();
            queryClient.setQueryData(["meu-perfil"], updated);
            toast.success(
                isFirstSubmit
                    ? "Perfil criado e enviado para revisão."
                    : "Perfil atualizado com sucesso.",
            );
            navigate("/meu-perfil");
        },
        onError: (err) => {
            toast.error(getApiError(err, "Erro ao salvar perfil."));
        },
    });

    function handleSave() {
        if (isFirstSubmit && !form.area.trim()) {
            toast.error("Área de atuação é obrigatória.");
            return;
        }

        saveMutation.mutate({
            ...form,
            experienceYears: form.experienceYears ? Number(form.experienceYears) : null,
            skills: stacks.map((s) => ({ name: s.name, type: "HARD", proficiencyLevel: s.level })),
        });
    }

    return {
        profile: profile ?? null,
        form,
        stacks,
        setStacks,
        updateField,
        handleSave,
        loading: user?.hasProfile === true && isLoading,
        isError: isError && !profileMissing,
        isFirstSubmit,
        saving: saveMutation.isPending,
    };
}
