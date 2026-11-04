import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HistoryChangeRow from "./HistoryChangeRow";

describe("HistoryChangeRow", () => {
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
