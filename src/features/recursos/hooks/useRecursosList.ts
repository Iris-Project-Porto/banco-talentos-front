import { useCallback, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { profilesApi, type UserProfile } from "@/features/profiles";
import type { ProfileListFilters } from "../types/profileFilters";
import { EMPTY_PROFILE_FILTERS } from "../types/profileFilters";
import { RECURSOS_PAGE_SIZE } from "../utils/profileFilterOptions";

function profileNivel(profile: UserProfile): string {
    return profile.levelOverride ?? profile.level ?? profile.nivel ?? "";
}

function matchesProfileFilters(profile: UserProfile, filters: ProfileListFilters): boolean {
    if (filters.nome.trim()) {
        const q = filters.nome.trim().toLowerCase();
        const matchesText =
            profile.name?.toLowerCase().includes(q) ||
            profile.email?.toLowerCase().includes(q) ||
            profile.jobTitle?.toLowerCase().includes(q) ||
            false;
        if (!matchesText) return false;
    }

    if (filters.area && profile.area !== filters.area) return false;
    if (filters.groupName && profile.groupName !== filters.groupName) return false;
    if (filters.status && profile.status !== filters.status) return false;
    if (filters.allocationStatus && profile.allocationStatus !== filters.allocationStatus) return false;
    if (filters.registrationStatus && profile.registrationStatus !== filters.registrationStatus) return false;
    if (filters.nivel && profileNivel(profile) !== filters.nivel) return false;

    return true;
}

export function hasProfileFilters(filters: ProfileListFilters): boolean {
    return Boolean(
        filters.nome.trim() ||
        filters.area ||
        filters.groupName ||
        filters.status ||
        filters.allocationStatus ||
        filters.registrationStatus ||
        filters.nivel,
    );
}

export function useRecursosList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const skillParam = searchParams.get("skill") || "";

    const [filters, setFilters] = useState<ProfileListFilters>({ ...EMPTY_PROFILE_FILTERS });
    const [applied, setApplied] = useState<ProfileListFilters>({ ...EMPTY_PROFILE_FILTERS });
    const [page, setPage] = useState(0);

    const catalogQuery = useQuery({
        queryKey: ["profiles-catalog", skillParam],
        queryFn: () => profilesApi.getAllProfiles(0, 1000, skillParam || undefined),
        placeholderData: keepPreviousData,
        staleTime: 60_000,
    });

    const allProfiles = useMemo<UserProfile[]>(
        () => catalogQuery.data?.content ?? [],
        [catalogQuery.data?.content],
    );

    const areas = useMemo(
        () => Array.from(new Set(allProfiles.map((p) => p.area).filter((a): a is string => Boolean(a)))).sort(),
        [allProfiles],
    );

    const groups = useMemo(
        () => Array.from(new Set(allProfiles.map((p) => p.groupName).filter((g): g is string => Boolean(g)))).sort(),
        [allProfiles],
    );

    const filteredProfiles = useMemo(() => {
        if (!hasProfileFilters(applied)) return allProfiles;
        return allProfiles.filter((profile) => matchesProfileFilters(profile, applied));
    }, [allProfiles, applied]);

    const totalElements = filteredProfiles.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / RECURSOS_PAGE_SIZE));

    const pageProfiles = useMemo(() => {
        const start = page * RECURSOS_PAGE_SIZE;
        return filteredProfiles.slice(start, start + RECURSOS_PAGE_SIZE);
    }, [filteredProfiles, page]);

    const replaceFilters = useCallback((next: ProfileListFilters) => {
        setFilters(next);
        setApplied(next);
        setPage(0);
    }, []);

    function setFilter(key: keyof ProfileListFilters, value: string) {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }

    function applyFilters() {
        setPage(0);
        setApplied({ ...filters });
    }

    function clearFilters() {
        replaceFilters({ ...EMPTY_PROFILE_FILTERS });
    }

    function clearSkillFilter() {
        const params = new URLSearchParams(searchParams);
        params.delete("skill");
        setSearchParams(params);
        setPage(0);
    }

    return {
        filters,
        setFilter,
        applyFilters,
        clearFilters,
        page,
        setPage,
        profiles: pageProfiles,
        totalElements,
        totalPages,
        isLoading: catalogQuery.isLoading && !catalogQuery.data,
        isError: catalogQuery.isError,
        skillParam,
        clearSkillFilter,
        areas,
        groups,
    };
}
