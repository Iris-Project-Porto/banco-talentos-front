import { Button, Pagination } from "@/components/ui";
import { PlusIcon, SearchIcon, UsersRoundIcon } from "lucide-react";
import { ParticipatingSquadsTable } from "./ParticipatingSquadsTable";
import { Squad } from "@/features/squads";
import { useState } from "react";
import { SelectSquadsModal } from "./SelectSquadsModal";

interface Props {
    isEdit: boolean;
}

const data: Squad[] = [
    {
        id: "1",
        name: "Squad 1",
        description: "Description 1",
        projectId: "1",
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        projectManager: "John Doe",
        portoCoordinator: "Jane Doe",
        members: 10,
    },
    {
        id: "2",
        name: "Squad 2",
        description: "Description 2",
        projectId: "2",
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        projectManager: "John Doe",
        portoCoordinator: "Jane Doe",
        members: 10,
    },
    {
        id: "3",
        name: "Squad 3",
        description: "Description 3",
        projectId: "3",
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        projectManager: "John Doe",
        portoCoordinator: "Jane Doe",
        members: 10,
    },
    {
        id: "4",
        name: "Squad 4",
        description: "Description 4",
        projectId: "4",
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        projectManager: "John Doe",
        portoCoordinator: "Jane Doe",
        members: 10,
    },
];

export function ParticipatingSquadsTab({ isEdit: _isEdit }: Props) {
    const [selectSquadsModalOpen, setSelectSquadsModalOpen] = useState(false);

    function openSelectSquadsModal() {
        setSelectSquadsModalOpen(true);
    }
    function closeSelectSquadsModal() {
        setSelectSquadsModalOpen(false);
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
                            onClick={() => {}}
                        >
                            <span className="flex items-center gap-2">
                                <PlusIcon className="w-4 h-4" />
                                Adicionar Squad
                            </span>
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            className="border-pink text-pink hover:bg-pink/5"
                            onClick={openSelectSquadsModal}
                        >
                            <span className="flex items-center gap-2">
                                <SearchIcon className="w-4 h-4" />
                                Selecionar Squad
                            </span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-card overflow-hidden flex flex-col">
                <ParticipatingSquadsTable data={data} />
                <Pagination
                    currentPage={1}
                    totalPages={1}
                    onPageChange={() => {}}
                />
            </div>
            {selectSquadsModalOpen && (
                <SelectSquadsModal
                    onClose={closeSelectSquadsModal}
                    onConfirm={() => {}}
                />
            )}
        </div>
    );
}
