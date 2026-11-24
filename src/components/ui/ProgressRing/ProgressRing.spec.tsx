import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressRing, getProgressColor } from "./ProgressRing";

describe("ProgressRing Component", () => {
    describe("getProgressColor helper", () => {
        it("deve retornar text-red-500 para percentuais entre 0 e 33%", () => {
            expect(getProgressColor(0)).toBe("text-red-500");
            expect(getProgressColor(15)).toBe("text-red-500");
            expect(getProgressColor(33)).toBe("text-red-500");
        });

        it("deve retornar text-yellow-500 para percentuais entre 34 e 66%", () => {
            expect(getProgressColor(34)).toBe("text-yellow-500");
            expect(getProgressColor(50)).toBe("text-yellow-500");
            expect(getProgressColor(66)).toBe("text-yellow-500");
        });

        it("deve retornar text-emerald-500 para percentuais entre 67 e 100%", () => {
            expect(getProgressColor(67)).toBe("text-emerald-500");
            expect(getProgressColor(85)).toBe("text-emerald-500");
            expect(getProgressColor(100)).toBe("text-emerald-500");
        });
    });

    describe("Renderização e classes de cores", () => {
        it("deve renderizar a porcentagem formatada", () => {
            render(<ProgressRing value={42} />);
            expect(screen.getByText("42%")).toBeInTheDocument();
            expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "42");
        });

        it("deve aplicar a classe vermelha (text-red-500) para valores <= 33%", () => {
            render(<ProgressRing value={21} />);
            const indicator = screen.getByTestId("progress-ring-indicator");
            expect(indicator).toHaveClass("text-red-500");
        });

        it("deve aplicar a classe amarela (text-yellow-500) para valores entre 34% e 66%", () => {
            render(<ProgressRing value={42} />);
            const indicator = screen.getByTestId("progress-ring-indicator");
            expect(indicator).toHaveClass("text-yellow-500");
        });

        it("deve aplicar a classe verde (text-emerald-500) para valores >= 67%", () => {
            render(<ProgressRing value={90} />);
            const indicator = screen.getByTestId("progress-ring-indicator");
            expect(indicator).toHaveClass("text-emerald-500");
        });

        it("deve permitir sobrescrever a cor através da prop color", () => {
            render(<ProgressRing value={90} color="text-pink" />);
            const indicator = screen.getByTestId("progress-ring-indicator");
            expect(indicator).toHaveClass("text-pink");
            expect(indicator).not.toHaveClass("text-emerald-500");
        });

        it("deve limitar valores menores que 0 e maiores que 100", () => {
            const { rerender } = render(<ProgressRing value={-10} />);
            expect(screen.getByText("0%")).toBeInTheDocument();

            rerender(<ProgressRing value={150} />);
            expect(screen.getByText("100%")).toBeInTheDocument();
        });
    });
});
