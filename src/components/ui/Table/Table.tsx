import { ReactNode, memo, useEffect, useMemo, useRef } from "react";
import { twMerge } from "tailwind-merge";

type RowKey = string | number;

interface Column<T> {
    header: string;
    render: (row: T) => ReactNode;
    className?: string;
}

export interface TableSelection<T> {
    selectedKeys: RowKey[];
    onToggleRow: (row: T) => void;
    onToggleAll: (checked: boolean) => void;
}

interface Props<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (row: T) => RowKey;
    emptyMessage?: string;
    minRows?: number;
    className?: string;
    wrapperClassName?: string;
    selection?: TableSelection<T>;
}

const thBaseCls = "py-3 px-4";
const tdBaseCls = "py-4 px-4";
const checkboxCls = "size-4 rounded border-slate-300 accent-pink cursor-pointer";
const selectionCellCls = "py-3 px-4 w-12";

interface CheckboxProps {
    checked: boolean;
    indeterminate?: boolean;
    onChange: (checked: boolean) => void;
    "aria-label": string;
}

function TableCheckbox({ checked, indeterminate = false, onChange, ...rest }: CheckboxProps) {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    return (
        <input
            ref={ref}
            type="checkbox"
            className={checkboxCls}
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            {...rest}
        />
    );
}

interface TableRowProps<T> {
    row: T;
    rowKey: RowKey;
    columns: Column<T>[];
    selectable: boolean;
    isSelected: boolean;
    onToggle?: (row: T) => void;
}

function TableRowInner<T>({ row, rowKey, columns, selectable, isSelected, onToggle }: TableRowProps<T>) {
    return (
        <tr
            onClick={selectable && onToggle ? () => onToggle(row) : undefined}
            className={twMerge(
                "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                selectable && "cursor-pointer",
                isSelected && "bg-pink/5",
            )}
        >
            {selectable && (
                <td
                    className={selectionCellCls}
                    onClick={(event) => event.stopPropagation()}
                >
                    <TableCheckbox
                        checked={isSelected}
                        onChange={() => onToggle?.(row)}
                        aria-label={`Selecionar linha ${rowKey}`}
                    />
                </td>
            )}
            {columns.map((column) => (
                <td
                    key={column.header}
                    className={twMerge(tdBaseCls, column.className)}
                >
                    {column.render(row)}
                </td>
            ))}
        </tr>
    );
}

const TableRow = memo(TableRowInner) as typeof TableRowInner;

export function Table<T>({
    columns,
    data,
    keyExtractor,
    emptyMessage = "Sem dados disponíveis",
    minRows = 0,
    className = "",
    wrapperClassName = "",
    selection,
}: Props<T>) {
    const emptyRows = data.length === 0 ? 0 : Math.max(0, minRows - data.length);
    const totalColumns = columns.length + (selection ? 1 : 0);

    const selectedKeys = selection?.selectedKeys;
    const selectedSet = useMemo(() => new Set(selectedKeys ?? []), [selectedKeys]);
    const allSelected = data.length > 0 && data.every((row) => selectedSet.has(keyExtractor(row)));
    const someSelected = data.some((row) => selectedSet.has(keyExtractor(row))) && !allSelected;

    return (
        <div className={twMerge("overflow-x-auto", wrapperClassName)}>
            <table className={twMerge("w-full text-left border-collapse", className)}>
                <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                        {selection && (
                            <th scope="col" className={selectionCellCls}>
                                <TableCheckbox
                                    checked={allSelected}
                                    indeterminate={someSelected}
                                    onChange={selection.onToggleAll}
                                    aria-label="Selecionar todos"
                                />
                            </th>
                        )}
                        {columns.map((column) => (
                            <th
                                key={column.header}
                                scope="col"
                                className={twMerge(thBaseCls, column.className)}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="text-sm text-slate-700">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={totalColumns}
                                className="py-8 text-center text-slate-400"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        <>
                            {data.map((row) => {
                                const key = keyExtractor(row);

                                return (
                                    <TableRow
                                        key={key}
                                        row={row}
                                        rowKey={key}
                                        columns={columns}
                                        selectable={Boolean(selection)}
                                        isSelected={selectedSet.has(key)}
                                        onToggle={selection?.onToggleRow}
                                    />
                                );
                            })}
                            {Array.from({ length: emptyRows }).map((_, index) => (
                                <tr
                                    key={`empty-row-${index}`}
                                    className="border-b border-slate-100"
                                >
                                    <td colSpan={totalColumns} className={`${tdBaseCls} h-11`}>
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
