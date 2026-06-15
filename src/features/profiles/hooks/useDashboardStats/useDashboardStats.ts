import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { profilesApi } from "../../api/profiles.api";
import type { UserProfile } from "../../types/profile";

export interface DashData {
    total: number;
    active: number;
    pending: number;
    topSkillsByProficiency?: { name: string; score: number }[];
    topSkillsByImportance?: { name: string; score: number }[];
    levelCount?: Record<string, number>;
}

export const ALOCACAO_COLORS: Record<string, string> = {
    "Disponível (Bench)": "#10B981",
    "Alocado Integral (100%)": "#3B82F6",
    "Alocado Parcial": "#F59E0B",
    "Em Transição (saindo de projeto)": "#F97316",
    "Férias / Licença": "#8B5CF6",
    "Desligado": "#EF4444",
};

export function useDashboardStats() {
    const [skillView, setSkillView] = useState<"proficiency" | "importance">("proficiency");

    const { data: dashData, isLoading: loadingDash } = useQuery<DashData>({
        queryKey: ['dashboard-data'],
        queryFn: profilesApi.getDashboard,
    });

    const { data: allProfiles = [] as UserProfile[], isLoading: loadingProfiles } = useQuery({
        queryKey: ['profiles-todos'],
        queryFn: async (): Promise<UserProfile[]> => {
            const d = await profilesApi.getAllProfiles();
            if (Array.isArray(d)) return d;
            return (d as any)?.content || (d as any)?.data || [];
        }
    });

    const stats = useMemo(() => {
        if (!dashData) return null;

        const alocacaoMap: Record<string, number> = {};

        allProfiles.forEach((p) => {
            const s = p.allocationStatus ?? "Sem status";
            alocacaoMap[s] = (alocacaoMap[s] ?? 0) + 1;
        });

        const alocacaoEntries = Object.entries(alocacaoMap).sort((a, b) => b[1] - a[1]);
        const maxAlocacao = alocacaoEntries.reduce((m, [, v]) => Math.max(m, v), 1);
        const disponiveisBench = alocacaoMap["Disponível (Bench)"] ?? 0;

        const skillsToRender = skillView === "proficiency"
            ? (dashData.topSkillsByProficiency || [])
            : (dashData.topSkillsByImportance || []);
        const maxSkill = skillsToRender.reduce((m: number, s: any) => Math.max(m, s.score), 1);

        const nivelCalculado = {
            Jr: dashData.levelCount?.Jr || dashData.levelCount?.JUNIOR || 0,
            Pleno: dashData.levelCount?.Pleno || dashData.levelCount?.PLENO || 0,
            Sr: dashData.levelCount?.Sr || dashData.levelCount?.SENIOR || 0,
        };

        return {
            dashData, alocacaoMap, alocacaoEntries, maxAlocacao, disponiveisBench,
            nivelCalculado, skillsToRender, maxSkill
        };
    }, [allProfiles, dashData, skillView]);

    return {
        loading: loadingDash || loadingProfiles,
        skillView, setSkillView, stats, allProfilesLength: allProfiles.length
    };
}