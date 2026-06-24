import {ReactNode} from "react";

interface Column<T> {
    header: string;
    render: (row: T) => ReactNode;
    className?: string;
}

interface Props<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (row: T) => string | number;
    emptyMessage?: string;
    minRows?: number;
    className?: string;
}

export function Table<T>({ columns, data, keyExtractor, emptyMessage = "Sem dados disponíveis", minRows = 0, className = "" }: Props<T>) {
    const emptyRows = data.length === 0 ? 0 : Math.max(0, minRows - data.length);

    return (
        <div className="w-full text-sm border-collapse">
            <table className={`w-full text-left border-collapse ${className}`}>
                <thead>
                    <tr className="bg-gray-100">
                        {columns.map((column) => (
                            <th key={column.header} className={`px-4 py-2 ${column.className || ""}`}>
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-2 text-center">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        <>
                            {data.map((row) => (
                                <tr key={keyExtractor(row)} className="border-b">
                                    {columns.map((column) => (
                                        <td key={column.header} className={`px-4 py-2 ${column.className || ""}`}>
                                            {column.render(row)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {Array.from({ length: emptyRows }).map((_, index) => (
                                <tr key={`empty-row-${index}`} className="border-b">
                                    <td colSpan={columns.length} className="px-4 py-2 h-11">
                                        &nbsp;
                                    </td>
                                </tr>
                            ))}
                        </>
                    )}
                </tbody>
            </table>
        </div>
    );
}