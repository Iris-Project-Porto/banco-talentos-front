import { describe, it, expect } from 'vitest';
import { getLevelLabel, getRegistrationStatusLabel } from './profileUtils';

describe('profileUtils', () => {
    describe('getLevelLabel', () => {
        it('deve retornar "Em desenvolvimento" para nível <= 3', () => {
            expect(getLevelLabel(1)).toBe("Em desenvolvimento");
            expect(getLevelLabel(3)).toBe("Em desenvolvimento");
        });

        it('deve retornar "Referência no time" para nível > 8', () => {
            expect(getLevelLabel(9)).toBe("Referência no time");
            expect(getLevelLabel(10)).toBe("Referência no time");
        });
    });

    describe('getRegistrationStatusLabel', () => {
        it('deve retornar "Não Necessário" para status não necessário', () => {
            expect(getRegistrationStatusLabel("NOT_REQUIRED")).toBe("Não Necessário");
        });

        it('deve retornar "Solicitado via chamado" para status solicitado via chamado', () => {
            expect(getRegistrationStatusLabel("REQUESTED_VIA_TICKET")).toBe("Solicitado via chamado");
        });

        it('deve retornar "Chamado aguardando aprovação" para status chamado aguardando aprovação', () => {
            expect(getRegistrationStatusLabel("TICKET_AWAITING_APPROVAL")).toBe("Chamado aguardando aprovação");
        });

        it('deve retornar "Chamado aguardando atendimento" para status chamado aguardando atendimento', () => {
            expect(getRegistrationStatusLabel("TICKET_AWAITING_SERVICE")).toBe("Chamado aguardando atendimento");
        });

        it('deve retornar "Liberada" para status liberado', () => {
            expect(getRegistrationStatusLabel("RELEASED")).toBe("Liberada");
        });
        
        it('deve retornar "Em andamento" para status pendentes', () => {
            expect(getRegistrationStatusLabel("REQUESTED")).toBe("Em andamento");
            expect(getRegistrationStatusLabel("AWAITING_APPROVAL")).toBe("Em andamento");
        });

        it('deve retornar "Concluído" para status finalizados', () => {
            expect(getRegistrationStatusLabel("APPROVED")).toBe("Concluído");
            expect(getRegistrationStatusLabel("REJECTED")).toBe("Concluído");
        });

        it('deve retornar "Não solicitado" para status não solicitado ou vazio', () => {
            expect(getRegistrationStatusLabel()).toBe("Não solicitado");
            expect(getRegistrationStatusLabel("NOT_REQUESTED")).toBe("Não solicitado");
        });
    });
});