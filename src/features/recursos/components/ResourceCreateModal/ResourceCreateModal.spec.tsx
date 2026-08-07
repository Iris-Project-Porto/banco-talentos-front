import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ResourceCreateModal } from "./ResourceCreateModal";
import { authApi } from "@/features/auth/api/auth.api";

vi.mock("@/features/auth/api/auth.api", () => ({
    authApi: {
        getGroups: vi.fn(),
    },
}));

function renderModal(props?: Partial<React.ComponentProps<typeof ResourceCreateModal>>) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <ResourceCreateModal
                saving={false}
                onSave={vi.fn()}
                onClose={vi.fn()}
                {...props}
            />
        </QueryClientProvider>,
    );
}

describe("Componente ResourceCreateModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(authApi.getGroups).mockResolvedValue({
            content: [{ id: "group-1", name: "Delivery" }],
        } as never);
    });

    it("deve renderizar o cabeçalho e os campos do formulário", async () => {
        renderModal();

        expect(screen.getByText("Cadastra Recurso")).toBeInTheDocument();
        expect(screen.getByText("Nome completo *")).toBeInTheDocument();
        expect(screen.getByText("E-mail corporativo *")).toBeInTheDocument();
        expect(screen.getByText("CPF *")).toBeInTheDocument();
        expect(screen.getByText("Grupo *")).toBeInTheDocument();
        expect(await screen.findByRole("option", { name: "Delivery" })).toBeInTheDocument();
    });

    it("deve invocar onClose ao clicar no botão de fechar", async () => {
        const onClose = vi.fn();
        renderModal({ onClose });

        await userEvent.click(screen.getByRole("button", { name: "×" }));
        expect(onClose).toHaveBeenCalled();
    });

    it("deve invocar onClose ao clicar em Cancelar", async () => {
        const onClose = vi.fn();
        renderModal({ onClose });

        await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
        expect(onClose).toHaveBeenCalled();
    });

    it("deve exibir erros de validação ao submeter formulário vazio", async () => {
        renderModal();

        await userEvent.click(screen.getByRole("button", { name: "Cadastrar" }));

        expect(await screen.findByText("Nome é obrigatório")).toBeInTheDocument();
        expect(screen.getByText("E-mail é obrigatório")).toBeInTheDocument();
        expect(screen.getByText("CPF inválido")).toBeInTheDocument();
        expect(screen.getAllByText("Selecione o grupo").length).toBeGreaterThanOrEqual(1);
    });

    it("deve chamar onSave com os dados corretos quando o formulário for válido", async () => {
        const onSave = vi.fn();
        renderModal({ onSave });

        await screen.findByRole("option", { name: "Delivery" });

        await userEvent.type(screen.getByPlaceholderText("Digite o nome completo"), "João Silva");
        await userEvent.type(screen.getByPlaceholderText("usuario@empresa.com"), "joao@vilt-group.com");
        await userEvent.type(screen.getByPlaceholderText("000.000.000-00"), "12345678901");
        await userEvent.selectOptions(screen.getByRole("combobox"), "group-1");
        await userEvent.click(screen.getByRole("button", { name: "Cadastrar" }));

        expect(onSave).toHaveBeenCalled();
        expect(onSave.mock.calls[0][0]).toEqual({
            name: "João Silva",
            email: "joao@vilt-group.com",
            cpf: "12345678901",
            groupId: "group-1",
        });
    });

    it("deve desabilitar o botão de cadastrar durante o envio", () => {
        renderModal({ saving: true });

        expect(screen.getByRole("button", { name: "Cadastrar" })).toBeDisabled();
    });
});
