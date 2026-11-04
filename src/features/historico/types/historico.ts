export type AuditOperation = "CREATE" | "UPDATE" | "DELETE";

export type AuditJsonValue =
  | string
  | number
  | boolean
  | null
  | AuditJsonValue[]
  | { [key: string]: AuditJsonValue };

// A lista mostra apenas informações resumidas, os snapshots aparecem somente nos detalhes
export interface AuditSummary {
  id: string;
  userId: string | null;
  userAffectedId: string | null;
  operation: AuditOperation;
  entityType: string;
  entityId: string;
  createdAt: string;
}
//esta interface é usada para exibir os registros que são detalhes no historico
export interface AuditDetail extends AuditSummary {
  oldValue: AuditJsonValue | null;
  newValue: AuditJsonValue | null;
}
export interface AuditLog extends AuditSummary {
  oldValue?: AuditJsonValue | null;
  newValue?: AuditJsonValue | null;
}
