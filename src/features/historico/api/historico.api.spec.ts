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
    vi.mocked(http.get).mockResolvedValueOnce({ data: [] });

    await historicoApi.getAuditList();

    expect(http.get).toHaveBeenCalledWith("/v1/audit", {
      params: undefined,
    });
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
});
