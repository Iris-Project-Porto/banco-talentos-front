import {
  formatHistoryValue,
  getHistorySkill,
} from "../../utils/historyChanges";

interface Props {
  value: unknown;
}

export default function HistorySkillCard({ value }: Props) {
  const skill = getHistorySkill(value);
  if (!skill) return <>{formatHistoryValue(value)}</>;

  const numericLevel = typeof skill.level === "number" ? skill.level : Number(skill.level);
  const levelStyle = Number.isFinite(numericLevel)
    ? numericLevel <= 3
      ? { color: "#9333ea", backgroundColor: "#f3e8ff" }
      : numericLevel <= 6
        ? { color: "#2563eb", backgroundColor: "#dbeafe" }
        : numericLevel <= 8
          ? { color: "#059669", backgroundColor: "#d1fae5" }
          : { color: "#b45309", backgroundColor: "#fef3c7" }
    : undefined;

  return (
    <span className="inline-flex items-stretch overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm">
      <span className="px-4 py-1.5 text-sm font-medium text-gray-800">{skill.name}</span>
      {skill.level !== null && (
        <span
          className="flex items-center border-l border-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600"
          style={levelStyle}
        >
          {skill.level}
        </span>
      )}
    </span>
  );
}
