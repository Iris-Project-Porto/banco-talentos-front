import { useQuery } from "@tanstack/react-query";
import { historicoApi } from "../api/historico.api";
import type { AuditDetail } from "../types/historico";

export function useAuditDetail(auditId?: string) {
  const query = useQuery<AuditDetail>({
    queryKey: ["audit", "detail", auditId],
    queryFn: () => historicoApi.getAuditDetail(auditId as string),
    enabled: Boolean(auditId),
  });

  return {
    audit: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
