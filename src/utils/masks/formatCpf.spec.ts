import { describe, expect, it } from "vitest";
import { formatCpf, onlyCpfDigits } from "./formatCpf";

describe("formatCpf", () => {
    it("formata CPF completo", () => {
        expect(formatCpf("12345678901")).toBe("123.456.789-01");
    });

    it("aplica máscara progressiva", () => {
        expect(formatCpf("123")).toBe("123");
        expect(formatCpf("123456")).toBe("123.456");
        expect(formatCpf("123456789")).toBe("123.456.789");
    });
});

describe("onlyCpfDigits", () => {
    it("retorna apenas dígitos", () => {
        expect(onlyCpfDigits("123.456.789-01")).toBe("12345678901");
    });
});
