import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PasswordRequirements } from "./PasswordRequirements";

describe("PasswordRequirements", () => {
  it("deve exibir todos os requisitos de senha", () => {
    render(<PasswordRequirements password="" />);

    expect(screen.getByText("Mínimo de 8 caracteres")).toBeInTheDocument();
    expect(screen.getByText("Pelo menos 1 letra maiúscula")).toBeInTheDocument();
    expect(screen.getByText("Pelo menos 1 número")).toBeInTheDocument();
    expect(screen.getByText("Pelo menos 1 caractere especial")).toBeInTheDocument();
  });

  it("deve marcar requisitos atendidos quando a senha é válida", () => {
    const { container } = render(<PasswordRequirements password="Senha@123" />);

    const metItems = container.querySelectorAll(".text-status-success-text");
    expect(metItems).toHaveLength(4);
  });
});
