import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { useRecursosList, hasProfileFilters } from "./useRecursosList";
import { profilesApi } from "@/features/profiles";
import { EMPTY_PROFILE_FILTERS } from "../types/profileFilters";

vi.mock("@/features/profiles", async () => {
    const actual = await vi.importActual<typeof import("@/features/profiles")>("@/features/profiles");
    return {
        ...actual,
        profilesApi: {
            getAllProfiles: vi.fn(),
        },
    };
});

const wrapperFactory = (initialEntries = ["/admin/talentos"]) => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
        </QueryClientProvider>
    );
};

describe("Hook useRecursosList", () => {
    const mockProfiles = [
        {
            id: "1",
            name: "Carlos Ramos",
            email: "carlos@vilt-group.com",
            area: "Backend",
            groupName: "Delivery",
            status: "ACTIVE",
            allocationStatus: "Disponível (Bench)",
            registrationStatus: "APPROVED",
            level: "Pleno",
        },
        {
            id: "2",
            name: "Ana Costa",
            email: "ana@vilt-group.com",
            area: "Frontend",
            groupName: "Platform",
            status: "PENDING",
            allocationStatus: "Disponível (Bench)",
            registrationStatus: "AWAITING_APPROVAL",
            level: "Jr",
        },
        {
            id: "3",
            name: "Rui Santos",
            email: "rui@vilt-group.com",
            area: "DevOps",
            groupName: "Delivery",
            status: "ACTIVE",
            allocationStatus: "Alocado Integral (100%)",
            registrationStatus: "APPROVED",
            levelOverride: "Sr",
            level: "Pleno",
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(profilesApi.getAllProfiles).mockResolvedValue({
            content: mockProfiles,
            totalPages: 1,
            totalElements: 3,
        } as never);
    });

    it("deve carregar os perfis da API e montar áreas e grupos", async () => {
        const { result } = renderHook(() => useRecursosList(), { wrapper: wrapperFactory() });

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.profiles).toHaveLength(3);
        expect(result.current.areas).toEqual(["Backend", "DevOps", "Frontend"]);
        expect(result.current.groups).toEqual(["Delivery", "Platform"]);
        expect(profilesApi.getAllProfiles).toHaveBeenCalledWith(0, 1000, undefined);
    });

    it("deve aplicar filtro por nome somente após applyFilters", async () => {
        const { result } = renderHook(() => useRecursosList(), { wrapper: wrapperFactory() });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        act(() => {
            result.current.setFilter("nome", "Ana");
        });
        expect(result.current.profiles).toHaveLength(3);

        act(() => {
            result.current.applyFilters();
        });

        expect(result.current.profiles).toHaveLength(1);
        expect(result.current.profiles[0].name).toBe("Ana Costa");
        expect(result.current.totalElements).toBe(1);
    });

    it("deve filtrar por área e nível override", async () => {
        const { result } = renderHook(() => useRecursosList(), { wrapper: wrapperFactory() });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        act(() => {
            result.current.setFilter("area", "DevOps");
        });
        act(() => {
            result.current.setFilter("nivel", "Sr");
        });
        act(() => {
            result.current.applyFilters();
        });

        expect(result.current.profiles).toHaveLength(1);
        expect(result.current.profiles[0].name).toBe("Rui Santos");
    });

    it("deve limpar filtros aplicados", async () => {
        const { result } = renderHook(() => useRecursosList(), { wrapper: wrapperFactory() });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        act(() => {
            result.current.setFilter("status", "PENDING");
        });
        act(() => {
            result.current.applyFilters();
        });
        expect(result.current.profiles).toHaveLength(1);

        act(() => {
            result.current.clearFilters();
        });

        expect(result.current.filters).toEqual(EMPTY_PROFILE_FILTERS);
        expect(result.current.profiles).toHaveLength(3);
    });

    it("deve ler skill da URL e repassar para a API", async () => {
        const { result } = renderHook(() => useRecursosList(), {
            wrapper: wrapperFactory(["/admin/talentos?skill=React"]),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.skillParam).toBe("React");
        expect(profilesApi.getAllProfiles).toHaveBeenCalledWith(0, 1000, "React");
    });
});

describe("hasProfileFilters", () => {
    it("deve retornar false para filtros vazios", () => {
        expect(hasProfileFilters(EMPTY_PROFILE_FILTERS)).toBe(false);
    });

    it("deve retornar true quando houver algum filtro preenchido", () => {
        expect(hasProfileFilters({ ...EMPTY_PROFILE_FILTERS, area: "Frontend" })).toBe(true);
        expect(hasProfileFilters({ ...EMPTY_PROFILE_FILTERS, nome: "  Ana  " })).toBe(true);
    });
});
