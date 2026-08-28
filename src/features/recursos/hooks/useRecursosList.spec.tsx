import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { useRecursosList, hasProfileFilters, deriveStatusRecurso } from "./useRecursosList";
import { profilesApi } from "@/features/profiles";
import { projectsApi } from "@/features/projects/api/projects.api";
import { EMPTY_PROFILE_FILTERS } from "../types/profileFilters";

vi.mock("@/features/profiles", async () => {
    const actual = await vi.importActual<typeof import("@/features/profiles")>("@/features/profiles");
    return {
        ...actual,
        profilesApi: {
            getAtivos: vi.fn(),
        },
    };
});

vi.mock("@/features/projects/api/projects.api", () => ({
    projectsApi: {
        getActive: vi.fn(),
    },
}));

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
            status: "ACTIVE",
            resourceStatus: "AVAILABLE",
            registrationStatus: "NOT_REQUIRED",
            projectManagerName: "Maria Silva",
            allocationProjectId: undefined,
            billable: true,
            portoOnboarding: false,
            projectEntryDate: "2025-07-10",
        },
        {
            id: "2",
            name: "Ana Costa",
            email: "ana@vilt-group.com",
            status: "ACTIVE",
            resourceStatus: "WAITING",
            registrationStatus: "REQUESTED_VIA_TICKET",
            projectManagerName: "João Pedro",
            allocationProjectId: undefined,
            billable: false,
            portoOnboarding: true,
            projectEntryDate: "2025-08-01",
        },
        {
            id: "3",
            name: "Rui Santos",
            email: "rui@vilt-group.com",
            status: "ACTIVE",
            resourceStatus: "ALLOCATED",
            registrationStatus: "RELEASED",
            projectManagerName: "Maria Silva",
            allocationProjectId: "p2",
            billable: true,
            portoOnboarding: true,
            projectEntryDate: "2025-06-15",
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(profilesApi.getAtivos).mockResolvedValue({
            content: mockProfiles,
            totalPages: 1,
            totalElements: 3,
        } as never);
        vi.mocked(projectsApi.getActive).mockResolvedValue({
            content: [
                { id: "p1", name: "Plataforma Digital" },
                { id: "p2", name: "Portal Cliente" },
            ],
            totalPages: 1,
            totalElements: 2,
        } as never);
    });

    it("deve carregar os perfis da API e montar projetos", async () => {
        const { result } = renderHook(() => useRecursosList(), { wrapper: wrapperFactory() });

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.profiles).toHaveLength(3);
        await waitFor(() => {
            expect(result.current.projects).toEqual([
                { id: "p1", name: "Plataforma Digital" },
                { id: "p2", name: "Portal Cliente" },
            ]);
        });
        expect(profilesApi.getAtivos).toHaveBeenCalledWith(0, 1000, undefined);
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

    it("deve filtrar por status do recurso e billable", async () => {
        const { result } = renderHook(() => useRecursosList(), { wrapper: wrapperFactory() });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        act(() => {
            result.current.setFilter("statusRecurso", "ALLOCATED");
            result.current.setFilter("billable", "true");
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
            result.current.setFilter("statusRecurso", "WAITING");
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
        expect(profilesApi.getAtivos).toHaveBeenCalledWith(0, 1000, "React");
    });
});

describe("deriveStatusRecurso", () => {
    it("deve preferir resourceStatus persistido", () => {
        expect(deriveStatusRecurso({ id: "1", status: "ACTIVE", resourceStatus: "WAITING" })).toBe("WAITING");
        expect(deriveStatusRecurso({ id: "2", status: "ACTIVE", resourceStatus: "ALLOCATED" })).toBe("ALLOCATED");
    });

    it("deve derivar da matrícula quando resourceStatus estiver ausente (RN003)", () => {
        expect(deriveStatusRecurso({ id: "1", status: "ACTIVE", registrationStatus: "NOT_REQUIRED" })).toBe(
            "AVAILABLE",
        );
        expect(deriveStatusRecurso({ id: "2", status: "ACTIVE", registrationStatus: "REQUESTED_VIA_TICKET" })).toBe(
            "WAITING",
        );
        expect(deriveStatusRecurso({ id: "3", status: "ACTIVE", registrationStatus: "RELEASED" })).toBe("ALLOCATED");
    });
});

describe("hasProfileFilters", () => {
    it("deve retornar false para filtros vazios", () => {
        expect(hasProfileFilters(EMPTY_PROFILE_FILTERS)).toBe(false);
    });

    it("deve retornar true quando houver algum filtro preenchido", () => {
        expect(hasProfileFilters({ ...EMPTY_PROFILE_FILTERS, statusRecurso: "WAITING" })).toBe(true);
        expect(hasProfileFilters({ ...EMPTY_PROFILE_FILTERS, nome: "  Ana  " })).toBe(true);
    });
});
