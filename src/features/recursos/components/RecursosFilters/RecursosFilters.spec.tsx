import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecursosFilters } from "./RecursosFilters";
import { EMPTY_PROFILE_FILTERS } from "../../types/profileFilters";

describe("Componente RecursosFilters", () => {
    const defaultProps = {
        filters: { ...EMPTY_PROFILE_FILTERS },
        projects: [
            { id: "p1", name: "Plataforma Digital" },
            { id: "p2", name: "Portal Cliente" },
        ],
        onChange: vi.fn(),
        onApply: vi.fn(),
        onClear: vi.fn(),
    };

    it("deve renderizar os campos de filtro", () => {
        render(<RecursosFilters {...defaultProps} />);

        expect(screen.getByText("Nome ou E-mail")).toBeInTheDocument();
        expect(screen.getByText("Status do Recurso")).toBeInTheDocument();
        expect(screen.getByText("Status da Matrícula")).toBeInTheDocument();
        expect(screen.getByText("Gerente do Projeto")).toBeInTheDocument();
        expect(screen.getByText("Projeto")).toBeInTheDocument();
        expect(screen.getByText("Billable")).toBeInTheDocument();
        expect(screen.getByText("Onboarding Porto realizado?")).toBeInTheDocument();
        expect(screen.getByText("Período de Entrada no Projeto")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Buscar por nome ou e-mail")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Digitar nome do gerente")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Limpar filtros/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Filtrar" })).toBeInTheDocument();
    });

    it("deve exibir opções de projeto recebidas por props", () => {
        render(<RecursosFilters {...defaultProps} />);

        expect(screen.getByRole("option", { name: "Plataforma Digital" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Portal Cliente" })).toBeInTheDocument();
    });

    it("deve chamar onChange ao digitar no campo de busca", async () => {
        const onChange = vi.fn();
        render(<RecursosFilters {...defaultProps} onChange={onChange} />);

        await userEvent.type(screen.getByPlaceholderText("Buscar por nome ou e-mail"), "A");

        expect(onChange).toHaveBeenCalledWith("nome", "A");
    });

    it("deve chamar onChange ao alterar o status do recurso", () => {
        const onChange = vi.fn();
        render(<RecursosFilters {...defaultProps} onChange={onChange} />);

        const selects = screen.getAllByRole("combobox");
        fireEvent.change(selects[0], { target: { value: "WAITING" } });

        expect(onChange).toHaveBeenCalledWith("statusRecurso", "WAITING");
    });

    it("deve chamar onApply ao clicar em Filtrar", () => {
        const onApply = vi.fn();
        render(<RecursosFilters {...defaultProps} onApply={onApply} />);

        fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));

        expect(onApply).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onClear ao clicar em Limpar filtros", () => {
        const onClear = vi.fn();
        render(<RecursosFilters {...defaultProps} onClear={onClear} />);

        fireEvent.click(screen.getByRole("button", { name: /Limpar filtros/i }));

        expect(onClear).toHaveBeenCalledTimes(1);
    });
});
