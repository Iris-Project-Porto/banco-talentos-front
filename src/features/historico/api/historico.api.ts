import { http } from "@/lib/axios";
import type { AuditLog } from "../types/historico";

export const historicoApi = {
  getHistorico: (): Promise<AuditLog[]> =>
    http.get("/v1/audit").then((response) => response.data),
};