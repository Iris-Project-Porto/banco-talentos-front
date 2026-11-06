import { Eye } from "lucide-react";
import { Avatar, Badge } from "@/components/ui";
import { Table } from "@/components/ui/Table/Table";
import type { AuditSummary } from "../../types/historico";
import {
    entityLabels,
    formatAuditDate,
    getAuditUserLabel,
    operationLabels,
    operationVariants,
} from "../../utils/adminHistory";

interface Props {
    records: AuditSummary[];
    onView?: (record: AuditSummary) => void;
}

export function AdminHistoryTable({ records, onView }: Props) {
    const columns = [
        {
            header: "Tipo de evento",
            render: (record: AuditSummary) => (
                <div>
                    <Badge variant={operationVariants[record.operation]}>
                        {operationLabels[record.operation]}
                    </Badge>
                    <p className="mt-1 text-xs text-slate-400">
                        {entityLabels[record.entityType] ?? record.entityType}
                    </p>
                </div>
            ),
        },
        {
            header: "Data e hora",
            render: (record: AuditSummary) => (
                <span className="whitespace-nowrap text-slate-600">
                    {formatAuditDate(record.createdAt)}
                </span>
            ),
        },
        {
            header: "Usuário executor",
            render: (record: AuditSummary) => (
                <div className="flex items-center gap-2">
                    <Avatar name={getAuditUserLabel(record.userId)} size={32} />
                    <span className="text-slate-700" title={record.userId ?? undefined}>
                        {getAuditUserLabel(record.userId)}
                    </span>
                </div>
            ),
        },
        {
            header: "Usuário afetado",
            render: (record: AuditSummary) => (
                <span className="text-slate-600" title={record.userAffectedId ?? undefined}>
                    {getAuditUserLabel(record.userAffectedId)}
                </span>
            ),
        },
        {
            header: "Detalhes",
            className: "text-right",
            render: (record: AuditSummary) => (
                <button
                    type="button"
                    onClick={() => onView?.(record)}
                    className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    title="Visualizar detalhes"
                    aria-label={`Visualizar detalhes da auditoria ${record.id}`}
                >
                    <Eye className="h-4 w-4" />
                </button>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={records}
            keyExtractor={(record) => record.id}
            emptyMessage="Não há histórico de eventos registrados para esta aba"
        />
    );
}
