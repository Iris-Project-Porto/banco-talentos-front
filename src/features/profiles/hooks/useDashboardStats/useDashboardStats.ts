import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { profilesApi } from "../../api/profiles.api"
import type { UserProfile } from "../../types/profile";

export interface DashData {
    total: number; ativos: number; pendentes: number; skillsCount: number;
    topSkillsByProficiency?: { name: string; score: number }[];
    topSkillsByImportance?: { name: string; score: number }[];
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
        queryFn: async () => {
            const d = await profilesApi.getAllProfiles();
            return Array.isArray(d) ? d : [];
        }
    });

    const stats = useMemo(() => {
        if (!dashData) return null;

        const alocacaoMap: Record<string, number> = {};
        const nivelCalculado: Record<"Jr" | "Pleno" | "Sr", number> = { Jr: 0, Pleno: 0, Sr: 0 };

        allProfiles.forEach((p) => {
            const s = p.alocacaoStatus ?? "Sem status";
            alocacaoMap[s] = (alocacaoMap[s] ?? 0) + 1;

            const n = p.nivelOverride || p.nivel;
            if (n === "Jr" || n === "Pleno" || n === "Sr") {
                nivelCalculado[n as "Jr" | "Pleno" | "Sr"]++;
            }
        });

        const alocacaoEntries = Object.entries(alocacaoMap).sort((a, b) => b[1] - a[1]);
        const maxAlocacao = alocacaoEntries.reduce((m, [, v]) => Math.max(m, v), 1);
        const disponiveisBench = alocacaoMap["Disponível (Bench)"] ?? 0;

        const skillsToRender = skillView === "proficiency"
            ? (dashData.topSkillsByProficiency || [])
            : (dashData.topSkillsByImportance || []);

        const maxSkill = skillsToRender.reduce((m: number, s: any) => Math.max(m, s.score), 1);

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