import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AllocationStep, type AllocationStepProps } from "./AllocationStep";
import type { Match } from "../../types/types";

const mockVaga: AllocationStepProps["vaga"] = {
    title: "Desenvolvedor Frontend Senior",
    vacancyCode: "VG-2026-042",
    projectName: "Iris Mobile",
    squadName: "Squad Pagamentos",
    experienceLevel: "SENIOR",
    modality: "REMOTO",
    estimatedAllocationWeeks: 24,
    recruiter: "Ana Souza",
    isUrgent: true,
    status: "ALLOCATING",
    skills: [
        { name: "React", type: "MANDATORY" },
        { name: "TypeScript", type: "MANDATORY" },
        { name: "Tailwind", type: "DESIRABLE" },
    ],
};

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
            { name: "TypeScript", contributionPercent: 40 },
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
        availability: "available",
        mainSkills: [
            { name: "React", contributionPercent: 45 },
        ],
    },
];

describe("AllocationStep Component", () => {
    it("deve renderizar o resumo da vaga com todas as informações", () => {
        render(
            <AllocationStep
                vaga={mockVaga}
                selectedMatches={mockMatches}
                onBack={vi.fn()}
                onConfirm={vi.fn()}
            />
        );

        expect(screen.getByText("Resumo da Vaga")).toBeInTheDocument();
        expect(screen.getByText("Desenvolvedor Frontend Senior")).toBeInTheDocument();
        expect(screen.getByText("#VG-2026-042")).toBeInTheDocument();
        expect(screen.getByText(/Em Alocação/i)).toBeInTheDocument();
        expect(screen.getByText(/Urgente/i)).toBeInTheDocument();

        expect(screen.getByText("Iris Mobile")).toBeInTheDocument();
        expect(screen.getByText("Squad Pagamentos")).toBeInTheDocument();
        expect(screen.getByText("Sênior")).toBeInTheDocument();
        expect(screen.getByText("Remoto")).toBeInTheDocument();
        expect(screen.getByText("24 semanas")).toBeInTheDocument();
        expect(screen.getByText("Ana Souza")).toBeInTheDocument();
        expect(screen.getByText("React, TypeScript")).toBeInTheDocument();
    });

    it("deve renderizar mensagem de lista vazia quando não houver recursos selecionados", () => {
        render(
            <AllocationStep
                vaga={mockVaga}
                selectedMatches={[]}
                onBack={vi.fn()}
                onConfirm={vi.fn()}
            />
        );

        expect(screen.getByText(/Nenhum recurso selecionado para alocação/i)).toBeInTheDocument();
        const confirmBtn = screen.getByRole("button", { name: /Confirmar Alocação/i });
        expect(confirmBtn).toBeDisabled();
    });

    it("deve renderizar os cards dos recursos selecionados com scores e inputs", () => {
        render(
            <AllocationStep
                vaga={mockVaga}
                selectedMatches={mockMatches}
                onBack={vi.fn()}
                onConfirm={vi.fn()}
            />
        );

        expect(screen.getByText("Lucas Silveira")).toBeInTheDocument();
        expect(screen.getByText("96% Match")).toBeInTheDocument();
        expect(screen.getByText("Mariana Costa")).toBeInTheDocument();
        expect(screen.getByText("88% Match")).toBeInTheDocument();

        const dateInputs = screen.getAllByLabelText(/Data Início/i);
        expect(dateInputs).toHaveLength(2);

        const dedicationSelects = screen.getAllByLabelText(/Dedicação/i);
        expect(dedicationSelects).toHaveLength(2);

        const roleInputs = screen.getAllByLabelText(/Papel/i);
        expect(roleInputs).toHaveLength(2);
    });

    it("deve disparar onBack ao clicar em Voltar ao Match", async () => {
        const handleBack = vi.fn();
        const user = userEvent.setup();

        render(
            <AllocationStep
                vaga={mockVaga}
                selectedMatches={mockMatches}
                onBack={handleBack}
                onConfirm={vi.fn()}
            />
        );

        const backButton = screen.getByRole("button", { name: "Voltar ao Match" });
        await user.click(backButton);

        expect(handleBack).toHaveBeenCalledTimes(1);
    });

    it("deve atualizar os campos e disparar onConfirm com os dados preenchidos", async () => {
        const handleConfirm = vi.fn();
        const user = userEvent.setup();

        render(
            <AllocationStep
                vaga={mockVaga}
                selectedMatches={mockMatches}
                onBack={vi.fn()}
                onConfirm={handleConfirm}
            />
        );

        const roleInputs = screen.getAllByLabelText(/Papel/i);
        await user.clear(roleInputs[0]);
        await user.type(roleInputs[0], "Tech Lead Frontend");

        const dedicationSelects = screen.getAllByLabelText(/Dedicação/i);
        fireEvent.change(dedicationSelects[1], { target: { value: "50%" } });

        const confirmBtn = screen.getByRole("button", { name: "Confirmar Alocação dos 2 Recursos" });
        await user.click(confirmBtn);

        expect(handleConfirm).toHaveBeenCalledTimes(1);
        const result = handleConfirm.mock.calls[0][0];
        expect(result).toHaveLength(2);
        expect(result[0]).toMatchObject({
            resourceId: "mat-1",
            resourceName: "Lucas Silveira",
            dedication: "100%",
            role: "Tech Lead Frontend",
        });
        expect(result[1]).toMatchObject({
            resourceId: "mat-2",
            resourceName: "Mariana Costa",
            dedication: "50%",
        });
    });

    it("deve ordenar os cards de recursos por porcentagem de match em ordem decrescente", () => {
        const unorderedMatches: Match[] = [
            {
                id: "caique",
                name: "Caique Lima",
                matchScore: 25,
                rankingScore: 3,
            },
            {
                id: "diogo",
                name: "Diogo Carrasco",
                matchScore: 50,
                rankingScore: 2,
            },
            {
                id: "caio",
                name: "Caio do Prado Gaspar",
                matchScore: 68,
                rankingScore: 1,
            },
        ];

        render(
            <AllocationStep
                vaga={mockVaga}
                selectedMatches={unorderedMatches}
                onBack={vi.fn()}
                onConfirm={vi.fn()}
            />
        );

        const names = screen.getAllByRole("heading", { level: 4 }).map((el) => el.textContent);
        expect(names).toEqual([
            "Caio do Prado Gaspar",
            "Diogo Carrasco",
            "Caique Lima",
        ]);
    });
});

