import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    skillsApi,
    SkillFormModal,
    SkillsTable,
    SkillsFilters,
    normalizeSkills,
    type Skill,
    type SkillCategory,
    type SkillPayload,
} from "@/features/skills";
import { Button, ConfirmModal, PageHeader, Pagination } from "@/components/ui";

const PAGE_SIZE = 10;

export default function Skills() {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<(Partial<SkillPayload> & { id?: string }) | null>(null);
    const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [page, setPage] = useState(0);

    useEffect(() => {
        setPage(0);
    }, [search, selectedCategory]);

    const { data, isLoading } = useQuery({
        queryKey: ["skills", "management", page, search, selectedCategory],
        queryFn: async () => {
            const response = await skillsApi.listForManagement({
                page,
                size: PAGE_SIZE,
                name: search || undefined,
                category: (selectedCategory || undefined) as SkillCategory | undefined,
            });

            return {
                ...response,
                content: normalizeSkills(response.content ?? []),
            };
        },
    });

    const { data: allSkills = [] } = useQuery({
        queryKey: ["skills", "all"],
        enabled: modalOpen,
        queryFn: async () => {
            const [active, inactive] = await Promise.all([
                skillsApi.getActiveSkills(0, 500),
                skillsApi.getInactiveSkills(0, 500),
            ]);

            return normalizeSkills([
                ...(active.content ?? []),
                ...(inactive.content ?? []),
            ]);
        },
    });

    const skills = data?.content ?? [];
    const totalPages = data?.totalPages ?? 1;

    const saveMutation = useMutation({
        mutationFn: async (payload: SkillPayload & { id?: string }) => {
            const { id, ...data } = payload;
            return id ? skillsApi.update(id, data) : skillsApi.create(data);
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

    function openNew() {
        setEditing({});
        setModalOpen(true);
    }

    function openEdit(skill: Skill) {
        setEditing({
            id: skill.id,
            name: skill.name,
            type: skill.type,
            description: skill.description,
            category: skill.category,
        });
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditing(null);
    }

    function handleClearFilters() {
        setSearch("");
        setSelectedCategory("");
        setPage(0);
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

            <SkillsFilters
                search={search}
                selectedCategory={selectedCategory}
                onSearchChange={setSearch}
                onCategoryChange={setSelectedCategory}
                onClear={handleClearFilters}
            />

            {isLoading ? (
                <p className="text-sm text-slate-400">Carregando...</p>
            ) : skills.length === 0 ? (
                <div className="bg-white border rounded-xl py-16 text-center">
                    <p className="text-slate-400 text-sm">Nenhuma skill encontrada.</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-xl shadow-card overflow-hidden flex flex-col">
                    <SkillsTable
                        data={skills}
                        deletingSkillId={
                            deleteMutation.isPending ? (deleteMutation.variables ?? null) : null
                        }
                        onEdit={openEdit}
                        onDelete={setSkillToDelete}
                    />

                    <Pagination
                        className="mt-0 py-4 px-4 border-t-0"
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}

            {modalOpen && editing && (
                <SkillFormModal
                    initial={editing}
                    existingSkills={allSkills}
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
