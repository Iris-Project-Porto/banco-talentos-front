import { describe, expect, it } from "vitest";
import { getHistoryChanges } from "./historyChanges";

describe("getHistoryChanges", () => {
  it("não cria mudanças quando os dois valores representam ausência de valor", () => {
    expect(getHistoryChanges(null, undefined)).toEqual([]);
    expect(getHistoryChanges("", null)).toEqual([]);
    expect(getHistoryChanges(undefined, "")).toEqual([]);
  });

  it("ignora propriedades sem valor dos dois lados", () => {
    expect(
      getHistoryChanges(
        { phone: null, area: "" },
        { phone: "", area: undefined },
      ),
    ).toEqual([]);
  });

  it("usa a chave do snapshot sem formatar automaticamente o rótulo", () => {
    expect(
      getHistoryChanges(
        { createdAt: "2026-10-29" },
        { createdAt: "2026-10-30" },
      ),
    ).toEqual([
      {
        label: "createdAt",
        oldValue: "2026-10-29",
        newValue: "2026-10-30",
      },
    ]);
  });

  it("mantém mudanças quando apenas um dos lados não tem valor", () => {
    expect(getHistoryChanges(null, "Desenvolvimento")).toEqual([
      {
        label: "",
        oldValue: null,
        newValue: "Desenvolvimento",
      },
    ]);
  });

  it("agrupa alterações de skill em uma única mudança por skill e omite os IDs", () => {
    expect(
      getHistoryChanges(
        {
          Skills: [
            { ID: "old-id", "ID da skill": "skill-id", Skill: "Java", "Nível de proficiência": 5 },
          ],
        },
        {
          Skills: [
            { ID: "new-id", "ID da skill": "skill-id", Skill: "Java", "Nível de proficiência": 8 },
          ],
        },
      ),
    ).toEqual([
      {
        label: "Skills",
        oldValue: { ID: "old-id", "ID da skill": "skill-id", Skill: "Java", "Nível de proficiência": 5 },
        newValue: { ID: "new-id", "ID da skill": "skill-id", Skill: "Java", "Nível de proficiência": 8 },
      },
    ]);
  });

  it("não normaliza a chave skills em minúsculo", () => {
    expect(
      getHistoryChanges(
        { skills: "valor antigo" },
        { skills: "valor novo" },
      ),
    ).toEqual([
      {
        label: "skills",
        oldValue: "valor antigo",
        newValue: "valor novo",
      },
    ]);
  });

  it("não normaliza mais a chave legada Competências", () => {
    expect(
      getHistoryChanges(
        { Competências: "valor antigo" },
        { Competências: "valor novo" },
      ),
    ).toEqual([
      {
        label: "Competências",
        oldValue: "valor antigo",
        newValue: "valor novo",
      },
    ]);
  });
});
