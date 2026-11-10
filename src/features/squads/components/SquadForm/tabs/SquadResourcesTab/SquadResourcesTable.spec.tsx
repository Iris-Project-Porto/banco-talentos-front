import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SquadResourcesTable } from "./SquadResourcesTable";
import type { Recurso } from "@/features/recursos/types/recurso";

const mockRecursos: Recurso[] = [
    {
        id: "rec-1",
        name: "Carlos Silva",
        email: "carlos.silva@vilt.com",
        jobTitle: "Desenvolvedor Backend",
        status: "ACTIVE",
        statusRecurso: "AVAILABLE",
        statusMatricula: "NOT_REQUIRED",
        possuiMaquinaCliente: false,
        maquinas: [],
    },
    {
        id: "rec-2",
        name: "Mariana Souza",
        email: "mariana.souza@vilt.com",
        jobTitle: "Tech Lead",
        status: "ACTIVE",
        statusRecurso: "ALLOCATED",
        statusMatricula: "RELEASED",
        possuiMaquinaCliente: true,
        maquinas: [],
    },
];

describe("SquadResourcesTable", () => {
    it("deve renderizar as colunas Recurso, Cargo/Função e Ações quando houver dados", () => {
        render(
            <SquadResourcesTable
                data={mockRecursos}
                onEdit={vi.fn()}
                onRemove={vi.fn()}
            />,
        );

        expect(screen.getByText("Recurso")).toBeInTheDocument();
        expect(screen.getByText("Cargo/Função")).toBeInTheDocument();
        expect(screen.getByText("Ações")).toBeInTheDocument();

        expect(screen.getByText("Carlos Silva")).toBeInTheDocument();
        expect(screen.getByText("carlos.silva@vilt.com")).toBeInTheDocument();
        expect(screen.getByText("Desenvolvedor Backend")).toBeInTheDocument();

        expect(screen.getByText("Mariana Souza")).toBeInTheDocument();
        expect(screen.getByText("Tech Lead")).toBeInTheDocument();
    });

    it("deve renderizar a mensagem de lista vazia", () => {
        render(
            <SquadResourcesTable
                data={[]}
                emptyMessage="Nenhum recurso vinculado"
            />,
        );

        expect(screen.getByText("Nenhum recurso vinculado")).toBeInTheDocument();
    });

    it("deve disparar onEdit ao clicar no botão de editar", async () => {
        const onEdit = vi.fn();
        const user = userEvent.setup();

        render(
            <SquadResourcesTable
                data={mockRecursos}
                onEdit={onEdit}
                onRemove={vi.fn()}
            />,
        );

        const editButtons = screen.getAllByTitle("Editar");
        expect(editButtons.length).toBe(2);

        await user.click(editButtons[0]);
        expect(onEdit).toHaveBeenCalledWith(mockRecursos[0]);
    });

    it("deve disparar onRemove ao clicar no botão de remover", async () => {
        const onRemove = vi.fn();
        const user = userEvent.setup();

        render(
            <SquadResourcesTable
                data={mockRecursos}
                onEdit={vi.fn()}
                onRemove={onRemove}
            />,
        );

        const removeButtons = screen.getAllByTitle("Remover");
        expect(removeButtons.length).toBe(2);

        await user.click(removeButtons[1]);
        expect(onRemove).toHaveBeenCalledWith(mockRecursos[1]);
    });

    it("deve exibir badge 'Já vinculado' para recursos em existingIds", () => {
        render(
            <SquadResourcesTable
                data={mockRecursos}
                existingIds={["rec-1"]}
            />,
        );

        expect(screen.getByText("Já vinculado")).toBeInTheDocument();
    });
});

