import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar Component', () => {
    it('deve renderizar as iniciais se não houver photoUrl', () => {
        render(<Avatar name="João Silva Pereira" />);
        // Deve pegar apenas as duas primeiras palavras: J e S
        expect(screen.getByText('JS')).toBeInTheDocument();
    });

    it('deve renderizar a imagem se photoUrl for providenciada', () => {
        render(<Avatar name="Maria" photoUrl="https://example.com/foto.jpg" />);

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://example.com/foto.jpg');
        expect(img).toHaveAttribute('alt', 'Maria');
        // Iniciais não devem estar na tela
        expect(screen.queryByText('M')).not.toBeInTheDocument();
    });
});