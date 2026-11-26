import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MatchResources } from "./ResourceMatch";
import { vagasApi } from "../../api/vagas.api";
import type { Match } from "../../types/types";

vi.mock("../../api/vagas.api", () => ({
    vagasApi: {
        getSquads: vi.fn(),
        getMatches: vi.fn(),
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

const availableMatch: Match = {
    id: "rec-1",
    name: "Lucas Silveira",
    description: "Senior Frontend",
    squadName: "Squad Pagamentos",
    rankingScore: 1,
    matchScore: 95,
    availability: "available",
    mainSkills: [{ name: "React", contributionPercent: 50 }],
};

const allocatedMatch: Match = {
    id: "rec-2",
    name: "Roberto Mendes",
    description: "Senior Backend",
    squadName: "Squad Checkout",
    rankingScore: 2,
    matchScore: 90,
    availability: "allocated",
    mainSkills: [{ name: "Node.js", contributionPercent: 40 }],
};

describe("MatchResources Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(vagasApi.getSquads).mockResolvedValue({
            content: [{ id: "sq-1", name: "Squad Pagamentos" }],
            totalElements: 1,
            totalPages: 1,
            number: 0,
            size: 100,
        } as never);
        vi.mocked(vagasApi.getMatches).mockResolvedValue({
            content: [availableMatch, allocatedMatch],
            totalElements: 2,
            totalPages: 1,
            number: 0,
            size: 5,
        } as never);
    });

    it("deve exibir FloatingActionButton 'Avançar para Alocação' desabilitado sem seleção e sem botão Voltar", async () => {
        renderWithClient(
            <MatchResources
                vagaId="vaga-1"
                selectedMatches={[]}
                onProceedToAllocation={vi.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByText("Ranking de Recursos")).toBeInTheDocument();
        });

        expect(screen.queryByRole("button", { name: "Voltar" })).not.toBeInTheDocument();
        const proceedButton = screen.getByRole("button", { name: /Avançar para Alocação/i });
        expect(proceedButton).toBeDisabled();
        expect(screen.getByText("Nenhum recurso selecionado para alocação")).toBeInTheDocument();
    });

    it("deve manter o botão 'Avançar para Alocação' desabilitado quando apenas recursos alocados estiverem selecionados", async () => {
        renderWithClient(
            <MatchResources
                vagaId="vaga-1"
                selectedMatches={[allocatedMatch]}
                onProceedToAllocation={vi.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByText("1 recurso selecionado para alocação")).toBeInTheDocument();
        });

        expect(screen.getByRole("button", { name: /Avançar para Alocação/i })).toBeDisabled();
    });

    it("deve habilitar e acionar onProceedToAllocation ao clicar no FloatingActionButton com recurso disponível selecionado", async () => {
        const handleProceed = vi.fn();
        const user = userEvent.setup();

        renderWithClient(
            <MatchResources
                vagaId="vaga-1"
                selectedMatches={[availableMatch]}
                onProceedToAllocation={handleProceed}
            />
        );

        await waitFor(() => {
            expect(screen.getByText("1 recurso selecionado para alocação")).toBeInTheDocument();
        });

        const proceedButton = screen.getByRole("button", { name: /Avançar para Alocação/i });
        expect(proceedButton).toBeEnabled();

        await user.click(proceedButton);
        expect(handleProceed).toHaveBeenCalledTimes(1);
    });
});
