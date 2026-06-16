import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfileReadOnly } from './ProfileReadOnly';
import type { UserProfile } from '../../types/profile';

describe('ProfileReadOnly Component', () => {
    const mockProfileBase: UserProfile = {
        id: '123',
        status: 'ACTIVE',
        nivel: 'Pleno',
        registrationStatus: 'APPROVED',
        registrationNumber: 'MAT-999',
        area: 'Frontend',
        experienceYears: 4,
        linkedinUrl: 'https://linkedin.com/in/leticia',
        githubUrl: 'https://github.com/leticia',
        about: 'Desenvolvedora focado na criação de interfaces.',
        skills: [
            { skill: { name: 'React', type: 'HARD' }, proficiencyLevel: 8 },
            { skill: { name: 'TypeScript' }, level: 7 },
            { name: 'Comunicação', type: 'SOFT', proficiencyLevel: 9 },
            { skill: { name: 'Proatividade', type: 'SOFT' }, proficiencyLevel: 8 }
        ],
        name: 'João Silva',
        email: 'joao@vilt-group.com'
    };

    it('deve renderizar o cabeçalho e badge corretamente quando o perfil está ATIVO', () => {
        render(<ProfileReadOnly profile={mockProfileBase} />);

        expect(screen.getByText('Seu perfil está ativo no banco de talentos')).toBeInTheDocument();
        expect(screen.getByText('Ativo')).toBeInTheDocument();
        expect(screen.getByText('Pleno')).toBeInTheDocument();
    });

    it('deve renderizar o cabeçalho, aviso e badge corretamente quando o perfil está PENDENTE', () => {
        const profilePendente = { ...mockProfileBase, status: 'PENDING', nivel: 'Jr' }; // Ajustado para 'PENDING'
        render(<ProfileReadOnly profile={profilePendente} />);

        expect(screen.getByText('Perfil enviado - aguardando revisão do RH')).toBeInTheDocument();
        expect(screen.getByText('Em análise')).toBeInTheDocument();
        expect(screen.getByText('O RH irá revisar suas respostas e ativar seu perfil em breve.')).toBeInTheDocument();
    });

    it('deve renderizar corretamente os campos básicos de informação (ReadField)', () => {
        render(<ProfileReadOnly profile={mockProfileBase} />);

        expect(screen.getByText('Matrícula')).toBeInTheDocument();
        expect(screen.getByText('MAT-999')).toBeInTheDocument();

        expect(screen.getByText('Área')).toBeInTheDocument();
        expect(screen.getByText('Frontend')).toBeInTheDocument();

        expect(screen.getByText('Sobre você')).toBeInTheDocument();
        // Ajustado de "Desenvolvedor" para "Desenvolvedora" para bater com o mockProfileBase
        expect(screen.getByText('Desenvolvedora focado na criação de interfaces.')).toBeInTheDocument();
    });

    it('deve calcular corretamente a label de "Anos de experiência"', () => {
        const { rerender } = render(<ProfileReadOnly profile={{ ...mockProfileBase, experienceYears: 0 }} />);
        expect(screen.getByText('Menos de 1 ano')).toBeInTheDocument();

        rerender(<ProfileReadOnly profile={{ ...mockProfileBase, experienceYears: 2 }} />);
        expect(screen.getByText('1 a 2 anos')).toBeInTheDocument();

        rerender(<ProfileReadOnly profile={{ ...mockProfileBase, experienceYears: 4 }} />);
        expect(screen.getByText('3 a 5 anos')).toBeInTheDocument();

        rerender(<ProfileReadOnly profile={{ ...mockProfileBase, experienceYears: 7 }} />);
        expect(screen.getByText('6 anos ou mais')).toBeInTheDocument();
    });

    it('deve renderizar os links do LinkedIn e GitHub', () => {
        render(<ProfileReadOnly profile={mockProfileBase} />);

        // Ajustado de "/joao" para "/leticia" para bater com os links do mockProfileBase
        const linkedinLink = screen.getByText('https://linkedin.com/in/leticia');
        expect(linkedinLink).toBeInTheDocument();
        expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/leticia');

        const githubLink = screen.getByText('https://github.com/leticia');
        expect(githubLink).toBeInTheDocument();
        expect(githubLink).toHaveAttribute('href', 'https://github.com/leticia');
    });

    it('deve renderizar apenas as Hard Skills e ocultar as Soft Skills', () => {
        render(<ProfileReadOnly profile={mockProfileBase} />);

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('8')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();

        expect(screen.queryByText('Comunicação')).not.toBeInTheDocument();
        expect(screen.queryByText('Proatividade')).not.toBeInTheDocument();
    });
});