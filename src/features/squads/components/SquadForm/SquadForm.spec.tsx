import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SquadForm } from "./SquadForm";
import type { Squad } from "../../types/types";

describe("SquadForm Component", () => {
    const mockInitialSquad: Partial<Squad> = {
        id: "sq-1",
        name: "Squad Pagamentos",
        description: "Squad responsável pela área de pagamentos",
        portoCoordinator: "Carlos Silva",
        projectManager: "Mariana Souza",
        active: true,
        recursos: [
            {
                id: "rec-1",
                name: "Lucas Dev",
                email: "lucas@example.com",
                jobTitle: "Tech Lead",
                status: "ACTIVE",
                statusRecurso: "AVAILABLE",
                statusMatricula: "NOT_REQUIRED",
                possuiMaquinaCliente: false,
                maquinas: [],
            },
        ],
    };

    it("deve preencher os campos com os valores iniciais e enviar recursos com jobTitle no payload ao salvar", async () => {
        const handleSave = vi.fn();
        const user = userEvent.setup();

        render(
            <SquadForm
                initial={mockInitialSquad}
                existingSquads={[]}
                saving={false}
                onSave={handleSave}
                onCancel={vi.fn()}
            />
        );

        expect(screen.getByDisplayValue("Squad Pagamentos")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Carlos Silva")).toBeInTheDocument();

        const saveBtn = screen.getByRole("button", { name: /Salvar alterações/i });
        await user.click(saveBtn);

        await waitFor(() => {
            expect(handleSave).toHaveBeenCalledTimes(1);
        });

        const sentPayload = handleSave.mock.calls[0][0];
        expect(sentPayload).toMatchObject({
            id: "sq-1",
            name: "Squad Pagamentos",
            description: "Squad responsável pela área de pagamentos",
            portoCoordinator: "Carlos Silva",
            projectManager: "Mariana Souza",
            recursoIds: ["rec-1"],
            recursos: [
                {
                    id: "rec-1",
                    jobTitle: "Tech Lead",
                },
            ],
        });
    });

    it("deve disparar onCancel ao clicar em Cancelar ou no botão de voltar", async () => {
        const handleCancel = vi.fn();
        const user = userEvent.setup();

        render(
            <SquadForm
                initial={{}}
                existingSquads={[]}
                saving={false}
                onSave={vi.fn()}
                onCancel={handleCancel}
            />
        );

        const cancelBtn = screen.getByRole("button", { name: "Cancelar" });
        await user.click(cancelBtn);

        expect(handleCancel).toHaveBeenCalledTimes(1);
    });
});

