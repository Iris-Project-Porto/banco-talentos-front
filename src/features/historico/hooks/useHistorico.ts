import { useQuery } from "@tanstack/react-query";
import { historicoApi } from "../api/historico.api";
import type { AuditLog, AuditSummary } from "../types/historico";

export function useAuditList(userAffectedId?: string) {
  const query = useQuery<AuditSummary[]>({
    queryKey: ["audit", { userAffectedId: userAffectedId ?? null }],
    queryFn: () => historicoApi.getAuditList(userAffectedId),
  });

  return {
    audits: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useHistorico() {
  const query = useQuery<AuditLog[]>({
    queryKey: ["historico"],
    queryFn: historicoApi.getHistorico,
  });

  return {
    historico: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
