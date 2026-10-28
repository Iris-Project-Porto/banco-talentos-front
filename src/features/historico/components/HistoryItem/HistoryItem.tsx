import { Button } from "@/components/ui";

interface Props {
  description: string;
  date: string;
  onViewChanges: () => void;
}

export default function HistoryItem({ description, date, onViewChanges }: Props) {
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));

  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-gray-50">
      <td className="px-4 py-4 text-sm font-medium text-gray-800">{description}</td>
      <td className="px-4 py-4 text-sm text-gray-500">
        <time dateTime={date}>{formattedDate}</time>
      </td>
      <td className="px-4 py-4 text-right">
        <Button type="button" variant="secondary" size="sm" onClick={onViewChanges}>
          Ver alterações
        </Button>
      </td>
    </tr>
  );
}