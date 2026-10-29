export type AuditOperation = "CREATE" | "UPDATE" | "DELETE";

export type AuditJsonValue =
  | string
  | number
  | boolean
  | null
  | AuditJsonValue[]
  | { [key: string]: AuditJsonValue };

export interface AuditLog {
  id: string;
  userId: string | null;
  operation: AuditOperation;
  entityType: string;
  entityId: string;
  oldValue: AuditJsonValue | null;
  newValue: AuditJsonValue | null;
  createdAt: string;
}
