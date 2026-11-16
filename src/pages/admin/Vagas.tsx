import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { vagasApi, VagaCard, type JobPosting } from "@/features/vagas";
import { useVagasList } from "../../features/vagas/hooks/useVagasList"; 
import { VagaFilters } from "../../features/vagas/components/VagaFilter/VagaFilters";
import { PageHeader, Button, ConfirmModal, Pagination } from "@/components/ui";

export default function Vagas() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [vagaToCancel, setVagaToCancel] = useState<JobPosting | null>(null);

  const {
    viewActive,
    setViewActive,
    page,
    setPage,
    filters,
    setFilter,
    applyFilters,
    clearFilters,
    vagas,
    totalPages,
    isLoading,
    projects,
    squads,
  } = useVagasList();

  const cancelMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      vagasApi.updateStatus(id, "CANCELLED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vagas"] });
      setVagaToCancel(null);
      toast.success("Vaga cancelada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao cancelar", error);
      toast.error("Ocorreu um erro ao cancelar a vaga. Tente novamente.");
    },
  });

  function openNew() { navigate("/admin/vagas/nova"); }
  function openEdit(v: JobPosting) { navigate(`/admin/vagas/${v.id}/editar`); }

  function handleCancelJob(vaga: JobPosting) {
    if (!["CANCELLED", "FILLED"].includes(vaga.status)) {
      setVagaToCancel(vaga);
    }
  }

  function confirmCancelJob() {
    if (vagaToCancel) {
      cancelMutation.mutate({ id: vagaToCancel.id });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vagas Externas"
        subtitle="Gestão de vagas, requisições e matching"
        actions={<Button variant="primary" size="md" onClick={openNew}>+ Nova Vaga</Button>}
      />

      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setViewActive(true)}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            viewActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Ativas
        </button>
        <button
          onClick={() => setViewActive(false)}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            !viewActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Inativas / Histórico
        </button>
      </div>

      <VagaFilters
        filters={filters}
        projects={projects}
        squads={squads}
        onChange={setFilter}
        onApply={applyFilters}
        onClear={clearFilters}
      />

      {isLoading ? (
        <p className="text-sm text-slate-400">Carregando...</p>
      ) : vagas.length === 0 ? (
        <div className="bg-white border rounded-xl py-16 text-center shadow-sm">
          <p className="text-slate-400 text-sm">Nenhuma vaga encontrada.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vagas.map((v: JobPosting) => (
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

      {vagaToCancel && (
        <ConfirmModal
          title="Cancelar esta vaga?"
          message={`Deseja realmente cancelar a vaga ${vagaToCancel.vacancyCode}? Esta ação pode ser irreversível no fluxo operacional.`}
          confirmLabel="Cancelar vaga"
          cancelLabel="Voltar"
          loading={cancelMutation.isPending}
          onConfirm={confirmCancelJob}
          onClose={() => setVagaToCancel(null)}
        />
      )}
    </div>
  );
}