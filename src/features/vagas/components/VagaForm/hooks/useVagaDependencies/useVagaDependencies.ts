import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { vagasApi } from "../../../../api/vagas.api";

export function useVagaDependencies(selectedProjectId: string, selectedSquadId: string, setValue: any) {
    const { data: projectsData, isLoading: loadingProjects } = useQuery({
        queryKey: ['projects', 'active'],
        queryFn: () => vagasApi.getProjects(0, 100)
    });

    const { data: squadsData, isLoading: loadingSquads } = useQuery({
        queryKey: ['squads', 'active'],
        queryFn: () => vagasApi.getSquads(0, 100)
    });

    const projects = projectsData?.content || [];
    const allSquads = squadsData?.content || [];

    const filteredSquads = useMemo(() => {
        return allSquads.filter((s: any) => s.projectId === selectedProjectId || s.project?.id === selectedProjectId);
    }, [allSquads, selectedProjectId]);

    useEffect(() => {
        if (selectedProjectId && selectedSquadId) {
            const isValid = filteredSquads.some((s: any) => s.id === selectedSquadId);
            if (!isValid && filteredSquads.length > 0) {
                setValue("squadId", "", { shouldValidate: true });
            }
        }
    }, [selectedProjectId, filteredSquads, selectedSquadId, setValue]);

    return { projects, filteredSquads, loadingProjects, loadingSquads };
}