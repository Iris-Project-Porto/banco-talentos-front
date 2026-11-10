import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { SquadResourcesTab } from "./SquadResourcesTab";
import { profilesApi } from "@/features/profiles";
import type { SquadFormData } from "../../../../validations/validations";

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
        id: "rec-1",
        name: "Carlos Developer",
        email: "carlos@vilt.com",
        jobTitle: "Dev Fullstack",
        status: "ACTIVE",
    },
    {
        id: "rec-2",
        name: "Ana Analista",
        email: "ana@vilt.com",
        jobTitle: "Business Analyst",
        status: "ACTIVE",
    },
];

function TestWrapper({
    defaultRecursos = [],
    onBack,
}: {
    defaultRecursos?: SquadFormData["recursos"];
    onBack?: () => void;
}) {
    const methods = useForm<SquadFormData>({
        defaultValues: {
            name: "Squad Alfa",
            description: "Squad de Pagamentos",
            portoCoordinator: "Roberto",
            projectManager: "Patricia",
            recursos: defaultRecursos,
        },
    });

    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <FormProvider {...methods}>
                <SquadResourcesTab onBack={onBack} />
            </FormProvider>
        </QueryClientProvider>
    );
}

describe("SquadResourcesTab", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(profilesApi.getAtivos).mockResolvedValue({
            content: mockProfiles,
            totalPages: 1,
            totalElements: 2,
        } as never);
    });

    it("deve renderizar a tabela com os recursos vinculados (Cenário 2)", () => {
        render(
            <TestWrapper
                defaultRecursos={[
                    { id: "rec-1", name: "Carlos Developer", email: "carlos@vilt.com", jobTitle: "Dev Fullstack" },
                ]}
            />,
        );

        expect(screen.getByText("Recursos Vinculados")).toBeInTheDocument();
        expect(screen.getByText("Carlos Developer")).toBeInTheDocument();
        expect(screen.getByText("carlos@vilt.com")).toBeInTheDocument();
        expect(screen.getByText("Dev Fullstack")).toBeInTheDocument();
    });

    it("deve abrir o modal de seleção ao clicar em 'Adicionar Recurso' (Cenário 1)", async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const addButton = screen.getByRole("button", { name: /Adicionar Recurso/i });
        await user.click(addButton);

        expect(screen.getByText("Selecionar Recursos")).toBeInTheDocument();
        expect(await screen.findByText("Carlos Developer")).toBeInTheDocument();
    });

    it("deve editar as informações de um recurso (Cenário 3)", async () => {
        const user = userEvent.setup();
        render(
            <TestWrapper
                defaultRecursos={[
                    { id: "rec-1", name: "Carlos Developer", email: "carlos@vilt.com", jobTitle: "Dev Fullstack" },
                ]}
            />,
        );

        const editButton = screen.getByTitle("Editar");
        await user.click(editButton);

        expect(screen.getByText("Editar Recurso da Squad")).toBeInTheDocument();

        const inputCargo = screen.getByDisplayValue("Dev Fullstack");
        await user.clear(inputCargo);
        await user.type(inputCargo, "Tech Lead Senior");

        const saveButton = screen.getByRole("button", { name: "Salvar Alteração" });
        await user.click(saveButton);

        expect(toast.success).toHaveBeenCalledWith("Cargo do recurso atualizado com sucesso.");
        expect(await screen.findByText("Tech Lead Senior")).toBeInTheDocument();
    });

    it("deve solicitar confirmação e remover o recurso (Cenário 4)", async () => {
        const user = userEvent.setup();
        render(
            <TestWrapper
                defaultRecursos={[
                    { id: "rec-1", name: "Carlos Developer", email: "carlos@vilt.com", jobTitle: "Dev Fullstack" },
                ]}
            />,
        );

        const removeButton = screen.getByTitle("Remover");
        await user.click(removeButton);

        expect(screen.getByText("Remover Recurso")).toBeInTheDocument();
        expect(
            screen.getByText('Tem certeza que deseja remover o recurso "Carlos Developer" da squad?'),
        ).toBeInTheDocument();

        const confirmButton = screen.getByRole("button", { name: "Remover" });
        await user.click(confirmButton);

        expect(toast.success).toHaveBeenCalledWith("Recurso removido da squad.");
        expect(screen.queryByText("Carlos Developer")).not.toBeInTheDocument();
    });

    it("deve permitir voltar para dados gerais quando onBack for passado (RN07)", async () => {
        const onBack = vi.fn();
        const user = userEvent.setup();

        render(<TestWrapper onBack={onBack} />);

        const backButton = screen.getByRole("button", { name: /Voltar: Dados Gerais/i });
        await user.click(backButton);

        expect(onBack).toHaveBeenCalled();
    });
});

