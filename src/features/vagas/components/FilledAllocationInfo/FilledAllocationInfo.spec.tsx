import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FilledAllocationInfo } from "./FilledAllocationInfo";
import type { JobPostingAllocationResponse } from "../../types/types";

describe("FilledAllocationInfo Component", () => {
    it("deve renderizar estado de carregamento quando loading for true", () => {
        render(<FilledAllocationInfo allocations={[]} loading />);
        expect(screen.getByText(/Carregando motivo do preenchimento da vaga/i)).toBeInTheDocument();
    });

    it("deve renderizar mensagem de erro quando error for true", () => {
        render(<FilledAllocationInfo allocations={[]} error />);
        expect(screen.getByText(/Não foi possível carregar os detalhes da alocação/i)).toBeInTheDocument();
    });

    it("deve indicar preenchimento manual quando não houver alocações registradas", () => {
        render(<FilledAllocationInfo allocations={[]} />);
        expect(screen.getByText(/Vaga marcada manualmente como/i)).toBeInTheDocument();
    });

    it("deve exibir o recurso alocado, papel, squad/projeto e data de início quando preenchida por alocação", () => {
        const mockAllocations: JobPostingAllocationResponse[] = [
            {
                id: "alloc-1",
                jobPostingId: "vaga-1",
                resourceId: "rec-1",
                resourceName: "Caio do Prado Gaspar",
                projectName: "Iris Mobile",
                squadName: "Squad Pagamentos",
                startDate: "2026-11-15",
                role: "Java Consultant",
                active: true,
                createdAt: "2026-11-11T10:00:00Z",
                createdBy: "admin@vilt-group.com",
            },
        ];

        render(<FilledAllocationInfo allocations={mockAllocations} />);

        expect(screen.getByText("Vaga preenchida por alocação de recurso")).toBeInTheDocument();
        expect(screen.getByText("Caio do Prado Gaspar")).toBeInTheDocument();
        expect(screen.getByText("Java Consultant")).toBeInTheDocument();
        expect(screen.getByText("Iris Mobile • Squad Pagamentos")).toBeInTheDocument();
        expect(screen.getByText(/Início: 15\/11\/2026/)).toBeInTheDocument();
        expect(screen.getByText("admin@vilt-group.com")).toBeInTheDocument();
        expect(screen.getByText(/em 11\/11\/2026/)).toBeInTheDocument();
    });
});

