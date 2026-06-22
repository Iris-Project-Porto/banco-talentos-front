import { useState, useMemo, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button, ConfirmModal, PageHeader, Select, Pagination } from "@/components/ui";
import {
    skillsApi,
    SkillFormModal,
    SkillsTable,
    type CreateSkillPayload,
    type Skill,
} from "@/features/skills";
import { useSkillsQuery } from "@/features/skills/hooks/useSkillsQuery";

function toSkillPayload(data: CreateSkillPayload & { id?: string }): CreateSkillPayload {
    return {
        name: data.name,
        type: data.type,
        importanceWeight: data.importanceWeight,
    };
}

const SKILL_TYPE_OPTIONS = [
    { value: "", label: "Todos os tipos" },
    { value: "HARD", label: "Hard Skill" },
    { value: "SOFT", label: "Soft Skill" },
];

const PAGE_SIZE = 10;

export default function Skills() {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<(Partial<CreateSkillPayload> & { id?: string }) | null>(null);
    const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
    const [viewActive, setViewActive] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [page, setPage] = useState(0);

    useEffect(() => {
        setPage(0);
    }, [viewActive, search, selectedType]);

    const { data: skills = [], isLoading } = useSkillsQuery(!viewActive);

    const saveMutation = useMutation({
        mutationFn: async (data: CreateSkillPayload & { id?: string }) => {
            const payload = toSkillPayload(data);
            return data.id ? skillsApi.update(data.id, payload) : skillsApi.create(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skills"] });
            closeModal();
        },
        onError: (error) => {
            console.error("Erro ao salvar skill:", error);
            toast.error("Ocorreu um erro ao atualizar o recurso. Por favor, tente novamente.");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => skillsApi.inactivateSkill(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skills"] });
            setSkillToDelete(null);
        },
        onError: (error) => {
            console.error("Erro ao excluir skill:", error);
            toast.error("Ocorreu um erro ao atualizar o recurso. Por favor, tente novamente.");
        },
    });

    const filteredSkills = useMemo(() => {
        return skills.filter((skill) => {
            const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase());
            const matchesType = !selectedType || skill.type === selectedType;
            return matchesSearch && matchesType;
        });
    }, [skills, search, selectedType]);

    const totalPages = Math.ceil(filteredSkills.length / PAGE_SIZE) || 1;
    const paginatedSkills = filteredSkills.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    function openNew() {
        setEditing({});
        setModalOpen(true);
    }

    function openEdit(skill: Skill) {
        setEditing({
            id: skill.id,
            name: skill.name,
            type: skill.type,
            importanceWeight: skill.importanceWeight,
        });
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditing(null);
    }

    function handleClearFilters() {
        setSearch("");
        setSelectedType("");
        setPage(0);
    }

    function handleDeleteClick(skill: Skill) {
        setSkillToDelete(skill);
    }

    function confirmDelete() {
        if (skillToDelete) {
            deleteMutation.mutate(skillToDelete.id);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Consulta de Skills"
                subtitle="Catálogo de competências técnicas e comportamentais"
                actions={
                    <Button variant="primary" size="sm" onClick={openNew}>
                        + Cadastrar Skill
                    </Button>
                }
            />

            <div className="bg-white border border-slate-200 rounded-xl shadow-card px-5 py-4 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewActive(true)}
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold ${viewActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                    >
                        Ativas
                    </button>
                    <button
                        onClick={() => setViewActive(false)}
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold ${!viewActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                    >
                        Inativas
                    </button>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <input
                        placeholder="Ex: React, Python, Scrum..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-pink focus:shadow-focus-pink"
                    />
                </div>
                <div className="w-48">
                    <Select
                        className="px-3.5 py-2 text-sm w-full border border-slate-300 rounded-lg focus:ring-pink focus:border-pink focus:shadow-focus-pink"
                        options={SKILL_TYPE_OPTIONS}
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    />
                </div>
                <Button variant="secondary" size="sm" onClick={handleClearFilters}>
                    Limpar filtros
                </Button>
            </div>

            {isLoading ? (
                <p className="text-sm text-slate-400">Carregando...</p>
            ) : filteredSkills.length === 0 ? (
                <div className="bg-white border rounded-xl py-16 text-center">
                    <p className="text-slate-400 text-sm">Nenhuma skill encontrada.</p>
                </div>
            ) : (
                <>
                    <div className="bg-white border border-slate-200 rounded-xl shadow-card p-6">
                        <SkillsTable
                            data={paginatedSkills}
                            deletingSkillId={
                                deleteMutation.isPending ? (deleteMutation.variables ?? null) : null
                            }
                            onEdit={openEdit}
                            onDelete={handleDeleteClick}
                        />
                    </div>

                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}

            {modalOpen && editing && (
                <SkillFormModal
                    initial={editing}
                    saving={saveMutation.isPending}
                    onSave={(data) => saveMutation.mutate(data)}
                    onClose={closeModal}
                />
            )}

            {skillToDelete && (
                <ConfirmModal
                    title="Excluir skill"
                    message={`Deseja realmente excluir a skill "${skillToDelete.name}"?`}
                    confirmLabel="Excluir"
                    loading={deleteMutation.isPending}
                    onConfirm={confirmDelete}
                    onClose={() => setSkillToDelete(null)}
                />
            )}
        </div>
    );
}
