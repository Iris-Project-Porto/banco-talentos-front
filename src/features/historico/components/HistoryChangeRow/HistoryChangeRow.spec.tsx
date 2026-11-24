import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HistoryChangeRow from "./HistoryChangeRow";

describe("HistoryChangeRow", () => {
  it("traduz os status da máquina conforme as opções exibidas no formulário", () => {
    const statusLabels = [
      ["REQUEST_IN_PROGRESS", "Em processo de solicitação"],
      ["REQUESTED", "Solicitado"],
      ["WITHDRAWN", "Retirado"],
      ["SENT_TO_RESOURCE", "Envio para o recurso"],
      ["IN_USE", "Em Uso"],
      ["RETURNED", "Devolvido"],
      ["INACTIVE", "Inativo"],
    ];

    render(
      <table>
        <tbody>
          {statusLabels.map(([value]) => (
            <HistoryChangeRow
              key={value}
              change={{ label: "Status", oldValue: value, newValue: value }}
              operation="Atualização"
              entityType="Equipamento"
              formattedDate="30/10/2026 10:00"
              date="2026-10-30T10:00:00"
            />
          ))}
        </tbody>
      </table>,
    );

    for (const [, label] of statusLabels) {
      expect(screen.getAllByText(label)).toHaveLength(2);
    }
  });

  it("não traduz valores iguais quando pertencem a outro campo", () => {
    render(
      <table>
        <tbody>
          <HistoryChangeRow
            change={{ label: "Observações", oldValue: "IN_USE", newValue: "IN_USE" }}
            operation="Atualização"
            entityType="Equipamento"
            formattedDate="30/10/2026 10:00"
            date="2026-10-30T10:00:00"
          />
        </tbody>
      </table>,
    );

    expect(screen.getAllByText("IN_USE")).toHaveLength(2);
  });

  it("renderiza mudanças de skill como cards sem expor IDs ou controles", () => {
    render(
      <table>
        <tbody>
          <HistoryChangeRow
            change={{
              label: "Skills",
              oldValue: {
                ID: "profile-skill-old",
                "ID da skill": "skill-id",
                Skill: "Java",
                "Nível de proficiência": 5,
              },
              newValue: {
                ID: "profile-skill-new",
                "ID da skill": "skill-id",
                Skill: "Java",
                "Nível de proficiência": 8,
              },
            }}
            operation="Atualização"
            entityType="PROFILE"
            formattedDate="30/10/2026 10:00"
            date="2026-10-30T10:00:00"
          />
        </tbody>
      </table>,
    );

    expect(screen.getAllByText("Java")).toHaveLength(2);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.queryByText(/profile-skill-old|skill-id/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
