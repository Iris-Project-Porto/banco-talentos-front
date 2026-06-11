import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vagasApi, VagaCard, VagaModal, type JobPosting, type JobPostingPayload } from "@/features/vagas";
import { PageHeader, Button } from "@/components/ui";

export default function Vagas() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<(Partial<JobPostingPayload> & { id?: string }) | null>(null);
  const [viewActive, setViewActive] = useState(true);
  const [search, setSearch] = useState("");

  const { data: activeVagas = [], isLoading: loadingActive } = useQuery({
    queryKey: ['vagas', 'active'],
    queryFn: vagasApi.getActive
  });

  const { data: inactiveVagas = [], isLoading: loadingInactive } = useQuery({
    queryKey: ['vagas', 'inactive'],
    queryFn: vagasApi.getInactive
  });

  const saveMutation = useMutation({
    mutationFn: async (data: JobPostingPayload & { id?: string }) =>
      data.id ? vagasApi.update(data.id, data) : vagasApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagas'] });
      closeModal();
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string, active: boolean }) =>
      active ? vagasApi.deactivate(id) : vagasApi.activate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vagas'] })
  });

  const currentList = viewActive ? activeVagas : inactiveVagas;
  const isLoading = viewActive ? loadingActive : loadingInactive;

  const filtered = currentList.filter((v: JobPosting) => {
    const q = search.toLowerCase();
    return !q || (v.projectName?.toLowerCase() || "").includes(q)
      || (v.recruiter?.toLowerCase() || "").includes(q)
      || (v.status?.toLowerCase() || "").includes(q);
  });

  function openNew() { setEditing({}); setModalOpen(true); }
  function openEdit(v: JobPosting) { setEditing(v); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditing(null); }

  function handleToggleActive(id: string, currentActive: boolean) {
    if (confirm(`Deseja ${currentActive ? 'desativar' : 'ativar'} esta vaga?`)) {
      toggleStatusMutation.mutate({ id, active: currentActive });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Vagas" subtitle="Gestão de vagas e requisições" actions={<Button variant="primary" size="sm" onClick={openNew}>+ Nova vaga</Button>} />

      <div className="bg-white border border-slate-200 rounded-xl shadow-card px-5 py-4 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button onClick={() => setViewActive(true)} className={`px-4 py-1.5 rounded-md text-xs font-semibold ${viewActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Ativas ({activeVagas.length})</button>
          <button onClick={() => setViewActive(false)} className={`px-4 py-1.5 rounded-md text-xs font-semibold ${!viewActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Inativas ({inactiveVagas.length})</button>
        </div>
        <div className="flex-1">
          <input placeholder="Buscar por projeto, recrutador, status..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-pink focus:shadow-focus-pink" />
        </div>
      </div>

      {isLoading ? <p className="text-sm text-slate-400">Carregando...</p> : filtered.length === 0 ? (
        <div className="bg-white border rounded-xl py-16 text-center"><p className="text-slate-400 text-sm">Nenhuma vaga encontrada.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((v: JobPosting) => <VagaCard key={v.id} vaga={v} onEdit={openEdit} onToggleActive={handleToggleActive} />)}
        </div>
      )}

      {modalOpen && editing && <VagaModal initial={editing} saving={saveMutation.isPending} onSave={(data) => saveMutation.mutate(data)} onClose={closeModal} />}
    </div>
  );
}