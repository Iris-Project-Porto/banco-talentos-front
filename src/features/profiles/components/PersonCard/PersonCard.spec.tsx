import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PersonCard } from './PersonCard';
import type { UserProfile } from '../../types/profile';

describe('Componente PersonCard', () => {
    // Atualizado: Removida a propriedade `user` aninhada e passado direto para a raiz (name e email)
    const mockProfile: UserProfile = {
        id: "perf-123",
        status: "ACTIVE",
        nivel: "Sr",
        area: "Frontend",
        allocationStatus: "Disponível (Bench)",
        registrationStatus: "APPROVED",
        skills: [
            { skill: { name: "React" } },
            { skill: { name: "TypeScript" } },
            { skill: { name: "Tailwind" } },
            { skill: { name: "Vitest" } },
            { skill: { name: "Node.js" } }
        ],
        name: "Nuno Silva",
        email: "nuno.silva@vilt-group.com"
    };

    it('deve renderizar corretamente os dados identificadores, nível e área do talento', () => {
        render(
            <MemoryRouter>
                <PersonCard
                    id={mockProfile.id}
                    name={mockProfile.name!}
                    email={mockProfile.email}
                    area={mockProfile.area}
                    nivel={mockProfile.nivel}
                    allocationStatus={mockProfile.allocationStatus}
                    skills={mockProfile.skills}
                    registrationStatus={mockProfile.registrationStatus}
                />
            </MemoryRouter>
        );

        expect(screen.getByText('Nuno Silva')).toBeInTheDocument();
        expect(screen.getByText('nuno.silva@vilt-group.com')).toBeInTheDocument();
        expect(screen.getByText('Sr')).toBeInTheDocument();
        expect(screen.getByText('Frontend')).toBeInTheDocument();
    });

    it('deve mapear corretamente os textos amigáveis de alocação e status de matrícula', () => {
        render(
            <MemoryRouter>
                <PersonCard
                    id={mockProfile.id}
                    name={mockProfile.name!}
                    allocationStatus="Em Transição (saindo de projeto)"
                    registrationStatus="AWAITING_APPROVAL"
                />
            </MemoryRouter>
        );

        expect(screen.getByText('Em Transição')).toBeInTheDocument();
        expect(screen.getByText('Matrícula Pendente')).toBeInTheDocument();
    });

    it('deve limitar a exibição a no máximo 4 skills e mostrar o contador restante', () => {
        render(
            <MemoryRouter>
                <PersonCard
                    id={mockProfile.id}
                    name={mockProfile.name!}
                    skills={mockProfile.skills}
                />
            </MemoryRouter>
        );

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Tailwind')).toBeInTheDocument();
        expect(screen.getByText('Vitest')).toBeInTheDocument();
        expect(screen.queryByText('Node.js')).not.toBeInTheDocument();
        expect(screen.getByText('+1')).toBeInTheDocument();
    });
});