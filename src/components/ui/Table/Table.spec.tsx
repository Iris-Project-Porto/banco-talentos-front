import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table } from './Table';

interface Row {
    id: string;
    name: string;
    category: string;
}

const columns = [
    {
        header: 'Nome',
        render: (row: Row) => row.name,
    },
    {
        header: 'Categoria',
        render: (row: Row) => row.category,
        className: 'text-right',
    },
];

const data: Row[] = [
    { id: '1', name: 'React', category: 'Frontend' },
    { id: '2', name: 'Python', category: 'Backend' },
];

describe('Componente Table', () => {
    it('deve renderizar os cabeçalhos das colunas', () => {
        render(
            <Table
                columns={columns}
                data={data}
                keyExtractor={(row) => row.id}
            />
        );

        expect(screen.getByText('Nome')).toBeInTheDocument();
        expect(screen.getByText('Categoria')).toBeInTheDocument();
    });

    it('deve renderizar os dados das linhas', () => {
        render(
            <Table
                columns={columns}
                data={data}
                keyExtractor={(row) => row.id}
            />
        );

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Python')).toBeInTheDocument();
        expect(screen.getByText('Frontend')).toBeInTheDocument();
        expect(screen.getByText('Backend')).toBeInTheDocument();
    });

    it('deve exibir mensagem padrão quando não houver dados', () => {
        render(
            <Table
                columns={columns}
                data={[]}
                keyExtractor={(row) => row.id}
            />
        );

        expect(screen.getByText('Sem dados disponíveis')).toBeInTheDocument();
    });

    it('deve exibir mensagem customizada quando não houver dados', () => {
        render(
            <Table
                columns={columns}
                data={[]}
                keyExtractor={(row) => row.id}
                emptyMessage="Nenhuma skill encontrada"
            />
        );

        expect(screen.getByText('Nenhuma skill encontrada')).toBeInTheDocument();
    });

    it('deve aplicar className customizada na tabela', () => {
        const { container } = render(
            <Table
                className="min-w-[800px]"
                columns={columns}
                data={data}
                keyExtractor={(row) => row.id}
            />
        );

        expect(container.querySelector('table')).toHaveClass('min-w-[800px]');
    });

    it('deve aplicar estilo de cabeçalho no padrão squads', () => {
        const { container } = render(
            <Table
                columns={columns}
                data={data}
                keyExtractor={(row) => row.id}
            />
        );

        const headerRow = container.querySelector('thead tr');
        expect(headerRow).toHaveClass('border-b', 'uppercase', 'text-slate-500');
    });

    it('deve aplicar hover nas linhas de dados', () => {
        const { container } = render(
            <Table
                columns={columns}
                data={data}
                keyExtractor={(row) => row.id}
            />
        );

        const dataRow = container.querySelector('tbody tr');
        expect(dataRow).toHaveClass('hover:bg-slate-50');
    });

    it('deve aplicar className nas células da coluna', () => {
        const { container } = render(
            <Table
                columns={columns}
                data={data}
                keyExtractor={(row) => row.id}
            />
        );

        expect(container.querySelector('th.text-right')).toBeInTheDocument();
        expect(container.querySelectorAll('td.text-right')).toHaveLength(2);
    });

    it('deve renderizar linhas vazias extras quando minRows for maior que os dados', () => {
        const { container } = render(
            <Table
                columns={columns}
                data={[data[0]]}
                keyExtractor={(row) => row.id}
                minRows={3}
            />
        );

        expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
    });
});
