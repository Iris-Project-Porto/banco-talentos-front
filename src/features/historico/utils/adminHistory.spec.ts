import { describe, expect, it } from "vitest";
import type { AuditSummary } from "../types/historico";
import {
    filterAudits,
    getAuditCategory,
} from "./adminHistory";

function createAudit(
    id: string,
    entityType: string,
    userName: string | null = null,
    userAffectedName: string | null = null,
): AuditSummary {
    return {
        id,
        userId: `${id}-executor`,
        userName,
        userAffectedId: `${id}-affected`,
        userAffectedName,
        operation: "UPDATE",
        entityType,
        entityId: `${id}-entity`,
        createdAt: "2026-11-01T10:00:00Z",
    };
}

describe("getAuditCategory", () => {
    it.each([
        ["PROJECT", "Projetos"],
        ["SQUAD", "Squads"],
        ["JOB_POSTING", "Recursos"],
        ["PROFILE", "Recursos"],
        ["PROFILE_SKILL", "Recursos"],
        ["RESOURCE_EQUIPMENT", "Recursos"],
    ] as const)("categoriza %s em %s", (entityType, category) => {
        expect(getAuditCategory(createAudit("audit-1", entityType))).toBe(category);
    });

    it("não categoriza tipos de entidade desconhecidos", () => {
        expect(getAuditCategory(createAudit("audit-1", "UNRECOGNIZED"))).toBeNull();
    });
});

describe("filterAudits", () => {
    const records = [
        {
            ...createAudit("one", "PROJECT", "Ana Silva", "João Souza"),
            entityName: "Projeto Atlas",
            description: "Squad adicionada: Squad de Dados",
        },
        {
            ...createAudit("two", "PROJECT", "Marina Costa", "Ana Paula"),
            entityName: "Projeto Boreal",
            description: "Squad removida: Squad Plataforma",
        },
        createAudit("three", "PROJECT", null, null),
    ];

    it.each([
        ["executor", "ana silva", ["one"]],
        ["usuário afetado", "joao souza", ["one"]],
        ["nome da entidade", "atlas", ["one"]],
        ["descrição", "squad dados", ["one"]],
        ["tipo da entidade", "projeto", ["one", "two", "three"]],
        ["operação", "atualizacao", ["one", "two", "three"]],
    ])("busca por %s ignorando maiúsculas e acentos", (_field, query, expectedIds) => {
        expect(filterAudits(records, query).map(({ id }) => id)).toEqual(expectedIds);
    });

    it("retorna todos os registros para uma busca vazia", () => {
        expect(filterAudits(records, "  ")).toEqual(records);
    });

    it("retorna lista vazia quando não encontra correspondência", () => {
        expect(filterAudits(records, "inexistente")).toEqual([]);
    });
});
