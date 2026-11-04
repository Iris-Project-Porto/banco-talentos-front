import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HistoryItem from "./HistoryItem";

function renderHistoryItem(
  props: Partial<React.ComponentProps<typeof HistoryItem>> = {},
) {
  return render(
    <table>
      <tbody>
        <HistoryItem
          id="history-1"
          operation="Atualização"
          entityType="PROFILE"
          date="2026-10-30T10:00:00.000Z"
          oldValue={{ name: "Ana", email: "ana@example.com" }}
          newValue={{ name: "Beatriz", email: "ana@example.com" }}
          {...props}
        />
      </tbody>
    </table>,
  );
}

describe("HistoryItem", () => {
  it("renderiza as mudanças com operação, entidade, valores e data formatada", () => {
    renderHistoryItem();
    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date("2026-10-30T10:00:00.000Z"));

    expect(screen.getByText("Atualização")).toBeInTheDocument();
    expect(screen.getByText("PROFILE")).toBeInTheDocument();
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("Beatriz")).toBeInTheDocument();
    expect(screen.getByText(formattedDate)).toHaveAttribute(
      "datetime",
      "2026-10-30T10:00:00.000Z",
    );
  });

  it("renderiza uma linha para cada campo alterado", () => {
    renderHistoryItem({
      oldValue: { name: "Ana", email: "ana@example.com" },
      newValue: { name: "Beatriz", email: "beatriz@example.com" },
    });

    expect(screen.getAllByRole("row")).toHaveLength(2);
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("email")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
    expect(screen.getByText("beatriz@example.com")).toBeInTheDocument();
  });

  it("não renderiza linhas quando os valores não mudaram", () => {
    renderHistoryItem({
      oldValue: { name: "Ana" },
      newValue: { name: "Ana" },
    });

    expect(screen.queryAllByRole("row")).toHaveLength(0);
  });
});