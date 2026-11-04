import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HistorySkillCard from "./HistorySkillCard";

describe("HistorySkillCard", () => {
  it("renderiza o nome e o nível da skill com a cor correspondente", () => {
    render(
      <HistorySkillCard
        value={{
          Skill: "Java",
          "Nível de proficiência": 8,
        }}
      />,
    );

    expect(screen.getByText("Java")).toBeInTheDocument();
    expect(screen.getByText("8")).toHaveStyle({
      color: "rgb(5, 150, 105)",
      backgroundColor: "rgb(209, 250, 229)",
    });
  });

  it("aceita os nomes alternativos das propriedades", () => {
    render(
      <HistorySkillCard
        value={{
          name: "TypeScript",
          proficiencyLevel: "5",
        }}
      />,
    );

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("5")).toHaveStyle({
      color: "rgb(37, 99, 235)",
      backgroundColor: "rgb(219, 234, 254)",
    });
  });

  it("não renderiza um nível quando ele não está disponível", () => {
    render(<HistorySkillCard value={{ Skill: "React" }} />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.queryByText("Sem valor")).not.toBeInTheDocument();
  });

  it("formata como valor comum dados que não representam uma skill válida", () => {
    const { container } = render(<HistorySkillCard value={{ id: "skill-1" }} />);

    expect(container.textContent).toBe('{\n  "id": "skill-1"\n}');
  });
});