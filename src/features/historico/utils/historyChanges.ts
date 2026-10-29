export type JsonObject = Record<string, unknown>;
export type HistoryOperation = "Criação" | "Atualização" | "Remoção";

export interface Change {
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

export function getHistoryChanges(
  oldValue: unknown,
  newValue: unknown,
  path: string[] = [],
): Change[] {
  if (areValuesEqual(oldValue, newValue)) return [];

  if (
    (isRecord(oldValue) && isRecord(newValue)) ||
    (isRecord(oldValue) && (newValue === null || newValue === undefined)) ||
    (isRecord(newValue) && (oldValue === null || oldValue === undefined))
  ) {
    const oldRecord = isRecord(oldValue) ? oldValue : {};
    const newRecord = isRecord(newValue) ? newValue : {};
    const keys = new Set([...Object.keys(oldRecord), ...Object.keys(newRecord)]);
    return [...keys].flatMap((key) =>
      getHistoryChanges(oldRecord[key], newRecord[key], [...path, formatLabel(key)]),
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
        return getHistoryChanges(
          oldEntry?.item,
          newEntry?.item,
          [...path, getItemLabel(item, itemIndex)],
        );
      });
    }
  }

  return [{ label: path.join(" / "), oldValue, newValue }];
}

export function formatHistoryValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "Sem valor";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value, null, 2);
}
