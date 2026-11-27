import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FloatingActionButton } from "./FloatingActionButton";

describe("FloatingActionButton", () => {
    it("renderiza o label, tipo button e posicionamento flutuante por padrão", () => {
        render(<FloatingActionButton label="Salvar alterações" />);

        const button = screen.getByRole("button", { name: "Salvar alterações" });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute("type", "button");
        expect(button).toHaveClass("fixed", "bottom-6", "right-6", "bg-pink");
    });

    it("dispara onClick ao ser clicado", () => {
        const handleClick = vi.fn();
        render(<FloatingActionButton label="Salvar" onClick={handleClick} />);

        fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("desabilita o botão e bloqueia cliques quando disabled é true", () => {
        const handleClick = vi.fn();
        render(<FloatingActionButton label="Salvar" disabled onClick={handleClick} />);

        const button = screen.getByRole("button", { name: "Salvar" });
        expect(button).toBeDisabled();

        fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it("exibe o spinner, oculta o ícone e desabilita o botão quando loading é true", () => {
        const handleClick = vi.fn();
        render(
            <FloatingActionButton
                label="Salvando"
                loading
                icon={<span data-testid="custom-icon" />}
                onClick={handleClick}
            />,
        );

        const button = screen.getByRole("button", { name: "Salvando" });
        expect(button).toBeDisabled();
        expect(screen.queryByTestId("custom-icon")).not.toBeInTheDocument();
        expect(button.querySelector(".animate-spin")).toBeInTheDocument();

        fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it("renderiza o ícone à esquerda por padrão e à direita quando iconPosition='right'", () => {
        const { rerender } = render(
            <FloatingActionButton
                label="Avançar"
                icon={<span data-testid="custom-icon">→</span>}
            />,
        );

        let button = screen.getByRole("button", { name: /Avançar/ });
        expect(button.firstElementChild).toHaveAttribute("data-testid", "custom-icon");

        rerender(
            <FloatingActionButton
                label="Avançar"
                icon={<span data-testid="custom-icon">→</span>}
                iconPosition="right"
            />,
        );

        button = screen.getByRole("button", { name: /Avançar/ });
        expect(button.lastElementChild).toHaveAttribute("data-testid", "custom-icon");
    });

    it("aplica estilos da variante secondary quando informada", () => {
        render(<FloatingActionButton label="Salvar" variant="secondary" />);

        const button = screen.getByRole("button", { name: "Salvar" });
        expect(button).toHaveClass("bg-white", "text-slate-700");
        expect(button).not.toHaveClass("bg-pink");
    });

    it("remove as classes de posicionamento fixo quando floating é false", () => {
        render(<FloatingActionButton label="Salvar" floating={false} />);

        const button = screen.getByRole("button", { name: "Salvar" });
        expect(button).not.toHaveClass("fixed", "bottom-6", "right-6");
    });
});