import { Button, ConfirmModal, Pagination } from "@/components/ui";
import { ProjectEditFormInput } from "@/features/projects/validations/validations";
import { Squad } from "@/features/squads/types/types";
import { SearchIcon, UsersRoundIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { paginateLocally } from "@/features/projects/utils/projectsList";
import { ParticipatingSquadsTable } from "./ParticipatingSquadsTable";
import { SelectSquadsModal } from "./SelectSquadsModal";

interface Props {
  isEdit: boolean;
}

const PAGE_SIZE = 7;

type ModalState =
  | { type: "select" }
  | { type: "remove"; squad: Squad };

export function ParticipatingSquadsTab({ isEdit: _isEdit }: Props) {
  const { setValue } = useFormContext<ProjectEditFormInput>();
  const selectedSquads =
    useWatch<ProjectEditFormInput, "squads">({ name: "squads" }) ?? [];
  const [modal, setModal] = useState<ModalState | null>(null);
  const [page, setPage] = useState(0);

  const { content: paginatedSquads, totalPages } = useMemo(
    () => paginateLocally(selectedSquads, page, PAGE_SIZE),
    [selectedSquads, page],
  );

  useEffect(() => {
    if (page > 0 && page >= totalPages) {
      setPage(totalPages - 1);
    }
  }, [page, totalPages]);

  const closeModal = () => setModal(null);

  function confirmRemoveSquad() {
    if (modal?.type !== "remove") return;

    setValue(
      "squads",
      selectedSquads.filter((squad) => squad.id !== modal.squad.id),
      { shouldDirty: true },
    );
    closeModal();
  }

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <div className="bg-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <UsersRoundIcon className="w-6 h-6 text-pink shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-900">
                Squads Participantes
              </h1>
              <p className="mt-0.5 text-sm text-slate-400">
                Gerencie as squads que participam deste projeto.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="border-pink text-pink hover:bg-pink/5"
              onClick={() => setModal({ type: "select" })}
            >
              <span className="flex items-center gap-2">
                <SearchIcon className="w-4 h-4" />
                Selecionar Squads
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-card overflow-hidden flex flex-col">
        <ParticipatingSquadsTable
          data={paginatedSquads}
          onDelete={(squad) => setModal({ type: "remove", squad })}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-4">
          <p className="text-sm text-slate-500">
            Total de squads:{" "}
            <span className="font-semibold text-slate-900">
              {selectedSquads.length}
            </span>
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-0 pt-0 border-t-0"
          />
        </div>
      </div>
      {modal?.type === "select" && (
        <SelectSquadsModal
          initialSelected={selectedSquads}
          onClose={closeModal}
          onConfirm={(squads) =>
            setValue("squads", squads, { shouldDirty: true })
          }
        />
      )}

      {modal?.type === "remove" && (
        <ConfirmModal
          title="Remover squad do projeto"
          message={`Deseja realmente remover a squad "${modal.squad.name}" deste projeto? A squad continuará cadastrada e a alteração será aplicada ao salvar o projeto.`}
          confirmLabel="Remover"
          onConfirm={confirmRemoveSquad}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
