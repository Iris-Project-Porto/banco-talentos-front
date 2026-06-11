import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { profilesApi } from "../../api/profiles.api";
import type { UserProfile } from "../../types/profile";

export function useBancoTalentos() {
    const [search, setSearch] = useState("");
    const [area, setArea] = useState("");

    const { data: profiles = [] as UserProfile[], isLoading: loading } = useQuery({
        queryKey: ['profiles-ativos'],
        queryFn: async () => {
            const data = await profilesApi.getAtivos();
            return Array.isArray(data) ? data : [];
        }
    });

    const areas = useMemo(() => Array.from(new Set(profiles.map((p) => p.area).filter(Boolean))), [profiles]);
    const disponíveis = useMemo(() => profiles.filter((p) => p.alocacaoStatus === "Disponível (Bench)"), [profiles]);

    const filtered = useMemo(() => disponíveis.filter((p) => {
        const q = search.toLowerCase();
        return (
            (!q || p.user?.name?.toLowerCase().includes(q) || p.area?.toLowerCase().includes(q) ||
                p.skills?.some((s: any) => (s.skill?.name || s.name)?.toLowerCase().includes(q))) &&
            (!area || p.area === area)
        );
    }), [disponíveis, search, area]);

    return { search, setSearch, area, setArea, areas, filtered, loading };
}