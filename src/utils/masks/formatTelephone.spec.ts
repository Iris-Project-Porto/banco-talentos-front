import { describe, expect, it } from "vitest";
import { formatTelephone } from "./formatTelephone";

describe("formatTelephone", () => {
    it("formata celular com 11 dígitos", () => {
        expect(formatTelephone("11987654321")).toBe("(11) 98765-4321");
    });

    it("formata fixo com 10 dígitos", () => {
        expect(formatTelephone("1133334444")).toBe("(11) 3333-4444");
    });

    it("aplica máscara progressiva", () => {
        expect(formatTelephone("11")).toBe("(11");
        expect(formatTelephone("11987")).toBe("(11) 987");
        expect(formatTelephone("1198765432")).toBe("(11) 9876-5432");
    });

    it("ignora não-dígitos e limita a 11", () => {
        expect(formatTelephone("(11) 98765-4321abc999")).toBe("(11) 98765-4321");
    });
});
