import { useCallback, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { profilesApi, type UserProfile } from "@/features/profiles";
import { projectsApi } from "@/features/projects/api/projects.api";
import type { ProfileListFilters } from "../types/profileFilters";
import { EMPTY_PROFILE_FILTERS } from "../types/profileFilters";
import type { StatusRecurso } from "../types/recurso";
import { RECURSOS_PAGE_SIZE } from "../utils/profileFilterOptions";

export function deriveStatusRecurso(profile: UserProfile): StatusRecurso {
    if (
        profile.resourceStatus === "AVAILABLE" ||
        profile.resourceStatus === "WAITING" ||
        profile.resourceStatus === "ALLOCATED"
    ) {
        return profile.resourceStatus;
    }

    if (!profile.registrationStatus || profile.registrationStatus === "NOT_REQUIRED") {
        return "AVAILABLE";
    }
    if (profile.registrationStatus === "RELEASED") {
        return "ALLOCATED";
    }
    return "WAITING";
}

function matchesBooleanFilter(value: boolean | null | undefined, filter: string): boolean {
    if (!filter) return true;
    if (value == null) return false;
    return String(value) === filter;
}

function matchesProfileFilters(profile: UserProfile, filters: ProfileListFilters): boolean {
    if (filters.nome.trim()) {
        const q = filters.nome.trim().toLowerCase();
        const matchesText =
            profile.name?.toLowerCase().includes(q) ||
            profile.email?.toLowerCase().includes(q) ||
            false;
        if (!matchesText) return false;
    }

    if (filters.statusRecurso && deriveStatusRecurso(profile) !== filters.statusRecurso) return false;
    if (filters.registrationStatus && profile.registrationStatus !== filters.registrationStatus) return false;

    if (filters.projectManagerName.trim()) {
        const q = filters.projectManagerName.trim().toLowerCase();
        if (!profile.projectManagerName?.toLowerCase().includes(q)) return false;
    }

    if (filters.allocationProjectId && profile.allocationProjectId !== filters.allocationProjectId) {
        return false;
    }

    if (!matchesBooleanFilter(profile.billable, filters.billable)) return false;
    if (!matchesBooleanFilter(profile.portoOnboarding, filters.portoOnboarding)) return false;

    if (filters.projectEntryDateFrom) {
        if (!profile.projectEntryDate || profile.projectEntryDate < filters.projectEntryDateFrom) {
            return false;
        }
    }

    if (filters.projectEntryDateTo) {
        if (!profile.projectEntryDate || profile.projectEntryDate > filters.projectEntryDateTo) {
            return false;
        }
    }

    return true;
}

export function hasProfileFilters(filters: ProfileListFilters): boolean {
    return Boolean(
        filters.nome.trim() ||
        filters.statusRecurso ||
        filters.registrationStatus ||
        filters.projectManagerName.trim() ||
        filters.allocationProjectId ||
        filters.billable ||
        filters.portoOnboarding ||
        filters.projectEntryDateFrom ||
        filters.projectEntryDateTo,
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
        queryFn: () => profilesApi.getAtivos(0, 1000, skillParam || undefined),
        placeholderData: keepPreviousData,
        staleTime: 60_000,
    });

    const projectsQuery = useQuery({
        queryKey: ["projects-active-filter"],
        queryFn: () => projectsApi.getActive({ page: 0, size: 200 }),
        staleTime: 60_000,
    });

    const allProfiles = useMemo<UserProfile[]>(
        () => catalogQuery.data?.content ?? [],
        [catalogQuery.data?.content],
    );

    const projects = useMemo(
        () =>
            (projectsQuery.data?.content ?? []).map((project) => ({
                id: project.id,
                name: project.name,
            })),
        [projectsQuery.data?.content],
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
        projects,
    };
}
