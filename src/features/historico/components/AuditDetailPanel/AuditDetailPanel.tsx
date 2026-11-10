import { useEffect } from "react";
import { isAxiosError } from "axios";
import { History, X } from "lucide-react";
import { Button } from "@/components/ui";
import { getApiError } from "@/lib/axios";
import { useAuditDetail } from "../../hooks/useAuditDetail";
import type { AuditJsonValue, AuditSummary } from "../../types/historico";
import {
    entityLabels,
    formatAuditDate,
    getAuditUserLabel,
    operationLabels,
} from "../../utils/adminHistory";
import { getHistoryChanges } from "../../utils/historyChanges";

interface Props {
    record: AuditSummary;
    onClose: () => void;
}

function formatFieldLabel(label: string): string {
    return label
        .split(" / ")
        .map((part) =>
            part
                .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                .replace(/[_-]+/g, " ")
                .replace(/^./, (character) => character.toLocaleUpperCase()),
        )
        .join(" / ");
}

function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === "") return "Sem valor";
    if (typeof value === "boolean") return value ? "Sim" : "Não";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (Array.isArray(value)) {
        return value.length
            ? value.map((item, index) => `Item ${index + 1}: ${formatValue(item)}`).join("\n")
            : "Nenhum item";
    }
    if (typeof value === "object") {
        const entries = Object.entries(value).filter(([key]) => !isIdentifierField(key));
        return entries.length
            ? entries.map(([key, item]) => `${formatFieldLabel(key)}: ${formatValue(item)}`).join("\n")
            : "Sem dados";
    }
    return String(value);
}

function isIdentifierField(key: string): boolean {
    const normalizedKey = key.replace(/[^a-z0-9]/gi, "").toLocaleLowerCase();
    return normalizedKey.startsWith("id") ||
        normalizedKey.endsWith("id") ||
        normalizedKey.includes("uuid") ||
        normalizedKey.includes("identifier");
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

function isAuditObject(value: AuditJsonValue): value is { [key: string]: AuditJsonValue } {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function SnapshotValue({ value }: { value: unknown }) {
    const formattedValue = formatValue(value);

    return (
        <div className="break-words whitespace-pre-wrap text-sm text-slate-700">
            {formattedValue.length > 240 ? (
                <details>
                    <summary className="cursor-pointer font-medium text-slate-700">
                        Valor extenso — clique para expandir
                    </summary>
                    <p className="mt-2">{formattedValue}</p>
                </details>
            ) : (
                formattedValue
            )}
        </div>
    );
}

function SnapshotFields({ value }: { value?: AuditJsonValue | null }) {
    if (value === null || value === undefined) {
        return <p className="text-sm text-slate-500">Snapshot não disponível.</p>;
    }

    if (typeof value !== "object" || Array.isArray(value)) {
        return <SnapshotValue value={omitIdentifiers(value)} />;
    }

    const sanitizedValue = omitIdentifiers(value);
    if (!isAuditObject(sanitizedValue)) {
        return <SnapshotValue value={sanitizedValue} />;
    }

    const fields = Object.entries(sanitizedValue);
    if (fields.length === 0) {
        return <p className="text-sm text-slate-500">Sem dados registrados.</p>;
    }

    return (
        <dl className="divide-y divide-slate-100">
            {fields.map(([key, fieldValue]) => (
                <div
                    key={key}
                    className="grid gap-1 py-3 sm:grid-cols-[minmax(8rem,0.35fr)_minmax(0,1fr)] sm:gap-4"
                >
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {formatFieldLabel(key)}
                    </dt>
                    <dd className="min-w-0">
                        <SnapshotValue value={fieldValue} />
                    </dd>
                </div>
            ))}
        </dl>
    );
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

export function AuditDetailPanel({ record, onClose }: Props) {
    const { audit, isLoading, isError, error, refetch } = useAuditDetail(record.id);
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

        if (operation === "CREATE") {
            return <SnapshotFields value={audit.newValue} />;
        }
        if (operation === "DELETE") {
            return <SnapshotFields value={audit.oldValue} />;
        }

        const oldValue = audit.oldValue ? omitIdentifiers(audit.oldValue) : audit.oldValue;
        const newValue = audit.newValue ? omitIdentifiers(audit.newValue) : audit.newValue;
        const changes = getHistoryChanges(oldValue, newValue);
        if (changes.length === 0) {
            return <p className="text-sm text-slate-500">Não há diferenças disponíveis.</p>;
        }

        return (
            <dl className="divide-y divide-slate-100">
                {changes.map((change, index) => (
                    <div key={`${change.label}-${index}`} className="py-3">
                        <dt className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {change.label ? formatFieldLabel(change.label) : "Alteração"}
                        </dt>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <span className="mb-1 block text-xs text-slate-500">Anterior</span>
                                <SnapshotValue value={change.oldValue} />
                            </div>
                            <div>
                                <span className="mb-1 block text-xs text-slate-500">Novo</span>
                                <SnapshotValue value={change.newValue} />
                            </div>
                        </div>
                    </div>
                ))}
            </dl>
        );
    }

    return (
        <aside
            aria-labelledby="audit-detail-title"
            className="flex max-h-[calc(100vh-12rem)] min-h-[32rem] flex-col overflow-hidden rounded-xl border border-pink-100 bg-white shadow-card xl:sticky xl:top-4"
        >
            <div className="h-1 bg-pink/60" aria-hidden="true" />
            <header className="flex items-center justify-between border-b border-pink-100 bg-gradient-to-r from-pink-50/70 to-white px-4 py-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100/70 text-pink">
                            <History className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                            <h2 id="audit-detail-title" className="text-lg font-bold text-slate-900">
                                Detalhes da auditoria
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                {operationLabels[operation]} de {entityName}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar"
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-pink-100/70 hover:text-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4">
                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Entidade</dt>
                            <dd className="mt-1 text-sm font-medium text-slate-800">
                                {record.entityName?.trim() || "Contexto indisponível"}
                            </dd>
                        </div>
                        <div className="rounded-xl border border-pink-100 bg-pink-50/40 p-3">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-pink-700">Operação</dt>
                            <dd className="mt-1 text-sm font-medium text-slate-800">{operationLabels[operation]}</dd>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Usuário executor</dt>
                            <dd className="mt-1 text-sm font-medium text-slate-800">{getAuditUserLabel(record.userName)}</dd>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Usuário afetado</dt>
                            <dd className="mt-1 text-sm font-medium text-slate-800">{getAuditUserLabel(record.userAffectedName)}</dd>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 sm:col-span-2">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Data e hora</dt>
                            <dd className="mt-1 text-sm font-medium text-slate-800">
                                <time dateTime={record.createdAt}>{formatAuditDate(record.createdAt)}</time>
                            </dd>
                        </div>
                        {record.description?.trim() && (
                            <div className="rounded-xl border border-pink-100 bg-pink-50/40 p-3 sm:col-span-2">
                                <dt className="text-xs font-semibold uppercase tracking-wide text-pink-700">Descrição</dt>
                                <dd className="mt-1 text-sm font-medium text-slate-800">{record.description.trim()}</dd>
                            </div>
                        )}
                    </dl>

                    <section className="mt-6 border-t border-pink-100 pt-5">
                        <h3 className="mb-3 border-l-2 border-pink px-3 text-sm font-bold text-slate-900">
                            {operation === "CREATE" ? "Novo valor" : operation === "DELETE" ? "Valor anterior" : "Alterações"}
                        </h3>
                        {isLoading ? (
                            <p role="status" className="text-sm text-slate-400">Carregando detalhes...</p>
                        ) : isError ? (
                            <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                                <p role="alert" className="text-sm text-red-700">{getErrorMessage(error)}</p>
                                <button
                                    type="button"
                                    onClick={() => refetch()}
                                    className="mt-2 text-sm font-medium text-slate-900 underline"
                                >
                                    Tentar novamente
                                </button>
                            </div>
                        ) : (
                            renderSnapshots()
                        )}
                    </section>
            </div>

            <footer className="flex justify-end border-t border-slate-200 px-4 py-3">
                <Button type="button" variant="secondary" onClick={onClose}>Fechar</Button>
            </footer>
        </aside>
    );
}
