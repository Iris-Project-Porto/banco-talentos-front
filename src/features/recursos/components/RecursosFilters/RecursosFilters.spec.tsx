import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecursosFilters } from "./RecursosFilters";
import { EMPTY_PROFILE_FILTERS } from "../../types/profileFilters";

describe("Componente RecursosFilters", () => {
    const defaultProps = {
        filters: { ...EMPTY_PROFILE_FILTERS },
        areas: ["Frontend", "Backend"],
        groups: ["Delivery", "Platform"],
        onChange: vi.fn(),
        onApply: vi.fn(),
        onClear: vi.fn(),
    };

    it("deve renderizar os campos de filtro", () => {
        render(<RecursosFilters {...defaultProps} />);

        expect(screen.getByText("NOME / E-MAIL")).toBeInTheDocument();
        expect(screen.getByText("ÁREA")).toBeInTheDocument();
        expect(screen.getByText("GRUPO")).toBeInTheDocument();
        expect(screen.getByText("STATUS")).toBeInTheDocument();
        expect(screen.getByText("ALOCAÇÃO")).toBeInTheDocument();
        expect(screen.getByText("STATUS MATRÍCULA")).toBeInTheDocument();
        expect(screen.getByText("NÍVEL")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Buscar...")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Limpar/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Aplicar Filtros" })).toBeInTheDocument();
    });

    it("deve exibir opções de área e grupo recebidas por props", () => {
        render(<RecursosFilters {...defaultProps} />);

        expect(screen.getByRole("option", { name: "Frontend" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Backend" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Delivery" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Platform" })).toBeInTheDocument();
    });

    it("deve chamar onChange ao digitar no campo de busca", async () => {
        const onChange = vi.fn();
        render(<RecursosFilters {...defaultProps} onChange={onChange} />);

        await userEvent.type(screen.getByPlaceholderText("Buscar..."), "A");

        expect(onChange).toHaveBeenCalledWith("nome", "A");
    });

    it("deve chamar onChange ao alterar a área", () => {
        const onChange = vi.fn();
        render(<RecursosFilters {...defaultProps} onChange={onChange} />);

        const selects = screen.getAllByRole("combobox");
        fireEvent.change(selects[0], { target: { value: "Frontend" } });

        expect(onChange).toHaveBeenCalledWith("area", "Frontend");
    });

    it("deve chamar onApply ao clicar em Aplicar Filtros", () => {
        const onApply = vi.fn();
        render(<RecursosFilters {...defaultProps} onApply={onApply} />);

        fireEvent.click(screen.getByRole("button", { name: "Aplicar Filtros" }));

        expect(onApply).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onClear ao clicar em Limpar", () => {
        const onClear = vi.fn();
        render(<RecursosFilters {...defaultProps} onClear={onClear} />);

        fireEvent.click(screen.getByRole("button", { name: /Limpar/i }));

        expect(onClear).toHaveBeenCalledTimes(1);
    });
});
