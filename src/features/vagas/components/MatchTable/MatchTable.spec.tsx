import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MatchTable } from "./MatchTable";
import type { Match } from "../../types/types";

const mockMatches: Match[] = [
    {
        id: "mat-1",
        name: "Lucas Silveira",
        photoUrl: "https://example.com/lucas.jpg",
        description: "Senior Frontend",
        squadName: "Squad Pagamentos",
        rankingScore: 1,
        matchScore: 96,
        availability: "available",
        mainSkills: [
            { name: "React", contributionPercent: 50 },
        ],
    },
    {
        id: "mat-2",
        name: "Mariana Costa",
        photoUrl: undefined,
        description: "Pleno Fullstack",
        squadName: "Squad Checkout",
        rankingScore: 2,
        matchScore: 88,
        availability: "waiting",
        mainSkills: [],
    },
];

describe("MatchTable Component", () => {
    it("deve renderizar as colunas padrão e os dados dos candidatos", () => {
        render(<MatchTable data={mockMatches} />);

        expect(screen.getByText("Ranking")).toBeInTheDocument();
        expect(screen.getByText("Recurso")).toBeInTheDocument();
        expect(screen.getByText("Squad")).toBeInTheDocument();
        expect(screen.getByText("Disponibilidade")).toBeInTheDocument();
        expect(screen.getByText("Match")).toBeInTheDocument();

        expect(screen.getByText("Lucas Silveira")).toBeInTheDocument();
        expect(screen.getByText("Mariana Costa")).toBeInTheDocument();
        expect(screen.getByText("Squad Pagamentos")).toBeInTheDocument();
        expect(screen.getByText("Disponível")).toBeInTheDocument();
        expect(screen.getByText("Aguardando")).toBeInTheDocument();
    });

    it("deve renderizar a coluna de checkbox quando onToggleSelect for passado", () => {
        render(
            <MatchTable
                data={mockMatches}
                selectedIds={["mat-1"]}
                onToggleSelect={vi.fn()}
                onSelectAll={vi.fn()}
            />
        );

        const selectAllCheckbox = screen.getByRole("checkbox", { name: "Selecionar todos os recursos" });
        expect(selectAllCheckbox).toBeInTheDocument();
        expect(selectAllCheckbox).not.toBeChecked();

        const rowCheckbox1 = screen.getByRole("checkbox", { name: "Selecionar Lucas Silveira" });
        const rowCheckbox2 = screen.getByRole("checkbox", { name: "Selecionar Mariana Costa" });

        expect(rowCheckbox1).toBeChecked();
        expect(rowCheckbox2).not.toBeChecked();
    });

    it("deve disparar onToggleSelect ao clicar no checkbox de um recurso", async () => {
        const handleToggle = vi.fn();
        const user = userEvent.setup();

        render(
            <MatchTable
                data={mockMatches}
                selectedIds={[]}
                onToggleSelect={handleToggle}
            />
        );

        const rowCheckbox2 = screen.getByRole("checkbox", { name: "Selecionar Mariana Costa" });
        await user.click(rowCheckbox2);

        expect(handleToggle).toHaveBeenCalledTimes(1);
        expect(handleToggle).toHaveBeenCalledWith(mockMatches[1]);
    });

    it("deve disparar onSelectAll ao clicar no checkbox do cabeçalho", async () => {
        const handleSelectAll = vi.fn();
        const user = userEvent.setup();

        render(
            <MatchTable
                data={mockMatches}
                selectedIds={[]}
                onToggleSelect={vi.fn()}
                onSelectAll={handleSelectAll}
            />
        );

        const selectAllCheckbox = screen.getByRole("checkbox", { name: "Selecionar todos os recursos" });
        await user.click(selectAllCheckbox);

        expect(handleSelectAll).toHaveBeenCalledTimes(1);
        expect(handleSelectAll).toHaveBeenCalledWith(mockMatches);
    });

    it("deve disparar onView ao clicar no botão de visualizar", async () => {
        const handleView = vi.fn();
        const user = userEvent.setup();

        render(<MatchTable data={mockMatches} onView={handleView} />);

        const viewButtons = screen.getAllByTitle("Visualizar");
        await user.click(viewButtons[0]);

        expect(handleView).toHaveBeenCalledTimes(1);
        expect(handleView).toHaveBeenCalledWith(mockMatches[0]);
    });
});

