import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Stepper } from './Stepper';

const steps = [
    { label: 'Dados da Vaga', description: 'Informações gerais' },
    { label: 'Match de Recursos', description: 'Ranking automático' },
    { label: 'Alocação de Recursos', description: 'Definir alocação' },
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
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('deve exibir o ícone de concluído para etapas anteriores à atual', () => {
        const { container } = render(<Stepper steps={steps} currentStep={1} />);
        expect(container.querySelector('svg')).toBeInTheDocument();
        expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('deve permitir clicar apenas em etapas anteriores para voltar', () => {
        const onStepClick = vi.fn();
        render(<Stepper steps={steps} currentStep={2} onStepClick={onStepClick} />);

        // Etapa 0 (Dados da Vaga) é anterior -> clicável
        const step0Button = screen.getByRole('button', { name: /Voltar para etapa 1: Dados da Vaga/i });
        expect(step0Button).toBeInTheDocument();
        fireEvent.click(step0Button);
        expect(onStepClick).toHaveBeenCalledWith(0);

        // Etapa 1 (Match de Recursos) é anterior -> clicável
        const step1Button = screen.getByRole('button', { name: /Voltar para etapa 2: Match de Recursos/i });
        expect(step1Button).toBeInTheDocument();
        fireEvent.click(step1Button);
        expect(onStepClick).toHaveBeenCalledWith(1);

        // Etapa 2 (Atual) -> não é botão, não clicável
        expect(screen.queryByRole('button', { name: /Alocação de Recursos/i })).not.toBeInTheDocument();
    });

    it('não deve permitir clicar em etapas futuras para avançar', () => {
        const onStepClick = vi.fn();
        render(<Stepper steps={steps} currentStep={0} onStepClick={onStepClick} />);

        // Nenhuma etapa futura (1 ou 2) deve ser botão
        expect(screen.queryByRole('button')).not.toBeInTheDocument();

        // Clicar no texto da etapa futura não chama onStepClick
        fireEvent.click(screen.getByText('Match de Recursos'));
        expect(onStepClick).not.toHaveBeenCalled();
    });
});
