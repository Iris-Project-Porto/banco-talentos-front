import HistoryItem from "@/features/historico/components/HistoryItem/HistoryItem";
import { useHistorico } from "@/features/historico/hooks/useHistorico";
import type { AuditOperation } from "@/features/historico/types/historico";
import type { HistoryOperation } from "@/features/historico/utils/historyChanges";

const operationLabels: Record<AuditOperation, HistoryOperation> = {
  CREATE: "Criação",
  UPDATE: "Atualização",
  DELETE: "Remoção",
};

const entityLabels: Record<string, string> = {
  PROFILE: "Perfil",
  RESOURCE_EQUIPMENT: "Equipamento",
};

export default function MeuHistorico() {
  const { historico, isLoading, isError } = useHistorico();

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
                <th scope="col" className="px-4 py-3">Operação / Entidade</th>
                <th scope="col" className="whitespace-nowrap px-4 py-3">Data e hora</th>
                <th scope="col" className="px-4 py-3">Mudança</th>
                <th scope="col" className="px-4 py-3">Anterior</th>
                <th scope="col" className="px-4 py-3">Atual</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    Carregando histórico...
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-red-600">
                    Não foi possível carregar o histórico.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && historico.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    Nenhum registro de histórico encontrado.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && historico.map((item) => (
                <HistoryItem
                  key={item.id}
                  id={item.id}
                  operation={operationLabels[item.operation]}
                  entityType={entityLabels[item.entityType] ?? item.entityType}
                  date={item.createdAt}
                  oldValue={item.oldValue}
                  newValue={item.newValue}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
