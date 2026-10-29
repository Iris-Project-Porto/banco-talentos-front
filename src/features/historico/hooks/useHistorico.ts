import { useQuery } from "@tanstack/react-query";
import { historicoApi } from "../api/historico.api";
import type { AuditLog } from "../types/historico";

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
