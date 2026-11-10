import { beforeEach, describe, expect, it, vi } from "vitest";
import { http } from "@/lib/axios";
import { historicoApi } from "./historico.api";

vi.mock("@/lib/axios", () => ({
  http: {
    get: vi.fn(),
  },
}));

describe("historicoApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lista auditorias sem filtro", async () => {
    const records = [{
      id: "audit-123",
      userId: "executor-123",
      userName: "Ana Silva",
      userAffectedId: "affected-123",
      userAffectedName: "João Souza",
      operation: "UPDATE",
      entityType: "PROJECT",
      entityName: "Projeto Atlas",
      description: null,
      entityId: "project-123",
      createdAt: "2026-11-01T10:00:00Z",
    }];
    vi.mocked(http.get).mockResolvedValueOnce({ data: records });

    const result = await historicoApi.getAuditList();

    expect(http.get).toHaveBeenCalledWith("/v1/audit", {
      params: undefined,
    });
    expect(result).toEqual(records);
    expect(result[0]).not.toHaveProperty("oldValue");
    expect(result[0]).not.toHaveProperty("newValue");
  });

  it("filtra pelo usuario afetado", async () => {
    vi.mocked(http.get).mockResolvedValueOnce({ data: [] });

    await historicoApi.getAuditList("4f5a8d08-d1ec-4d8d-a8d2-a3b7f1c4b2e1");

    expect(http.get).toHaveBeenCalledWith("/v1/audit", {
      params: { userAffectedId: "4f5a8d08-d1ec-4d8d-a8d2-a3b7f1c4b2e1" },
    });
  });

  it("consulta o detalhe pelo ID da auditoria", async () => {
    vi.mocked(http.get).mockResolvedValueOnce({ data: {} });

    await historicoApi.getAuditDetail("audit-123");

    expect(http.get).toHaveBeenCalledWith("/v1/audit/audit-123");
  });

  it("carrega os detalhes dos registros listados para o histórico", async () => {
    const audit = { id: "audit-123" };
    const auditDetail = { ...audit, oldValue: { Cargo: "Dev" }, newValue: { Cargo: "Tech Lead" } };
    vi.mocked(http.get)
      .mockResolvedValueOnce({ data: [audit] })
      .mockResolvedValueOnce({ data: auditDetail });

    await expect(historicoApi.getHistorico()).resolves.toEqual([auditDetail]);
    expect(http.get).toHaveBeenNthCalledWith(1, "/v1/audit", { params: undefined });
    expect(http.get).toHaveBeenNthCalledWith(2, "/v1/audit/audit-123");
  });
});
