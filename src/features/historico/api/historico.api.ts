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

  getHistorico: async (): Promise<AuditLog[]> => {
    const audits = await historicoApi.getAuditList();
    return Promise.all(audits.map(({ id }) => historicoApi.getAuditDetail(id)));
  },
};