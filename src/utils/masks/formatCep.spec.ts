import { describe, expect, it } from "vitest";
import { formatCep } from "./formatCep";

describe("formatCep", () => {
    it("formata CEP com hífen", () => {
        expect(formatCep("01310100")).toBe("01310-100");
    });

    it("limita a 8 dígitos", () => {
        expect(formatCep("01310100999")).toBe("01310-100");
    });
});
