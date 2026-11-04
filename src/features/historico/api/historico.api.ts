import { http } from "@/lib/axios";
import type { AuditDetail, AuditLog, AuditSummary } from "../types/historico";

export const historicoApi = {
  getAuditList: (userAffectedId?: string): Promise<AuditSummary[]> =>
    http
      .get("/v1/audit", {
        params: userAffectedId ? { userAffectedId } : undefined,
      })
      .then((response) => response.data),

  getAuditDetail: (auditId: string): Promise<AuditDetail> =>
    http.get(`/v1/audit/${auditId}`).then((response) => response.data),

  getHistorico: (): Promise<AuditLog[]> =>
    http.get("/v1/audit").then((response) => response.data),
};