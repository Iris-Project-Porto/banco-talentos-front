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
import type { AuditCategory } from "../../utils/adminHistory";

interface Props {
  records: AuditSummary[];
  activeTab: AuditCategory;
  onView: (record: AuditSummary) => void;
}

export function AdminHistoryTable({ records, activeTab, onView }: Props) {
  const columns = [
    {
      header: "Tipo de alteração",
      render: (record: AuditSummary) => (
        <div
          onClick={() => onView(record)}
          className="cursor-pointer group"
          title="Clique para ver os detalhes"
        >
          <Badge variant={operationVariants[record.operation]}>
            {operationLabels[record.operation]}
          </Badge>

          <p className="mt-0.5 text-sm font-medium text-slate-700 truncate max-w-[16rem] sm:max-w-[24rem] group-hover:text-pink transition-colors">
            {record.entityName?.trim() || "Contexto indisponível"}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {entityLabels[record.entityType] ?? record.entityType}
          </p>
          {(record.entityType === "PROJECT" ||
            record.entityType === "SQUAD" ||
            record.entityType === "SKILL") &&
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
        <div onClick={() => onView(record)} className="cursor-pointer h-full flex items-center">
          <span className="whitespace-nowrap text-slate-600">
            {formatAuditDate(record.createdAt)}
          </span>
        </div>
      ),
    },
    activeTab === "Recursos"
      ? {
        header: "Usuário afetado",
        render: (record: AuditSummary) => (
          <div onClick={() => onView(record)} className="cursor-pointer h-full flex items-center">
            <span className="text-slate-600">
              {getAuditUserLabel(record.userAffectedName)}
            </span>
          </div>
        ),
      }
      : null,
  ].filter(Boolean) as any[];

  return (
    <Table
      columns={columns}
      data={records}
      keyExtractor={(record) => record.id}
      emptyMessage="Não há histórico de eventos registrados para esta aba"
    />
  );
}