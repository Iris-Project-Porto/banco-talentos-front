import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuditList } from "@/features/historico/hooks/useHistorico";
import { useAuditDetail } from "@/features/historico/hooks/useAuditDetail";
import type { AuditSummary } from "@/features/historico/types/historico";
import Historico from "./Historico";

vi.mock("@/features/historico/hooks/useHistorico", () => ({
    useAuditList: vi.fn(),
}));

vi.mock("@/features/historico/hooks/useAuditDetail", () => ({
    useAuditDetail: vi.fn(),
}));

const useAuditListMock = vi.mocked(useAuditList);
const useAuditDetailMock = vi.mocked(useAuditDetail);

function createRecord(
    id: string,
    entityType: string,
    userName: string | null = null,
    userAffectedName: string | null = null,
): AuditSummary {
    return {
        id,
        userId: null,
        userName,
        userAffectedId: null,
        userAffectedName,
        operation: "CREATE",
        entityType,
        entityId: `${id}-entity`,
        createdAt: "2026-11-01T10:00:00Z",
    };
}

const records = [
    {
        ...createRecord("project-audit", "PROJECT", "Ana Silva", "Bruno Souza"),
        entityName: "Projeto Atlas",
        description: "Squad adicionada: Squad de Dados",
    },
    createRecord("squad-audit", "SQUAD", "Carla Lima", "Ana Paula"),
    createRecord("profile-skill-audit", "PROFILE_SKILL", "Marina Costa", null),
    createRecord("unknown-audit", "UNRECOGNIZED"),
];

describe("Historico admin", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAuditListMock.mockReturnValue({
            audits: records,
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null,
            refetch: vi.fn(),
        });
        useAuditDetailMock.mockReturnValue({
            audit: undefined,
            isLoading: true,
            isFetching: true,
            isError: false,
            error: null,
            refetch: vi.fn(),
        });
    });

    it("categoriza pelos tipos conhecidos e não exibe uma aba para tipos desconhecidos", () => {
        render(<Historico />);

        expect(screen.getAllByRole("tab")).toHaveLength(3);
        expect(screen.queryByRole("tab", { name: "Outros" })).not.toBeInTheDocument();
        expect(screen.getByText("Total de registros: 1")).toBeInTheDocument();
        expect(screen.getByText("Projeto")).toBeInTheDocument();
        expect(screen.queryByText("Skill do perfil")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("tab", { name: "Squads" }));
        expect(screen.getByText("Squad")).toBeInTheDocument();
        expect(screen.queryByText("Projeto")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("tab", { name: "Recursos" }));
        expect(screen.getByText("Skill do perfil")).toBeInTheDocument();
        expect(screen.queryByText("UNRECOGNIZED")).not.toBeInTheDocument();
    });

    it("busca por descrição dentro da categoria ativa sem nova chamada à API", () => {
        render(<Historico />);
        const input = screen.getByRole("textbox", {
            name: "Buscar por usuário, entidade, descrição ou operação",
        });
        fireEvent.change(input, { target: { value: "SQUAD DE DADOS" } });

        expect(useAuditListMock).toHaveBeenLastCalledWith();
        expect(screen.getByText("Total de registros: 1")).toBeInTheDocument();
        expect(screen.queryByText("Ana Silva")).not.toBeInTheDocument();
        expect(screen.getByText("Squad adicionada: Squad de Dados")).toBeInTheDocument();
    });

    it("limpa a busca e mostra estado sem correspondências", () => {
        render(<Historico />);
        const input = screen.getByRole("textbox", {
            name: "Buscar por usuário, entidade, descrição ou operação",
        });

        fireEvent.change(input, { target: { value: "ninguém" } });
        expect(screen.getByText("Nenhum registro corresponde à busca nesta categoria.")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Limpar busca" }));
        expect(input).toHaveValue("");
        expect(screen.getByText("Total de registros: 1")).toBeInTheDocument();
        expect(screen.queryByText("Ana Silva")).not.toBeInTheDocument();
    });

    it("abre o painel de detalhe sob demanda usando o ID da auditoria", () => {
        render(<Historico />);

        fireEvent.click(screen.getByRole("button", {
            name: "Visualizar detalhes da auditoria project-audit",
        }));

        expect(screen.getByRole("complementary", { name: "Detalhes do evento" })).toBeInTheDocument();
        expect(screen.getByText("Ana Silva")).toBeInTheDocument();
        expect(useAuditDetailMock).toHaveBeenCalledWith("project-audit");
    });
});
