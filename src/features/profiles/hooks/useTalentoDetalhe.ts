import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { StackItem } from "../components/StackInput/StackInput";
import { SOFTSKILLS_LIST } from "../profile";
import { profilesApi } from "../api/profiles.api";
import type { ProfileFormState, UserProfile } from "../types/profile";
import { formatCep, formatEmail, formatTelephone } from "@/utils/masks";

const emptyForm = (): ProfileFormState => ({
    area: "",
    about: "",
    allocationStatus: "",
    careerPath: "",
    experienceYears: "",
    linkedinUrl: "",
    githubUrl: "",
    levelOverride: "",
    registrationNumber: "",
    registrationStatus: "NOT_REQUIRED",
    registrationRequestedAt: "",
    registrationNotes: "",
    hasClientMachine: false,
    contractingArea: "",
    costCenter: "",
    projectEntryDate: "",
    billable: null,
    portoOnboarding: null,
    projectManagerName: "",
    allocationProjectId: "",
    allocationSquadId: "",
    technicalProposalStatus: "",
    technicalProposalNumber: "",
    technicalProposalSentAt: "",
    technicalProposalNotes: "",
    contact: "",
    contactEmail: "",
    phone: "",
    address: "",
    postalCode: "",
    cityState: "",
    softSkills: [],
});

function emptyToNull(value: string) {
    return value?.trim() ? value : null;
}

export function useTalentoDetalhe(id: string | undefined) {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stacks, setStacks] = useState<StackItem[]>([]);
    const queryClient = useQueryClient();
    const [form, setForm] = useState<ProfileFormState>(emptyForm());

    const { data: fetchedProfile, isLoading: loading } = useQuery({
        queryKey: ["talento", id],
        queryFn: () => profilesApi.getProfileById(id!),
        enabled: !!id,
    });

    useEffect(() => {
        if (!fetchedProfile) return;

        const p = fetchedProfile as UserProfile;
        const loadedStacks: StackItem[] = [];
        const loadedSofts: { name: string; level: number }[] = [];

        p.skills?.forEach((ps: any) => {
            const skillName = ps.skill?.name ?? ps.name ?? "";
            const level = Number(ps.proficiencyLevel ?? ps.level ?? 5);

            const isSoftSkill =
                SOFTSKILLS_LIST.some((soft) => soft.toUpperCase() === skillName.toUpperCase()) ||
                ps.skill?.type === "SOFT" ||
                ps.type === "SOFT";

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
            about: p.about ?? "",
            allocationStatus: p.allocationStatus || "Disponível (Bench)",
            careerPath: p.careerPath ?? "",
            experienceYears: p.experienceYears ?? "",
            linkedinUrl: p.linkedinUrl ?? "",
            githubUrl: p.githubUrl ?? "",
            levelOverride: p.levelOverride ?? "",
            registrationNumber: p.registrationNumber ?? "",
            registrationStatus: p.registrationStatus ?? "NOT_REQUIRED",
            registrationRequestedAt: p.registrationRequestedAt ?? "",
            registrationNotes: p.registrationNotes ?? "",
            hasClientMachine: p.hasClientMachine ?? false,
            contractingArea: p.contractingArea ?? "",
            costCenter: p.costCenter ?? "",
            projectEntryDate: p.projectEntryDate ?? "",
            billable: p.billable ?? null,
            portoOnboarding: p.portoOnboarding ?? null,
            projectManagerName: p.projectManagerName ?? "",
            allocationProjectId: p.allocationProjectId ?? "",
            allocationSquadId: p.allocationSquadId ?? "",
            technicalProposalStatus: p.technicalProposalStatus ?? "",
            technicalProposalNumber: p.technicalProposalNumber ?? "",
            technicalProposalSentAt: p.technicalProposalSentAt ?? "",
            technicalProposalNotes: p.technicalProposalNotes ?? "",
            contact: p.contact ?? "",
            contactEmail: formatEmail(p.contactEmail ?? ""),
            phone: formatTelephone(p.phone ?? ""),
            address: p.address ?? "",
            postalCode: formatCep(p.postalCode ?? ""),
            cityState: p.cityState ?? "",
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
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string;
            payload: any;
            activate: boolean;
        }) => profilesApi.updateProfile(id, payload),
        onSuccess: (updated, variables) => {
            setProfile(updated);
            queryClient.invalidateQueries({ queryKey: ["talento", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["profiles-catalog"] });
            queryClient.invalidateQueries({ queryKey: ["profiles-pendentes"] });
            toast.success("Dados salvos com sucesso.");

            if (variables.activate) {
                navigate("/admin/fila");
            }
        },
        onError: () => {
            toast.error("Ocorreu um erro ao atualizar o recurso. Por favor, tente novamente.");
        },
    });

    const handleSave = async (activate = false) => {
        if (!id) return;

        const registrationRequired = form.registrationStatus !== "NOT_REQUIRED";
        // Mesma regra de visibilidade da aba + seções em TalentoDetalheCorporativaTab
        const projectSectionsVisible =
            profile?.registrationStatus !== "NOT_REQUIRED" && registrationRequired;

        if (registrationRequired) {
            if (!form.registrationNumber?.trim()) {
                toast.error("Informe o Nº da Matrícula.");
                return;
            }
            if (!form.registrationRequestedAt?.trim()) {
                toast.error("Informe a Data da Solicitação.");
                return;
            }
            if (!form.registrationNotes?.trim()) {
                toast.error("Informe as Observações da Matrícula.");
                return;
            }
        }

        if (projectSectionsVisible) {
            if (!form.contractingArea?.trim()) {
                toast.error("Informe a Área Contratante.");
                return;
            }
            if (!form.costCenter?.trim()) {
                toast.error("Informe o Centro de Custo.");
                return;
            }
            if (!form.projectEntryDate?.trim()) {
                toast.error("Informe a Data de Entrada no Projeto.");
                return;
            }
            if (!form.projectManagerName?.trim()) {
                toast.error("Informe o Gerente de Projeto.");
                return;
            }
            if (form.billable == null) {
                toast.error("Informe se o recurso é Billable.");
                return;
            }
            if (form.portoOnboarding == null) {
                toast.error("Informe se o Onboarding Porto foi realizado.");
                return;
            }
            if (!form.allocationProjectId?.trim()) {
                toast.error("Selecione o Projeto.");
                return;
            }
            if (!form.allocationSquadId?.trim()) {
                toast.error("Selecione a Squad.");
                return;
            }
            if (!form.technicalProposalStatus?.trim()) {
                toast.error("Selecione o Status da Proposta Técnica.");
                return;
            }
            if (!form.technicalProposalNumber?.trim()) {
                toast.error("Informe o Número da Proposta Técnica.");
                return;
            }
            if (!form.technicalProposalSentAt?.trim()) {
                toast.error("Informe a Data do Envio da Proposta Técnica.");
                return;
            }
            if (!form.technicalProposalNotes?.trim()) {
                toast.error("Informe as Observações da Proposta Técnica.");
                return;
            }
        }

        const payload = {
            ...form,
            resourceStatus: undefined,
            levelOverride: form.levelOverride || null,
            registrationNumber: registrationRequired ? form.registrationNumber : null,
            registrationRequestedAt: registrationRequired
                ? emptyToNull(form.registrationRequestedAt)
                : null,
            registrationNotes: registrationRequired ? form.registrationNotes : null,
            projectEntryDate: emptyToNull(form.projectEntryDate),
            technicalProposalSentAt: emptyToNull(form.technicalProposalSentAt),
            technicalProposalStatus: emptyToNull(form.technicalProposalStatus),
            technicalProposalNumber: emptyToNull(form.technicalProposalNumber),
            allocationProjectId: emptyToNull(form.allocationProjectId),
            allocationSquadId: emptyToNull(form.allocationSquadId),
            skills: stacks.map((s) => ({ name: s.name, type: "HARD", proficiencyLevel: s.level })),
            softSkills: form.softSkills.map((s) => ({
                name: s.name,
                type: "SOFT",
                proficiencyLevel: s.level,
            })),
            status: activate ? "ACTIVE" : profile?.status,
        };
        saveMutation.mutate({ id, payload, activate });
    };

    return {
        profile,
        form,
        stacks,
        saving: saveMutation.isPending,
        loading,
        setStacks,
        updateField,
        handleAddSoftSkill,
        handleRemoveSoftSkill,
        handleSave,
    };
}
