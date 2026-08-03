import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stepper } from './Stepper';

const steps = [
    { label: 'Dados da Vaga', description: 'Informações gerais' },
    { label: 'Match de Recursos', description: 'Ranking automático' },
];

describe('Stepper Component', () => {
    it('deve renderizar o label e a descrição de cada etapa', () => {
        render(<Stepper steps={steps} currentStep={0} />);
        expect(screen.getByText('Dados da Vaga')).toBeInTheDocument();
        expect(screen.getByText('Informações gerais')).toBeInTheDocument();
        expect(screen.getByText('Match de Recursos')).toBeInTheDocument();
    });

    it('deve numerar as etapas ainda não concluídas', () => {
        render(<Stepper steps={steps} currentStep={0} />);
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('deve exibir o ícone de concluído para etapas anteriores à atual', () => {
        const { container } = render(<Stepper steps={steps} currentStep={1} />);
        expect(container.querySelector('svg')).toBeInTheDocument();
        expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
});
