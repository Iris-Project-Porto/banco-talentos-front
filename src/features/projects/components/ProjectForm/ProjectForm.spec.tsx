import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectForm } from "./ProjectForm";

describe("Componente ProjectForm", () => {
    it("deve renderizar a página de cadastro quando não houver ID inicial", () => {
        render(<ProjectForm initial={{}} saving={false} onSave={vi.fn()} onCancel={vi.fn()} />);

        expect(screen.getByText("Cadastrar Projeto")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
    });

    it("deve renderizar os campos do formulário", () => {
        render(<ProjectForm initial={{}} saving={false} onSave={vi.fn()} onCancel={vi.fn()} />);

        expect(screen.getByText("NOME DO PROJETO *")).toBeInTheDocument();
        expect(screen.getByText("DESCRIÇÃO *")).toBeInTheDocument();
    });

    it("deve renderizar a página de edição e o campo de status", () => {
        render(
            <ProjectForm
                initial={{
                    id: "project-1",
                    name: "Migração de Cloud",
                    description: "Desc",
                    active: false,
                }}
                saving={false}
                onSave={vi.fn()}
                onCancel={vi.fn()}
            />,
        );

        expect(screen.getByText("Editar Projeto")).toBeInTheDocument();
        expect(screen.getByText("STATUS")).toBeInTheDocument();
    });

    it("deve invocar onCancel ao clicar em voltar", async () => {
        const handleCancel = vi.fn();
        render(<ProjectForm initial={{}} saving={false} onSave={vi.fn()} onCancel={handleCancel} />);

        await userEvent.click(screen.getByRole("button", { name: "Voltar para projetos" }));

        expect(handleCancel).toHaveBeenCalledOnce();
    });

    it("deve manter o botão de salvar desabilitado enquanto os campos obrigatórios estiverem vazios", () => {
        render(<ProjectForm initial={{}} saving={false} onSave={vi.fn()} onCancel={vi.fn()} />);

        expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    });

    it("deve habilitar o botão de salvar quando os campos obrigatórios estiverem preenchidos", async () => {
        render(<ProjectForm initial={{}} saving={false} onSave={vi.fn()} onCancel={vi.fn()} />);

        await userEvent.type(
            screen.getByPlaceholderText("Ex: Migração de Cloud, Portal do Cliente..."),
            "Portal do Cliente",
        );
        await userEvent.type(
            screen.getByPlaceholderText("Descreva brevemente o objetivo do projeto"),
            "Portal web para clientes",
        );

        expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    });

    it("deve exibir erro ao cadastrar um projeto com nome duplicado", async () => {
        render(
            <ProjectForm
                initial={{}}
                existingProjects={[{ id: "1", name: "Migração de Cloud" }]}
                saving={false}
                onSave={vi.fn()}
                onCancel={vi.fn()}
            />,
        );

        await userEvent.type(
            screen.getByPlaceholderText("Ex: Migração de Cloud, Portal do Cliente..."),
            "Migração de Cloud",
        );
        await userEvent.type(
            screen.getByPlaceholderText("Descreva brevemente o objetivo do projeto"),
            "Descrição do projeto",
        );
        await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

        expect(screen.getByText("Já existe um projeto cadastrado com este nome.")).toBeInTheDocument();
    });

    it("deve chamar onSave com os dados corretos ao criar", async () => {
        const handleSave = vi.fn();
        render(<ProjectForm initial={{}} saving={false} onSave={handleSave} onCancel={vi.fn()} />);

        await userEvent.type(
            screen.getByPlaceholderText("Ex: Migração de Cloud, Portal do Cliente..."),
            "Portal do Cliente",
        );
        await userEvent.type(
            screen.getByPlaceholderText("Descreva brevemente o objetivo do projeto"),
            "Portal web para clientes",
        );
        await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

        expect(handleSave).toHaveBeenCalledWith({
            name: "Portal do Cliente",
            description: "Portal web para clientes",
            squadIds: [],
        });
    });

    it("deve chamar onSave com status ao editar", async () => {
        const handleSave = vi.fn();
        render(
            <ProjectForm
                initial={{
                    id: "project-1",
                    name: "Legado",
                    description: "Sistema legado",
                    active: false,
                }}
                saving={false}
                onSave={handleSave}
                onCancel={vi.fn()}
            />,
        );

        await userEvent.selectOptions(screen.getByRole("combobox"), "ACTIVE");
        await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

        expect(handleSave).toHaveBeenCalledWith({
            name: "Legado",
            description: "Sistema legado",
            id: "project-1",
            active: true,
            initialActive: false,
            squadIds: [],
        });
    });

    it("deve invocar onCancel ao clicar em Cancelar", async () => {
        const handleCancel = vi.fn();
        render(<ProjectForm initial={{}} saving={false} onSave={vi.fn()} onCancel={handleCancel} />);

        await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));

        expect(handleCancel).toHaveBeenCalledOnce();
    });

    it("deve desabilitar o botão de salvar durante o envio", () => {
        render(<ProjectForm initial={{}} saving onSave={vi.fn()} onCancel={vi.fn()} />);

        expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    });
});
