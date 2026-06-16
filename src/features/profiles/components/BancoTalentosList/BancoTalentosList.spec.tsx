import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BancoTalentosList } from './BancoTalentosList';
import { useBancoTalentos } from '../../hooks/useBancoTalentos/useBancoTalentos';

vi.mock('../../hooks/useBancoTalentos/useBancoTalentos', () => ({
    useBancoTalentos: vi.fn()
}));

describe('BancoTalentosList Component', () => {
    const mockSetSearch = vi.fn();
    const mockSetArea = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = () => {
        return render(
            <MemoryRouter>
                <BancoTalentosList />
            </MemoryRouter>
        );
    };

    it('deve renderizar o texto de carregamento quando o loading for true', () => {
        vi.mocked(useBancoTalentos).mockReturnValue({
            search: '',
            setSearch: mockSetSearch,
            area: '',
            setArea: mockSetArea,
            areas: [],
            filtered: [],
            loading: true
        } as any);

        renderComponent();
        expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    it('deve exibir a mensagem de lista vazia quando nenhum talento for encontrado', () => {
        vi.mocked(useBancoTalentos).mockReturnValue({
            search: '',
            setSearch: mockSetSearch,
            area: '',
            setArea: mockSetArea,
            areas: ['Frontend', 'Backend'],
            filtered: [],
            totalElements: 0,
            loading: false
        } as any);

        renderComponent();
        expect(screen.getByText('Nenhum talento encontrado.')).toBeInTheDocument();
        expect(screen.getByText(/0 pessoas/i)).toBeInTheDocument();
    });

    it('deve renderizar a grelha de talentos (PersonCard) e as opções de Business Unit (áreas)', () => {
        const mockFiltered = [
            {
                id: '1',
                name: 'João Silva',
                email: 'joao@vilt-group.com',
                area: 'Frontend',
                allocationStatus: 'Disponível (Bench)'
            },
            {
                id: '2',
                name: 'Maria Souza',
                email: 'maria@vilt-group.com',
                area: 'Backend',
                allocationStatus: 'Disponível (Bench)'
            }
        ];

        vi.mocked(useBancoTalentos).mockReturnValue({
            search: '',
            setSearch: mockSetSearch,
            area: '',
            setArea: mockSetArea,
            areas: ['Frontend', 'Backend'],
            filtered: mockFiltered,
            totalElements: 2,
            loading: false
        } as any);

        renderComponent();
        expect(screen.getByText('João Silva')).toBeInTheDocument();
        expect(screen.getByText('Maria Souza')).toBeInTheDocument();
        expect(screen.getByText(/2 pessoas/i)).toBeInTheDocument();

        expect(screen.getByRole('option', { name: 'Frontend' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Backend' })).toBeInTheDocument();
    });

    it('deve invocar setSearch ao digitar no input de pesquisa', () => {
        vi.mocked(useBancoTalentos).mockReturnValue({
            search: '',
            setSearch: mockSetSearch,
            area: '',
            setArea: mockSetArea,
            areas: [],
            filtered: [],
            loading: false
        } as any);

        renderComponent();
        const searchInput = screen.getByPlaceholderText('Buscar por nome, área ou skill...');
        fireEvent.change(searchInput, { target: { value: 'React' } });

        expect(mockSetSearch).toHaveBeenCalledTimes(1);
        expect(mockSetSearch).toHaveBeenCalledWith('React');
    });

    it('deve invocar setArea ao alterar o valor da combobox de Business Unit', () => {
        vi.mocked(useBancoTalentos).mockReturnValue({
            search: '',
            setSearch: mockSetSearch,
            area: '',
            setArea: mockSetArea,
            areas: ['DevOps', 'Mobile'],
            filtered: [],
            loading: false
        } as any);

        renderComponent();
        const areaSelect = screen.getByRole('combobox');
        fireEvent.change(areaSelect, { target: { value: 'DevOps' } });

        expect(mockSetArea).toHaveBeenCalledTimes(1);
        expect(mockSetArea).toHaveBeenCalledWith('DevOps');
    });
});