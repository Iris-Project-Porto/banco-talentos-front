import { http } from "@/lib/axios";
import type { Maquina, MatriculaHistorico, Recurso, RecursoFilterParams, RecursoPage, StatusMatricula } from "../types/recurso";

function buildParams(f: RecursoFilterParams & { page?: number; size?: number }): URLSearchParams {
  const p = new URLSearchParams();
  if (f.page !== undefined) p.set("page", String(f.page));
  if (f.size !== undefined) p.set("size", String(f.size));
  if (f.nome) p.set("nome", f.nome);
  if (f.statusRecurso) p.set("statusRecurso", f.statusRecurso);
  if (f.statusMatricula) p.set("statusMatricula", f.statusMatricula);
  if (f.gerenteProjeto) p.set("gerenteProjeto", f.gerenteProjeto);
  if (f.projeto) p.set("projeto", f.projeto);
  if (f.billable !== "" && f.billable !== undefined) p.set("billable", String(f.billable));
  if (f.onboarding !== "" && f.onboarding !== undefined) p.set("onboarding", String(f.onboarding));
  if (f.dataEntradaDe) p.set("dataEntradaDe", f.dataEntradaDe);
  if (f.dataEntradaAte) p.set("dataEntradaAte", f.dataEntradaAte);
  return p;
}

export const recursosApi = {
  listar: (filtros: RecursoFilterParams, page = 0, size = 20): Promise<RecursoPage> =>
    http.get(`/v1/admin/recursos?${buildParams({ ...filtros, page, size })}`).then((r) => r.data),

  buscar: (id: string): Promise<Recurso> =>
    http.get(`/v1/admin/recursos/${id}`).then((r) => r.data),

  atualizar: (id: string, data: Partial<Recurso>): Promise<Recurso> =>
    http.patch(`/v1/admin/recursos/${id}`, data).then((r) => r.data),

  atualizarMatricula: (id: string, statusMatricula: StatusMatricula): Promise<Recurso> =>
    http.patch(`/v1/admin/recursos/${id}/matricula`, { statusMatricula }).then((r) => r.data),

  listarHistorico: (id: string): Promise<MatriculaHistorico[]> =>
    http.get(`/v1/admin/recursos/${id}/historico`).then((r) => r.data),

  adicionarMaquina: (id: string, data: Omit<Maquina, "id" | "createdAt" | "updatedAt">): Promise<Maquina> =>
    http.post(`/v1/admin/recursos/${id}/maquinas`, data).then((r) => r.data),

  atualizarMaquina: (id: string, maqId: string, data: Partial<Maquina>): Promise<Maquina> =>
    http.put(`/v1/admin/recursos/${id}/maquinas/${maqId}`, data).then((r) => r.data),

  removerMaquina: (id: string, maqId: string): Promise<void> =>
    http.delete(`/v1/admin/recursos/${id}/maquinas/${maqId}`).then((r) => r.data),

  atualizarContato: (data: { contato?: string; endereco?: string }): Promise<Recurso> =>
    http.patch("/v1/recurso/me/contato", data).then((r) => r.data),
};
