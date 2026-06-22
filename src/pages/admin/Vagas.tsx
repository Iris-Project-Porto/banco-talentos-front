import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { vagasApi, VagaCard, VagaModal, type JobPosting, type JobPostingPayload } from "@/features/vagas";
import { PageHeader, Button, Pagination } from "@/components/ui";

export default function Vagas() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<(Partial<JobPostingPayload> & { id?: string }) | null>(null);
  const [viewActive, setViewActive] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [viewActive, search]);

  const { data: activeData, isLoading: loadingActive } = useQuery({
    queryKey: ['vagas', 'active', page],
    queryFn: () => vagasApi.getActive(page)
  });
  const { data: inactiveData, isLoading: loadingInactive } = useQuery({
    queryKey: ['vagas', 'inactive', page],
    queryFn: () => vagasApi.getInactive(page)
  });

  const saveMutation = useMutation({
    mutationFn: async (data: JobPostingPayload & { id?: string }) =>
      data.id ? vagasApi.update(data.id, data) : vagasApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagas'] });
      closeModal();
      toast.success("Vaga salva com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao salvar", error);
      toast.error("Ocorreu um erro ao atualizar a vaga. Verifique os dados e tente novamente.");
    }
  });

  const currentData = viewActive ? activeData : inactiveData;
  const currentList = currentData?.content || [];
  const totalPages = currentData?.totalPages || 1;
  const isLoading = viewActive ? loadingActive : loadingInactive;

  const filtered = currentList.filter((v: JobPosting) => {
    const q = search.toLowerCase();
    return !q ||
      (v.vacancyCode?.toLowerCase() || "").includes(q) ||
      (v.title?.toLowerCase() || "").includes(q) ||
      (v.projectName?.toLowerCase() || "").includes(q) ||
      (v.recruiter?.toLowerCase() || "").includes(q) ||
      (v.status?.toLowerCase() || "").includes(q) ||
      (v.experienceLevel?.toLowerCase() || "").includes(q);
  });

  function openNew() { setEditing({}); setModalOpen(true); }
  function openEdit(v: JobPosting) { setEditing(v); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditing(null); }

  function handleCancelJob(vaga: JobPosting) {
    if (confirm(`Deseja realmente cancelar a vaga ${vaga.vacancyCode}?`)) {
      saveMutation.mutate({ ...vaga, status: "CANCELLED" });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vagas Externas"
        subtitle="Gestão de vagas, requisições e matching"
        actions={<Button variant="primary" size="sm" onClick={openNew}>+ Nova vaga</Button>}
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
            Inativas / Histórico
          </button>
        </div>
        <div className="flex-1 min-w-[280px]">
          <input
            placeholder="Buscar por código, título, projeto, recrutador, senioridade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-pink focus:shadow-focus-pink"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400">Carregando...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white border rounded-xl py-16 text-center">
          <p className="text-slate-400 text-sm">Nenhuma vaga encontrada.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((v: JobPosting) => (
              <VagaCard key={v.id} vaga={v} onEdit={openEdit} onCancel={handleCancelJob} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {modalOpen && editing && (
        <VagaModal
          initial={editing}
          saving={saveMutation.isPending}
          onSave={(data) => saveMutation.mutate(data)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}