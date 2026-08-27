import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RecursosList } from "./RecursosList";
import { useRecursosList } from "../../hooks/useRecursosList";
import { EMPTY_PROFILE_FILTERS } from "../../types/profileFilters";

vi.mock("../../hooks/useRecursosList", () => ({
    useRecursosList: vi.fn(),
}));

vi.mock("@/features/profiles", async () => {
    const actual = await vi.importActual<typeof import("@/features/profiles")>("@/features/profiles");
    return {
        ...actual,
        PersonCard: ({ name }: { name: string }) => <div>{name}</div>,
    };
});

describe("Componente RecursosList", () => {
    const baseReturn = {
        filters: { ...EMPTY_PROFILE_FILTERS },
        setFilter: vi.fn(),
        applyFilters: vi.fn(),
        clearFilters: vi.fn(),
        page: 0,
        setPage: vi.fn(),
        profiles: [],
        totalElements: 0,
        totalPages: 1,
        isLoading: false,
        isError: false,
        skillParam: "",
        clearSkillFilter: vi.fn(),
        projects: [],
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    function renderList() {
        return render(
            <MemoryRouter>
                <RecursosList />
            </MemoryRouter>,
        );
    }

    it("deve renderizar o texto de carregamento quando isLoading for true", () => {
        vi.mocked(useRecursosList).mockReturnValue({ ...baseReturn, isLoading: true } as never);

        renderList();
        expect(screen.getByText("Carregando...")).toBeInTheDocument();
    });

    it("deve exibir mensagem de erro quando isError for true", () => {
        vi.mocked(useRecursosList).mockReturnValue({ ...baseReturn, isError: true } as never);

        renderList();
        expect(screen.getByText("Não foi possível carregar os recursos.")).toBeInTheDocument();
    });

    it("deve exibir a mensagem de lista vazia quando nenhum talento for encontrado", () => {
        vi.mocked(useRecursosList).mockReturnValue({ ...baseReturn, totalElements: 0 } as never);

        renderList();
        expect(screen.getByText("Nenhum talento encontrado.")).toBeInTheDocument();
        expect(screen.getByText(/0 pessoas/i)).toBeInTheDocument();
    });

    it("deve renderizar a grelha de talentos e o total de pessoas", () => {
        vi.mocked(useRecursosList).mockReturnValue({
            ...baseReturn,
            totalElements: 2,
            profiles: [
                { id: "1", name: "João Silva", email: "joao@vilt-group.com", status: "ACTIVE" },
                { id: "2", name: "Maria Souza", email: "maria@vilt-group.com", status: "ACTIVE" },
            ],
        } as never);

        renderList();
        expect(screen.getByText("João Silva")).toBeInTheDocument();
        expect(screen.getByText("Maria Souza")).toBeInTheDocument();
        expect(screen.getByText(/2 pessoas/i)).toBeInTheDocument();
    });

    it("deve exibir o chip de skill e limpar filtros ao clicar no ×", () => {
        const clearFilters = vi.fn();
        const clearSkillFilter = vi.fn();
        vi.mocked(useRecursosList).mockReturnValue({
            ...baseReturn,
            skillParam: "React",
            clearFilters,
            clearSkillFilter,
        } as never);

        renderList();
        expect(screen.getByText("Skill: React")).toBeInTheDocument();

        fireEvent.click(screen.getByTitle("Remover filtro"));
        expect(clearFilters).toHaveBeenCalled();
        expect(clearSkillFilter).toHaveBeenCalled();
    });
});
