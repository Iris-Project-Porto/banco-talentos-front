import { useState } from "react";
import DetailsModal from "@/features/historico/components/DetailsModal/DetailsModal";
import HistoryItem from "@/features/historico/components/HistoryItem/HistoryItem";

const historyItems = [
  {
    id: "history-1",
    description: "Atualização de perfil",
    date: "2025-03-14T10:30:00-03:00",
    oldValue: { area: "Fullstack" },
    newValue: { area: "Frontend" },
  },
  {
    id: "history-2",
    description: "Atualização de perfil",
    date: "2025-02-27T15:45:00-03:00",
    oldValue: { level: "JUNIOR", phone: "(32) 98487-9196" },
    newValue: { level: "PLENO", phone: "(32) 98487-9096" },
  },
  {
    id: "history-3",
    description: "Atualização de equipamento do recurso",
    date: "2025-01-08T09:15:00-03:00",
    oldValue: { equipment: { name: "Notebook", model: "Dell Latitude 5420" } },
    newValue: { equipment: { name: "Notebook", model: "Dell Latitude 5440" } },
  },
];

export default function MeuHistorico() {
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const selectedHistory = historyItems.find((item) => item.id === selectedHistoryId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>Meu Histórico</h1>
        <p className="text-sm text-gray-400 mt-0.5">Histórico de alocações e evolução de carreira</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold uppercase text-gray-500">
                <th scope="col" className="px-4 py-3">Alteração</th>
                <th scope="col" className="px-4 py-3">Data e hora</th>
                <th scope="col" className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {historyItems.map((item) => (
                <HistoryItem
                  key={item.id}
                  description={item.description}
                  date={item.date}
                  onViewChanges={() => setSelectedHistoryId(item.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedHistory && (
        <DetailsModal
          oldValue={selectedHistory.oldValue}
          newValue={selectedHistory.newValue}
          onClose={() => setSelectedHistoryId(null)}
        />
      )}

    </div>
  );
}
