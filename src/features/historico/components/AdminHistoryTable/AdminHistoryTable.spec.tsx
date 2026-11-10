import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AuditSummary } from "../../types/historico";
import { AdminHistoryTable } from "./AdminHistoryTable";

const record: AuditSummary = {
    id: "audit-uuid",
    userId: "executor-uuid",
    userName: "Ana Silva",
    userAffectedId: "affected-uuid",
    userAffectedName: "João Souza",
    operation: "CREATE",
    entityType: "PROJECT",
    entityName: "Projeto Atlas",
    entityId: "project-uuid",
    createdAt: "2026-11-01T10:00:00Z",
};

describe("AdminHistoryTable", () => {
    it("exibe o usuário afetado sem mostrar executor, IDs nem snapshots", () => {
        render(<AdminHistoryTable records={[record]} onView={vi.fn()} />);

        expect(screen.getByText("João Souza")).toBeInTheDocument();
        expect(screen.getByText("Projeto Atlas")).toBeInTheDocument();
        expect(screen.getByText("Projeto")).toBeInTheDocument();
        expect(screen.queryByText("Ana Silva")).not.toBeInTheDocument();
        expect(screen.queryByText("executor-uuid")).not.toBeInTheDocument();
        expect(screen.queryByText("affected-uuid")).not.toBeInTheDocument();
        expect(screen.queryByText("project-uuid")).not.toBeInTheDocument();
        expect(screen.queryByText(/oldValue|newValue/)).not.toBeInTheDocument();
    });

    it("mostra fallback para usuário afetado que não veio na resposta", () => {
        render(
            <AdminHistoryTable
                records={[{ ...record, userName: null, userAffectedName: null }]}
                onView={vi.fn()}
            />,
        );

        expect(screen.getByText("Não identificado")).toBeInTheDocument();
    });

    it("notifica a seleção do registro pelo botão de detalhes", () => {
        const onView = vi.fn();
        render(<AdminHistoryTable records={[record]} onView={onView} />);

        fireEvent.click(screen.getByRole("button", {
            name: "Visualizar detalhes da auditoria audit-uuid",
        }));

        expect(onView).toHaveBeenCalledWith(record);
    });

    it.each([null, ""])("mostra fallback quando entityName está ausente ou vazio (%s)", (entityName) => {
        render(
            <AdminHistoryTable
                records={[{ ...record, entityName }]}
                onView={vi.fn()}
            />,
        );

        expect(screen.getByText("Contexto indisponível")).toBeInTheDocument();
    });

    it("exibe a descrição recebida para registros de Squad", () => {
        const squadRecord: AuditSummary = {
            ...record,
            entityType: "SQUAD",
            entityName: "Squad Alfa",
            description: "Vínculo de projeto: Projeto Atlas",
        };
        render(<AdminHistoryTable records={[squadRecord]} onView={vi.fn()} />);

        expect(screen.getByText("Vínculo de projeto: Projeto Atlas")).toBeInTheDocument();
    });

    it.each([
        "Squad adicionada: Squad de Dados",
        "Squad removida: Squad de Dados",
    ])("exibe a descrição recebida para registros de Projeto: %s", (description) => {
        const projectRecord: AuditSummary = {
            ...record,
            entityType: "PROJECT",
            entityName: "Projeto Atlas",
            description,
        };
        render(<AdminHistoryTable records={[projectRecord]} onView={vi.fn()} />);

        expect(screen.getByText(description)).toBeInTheDocument();
        expect(screen.getByText("Projeto Atlas")).toBeInTheDocument();
    });

    it.each([null, "", "   "])(
        "mantém a apresentação atual para Squad sem descrição (%s)",
        (description) => {
            const squadRecord: AuditSummary = {
                ...record,
                entityType: "SQUAD",
                entityName: "Squad Alfa",
                description,
            };
            render(<AdminHistoryTable records={[squadRecord]} onView={vi.fn()} />);

            expect(screen.getByText("Squad Alfa")).toBeInTheDocument();
            expect(screen.queryByText(/Vínculo de projeto/)).not.toBeInTheDocument();
        },
    );

    it("não exibe descrição para outros tipos de registro", () => {
        render(
            <AdminHistoryTable
                records={[{ ...record, entityType: "PROFILE", description: "Descrição do backend" }]}
                onView={vi.fn()}
            />,
        );

        expect(screen.queryByText("Descrição do backend")).not.toBeInTheDocument();
    });
});
