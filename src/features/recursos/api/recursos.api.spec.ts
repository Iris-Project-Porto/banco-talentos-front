import { describe, it, expect, vi, beforeEach } from 'vitest';
import { recursosApi } from './recursos.api';
import { http } from '@/lib/axios';

vi.mock('@/lib/axios', () => ({
    http: {
        get: vi.fn(),
        patch: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    }
}));

const mockRecurso = {
    id: 'uuid-1',
    name: 'João Silva',
    email: 'joao@vilt-group.com',
    statusRecurso: 'DISPONIVEL',
    statusMatricula: 'NAO_NECESSARIO',
    possuiMaquinaCliente: false,
    maquinas: [],
};

describe('recursosApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('listar', () => {
        it('deve chamar GET /v1/admin/recursos com parâmetros de paginação', async () => {
            vi.mocked(http.get).mockResolvedValueOnce({ data: { content: [mockRecurso], totalElements: 1, totalPages: 1, number: 0, size: 20 } });

            await recursosApi.listar({}, 0, 20);

            expect(http.get).toHaveBeenCalledWith(expect.stringContaining('/v1/admin/recursos'));
            expect(http.get).toHaveBeenCalledWith(expect.stringContaining('page=0'));
            expect(http.get).toHaveBeenCalledWith(expect.stringContaining('size=20'));
        });

        it('deve incluir filtros na query string quando fornecidos', async () => {
            vi.mocked(http.get).mockResolvedValueOnce({ data: { content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 } });

            await recursosApi.listar({ nome: 'João', statusRecurso: 'ALOCADO', billable: true }, 0, 20);

            const url = vi.mocked(http.get).mock.calls[0][0] as string;
            expect(url).toContain('nome=Jo%C3%A3o');
            expect(url).toContain('statusRecurso=ALOCADO');
            expect(url).toContain('billable=true');
        });

        it('não deve incluir filtros vazios na query string', async () => {
            vi.mocked(http.get).mockResolvedValueOnce({ data: { content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 } });

            await recursosApi.listar({ nome: '', statusRecurso: '', statusMatricula: '' }, 0, 20);

            const url = vi.mocked(http.get).mock.calls[0][0] as string;
            expect(url).not.toContain('nome=');
            expect(url).not.toContain('statusRecurso=');
            expect(url).not.toContain('statusMatricula=');
        });
    });

    describe('buscar', () => {
        it('deve chamar GET /v1/admin/recursos/:id', async () => {
            vi.mocked(http.get).mockResolvedValueOnce({ data: mockRecurso });

            const result = await recursosApi.buscar('uuid-1');

            expect(http.get).toHaveBeenCalledWith('/v1/admin/recursos/uuid-1');
            expect(result).toEqual(mockRecurso);
        });
    });

    describe('atualizarMatricula', () => {
        it('deve chamar PATCH /v1/admin/recursos/:id/matricula com o novo status', async () => {
            vi.mocked(http.patch).mockResolvedValueOnce({ data: { ...mockRecurso, statusMatricula: 'SOLICITADO_VIA_CHAMADO', statusRecurso: 'AGUARDANDO' } });

            const result = await recursosApi.atualizarMatricula('uuid-1', 'SOLICITADO_VIA_CHAMADO');

            expect(http.patch).toHaveBeenCalledWith('/v1/admin/recursos/uuid-1/matricula', { statusMatricula: 'SOLICITADO_VIA_CHAMADO' });
            expect(result.statusMatricula).toBe('SOLICITADO_VIA_CHAMADO');
        });
    });

    describe('listarHistorico', () => {
        it('deve chamar GET /v1/admin/recursos/:id/historico', async () => {
            const mockHistorico = [
                { id: 'h1', valorAnterior: 'NAO_NECESSARIO', valorNovo: 'SOLICITADO_VIA_CHAMADO', alteradoPorNome: 'Admin', alteradoEm: '2026-01-01T00:00:00Z' }
            ];
            vi.mocked(http.get).mockResolvedValueOnce({ data: mockHistorico });

            const result = await recursosApi.listarHistorico('uuid-1');

            expect(http.get).toHaveBeenCalledWith('/v1/admin/recursos/uuid-1/historico');
            expect(result).toHaveLength(1);
            expect(result[0].valorNovo).toBe('SOLICITADO_VIA_CHAMADO');
        });
    });

    describe('adicionarMaquina', () => {
        it('deve chamar POST /v1/admin/recursos/:id/maquinas com os dados da máquina', async () => {
            const novaMaquina = { tagNumeroSerie: 'TAG-001', hostname: 'PC-001', statusMaquina: 'VAZIO' as const };
            const mockMaquinaResponse = { id: 'm1', ...novaMaquina, createdAt: '2026-01-01T00:00:00Z', updatedAt: null };
            vi.mocked(http.post).mockResolvedValueOnce({ data: mockMaquinaResponse });

            const result = await recursosApi.adicionarMaquina('uuid-1', novaMaquina);

            expect(http.post).toHaveBeenCalledWith('/v1/admin/recursos/uuid-1/maquinas', novaMaquina);
            expect(result.id).toBe('m1');
        });
    });

    describe('removerMaquina', () => {
        it('deve chamar DELETE /v1/admin/recursos/:id/maquinas/:maqId', async () => {
            vi.mocked(http.delete).mockResolvedValueOnce({ data: undefined });

            await recursosApi.removerMaquina('uuid-1', 'maq-1');

            expect(http.delete).toHaveBeenCalledWith('/v1/admin/recursos/uuid-1/maquinas/maq-1');
        });
    });

    describe('atualizarContato', () => {
        it('deve chamar PATCH /v1/recurso/me/contato com contato e endereço', async () => {
            vi.mocked(http.patch).mockResolvedValueOnce({ data: { ...mockRecurso, contato: '(11) 99999-9999', endereco: 'Rua A, 123' } });

            const result = await recursosApi.atualizarContato({ contato: '(11) 99999-9999', endereco: 'Rua A, 123' });

            expect(http.patch).toHaveBeenCalledWith('/v1/recurso/me/contato', { contato: '(11) 99999-9999', endereco: 'Rua A, 123' });
            expect(result.contato).toBe('(11) 99999-9999');
        });
    });
});
