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
    selectAllAriaLabel?: string;
    getRowAriaLabel?: (row: T) => string;
    isRowDisabled?: (row: T) => boolean;
    getRowDisabledTooltip?: (row: T) => string | undefined;
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
    disabled?: boolean;
    title?: string;
    onChange: (checked: boolean) => void;
    "aria-label": string;
}

function TableCheckbox({ checked, indeterminate = false, disabled = false, onChange, title, ...rest }: CheckboxProps) {
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
            disabled={disabled}
            title={title}
            className={twMerge(
                checkboxCls,
                disabled && "cursor-not-allowed opacity-50 accent-slate-400"
            )}
            checked={checked}
            onChange={(event) => !disabled && onChange(event.target.checked)}
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
    disabled?: boolean;
    disabledTooltip?: string;
    onToggle?: (row: T) => void;
    rowAriaLabel?: string;
}

function TableRowInner<T>({
    row,
    rowKey,
    columns,
    selectable,
    isSelected,
    disabled = false,
    disabledTooltip,
    onToggle,
    rowAriaLabel,
}: TableRowProps<T>) {
    return (
        <tr
            onClick={selectable && onToggle && !disabled ? () => onToggle(row) : undefined}
            title={disabled ? disabledTooltip : undefined}
            className={twMerge(
                "border-b border-slate-100 transition-colors",
                selectable && !disabled && "cursor-pointer hover:bg-slate-50",
                selectable && disabled && "opacity-60 cursor-not-allowed bg-slate-50/50",
                !selectable && "hover:bg-slate-50",
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
                        disabled={disabled}
                        title={disabled ? disabledTooltip : undefined}
                        onChange={() => !disabled && onToggle?.(row)}
                        aria-label={rowAriaLabel || `Selecionar linha ${rowKey}`}
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

    const isRowDisabled = selection?.isRowDisabled;
    const selectableRows = useMemo(() => {
        if (!selection) return [];
        return isRowDisabled ? data.filter((row) => !isRowDisabled(row)) : data;
    }, [data, selection, isRowDisabled]);

    const selectedKeys = selection?.selectedKeys;
    const selectedSet = useMemo(() => new Set(selectedKeys ?? []), [selectedKeys]);
    const allSelected = selectableRows.length > 0 && selectableRows.every((row) => selectedSet.has(keyExtractor(row)));
    const someSelected = selectableRows.some((row) => selectedSet.has(keyExtractor(row))) && !allSelected;
    const allDisabled = Boolean(selection) && data.length > 0 && selectableRows.length === 0;

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
                                    disabled={allDisabled}
                                    onChange={selection.onToggleAll}
                                    aria-label={selection.selectAllAriaLabel || "Selecionar todos"}
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
                                const disabled = Boolean(isRowDisabled?.(row));
                                const disabledTooltip = disabled ? selection?.getRowDisabledTooltip?.(row) : undefined;

                                return (
                                    <TableRow
                                        key={key}
                                        row={row}
                                        rowKey={key}
                                        columns={columns}
                                        selectable={Boolean(selection)}
                                        isSelected={selectedSet.has(key)}
                                        disabled={disabled}
                                        disabledTooltip={disabledTooltip}
                                        onToggle={selection?.onToggleRow}
                                        rowAriaLabel={selection?.getRowAriaLabel ? selection.getRowAriaLabel(row) : undefined}
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
