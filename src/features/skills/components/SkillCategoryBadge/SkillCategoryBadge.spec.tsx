import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillCategoryBadge } from './SkillCategoryBadge';

describe('Componente SkillCategoryBadge', () => {
    it('deve exibir o rótulo em português da categoria', () => {
        render(<SkillCategoryBadge category="FRONTEND" />);

        expect(screen.getByText('Frontend')).toBeInTheDocument();
    });

    it('deve exibir rótulo de Ciência de Dados para DATA_SCIENCE', () => {
        render(<SkillCategoryBadge category="DATA_SCIENCE" />);

        expect(screen.getByText('Ciência de Dados')).toBeInTheDocument();
    });

    it('deve aplicar estilo visual da categoria', () => {
        const { container } = render(<SkillCategoryBadge category="FRONTEND" />);

        expect(container.querySelector('span')).toHaveClass('bg-blue-50');
    });
});
