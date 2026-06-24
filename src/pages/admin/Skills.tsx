import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    skillsApi,
    SkillFormModal,
    SkillsTable,
    SkillsFilters,
    normalizeSkills,
    type Skill,
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
        queryKey: ["skills", "active"],
        queryFn: async () => {
            const response = await skillsApi.getActiveSkills(0, 500);
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

    const saveMutation = useMutation({
        mutationFn: async (payload: SkillPayload & { id?: string }) =>
            payload.id ? skillsApi.update(payload.id, payload) : skillsApi.create(payload),
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
            const q = search.toLowerCase();
            const matchesSearch =
                !q ||
                skill.name.toLowerCase().includes(q) ||
                (skill.description?.toLowerCase() || "").includes(q);
            const matchesCategory = !selectedCategory || skill.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [skills, search, selectedCategory]);

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
            ) : filteredSkills.length === 0 ? (
                <div className="bg-white border rounded-xl py-16 text-center">
                    <p className="text-slate-400 text-sm">Nenhuma skill encontrada.</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-xl shadow-card p-6 flex flex-col gap-4">
                    <SkillsTable
                        data={paginatedSkills}
                        deletingSkillId={
                            deleteMutation.isPending ? (deleteMutation.variables ?? null) : null
                        }
                        onEdit={openEdit}
                        onDelete={setSkillToDelete}
                    />

                    <Pagination
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
