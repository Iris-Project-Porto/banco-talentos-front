import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuditDetail } from "../../hooks/useAuditDetail";
import type { AuditDetail, AuditSummary } from "../../types/historico";
import { AuditDetailPanel } from "./AuditDetailPanel";

vi.mock("../../hooks/useAuditDetail", () => ({
    useAuditDetail: vi.fn(),
}));

const record: AuditSummary = {
    id: "audit-uuid",
    userId: "executor-uuid",
    userName: "Ana Silva",
    userAffectedId: "affected-uuid",
    userAffectedName: "João Souza",
    operation: "UPDATE",
    entityType: "PROJECT",
    entityName: "Projeto Atlas",
    entityId: "project-uuid",
    createdAt: "2026-11-01T10:00:00Z",
};

const useAuditDetailMock = vi.mocked(useAuditDetail);

function createDetail(overrides: Partial<AuditDetail> = {}): AuditDetail {
    return {
        ...record,
        oldValue: { name: "Projeto antigo", active: true },
        newValue: { name: "Projeto novo", active: true },
        ...overrides,
    };
}

describe("AuditDetailPanel", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAuditDetailMock.mockReturnValue({
            audit: createDetail(),
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null,
            refetch: vi.fn(),
        });
    });

    it("busca pelo ID da auditoria e compara os valores sem mostrar IDs", () => {
        useAuditDetailMock.mockReturnValue({
            audit: createDetail({
                oldValue: {
                    id: "project-old-id",
                    name: "Projeto antigo",
                    metadata: { ownerId: "owner-old-id", label: "Antigo" },
                    active: true,
                },
                newValue: {
                    id: "project-new-id",
                    name: "Projeto novo",
                    metadata: { ownerId: "owner-new-id", label: "Novo" },
                    active: true,
                },
            }),
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null,
            refetch: vi.fn(),
        });

        render(<AuditDetailPanel record={record} onClose={vi.fn()} />);

        expect(screen.getByRole("complementary", { name: "Detalhes do evento" })).toBeInTheDocument();
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect(useAuditDetailMock).toHaveBeenCalledWith("audit-uuid");
        expect(screen.getByText("Projeto Atlas")).toBeInTheDocument();
        expect(screen.getByText("Ana Silva")).toBeInTheDocument();
        expect(screen.getByText("João Souza")).toBeInTheDocument();
        expect(screen.getByText("Projeto antigo")).toBeInTheDocument();
        expect(screen.getByText("Projeto novo")).toBeInTheDocument();
        expect(screen.queryByText("project-uuid")).not.toBeInTheDocument();
        expect(screen.queryByText("project-old-id")).not.toBeInTheDocument();
        expect(screen.queryByText("project-new-id")).not.toBeInTheDocument();
        expect(screen.queryByText("owner-old-id")).not.toBeInTheDocument();
        expect(screen.queryByText("owner-new-id")).not.toBeInTheDocument();
        expect(screen.queryByText("ID")).not.toBeInTheDocument();
    });

    it("mostra o novo snapshot para CREATE", () => {
        useAuditDetailMock.mockReturnValue({
            audit: createDetail({
                operation: "CREATE",
                oldValue: null,
                newValue: { name: "Nova squad" },
            }),
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null,
            refetch: vi.fn(),
        });

        render(
            <AuditDetailPanel
                record={{ ...record, operation: "CREATE" }}
                onClose={vi.fn()}
            />,
        );

        expect(screen.getByText("Novo valor")).toBeInTheDocument();
        expect(screen.getByText("Nova squad")).toBeInTheDocument();
    });

    it("oculta os IDs internos da skill e mantém nome e nível no snapshot", () => {
        useAuditDetailMock.mockReturnValue({
            audit: createDetail({
                operation: "CREATE",
                entityType: "PROFILE_SKILL",
                oldValue: null,
                newValue: {
                    ID: "profile-skill-uuid",
                    "ID da skill": "skill-uuid",
                    Skill: "Java",
                    "Nível de proficiência": 5,
                },
            }),
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null,
            refetch: vi.fn(),
        });

        render(
            <AuditDetailPanel
                record={{ ...record, operation: "CREATE", entityType: "PROFILE_SKILL" }}
                onClose={vi.fn()}
            />,
        );

        expect(screen.getByText("Java")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.queryByText("ID")).not.toBeInTheDocument();
        expect(screen.queryByText("ID da skill")).not.toBeInTheDocument();
        expect(screen.queryByText("profile-skill-uuid")).not.toBeInTheDocument();
        expect(screen.queryByText("skill-uuid")).not.toBeInTheDocument();
    });

    it("mostra o snapshot anterior para DELETE", () => {
        useAuditDetailMock.mockReturnValue({
            audit: createDetail({
                operation: "DELETE",
                oldValue: { name: "Squad removida" },
                newValue: null,
            }),
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null,
            refetch: vi.fn(),
        });

        render(
            <AuditDetailPanel
                record={{ ...record, operation: "DELETE" }}
                onClose={vi.fn()}
            />,
        );

        expect(screen.getByText("Valor anterior")).toBeInTheDocument();
        expect(screen.getByText("Squad removida")).toBeInTheDocument();
    });

    it("mostra estado de carregamento do detalhe", () => {
        useAuditDetailMock.mockReturnValue({
            audit: undefined,
            isLoading: true,
            isFetching: true,
            isError: false,
            error: null,
            refetch: vi.fn(),
        });

        render(<AuditDetailPanel record={record} onClose={vi.fn()} />);

        expect(screen.getByRole("status")).toHaveTextContent("Carregando detalhes...");
    });

    it("apresenta mensagem segura para registro não encontrado ou não autorizado", () => {
        useAuditDetailMock.mockReturnValue({
            audit: undefined,
            isLoading: false,
            isFetching: false,
            isError: true,
            error: Object.assign(new Error("Not found"), {
                isAxiosError: true,
                response: { status: 404 },
            }),
            refetch: vi.fn(),
        });

        render(<AuditDetailPanel record={record} onClose={vi.fn()} />);

        expect(screen.getByRole("alert")).toHaveTextContent(
            "Registro não encontrado ou você não tem autorização para acessá-lo.",
        );
    });
});
