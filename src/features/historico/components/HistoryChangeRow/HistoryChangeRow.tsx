import HistorySkillCard from "../HistorySkillCard/HistorySkillCard";
import { EQUIPMENT_STATUS_OPTIONS } from "@/features/profiles/profile";
import {
  formatHistoryValue,
  type Change,
  type HistoryOperation,
} from "../../utils/historyChanges";

interface Props {
  change: Change;
  operation: HistoryOperation;
  entityType: string;
  formattedDate: string;
  date: string;
}

function formatChangeValue(label: string, value: unknown): string {
  if (label === "Status" && typeof value === "string") {
    const statusOption = EQUIPMENT_STATUS_OPTIONS.find((option) => option.value === value);
    if (statusOption) return statusOption.label;
  }

  return formatHistoryValue(value);
}

export default function HistoryChangeRow({
  change,
  operation,
  entityType,
  formattedDate,
  date,
}: Props) {
  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-gray-50">
      <td className="px-4 py-4">
        <p className="text-sm font-semibold text-gray-800">{operation}</p>
        <p className="mt-1 text-xs text-gray-500">{entityType}</p>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
        <time dateTime={date}>{formattedDate}</time>
      </td>
      <td className="px-4 py-4 text-sm font-medium text-gray-700">{change.label}</td>
      <td className="max-w-sm whitespace-pre-wrap break-words px-4 py-4 text-sm text-gray-600">
        {change.label.endsWith("Skills") && change.oldValue !== null
          ? <HistorySkillCard value={change.oldValue} />
          : formatChangeValue(change.label, change.oldValue)}
      </td>
      <td className="max-w-sm whitespace-pre-wrap break-words px-4 py-4 text-sm font-medium text-gray-800">
        {change.label.endsWith("Skills") && change.newValue !== null
          ? <HistorySkillCard value={change.newValue} />
          : formatChangeValue(change.label, change.newValue)}
      </td>
    </tr>
  );
}
