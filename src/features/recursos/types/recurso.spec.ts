import { describe, it, expect } from 'vitest';
import {
    STATUS_RECURSO_LABELS,
    STATUS_MATRICULA_LABELS,
    STATUS_MAQUINA_LABELS,
    STATUS_PROPOSTA_LABELS,
} from './recurso';

describe('recurso type labels', () => {
    describe('STATUS_RECURSO_LABELS', () => {
        it('deve mapear todos os valores de StatusRecurso para labels em PT-BR', () => {
            expect(STATUS_RECURSO_LABELS['DISPONIVEL']).toBe('Disponível');
            expect(STATUS_RECURSO_LABELS['AGUARDANDO']).toBe('Aguardando');
            expect(STATUS_RECURSO_LABELS['ALOCADO']).toBe('Alocado');
        });

        it('deve cobrir todos os 3 status possíveis', () => {
            expect(Object.keys(STATUS_RECURSO_LABELS)).toHaveLength(3);
        });
    });

    describe('STATUS_MATRICULA_LABELS', () => {
        it('deve mapear todos os valores de StatusMatricula para labels em PT-BR', () => {
            expect(STATUS_MATRICULA_LABELS['NAO_NECESSARIO']).toBe('Não necessário');
            expect(STATUS_MATRICULA_LABELS['SOLICITADO_VIA_CHAMADO']).toBe('Solicitado via chamado');
            expect(STATUS_MATRICULA_LABELS['CHAMADO_AGUARDANDO_APROVACAO']).toBe('Aguardando aprovação');
            expect(STATUS_MATRICULA_LABELS['CHAMADO_AGUARDANDO_ATENDIMENTO']).toBe('Aguardando atendimento');
            expect(STATUS_MATRICULA_LABELS['LIBERADA']).toBe('Liberada');
        });

        it('deve cobrir todos os 5 status possíveis', () => {
            expect(Object.keys(STATUS_MATRICULA_LABELS)).toHaveLength(5);
        });
    });

    describe('STATUS_MAQUINA_LABELS', () => {
        it('deve retornar traço para VAZIO', () => {
            expect(STATUS_MAQUINA_LABELS['VAZIO']).toBe('—');
        });

        it('deve mapear os demais status de máquina corretamente', () => {
            expect(STATUS_MAQUINA_LABELS['EM_PROCESSO_DE_SOLICITACAO']).toBe('Em processo');
            expect(STATUS_MAQUINA_LABELS['SOLICITADO']).toBe('Solicitado');
            expect(STATUS_MAQUINA_LABELS['RETIRADO']).toBe('Retirado');
            expect(STATUS_MAQUINA_LABELS['ENVIO_PARA_O_RECURSO']).toBe('Enviado ao recurso');
            expect(STATUS_MAQUINA_LABELS['EM_USO']).toBe('Em uso');
            expect(STATUS_MAQUINA_LABELS['DEVOLVIDO']).toBe('Devolvido');
        });

        it('deve cobrir todos os 7 status possíveis', () => {
            expect(Object.keys(STATUS_MAQUINA_LABELS)).toHaveLength(7);
        });
    });

    describe('STATUS_PROPOSTA_LABELS', () => {
        it('deve mapear todos os status de proposta técnica', () => {
            expect(STATUS_PROPOSTA_LABELS['PENDENTE_DE_ENVIO']).toBe('Pendente de envio');
            expect(STATUS_PROPOSTA_LABELS['ENVIADO_AO_COORDENADOR']).toBe('Enviado ao Coordenador');
            expect(STATUS_PROPOSTA_LABELS['COBRAR_RETORNO']).toBe('Cobrar retorno');
            expect(STATUS_PROPOSTA_LABELS['ASSINADO']).toBe('Assinado');
            expect(STATUS_PROPOSTA_LABELS['ERRO_DE_ASSINATURA']).toBe('Erro de assinatura');
        });

        it('deve cobrir todos os 5 status possíveis', () => {
            expect(Object.keys(STATUS_PROPOSTA_LABELS)).toHaveLength(5);
        });
    });
});
