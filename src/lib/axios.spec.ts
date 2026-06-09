import { describe, it, expect } from 'vitest';
import { getApiError } from './axios';

describe('axios lib - getApiError', () => {
    it('deve extrair a mensagem de um erro padrão do Axios', () => {
        const axiosError = {
            isAxiosError: true,
            response: { data: { message: "Credenciais inválidas" } }
        };
        expect(getApiError(axiosError)).toBe("Credenciais inválidas");
    });

    it('deve extrair a mensagem de uma instância de Error nativa', () => {
        const error = new Error("Erro de conexão com a internet");
        expect(getApiError(error)).toBe("Erro de conexão com a internet");
    });

    it('deve retornar a mensagem de fallback para erros desconhecidos', () => {
        expect(getApiError(null, "Erro padrão fallback")).toBe("Erro padrão fallback");
        expect(getApiError(undefined)).toBe("Ocorreu um erro inesperado.");
    });
});