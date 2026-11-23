import { useEffect } from "react";
import { isAxiosError } from "axios";
import { History, X, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { getApiError } from "@/lib/axios";
import { useAuditDetail } from "../../hooks/useAuditDetail";
import type { AuditJsonValue, AuditOperation, AuditSummary } from "../../types/historico";
import {
    entityLabels,
    formatAuditDate,
    getAuditUserLabel,
    operationLabels,
    ENUM_TRANSLATIONS,
    type AuditCategory,
} from "../../utils/adminHistory";
import { getHistoryChanges } from "../../utils/historyChanges";

interface Props {
    record: AuditSummary;
    activeTab: AuditCategory;
    onClose: () => void;
}

const FIELD_LABELS: Record<string, string> = {
    openingDate: "Data de abertura",
    dataAbertura: "Data de abertura",
    closingDate: "Data de fechamento",
    dataFechamento: "Data de fechamento",
};

const operationDateLabels: Record<AuditOperation, string> = {
    CREATE: "Data de criação",
    UPDATE: "Data de alteração",
    DELETE: "Data de remoção",
};

function formatFieldLabel(label: string): string {
    return label
        .split(" / ")
        .map((part) =>
            FIELD_LABELS[part] ??
            part
                .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                .replace(/[_-]+/g, " ")
                .replace(/^./, (character) => character.toLocaleUpperCase()),
        )
        .join(" / ");
}

function formatDateValue(value: string): string | null {
    const trimmed = value.trim();
    const match = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/.exec(trimmed);
    if (!match) return null;

    const [, year, month, day] = match;
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);

    if (y >= 1900 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        return `${day}/${month}/${year}`;
    }

    return null;
}

function isIdentifierField(key: string): boolean {
    const normalizedKey = key.replace(/[^a-z0-9]/gi, "").toLocaleLowerCase();
    return normalizedKey.startsWith("id") ||
        normalizedKey.endsWith("id") ||
        normalizedKey.includes("uuid") ||
        normalizedKey.includes("identifier") ||
        normalizedKey.includes("criado") ||
        normalizedKey.includes("atualizado") ||
        normalizedKey.includes("created") ||
        normalizedKey.includes("updated");
}

function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === "") return "Sem valor";
    if (typeof value === "boolean") return value ? "Sim" : "Não";
    if (typeof value === "number") return String(value);

    if (typeof value === "string") {
        if (ENUM_TRANSLATIONS[value]) {
            return ENUM_TRANSLATIONS[value];
        }
        const dateFormatted = formatDateValue(value);
        return dateFormatted ?? value;
    }

    if (Array.isArray(value)) {
        return value.length
            ? value.map((item, index) => `• Item ${index + 1}:\n  ${formatValue(item).replace(/\n/g, "\n  ")}`).join("\n\n")
            : "Nenhum item";
    }

    if (typeof value === "object") {
        const entries = Object.entries(value)
            .filter(([key]) => !isIdentifierField(key))
            .filter(([, item]) => item !== null && item !== undefined && item !== "");

        return entries.length
            ? entries.map(([key, item]) => {
                let formattedItem = formatValue(item);

                if (key === "Skill" || key === "skill") {
                    formattedItem = formattedItem.charAt(0).toUpperCase() + formattedItem.slice(1).toLowerCase();
                }

                return `${formatFieldLabel(key)}: ${formattedItem}`;
            }).join("\n")
            : "Sem dados";
    }

    return String(value);
}

function omitIdentifiers(value: AuditJsonValue): AuditJsonValue {
    if (Array.isArray(value)) {
        return value.map(omitIdentifiers);
    }
    if (typeof value === "object" && value !== null) {
        return Object.fromEntries(
            Object.entries(value)
                .filter(([key]) => !isIdentifierField(key))
                .map(([key, child]) => [key, omitIdentifiers(child)]),
        );
    }
    return value;
}



function parseSnapshotValue(value?: AuditJsonValue | null): AuditJsonValue | null | undefined {
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (
            (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
            (trimmed.startsWith("[") && trimmed.endsWith("]"))
        ) {
            try {
                return JSON.parse(trimmed);
            } catch {
                return value;
            }
        }
    }
    return value;
}


function getErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        if (error.response?.status === 404) {
            return "Registro não encontrado ou você não tem autorização para acessá-lo.";
        }
        if (error.response?.status === 401 || error.response?.status === 403) {
            return "Você não tem autorização para acessar este registro.";
        }
    }
    return getApiError(error, "Não foi possível carregar os detalhes da auditoria.");
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                {label}
            </span>
            <span className="text-sm font-medium text-slate-800 break-words">{value}</span>
        </div>
    );
}

export function AuditDetailPanel({ record, activeTab, onClose }: Props) {
    const { audit, isLoading, isError, error } = useAuditDetail(record.id);
    const operation = audit?.operation ?? record.operation;
    const entityName = entityLabels[record.entityType] ?? record.entityType;

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") onClose();
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    function renderSnapshots() {
        if (!audit) return null;

        const parsedOld = parseSnapshotValue(audit.oldValue);
        const parsedNew = parseSnapshotValue(audit.newValue);

        const oldValue = parsedOld ? omitIdentifiers(parsedOld) : {};
        const newValue = parsedNew ? omitIdentifiers(parsedNew) : {};

        if (operation === "CREATE") {
            const entries = Object.entries(newValue as Record<string, unknown>).filter(([, v]) => v !== null && v !== "");
            if (entries.length === 0) return <p className="text-sm text-slate-500">Sem dados registrados.</p>;

            return (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {entries.map(([key, val], index) => (
                        <div key={`${key}-${index}`} className="flex flex-col gap-1.5">
                            <dt className="text-sm font-medium text-slate-900">{formatFieldLabel(key)}</dt>
                            <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 shadow-sm">
                                <span className="text-sm text-emerald-900 font-medium break-words pr-2">
                                    {formatValue(val)}
                                </span>
                                <Check className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                            </div>
                        </div>
                    ))}
                </dl>
            );
        }

        if (operation === "DELETE") {
            const entries = Object.entries(oldValue as Record<string, unknown>).filter(([, v]) => v !== null && v !== "");
            if (entries.length === 0) return <p className="text-sm text-slate-500">Sem dados registrados.</p>;

            return (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {entries.map(([key, val], index) => (
                        <div key={`${key}-${index}`} className="flex flex-col gap-1.5">
                            <dt className="text-sm font-medium text-slate-900">{formatFieldLabel(key)}</dt>
                            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 shadow-sm">
                                <span className="text-sm text-red-900 break-words pr-2 opacity-90">
                                    {formatValue(val)}
                                </span>
                                <X className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                            </div>
                        </div>
                    ))}
                </dl>
            );
        }

        const changes = getHistoryChanges(oldValue, newValue);
        if (changes.length === 0) {
            return <p className="text-sm text-slate-500">Não há diferenças disponíveis.</p>;
        }

        return (
            <dl className="flex flex-col gap-5">
                {changes.map((change, index) => (
                    <div key={`${change.label}-${index}`} className="flex flex-col gap-2">
                        <dt className="text-sm font-medium text-slate-900">
                            {change.label ? formatFieldLabel(change.label) : "Alteração"}
                        </dt>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="flex min-w-0 flex-1 items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 shadow-sm">
                                <span className="text-sm text-red-900 line-through decoration-red-300 opacity-90 break-words pr-2">
                                    {formatValue(change.oldValue)}
                                </span>
                                <X className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                            </div>

                            <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 rotate-90 sm:rotate-0 self-center" aria-hidden="true" />

                            <div className="flex min-w-0 flex-1 items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 shadow-sm">
                                <span className="text-sm text-emerald-900 font-medium break-words pr-2">
                                    {formatValue(change.newValue)}
                                </span>
                                <Check className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                            </div>
                        </div>
                    </div>
                ))}
            </dl>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

            <div
                className="relative bg-white rounded-2xl shadow-login w-full max-w-3xl max-h-[90vh] flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
                    <h2 id="modal-title" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <History className="h-5 w-5 text-slate-500" aria-hidden="true" />
                        Detalhes do histórico
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-2xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink rounded"
                        aria-label="Fechar"
                    >
                        &times;
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 px-7 py-6 flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                        <DetailRow label="Usuário executor" value={getAuditUserLabel(record.userName)} />

                        {activeTab === "Recursos" && (
                            <DetailRow label="Usuário afetado" value={getAuditUserLabel(record.userAffectedName)} />
                        )}

                        <DetailRow label="ID da entidade" value={`#${record.entityId?.substring(0, 8) || "N/A"}`} />
                        <DetailRow label="Entidade" value={entityName} />

                        <div className="sm:col-span-2">
                            <DetailRow
                                label={operationDateLabels[operation]}
                                value={`${formatAuditDate(record.createdAt)} (${operationLabels[operation]})`}
                            />
                        </div>
                    </div>

                    <div className="border-t border-slate-100" />

                    <div>
                        <h3 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <History className="h-4 w-4" aria-hidden="true" />
                            Alterações
                        </h3>
                        {isLoading ? (
                            <p className="text-sm text-slate-500">Carregando detalhes das alterações...</p>
                        ) : isError ? (
                            <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                                <p className="text-sm text-red-700">{getErrorMessage(error)}</p>
                            </div>
                        ) : (
                            renderSnapshots()
                        )}
                    </div>
                </div>

                <div className="px-7 py-5 border-t border-slate-200 flex items-center justify-end shrink-0">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Fechar
                    </Button>
                </div>
            </div>
        </div>
    );
}