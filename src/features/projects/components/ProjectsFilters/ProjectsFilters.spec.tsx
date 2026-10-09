import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectsFilters } from "./ProjectsFilters";

describe("Componente ProjectsFilters", () => {
    const defaultProps = {
        search: "",
        statusType: "ACTIVE" as const,
        onSearchChange: vi.fn(),
        onStatusChange: vi.fn(),
        onClear: vi.fn(),
    };

    it("deve renderizar as abas de status, busca e limpar filtros", () => {
        render(<ProjectsFilters {...defaultProps} />);

        expect(screen.getByRole("button", { name: "Ativos" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Inativos / Histórico" })).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Buscar por nome do projeto...")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Limpar Filtros" })).toBeInTheDocument();
    });

    it("deve exibir o valor de busca informado", () => {
        render(<ProjectsFilters {...defaultProps} search="Cloud" />);

        expect(screen.getByPlaceholderText("Buscar por nome do projeto...")).toHaveValue("Cloud");
    });

    it("deve destacar a aba Inativos quando statusType for INACTIVE", () => {
        render(<ProjectsFilters {...defaultProps} statusType="INACTIVE" />);

        expect(screen.getByRole("button", { name: "Inativos / Histórico" }).className).toContain(
            "bg-white",
        );
        expect(screen.getByRole("button", { name: "Ativos" }).className).toContain("text-slate-500");
    });

    it("deve chamar onSearchChange ao digitar no campo de busca", async () => {
        const onSearchChange = vi.fn();
        render(<ProjectsFilters {...defaultProps} onSearchChange={onSearchChange} />);

        await userEvent.type(screen.getByPlaceholderText("Buscar por nome do projeto..."), "Mi");

        expect(onSearchChange).toHaveBeenCalled();
    });

    it("deve chamar onStatusChange ao clicar nas abas", () => {
        const onStatusChange = vi.fn();
        render(<ProjectsFilters {...defaultProps} onStatusChange={onStatusChange} />);

        fireEvent.click(screen.getByRole("button", { name: "Inativos / Histórico" }));
        expect(onStatusChange).toHaveBeenCalledWith("INACTIVE");

        fireEvent.click(screen.getByRole("button", { name: "Ativos" }));
        expect(onStatusChange).toHaveBeenCalledWith("ACTIVE");
    });

    it("deve chamar onClear ao clicar em Limpar Filtros", () => {
        const onClear = vi.fn();
        render(<ProjectsFilters {...defaultProps} onClear={onClear} />);

        fireEvent.click(screen.getByRole("button", { name: "Limpar Filtros" }));

        expect(onClear).toHaveBeenCalledTimes(1);
    });
});
