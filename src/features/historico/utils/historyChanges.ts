export type JsonObject = Record<string, unknown>;
export type HistoryOperation = "Criação" | "Atualização" | "Remoção";

export interface Change {
  label: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface HistorySkill {
  name: string;
  level: string | number | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getFirstValue(record: Record<string, unknown>, keys: string[]): unknown {
  return keys.map((key) => record[key]).find((value) => value !== null && value !== undefined);
}

export function getHistorySkill(value: unknown): HistorySkill | null {
  if (!isRecord(value)) return null;

  const name = getFirstValue(value, ["Skill", "name"]);
  if (typeof name !== "string") return null;

  const level = getFirstValue(value, [
    "Nível de proficiência",
    "proficiencyLevel",
    "Nível mínimo",
    "minLevel",
    "level",
  ]);
  return {
    name,
    level: typeof level === "string" || typeof level === "number" ? level : null,
  };
}

function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || value === "";
}

function areValuesEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (isEmptyValue(left) && isEmptyValue(right)) return true;
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

function isSkillsPath(path: string[]): boolean {
  const key = path[path.length - 1];
  return key === "Skills";
}

function getSkillIdentity(skill: unknown, index: number): string {
  if (isRecord(skill)) {
    const skillId = skill["ID da skill"] ?? skill.skillId;
    if (typeof skillId === "string" || typeof skillId === "number") {
      return `skill:${skillId}`;
    }

    const name = getHistorySkill(skill)?.name;
    if (name) return `name:${name.toLocaleLowerCase()}`;

    const id = skill.ID ?? skill.id;
    if (typeof id === "string" || typeof id === "number") return `id:${id}`;
  }
  return `index:${index}`;
}

function getSkillChanges(
  oldValue: unknown,
  newValue: unknown,
  path: string[],
): Change[] {
  const oldSkills = Array.isArray(oldValue) ? oldValue : [];
  const newSkills = Array.isArray(newValue) ? newValue : [];
  const oldItems = new Map(oldSkills.map((skill, index) => [getSkillIdentity(skill, index), skill]));
  const newItems = new Map(newSkills.map((skill, index) => [getSkillIdentity(skill, index), skill]));
  const identities = new Set([...oldItems.keys(), ...newItems.keys()]);

  return [...identities].flatMap((identity) => {
    const oldSkill = oldItems.get(identity);
    const newSkill = newItems.get(identity);
    const oldDisplay = getHistorySkill(oldSkill);
    const newDisplay = getHistorySkill(newSkill);
    if (
      oldDisplay?.name === newDisplay?.name &&
      oldDisplay?.level === newDisplay?.level
    ) {
      return [];
    }
    return [{
      label: path.join(" / "),
      oldValue: oldSkill,
      newValue: newSkill,
    }];
  });
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
    return [...keys].flatMap((key) => {
      const nextPath = [...path, key];
      if (isSkillsPath(nextPath)) {
        return getSkillChanges(oldRecord[key], newRecord[key], nextPath);
      }
      return getHistoryChanges(oldRecord[key], newRecord[key], nextPath);
    });
  }

  if (isSkillsPath(path)) return getSkillChanges(oldValue, newValue, path);

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
