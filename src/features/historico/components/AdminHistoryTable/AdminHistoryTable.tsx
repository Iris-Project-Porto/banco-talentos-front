import { Eye } from "lucide-react";
import { Badge } from "@/components/ui";
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
  onView: (record: AuditSummary) => void;
}

export function AdminHistoryTable({ records, onView }: Props) {
  const columns = [
    {
      header: "Tipo de alteração",
      render: (record: AuditSummary) => (
        <div>
          <Badge variant={operationVariants[record.operation]}>
            {operationLabels[record.operation]}
          </Badge>

          <p className="mt-0.5 text-sm font-medium text-slate-700">
            {record.entityName?.trim() || "Contexto indisponível"}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {entityLabels[record.entityType] ?? record.entityType}
          </p>
          {(record.entityType === "PROJECT" || record.entityType === "SQUAD") &&
            record.description?.trim() && (
              <p className="mt-1 text-xs text-slate-500">
                {record.description.trim()}
              </p>
            )}
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
      header: "Usuário afetado",
      render: (record: AuditSummary) => (
        <span className="text-slate-600">
          {getAuditUserLabel(record.userAffectedName)}
        </span>
      ),
    },
    {
      header: "Detalhes",
      className: "text-right",
      render: (record: AuditSummary) => (
        <button
          type="button"
          onClick={() => onView(record)}
          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
          title="Visualizar detalhes"
          aria-label={`Visualizar detalhes da auditoria ${record.id}`}
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
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
