import HistoryChangeRow from "../HistoryChangeRow/HistoryChangeRow";
import {
  getHistoryChanges,
  type HistoryOperation,
} from "../../utils/historyChanges";

interface HistoryItemProps {
  id: string;
  operation: HistoryOperation;
  entityType: string;
  date: string;
  oldValue: unknown;
  newValue: unknown;
}

export default function HistoryItem({ id, operation, entityType, date, oldValue, newValue }: HistoryItemProps) {
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
  const changes = getHistoryChanges(oldValue, newValue);

  return (
    <>
      {changes.map((change, index) => (
        <HistoryChangeRow
          key={`${id}-${change.label}-${index}`}
          change={change}
          operation={operation}
          entityType={entityType}
          formattedDate={formattedDate}
          date={date}
        />
      ))}
    </>
  );
}
