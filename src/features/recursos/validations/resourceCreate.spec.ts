import { describe, it, expect } from "vitest";
import { resourceCreateSchema } from "./resourceCreate";

describe("resourceCreateSchema", () => {
    const dadosValidos = {
        name: "João Silva",
        email: "joao@vilt-group.com",
        cpf: "123.456.789-01",
        groupId: "group-1",
    };

    it("deve aprovar dados válidos e normalizar o CPF", () => {
        const result = resourceCreateSchema.safeParse(dadosValidos);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual({
                name: "João Silva",
                email: "joao@vilt-group.com",
                cpf: "12345678901",
                groupId: "group-1",
            });
        }
    });

    it("deve rejeitar nome vazio", () => {
        const result = resourceCreateSchema.safeParse({ ...dadosValidos, name: "   " });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("Nome é obrigatório");
        }
    });

    it("deve rejeitar e-mail inválido", () => {
        const result = resourceCreateSchema.safeParse({ ...dadosValidos, email: "invalido" });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("E-mail inválido");
        }
    });

    it("deve rejeitar CPF com menos de 11 dígitos", () => {
        const result = resourceCreateSchema.safeParse({ ...dadosValidos, cpf: "123.456" });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("CPF inválido");
        }
    });

    it("deve rejeitar grupo não selecionado", () => {
        const result = resourceCreateSchema.safeParse({ ...dadosValidos, groupId: "" });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("Selecione o grupo");
        }
    });

    it("deve remover espaços do nome", () => {
        const result = resourceCreateSchema.safeParse({ ...dadosValidos, name: "  João Silva  " });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.name).toBe("João Silva");
        }
    });
});
