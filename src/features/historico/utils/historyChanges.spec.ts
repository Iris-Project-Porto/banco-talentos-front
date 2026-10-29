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

  it("mantém mudanças quando apenas um dos lados não tem valor", () => {
    expect(getHistoryChanges(null, "Desenvolvimento")).toEqual([
      {
        label: "",
        oldValue: null,
        newValue: "Desenvolvimento",
      },
    ]);
  });
});
