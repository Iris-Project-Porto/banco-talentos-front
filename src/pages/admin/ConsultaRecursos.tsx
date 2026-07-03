import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Eye, Search, X } from "lucide-react";
import { Badge, Button, Input, PageHeader, Pagination, Select } from "@/components/ui";
import { recursosApi } from "@/features/recursos/api/recursos.api";
import type { RecursoFilterParams, StatusMatricula, StatusRecurso } from "@/features/recursos/types/recurso";
import { STATUS_MATRICULA_LABELS, STATUS_RECURSO_LABELS } from "@/features/recursos/types/recurso";

const filterLabel = "block text-[11px] font-semibold tracking-wide text-slate-500 mb-1.5";

const STATUS_RECURSO_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "DISPONIVEL", label: "Disponível" },
  { value: "AGUARDANDO", label: "Aguardando" },
  { value: "ALOCADO", label: "Alocado" },
];

const STATUS_MATRICULA_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "NAO_NECESSARIO", label: "Não necessário" },
  { value: "SOLICITADO_VIA_CHAMADO", label: "Solicitado via chamado" },
  { value: "CHAMADO_AGUARDANDO_APROVACAO", label: "Aguardando aprovação" },
  { value: "CHAMADO_AGUARDANDO_ATENDIMENTO", label: "Aguardando atendimento" },
  { value: "LIBERADA", label: "Liberada" },
];

const BOOL_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "true", label: "Sim" },
  { value: "false", label: "Não" },
];

function statusRecursoBadge(s: StatusRecurso) {
  const variant =
    s === "ALOCADO" ? "success" :
    s === "AGUARDANDO" ? "warning" :
    "info";
  return <Badge variant={variant}>{STATUS_RECURSO_LABELS[s]}</Badge>;
}

function statusMatriculaBadge(s: StatusMatricula) {
  const variant =
    s === "LIBERADA" ? "success" :
    s === "NAO_NECESSARIO" ? "info" :
    "warning";
  return <Badge variant={variant}>{STATUS_MATRICULA_LABELS[s]}</Badge>;
}

const EMPTY_FILTERS: RecursoFilterParams = {
  nome: "",
  statusRecurso: "",
  statusMatricula: "",
  gerenteProjeto: "",
  projeto: "",
  billable: "",
  onboarding: "",
  dataEntradaDe: "",
  dataEntradaAte: "",
};

export default function ConsultaRecursos() {
  const [filters, setFilters] = useState<RecursoFilterParams>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<RecursoFilterParams>(EMPTY_FILTERS);
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["recursos", applied, page],
    queryFn: () => recursosApi.listar(applied, page),
  });

  function set(key: keyof RecursoFilterParams, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleApply() {
    setPage(0);
    setApplied(filters);
  }

  function handleClear() {
    setFilters(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setPage(0);
  }

  const recursos = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Recursos" subtitle="Consulta e gestão do ciclo de vida dos recursos" />
        <Link to="/admin/talentos">
          <Button variant="primary" size="sm">+ Cadastrar Recurso</Button>
        </Link>
      </div>

      {/* Filtros — linha 1 */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-card px-5 py-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={filterLabel}>NOME / E-MAIL</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
              <Input
                placeholder="Buscar..."
                value={filters.nome}
                onChange={(e) => set("nome", e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <label className={filterLabel}>STATUS RECURSO</label>
            <Select
              options={STATUS_RECURSO_OPTIONS}
              value={filters.statusRecurso as string}
              onChange={(e) => set("statusRecurso", e.target.value)}
            />
          </div>
          <div>
            <label className={filterLabel}>STATUS MATRÍCULA</label>
            <Select
              options={STATUS_MATRICULA_OPTIONS}
              value={filters.statusMatricula as string}
              onChange={(e) => set("statusMatricula", e.target.value)}
            />
          </div>
          <div>
            <label className={filterLabel}>GERENTE DO PROJETO</label>
            <Input
              placeholder="Nome do gerente..."
              value={filters.gerenteProjeto}
              onChange={(e) => set("gerenteProjeto", e.target.value)}
            />
          </div>
        </div>

        {/* Filtros — linha 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className={filterLabel}>PROJETO</label>
            <Input
              placeholder="Nome do projeto..."
              value={filters.projeto}
              onChange={(e) => set("projeto", e.target.value)}
            />
          </div>
          <div>
            <label className={filterLabel}>BILLABLE</label>
            <Select
              options={BOOL_OPTIONS}
              value={filters.billable as string}
              onChange={(e) => set("billable", e.target.value)}
            />
          </div>
          <div>
            <label className={filterLabel}>ONBOARDING PORTO</label>
            <Select
              options={BOOL_OPTIONS}
              value={filters.onboarding as string}
              onChange={(e) => set("onboarding", e.target.value)}
            />
          </div>
          <div>
            <label className={filterLabel}>ENTRADA DE</label>
            <Input
              type="date"
              value={filters.dataEntradaDe}
              onChange={(e) => set("dataEntradaDe", e.target.value)}
            />
          </div>
          <div>
            <label className={filterLabel}>ENTRADA ATÉ</label>
            <Input
              type="date"
              value={filters.dataEntradaAte}
              onChange={(e) => set("dataEntradaAte", e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" size="sm" onClick={handleClear}>
            <X className="w-3.5 h-3.5 mr-1" /> Limpar
          </Button>
          <Button variant="primary" size="sm" onClick={handleApply}>
            Aplicar Filtros
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-card overflow-hidden">
        {isLoading ? (
          <p className="text-sm text-slate-400 p-6">Carregando...</p>
        ) : recursos.length === 0 ? (
          <p className="text-sm text-slate-400 p-6 text-center">Nenhum recurso encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 tracking-wide">Nome</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 tracking-wide">E-mail</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 tracking-wide">Status Recurso</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 tracking-wide">Status Matrícula</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 tracking-wide">Gerente</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 tracking-wide">Projeto</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 tracking-wide">Entrada</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 tracking-wide">Billable</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 tracking-wide">Onboarding</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {recursos.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link to={`/admin/talentos/${r.id}`} className="hover:text-pink transition-colors">
                        {r.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{r.email}</td>
                    <td className="px-4 py-3">{statusRecursoBadge(r.statusRecurso)}</td>
                    <td className="px-4 py-3">{statusMatriculaBadge(r.statusMatricula)}</td>
                    <td className="px-4 py-3 text-slate-600">{r.gerenteProjeto ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{r.projetoAlocacao ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {r.dataEntradaProjeto
                        ? new Date(r.dataEntradaProjeto).toLocaleDateString("pt-BR")
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {r.recursoBillable === true ? (
                        <Badge variant="success">Sim</Badge>
                      ) : r.recursoBillable === false ? (
                        <Badge variant="pending">Não</Badge>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.onboardingPortoRealizado === true ? (
                        <Badge variant="success">Sim</Badge>
                      ) : r.onboardingPortoRealizado === false ? (
                        <Badge variant="pending">Não</Badge>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/talentos/${r.id}`}
                        className="text-slate-400 hover:text-pink transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Mostrando {recursos.length} de {totalElements} recurso{totalElements !== 1 ? "s" : ""}
          </p>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
