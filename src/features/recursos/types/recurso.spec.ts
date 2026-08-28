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
            expect(STATUS_RECURSO_LABELS['AVAILABLE']).toBe('Disponível');
            expect(STATUS_RECURSO_LABELS['WAITING']).toBe('Aguardando');
            expect(STATUS_RECURSO_LABELS['ALLOCATED']).toBe('Alocado');
        });

        it('deve cobrir todos os 3 status possíveis', () => {
            expect(Object.keys(STATUS_RECURSO_LABELS)).toHaveLength(3);
        });
    });

    describe('STATUS_MATRICULA_LABELS', () => {
        it('deve mapear todos os valores de StatusMatricula para labels em PT-BR', () => {
            expect(STATUS_MATRICULA_LABELS['NOT_REQUIRED']).toBe('Não Necessário');
            expect(STATUS_MATRICULA_LABELS['REQUESTED_VIA_TICKET']).toBe('Solicitado via chamado');
            expect(STATUS_MATRICULA_LABELS['TICKET_AWAITING_APPROVAL']).toBe('Aguardando aprovação');
            expect(STATUS_MATRICULA_LABELS['TICKET_AWAITING_SERVICE']).toBe('Aguardando atendimento');
            expect(STATUS_MATRICULA_LABELS['RELEASED']).toBe('Liberada');
        });

        it('deve cobrir todos os 5 status possíveis', () => {
            expect(Object.keys(STATUS_MATRICULA_LABELS)).toHaveLength(5);
        });
    });

    describe('STATUS_MAQUINA_LABELS', () => {
        it('deve retornar Vazio para EMPTY', () => {
            expect(STATUS_MAQUINA_LABELS['EMPTY']).toBe('Vazio');
        });

        it('deve mapear os demais status de máquina corretamente', () => {
            expect(STATUS_MAQUINA_LABELS['REQUEST_IN_PROGRESS']).toBe('Em processo de solicitação');
            expect(STATUS_MAQUINA_LABELS['REQUESTED']).toBe('Solicitado');
            expect(STATUS_MAQUINA_LABELS['WITHDRAWN']).toBe('Retirado');
            expect(STATUS_MAQUINA_LABELS['SENT_TO_RESOURCE']).toBe('Envio para o recurso');
            expect(STATUS_MAQUINA_LABELS['IN_USE']).toBe('Em Uso');
            expect(STATUS_MAQUINA_LABELS['RETURNED']).toBe('Devolvido');
            expect(STATUS_MAQUINA_LABELS['INACTIVE']).toBe('Inativo');
        });

        it('deve cobrir todos os 8 status possíveis', () => {
            expect(Object.keys(STATUS_MAQUINA_LABELS)).toHaveLength(8);
        });
    });

    describe('STATUS_PROPOSTA_LABELS', () => {
        it('deve mapear todos os status de proposta técnica', () => {
            expect(STATUS_PROPOSTA_LABELS['PENDING_SEND']).toBe('Pendente de envio');
            expect(STATUS_PROPOSTA_LABELS['SENT_TO_COORDINATOR']).toBe('Enviado ao Coordenador');
            expect(STATUS_PROPOSTA_LABELS['FOLLOW_UP_REQUIRED']).toBe('Cobrar retorno');
            expect(STATUS_PROPOSTA_LABELS['SIGNED']).toBe('Assinado');
            expect(STATUS_PROPOSTA_LABELS['SIGNATURE_ERROR']).toBe('Erro de assinatura');
        });

        it('deve cobrir todos os 5 status possíveis', () => {
            expect(Object.keys(STATUS_PROPOSTA_LABELS)).toHaveLength(5);
        });
    });
});
