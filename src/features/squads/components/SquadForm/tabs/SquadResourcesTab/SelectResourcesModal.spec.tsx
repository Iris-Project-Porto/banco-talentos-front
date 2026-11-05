import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { SelectResourcesModal } from "./SelectResourcesModal";
import { profilesApi } from "@/features/profiles";

vi.mock("@/features/profiles", () => ({
    profilesApi: {
        getAtivos: vi.fn(),
    },
}));

vi.mock("react-hot-toast", () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const mockProfiles = [
    {
        id: "p-1",
        name: "Lucas Fernandes",
        email: "lucas@vilt.com",
        jobTitle: "Desenvolvedor Frontend",
        status: "ACTIVE",
    },
    {
        id: "p-2",
        name: "Beatriz Lima",
        email: "beatriz@vilt.com",
        jobTitle: "UX Designer",
        status: "ACTIVE",
    },
];

function renderModal(props?: Partial<React.ComponentProps<typeof SelectResourcesModal>>) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <SelectResourcesModal
                onClose={vi.fn()}
                onConfirm={vi.fn()}
                {...props}
            />
        </QueryClientProvider>,
    );
}

describe("SelectResourcesModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(profilesApi.getAtivos).mockResolvedValue({
            content: mockProfiles,
            totalPages: 1,
            totalElements: 2,
        } as never);
    });

    it("deve carregar e listar os recursos ativos", async () => {
        renderModal();

        expect(screen.getByText("Selecionar Recursos")).toBeInTheDocument();
        expect(await screen.findByText("Lucas Fernandes")).toBeInTheDocument();
        expect(screen.getByText("Beatriz Lima")).toBeInTheDocument();
        expect(screen.getByText("Desenvolvedor Frontend")).toBeInTheDocument();
    });

    it("deve filtrar recursos pelo campo de busca", async () => {
        const user = userEvent.setup();
        renderModal();

        await screen.findByText("Lucas Fernandes");

        const searchInput = screen.getByPlaceholderText("Buscar por nome, e-mail ou cargo");
        await user.type(searchInput, "Beatriz");

        expect(screen.getByText("Beatriz Lima")).toBeInTheDocument();
        expect(screen.queryByText("Lucas Fernandes")).not.toBeInTheDocument();
    });

    it("deve impedir seleção de recurso já vinculado (RN04 / Cenário 5)", async () => {
        const user = userEvent.setup();
        renderModal({ existingIds: ["p-1"] });

        await screen.findByText("Lucas Fernandes");

        // Tentar selecionar a linha de Lucas (que já está em existingIds)
        const row = screen.getByText("Lucas Fernandes").closest("tr")!;
        await user.click(row);

        expect(toast.error).toHaveBeenCalledWith('O recurso "Lucas Fernandes" já está vinculado à squad.');
    });

    it("deve permitir selecionar e confirmar adição de novos recursos", async () => {
        const onConfirm = vi.fn();
        const onClose = vi.fn();
        const user = userEvent.setup();

        renderModal({ onConfirm, onClose });

        await screen.findByText("Beatriz Lima");

        // Selecionar Beatriz
        const row = screen.getByText("Beatriz Lima").closest("tr")!;
        await user.click(row);

        const confirmButton = screen.getByRole("button", { name: /Adicionar 1 recurso/i });
        expect(confirmButton).toBeEnabled();

        await user.click(confirmButton);

        expect(onConfirm).toHaveBeenCalledWith([
            expect.objectContaining({
                id: "p-2",
                name: "Beatriz Lima",
                jobTitle: "UX Designer",
            }),
        ]);
        expect(onClose).toHaveBeenCalled();
    });

    it("deve chamar onClose ao clicar em Cancelar", async () => {
        const onClose = vi.fn();
        const user = userEvent.setup();

        renderModal({ onClose });

        const cancelButton = screen.getByRole("button", { name: "Cancelar" });
        await user.click(cancelButton);

        expect(onClose).toHaveBeenCalled();
    });
});

