import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { vagasApi } from "../api/vagas.api";
import type { VagaFiltersParams } from "../types/types";

export function useVagasList() {
  const [viewActive, setViewActive] = useState(true);
  const [page, setPage] = useState(0);
  
  const [filters, setFilters] = useState<VagaFiltersParams>({});
  const [appliedFilters, setAppliedFilters] = useState<VagaFiltersParams>({});

  const setFilter = (key: keyof VagaFiltersParams, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({});
    setAppliedFilters({});
    setPage(0);
  };

  const { data: activeData, isLoading: loadingActive, isError: errorActive } = useQuery({
    queryKey: ['vagas', 'active', page, appliedFilters],
    queryFn: () => vagasApi.getActive(page, 20, appliedFilters),
    enabled: viewActive,
  });

  const { data: inactiveData, isLoading: loadingInactive, isError: errorInactive } = useQuery({
    queryKey: ['vagas', 'inactive', page, appliedFilters],
    queryFn: () => vagasApi.getInactive(page, 20, appliedFilters),
    enabled: !viewActive,
  });

  const { data: projectsData } = useQuery({
    queryKey: ['projects-list'],
    queryFn: () => vagasApi.getProjects(0, 100)
  });

  const { data: squadsData } = useQuery({
    queryKey: ['squads-list'],
    queryFn: () => vagasApi.getSquads(0, 100)
  });

  const handleViewActiveChange = (isActive: boolean) => {
  setViewActive(isActive);
  setPage(0);
};

  const currentData = viewActive ? activeData : inactiveData;
  const isLoading = viewActive ? loadingActive : loadingInactive;
  const isError = viewActive ? errorActive : errorInactive;

  return {
    viewActive,
    setViewActive: handleViewActiveChange,
    page,
    setPage,
    filters,
    setFilter,
    applyFilters,
    clearFilters,
    vagas: currentData?.content || [],
    totalElements: currentData?.totalElements || 0,
    totalPages: currentData?.totalPages || 1,
    isLoading,
    isError,
    projects: projectsData?.content || [],
    squads: squadsData?.content || [],
  };
}