import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AllocationStep, type AllocationStepProps } from "./AllocationStep";
import type { Match } from "../../types/types";

vi.mock("@/features/profiles", () => ({
    profilesApi: {
        getProfileById: vi.fn().mockImplementation((id: string) => {
            if (id === "mat-1") {
                return Promise.resolve({
                    id: "mat-1",
                    skills: [
                        { skill: { name: "React" } },
                        { skill: { name: "TypeScript" } },
                        { skill: { name: "GraphQL" } },
                        { skill: { name: "Docker" } },
                    ],
                });
            }
            return Promise.resolve({ id, skills: [] });
        }),
    },
}));

function renderWithClient(ui: React.ReactElement) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
}

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
        renderWithClient(
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
        renderWithClient(
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
        renderWithClient(
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

        const roleInputs = screen.getAllByLabelText(/Papel/i);
        expect(roleInputs).toHaveLength(2);

        expect(screen.queryByLabelText(/Dedicação/i)).not.toBeInTheDocument();
    });

    it("deve disparar onBack ao clicar em Voltar", async () => {
        const handleBack = vi.fn();
        const user = userEvent.setup();

        renderWithClient(
            <AllocationStep
                vaga={mockVaga}
                selectedMatches={mockMatches}
                onBack={handleBack}
                onConfirm={vi.fn()}
            />
        );

        const backButton = screen.getByRole("button", { name: "Voltar" });
        await user.click(backButton);

        expect(handleBack).toHaveBeenCalledTimes(1);
    });

    it("deve exigir a seleção de 1 candidato entre múltiplos finalistas e disparar onConfirm apenas com ele", async () => {
        const handleConfirm = vi.fn();
        const user = userEvent.setup();

        renderWithClient(
            <AllocationStep
                vaga={mockVaga}
                selectedMatches={mockMatches}
                onBack={vi.fn()}
                onConfirm={handleConfirm}
            />
        );

        const initialConfirmBtn = screen.getByRole("button", { name: "Confirmar Alocação do Recurso" });
        expect(initialConfirmBtn).toBeDisabled();

        const roleInputs = screen.getAllByLabelText(/Papel/i);
        await user.clear(roleInputs[1]);
        await user.type(roleInputs[1], "Dev Fullstack Lead");

        const dateInputs = screen.getAllByLabelText(/Data Início/i);
        fireEvent.change(dateInputs[1], { target: { value: "2026-12-01" } });

        const radioMariana = screen.getByRole("radio", { name: "Selecionar Mariana Costa" });
        await user.click(radioMariana);

        const confirmBtn = screen.getByRole("button", { name: "Confirmar Alocação de Mariana" });
        expect(confirmBtn).toBeEnabled();
        await user.click(confirmBtn);

        expect(handleConfirm).toHaveBeenCalledTimes(1);
        const result = handleConfirm.mock.calls[0][0];
        expect(result).toMatchObject({
            resourceId: "mat-2",
            resourceName: "Mariana Costa",
            startDate: "2026-12-01",
            role: "Dev Fullstack Lead",
        });
    });

    it("deve pré-selecionar automaticamente quando houver apenas 1 candidato selecionado", async () => {
        const handleConfirm = vi.fn();
        const user = userEvent.setup();

        renderWithClient(
            <AllocationStep
                vaga={mockVaga}
                selectedMatches={[mockMatches[0]]}
                onBack={vi.fn()}
                onConfirm={handleConfirm}
            />
        );

        const radioLucas = screen.getByRole("radio", { name: "Selecionar Lucas Silveira" });
        expect(radioLucas).toBeChecked();

        const confirmBtn = screen.getByRole("button", { name: "Confirmar Alocação de Lucas" });
        expect(confirmBtn).toBeEnabled();
        await user.click(confirmBtn);

        expect(handleConfirm).toHaveBeenCalledTimes(1);
        expect(handleConfirm.mock.calls[0][0]).toMatchObject({
            resourceId: "mat-1",
            resourceName: "Lucas Silveira",
            role: "Senior Frontend",
        });
    });

    it("deve ordenar os cards de recursos por porcentagem de match em ordem decrescente", () => {
        const unorderedMatches: Match[] = [
            {
                id: "caique",
                name: "Caique Lima",
                description: "Backend Developer",
                matchScore: 25,
                rankingScore: 3,
                mainSkills: [],
            },
            {
                id: "diogo",
                name: "Diogo Carrasco",
                description: "Frontend",
                matchScore: 50,
                rankingScore: 2,
                mainSkills: [],
            },
            {
                id: "caio",
                name: "Caio do Prado Gaspar",
                description: "Java Consultant",
                matchScore: 68,
                rankingScore: 1,
                mainSkills: [],
            },
        ];

        renderWithClient(
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

    it("deve exibir erro e impedir confirmação quando papel ou data estiverem vazios", async () => {
        const handleConfirm = vi.fn();
        const user = userEvent.setup();

        renderWithClient(
            <AllocationStep
                vaga={mockVaga}
                selectedMatches={[mockMatches[0]]}
                onBack={vi.fn()}
                onConfirm={handleConfirm}
            />
        );

        const roleInput = screen.getByLabelText(/Papel/i);
        await user.clear(roleInput);

        const dateInput = screen.getByLabelText(/Data Início/i);
        fireEvent.change(dateInput, { target: { value: "" } });

        await user.click(screen.getByRole("button", { name: "Confirmar Alocação de Lucas" }));

        expect(screen.getByText("Informe a data de início")).toBeInTheDocument();
        expect(screen.getByText("Informe o papel")).toBeInTheDocument();
        expect(handleConfirm).not.toHaveBeenCalled();
    });

    describe("RN02 - Restrição de Seleção por Disponibilidade na Alocação", () => {
        const allocatedMatch: Match = {
            id: "mat-alloc",
            name: "Roberto Mendes",
            photoUrl: undefined,
            description: "Senior Backend",
            squadName: "Squad Pagamentos",
            rankingScore: 1,
            matchScore: 92,
            availability: "allocated",
            mainSkills: [],
        };

        const availableMatch: Match = {
            id: "mat-avail",
            name: "Lucas Silveira",
            photoUrl: undefined,
            description: "Senior Frontend",
            squadName: "Squad Checkout",
            rankingScore: 2,
            matchScore: 89,
            availability: "available",
            mainSkills: [],
        };

        it("deve desativar a ação de seleção (radio/card) para recurso em projeto (RN02)", async () => {
            const handleConfirm = vi.fn();
            const user = userEvent.setup();

            renderWithClient(
                <AllocationStep
                    vaga={mockVaga}
                    selectedMatches={[allocatedMatch, availableMatch]}
                    onBack={vi.fn()}
                    onConfirm={handleConfirm}
                />
            );

            const allocRadio = screen.getByRole("radio", { name: /Roberto Mendes está em projeto/i });
            const availRadio = screen.getByRole("radio", { name: /Selecionar Lucas Silveira/i });

            expect(allocRadio).toBeDisabled();
            expect(availRadio).toBeEnabled();
            expect(screen.getByText("Indisponível (Em projeto)")).toBeInTheDocument();

            // Clicar no radio desativado não deve selecioná-lo
            await user.click(allocRadio);
            expect(allocRadio).not.toBeChecked();

            // Clicar no recurso disponível deve selecioná-lo
            await user.click(availRadio);
            expect(availRadio).toBeChecked();
            expect(screen.getByRole("button", { name: /Confirmar Alocação de Lucas/i })).toBeEnabled();
        });

        it("não deve auto-selecionar candidato único se ele estiver em projeto (RN02)", () => {
            renderWithClient(
                <AllocationStep
                    vaga={mockVaga}
                    selectedMatches={[allocatedMatch]}
                    onBack={vi.fn()}
                    onConfirm={vi.fn()}
                />
            );

            const radio = screen.getByRole("radio", { name: /Roberto Mendes está em projeto/i });
            expect(radio).toBeDisabled();
            expect(radio).not.toBeChecked();

            const confirmBtn = screen.getByRole("button", { name: /Confirmar Alocação do Recurso/i });
            expect(confirmBtn).toBeDisabled();
        });

        it("deve carregar e exibir todas as skills do candidato vindas do perfil", async () => {
            renderWithClient(
                <AllocationStep
                    vaga={mockVaga}
                    selectedMatches={mockMatches}
                    onBack={vi.fn()}
                    onConfirm={vi.fn()}
                />
            );

            await waitFor(() => {
                expect(screen.getByText("GraphQL")).toBeInTheDocument();
                expect(screen.getByText("Docker")).toBeInTheDocument();
            });
        });
    });
});

