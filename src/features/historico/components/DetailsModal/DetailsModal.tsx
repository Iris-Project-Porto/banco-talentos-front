import { useEffect } from "react";
import { Button } from "@/components/ui";

type JsonObject = Record<string, unknown>;

interface Props {
  oldValue: JsonObject;
  newValue: JsonObject;
  onClose: () => void;
}

interface Change {
  label: string;
  oldValue: unknown;
  newValue: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function areValuesEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (typeof left !== "object" || left === null || typeof right !== "object" || right === null) {
    return false;
  }

  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every(
      (key) =>
        Object.prototype.hasOwnProperty.call(right, key) &&
        areValuesEqual(
          (left as Record<string, unknown>)[key],
          (right as Record<string, unknown>)[key],
        ),
    )
  );
}

function formatLabel(key: string) {
  const labels: Record<string, string> = {
    area: "Área",
    level: "Nível",
    phone: "Telefone",
    skills: "Competências",
    proficiencyLevel: "Nível de proficiência",
  };

  return labels[key] ?? key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ");
}

function getIdentity(value: unknown): string | null {
  if (!isRecord(value)) return null;

  const identity = value.id ?? value.skillId ?? value.name;
  return typeof identity === "string" || typeof identity === "number"
    ? String(identity)
    : null;
}

function getItemLabel(value: unknown, index: number): string {
  if (isRecord(value)) {
    if (typeof value.name === "string") return value.name;
    if (typeof value.id === "string" || typeof value.id === "number") return String(value.id);
  }

  return `Item ${index + 1}`;
}

function getChanges(
  oldValue: unknown,
  newValue: unknown,
  path: string[] = [],
): Change[] {
  if (areValuesEqual(oldValue, newValue)) return [];

  if (isRecord(oldValue) && isRecord(newValue)) {
    const keys = new Set([...Object.keys(oldValue), ...Object.keys(newValue)]);
    return [...keys].flatMap((key) =>
      getChanges(oldValue[key], newValue[key], [...path, formatLabel(key)]),
    );
  }

  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    const oldIdentities = oldValue.map(getIdentity);
    const newIdentities = newValue.map(getIdentity);
    const canMatchByIdentity =
      [...oldIdentities, ...newIdentities].every((identity) => identity !== null) &&
      new Set(oldIdentities).size === oldIdentities.length &&
      new Set(newIdentities).size === newIdentities.length;

    if (canMatchByIdentity) {
      const oldItems = new Map<string, { item: unknown; index: number }>();
      const newItems = new Map<string, { item: unknown; index: number }>();
      oldValue.forEach((item, index) => {
        const identity = oldIdentities[index];
        if (identity !== null) oldItems.set(identity, { item, index });
      });
      newValue.forEach((item, index) => {
        const identity = newIdentities[index];
        if (identity !== null) newItems.set(identity, { item, index });
      });
      const identities = new Set([...oldItems.keys(), ...newItems.keys()]);

      return [...identities].flatMap((identity) => {
        const oldEntry = oldItems.get(identity);
        const newEntry = newItems.get(identity);
        const item = newEntry?.item ?? oldEntry?.item;
        const itemIndex = newEntry?.index ?? oldEntry?.index ?? 0;
        const itemPath = [...path, getItemLabel(item, itemIndex)];

        return getChanges(oldEntry?.item, newEntry?.item, itemPath);
      });
    }
  }

  return [{
    label: path.join(" / "),
    oldValue,
    newValue,
  }];
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "Sem valor";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value, null, 2);
}

function ChangeValue({ value }: { value: unknown }) {
  const formattedValue = formatValue(value);
  const isStructuredValue = typeof value === "object" && value !== null;

  return isStructuredValue ? (
    <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-700">
      {formattedValue}
    </pre>
  ) : (
    <p className="break-words text-sm text-slate-700">{formattedValue}</p>
  );
}

export default function DetailsModal({ oldValue, newValue, onClose }: Props) {
  const changes = getChanges(oldValue, newValue);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar detalhes das alterações"
        className="absolute inset-0 cursor-default bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-details-title"
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-login"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 sm:px-7">
          <div>
            <h2 id="history-details-title" className="text-lg font-bold text-slate-900">
              Alterações realizadas
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Comparação entre os valores anteriores e os novos.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="ml-4 text-2xl leading-none text-slate-400 transition-colors hover:text-slate-700"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 sm:px-7">
          {changes.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Não há alterações para exibir.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {changes.map((change) => (
                <article
                  key={change.label}
                  className="overflow-hidden rounded-xl border border-slate-200"
                >
                  <h3 className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">
                    {change.label}
                  </h3>
                  <div className="grid gap-4 p-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-600">
                        Valor anterior
                      </p>
                      <ChangeValue value={change.oldValue} />
                    </div>
                    <div className="min-w-0">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        Novo valor
                      </p>
                      <ChangeValue value={change.newValue} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-200 px-6 py-4 sm:px-7">
          <Button type="button" variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </section>
    </div>
  );
}