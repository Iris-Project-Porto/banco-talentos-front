import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button, Avatar, Input, Select, Section, Badge } from "@/components/ui";
import {
  StackInput,
  useTalentoDetalhe,
  NIVEL_OPTIONS,
  NIVEL_STYLE,
  AREA_OPTIONS,
  ALOCACAO_OPTIONS,
  TRILHA_OPTIONS,
  EXPERIENCE_OPTIONS,
  REGISTRATION_STATUS_OPTIONS,
  SOFTSKILLS_LIST
} from "@/features/profiles";
import { recursosApi } from "@/features/recursos/api/recursos.api";
import type { Maquina, StatusMatricula, StatusMaquina } from "@/features/recursos/types/recurso";
import {
  STATUS_RECURSO_LABELS,
  STATUS_PROPOSTA_LABELS,
  STATUS_MAQUINA_LABELS,
} from "@/features/recursos/types/recurso";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

// ── Opções ────────────────────────────────────────────────────────────────────

const STATUS_MATRICULA_OPTIONS = [
  { value: "NAO_NECESSARIO", label: "Não necessário" },
  { value: "SOLICITADO_VIA_CHAMADO", label: "Solicitado via chamado" },
  { value: "CHAMADO_AGUARDANDO_APROVACAO", label: "Aguardando aprovação" },
  { value: "CHAMADO_AGUARDANDO_ATENDIMENTO", label: "Aguardando atendimento" },
  { value: "LIBERADA", label: "Liberada" },
];

const STATUS_PROPOSTA_OPTIONS = [
  { value: "", label: "— Selecione —" },
  { value: "PENDENTE_DE_ENVIO", label: "Pendente de envio" },
  { value: "ENVIADO_AO_COORDENADOR", label: "Enviado ao Coordenador Porto" },
  { value: "COBRAR_RETORNO", label: "Cobrar retorno" },
  { value: "ASSINADO", label: "Assinado" },
  { value: "ERRO_DE_ASSINATURA", label: "Erro de assinatura" },
];

const STATUS_MAQUINA_OPTIONS = [
  { value: "VAZIO", label: "—" },
  { value: "EM_PROCESSO_DE_SOLICITACAO", label: "Em processo de solicitação" },
  { value: "SOLICITADO", label: "Solicitado" },
  { value: "RETIRADO", label: "Retirado" },
  { value: "ENVIO_PARA_O_RECURSO", label: "Envio para o recurso" },
  { value: "EM_USO", label: "Em uso" },
  { value: "DEVOLVIDO", label: "Devolvido" },
];

const BOOL_OPTIONS = [
  { value: "", label: "— Selecione —" },
  { value: "true", label: "Sim" },
  { value: "false", label: "Não" },
];

// ── Tabs ──────────────────────────────────────────────────────────────────────

type Tab = "dados" | "recurso";

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
        active
          ? "border-pink text-pink"
          : "border-transparent text-slate-500 hover:text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function TalentoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const {
    profile, form, stacks, saving, loading,
    setStacks, updateField, handleAddSoftSkill, handleRemoveSoftSkill, handleSave
  } = useTalentoDetalhe(id);

  const [tab, setTab] = useState<Tab>("dados");
  const [selectedSoftSkill, setSelectedSoftSkill] = useState("");
  const [selectedSoftLevel, setSelectedSoftLevel] = useState<number | "">("");

  // Recurso lifecycle data
  const { data: recurso, isLoading: recursoLoading } = useQuery({
    queryKey: ["recurso", id],
    queryFn: () => recursosApi.buscar(id!),
    enabled: !!id,
  });

  // Mutação: atualizar statusMatrícula
  const matriculaMutation = useMutation({
    mutationFn: (status: StatusMatricula) => recursosApi.atualizarMatricula(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurso", id] });
      toast.success("Status de matrícula atualizado.");
    },
    onError: () => toast.error("Erro ao atualizar status de matrícula."),
  });

  // Mutação: atualizar campos do lifecycle (Seções 1, 3, 4)
  const recursoMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => recursosApi.atualizar(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurso", id] });
      toast.success("Informações do recurso salvas.");
    },
    onError: () => toast.error("Erro ao salvar informações do recurso."),
  });

  // Mutação: adicionar máquina
  const addMaquinaMutation = useMutation({
    mutationFn: (data: Omit<Maquina, "id" | "createdAt" | "updatedAt">) =>
      recursosApi.adicionarMaquina(id!, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recurso", id] }),
    onError: () => toast.error("Erro ao adicionar máquina."),
  });

  // Mutação: remover máquina
  const removeMaquinaMutation = useMutation({
    mutationFn: (maqId: string) => recursosApi.removerMaquina(id!, maqId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recurso", id] }),
    onError: () => toast.error("Erro ao remover máquina."),
  });

  // Estado local do formulário da aba Recurso
  const [recursoForm, setRecursoForm] = useState<Record<string, unknown>>({});
  const [newMaquina, setNewMaquina] = useState<Partial<Maquina>>({ statusMaquina: "VAZIO" });

  if (loading || !profile) {
    return <p className="text-gray-400 text-sm">Carregando...</p>;
  }

  const isPendente = profile.status === "PENDING";
  const backLink = isPendente ? "/admin/fila" : "/admin/talentos";

  const nivel = form.levelOverride || profile.nivel;
  const ns = nivel ? NIVEL_STYLE[nivel] : null;
  const expLabel = EXPERIENCE_OPTIONS.find((o) => String(o.value) === String(form.experienceYears))?.label ?? "";
  const availableSoftSkills = SOFTSKILLS_LIST.filter(
    (skill) => !form.softSkills.some((s) => s.name === skill)
  );

  const onAddSoftSkillClick = () => {
    handleAddSoftSkill(selectedSoftSkill, Number(selectedSoftLevel));
    setSelectedSoftSkill("");
    setSelectedSoftLevel("");
  };

  // Estado do lifecycle combinando dados da API com edições locais
  const r = recurso;
  const matriculaAtiva = r && r.statusMatricula !== "NAO_NECESSARIO";
  const estaAlocado = r?.statusRecurso === "ALOCADO";

  function setRF(key: string, value: unknown) {
    setRecursoForm((prev) => ({ ...prev, [key]: value }));
  }

  function getRF<T>(key: string, fallback: T): T {
    return key in recursoForm ? (recursoForm[key] as T) : fallback ?? ("" as unknown as T);
  }

  function handleSaveRecurso() {
    const payload: Record<string, unknown> = {};
    const keys = Object.keys(recursoForm);
    if (keys.length === 0) {
      toast("Nenhuma alteração para salvar.", { icon: "ℹ️" });
      return;
    }
    keys.forEach((k) => {
      const v = recursoForm[k];
      payload[k] = v === "" ? null : v;
    });
    recursoMutation.mutate(payload);
    setRecursoForm({});
  }

  function handleAddMaquina() {
    addMaquinaMutation.mutate({
      tagNumeroSerie: newMaquina.tagNumeroSerie,
      hostname: newMaquina.hostname,
      numeroAtivo: newMaquina.numeroAtivo,
      marcaSistemaOperacional: newMaquina.marcaSistemaOperacional,
      processador: newMaquina.processador,
      statusMaquina: (newMaquina.statusMaquina ?? "VAZIO") as StatusMaquina,
    });
    setNewMaquina({ statusMaquina: "VAZIO" });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-2">
        <Link
          to={backLink}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {isPendente ? "Fila de revisão" : "Voltar"}
        </Link>
      </div>

      {/* Card de perfil */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
        <Avatar name={profile.name ?? "?"} photoUrl={profile.photoUrl} size={56} />
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>
                {profile.name}
              </h1>
              <p className="text-sm text-gray-400">{profile.email}</p>
              {form.area && <p className="text-sm text-gray-500 mt-0.5">{form.area}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {ns && nivel && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: ns.bg, color: ns.color }}>
                  {nivel}
                </span>
              )}
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isPendente ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                {isPendente ? "Pendente" : "Ativo"}
              </span>
              {r && (
                <Badge variant={r.statusRecurso === "ALOCADO" ? "success" : r.statusRecurso === "AGUARDANDO" ? "warning" : "info"}>
                  {STATUS_RECURSO_LABELS[r.statusRecurso]}
                </Badge>
              )}
            </div>
          </div>
          {expLabel && <p className="text-xs text-gray-400 mt-1">{expLabel} de experiência</p>}
        </div>
      </div>

      {/* Abas */}
      <div className="flex border-b border-slate-200 -mb-2">
        <TabButton active={tab === "dados"} onClick={() => setTab("dados")}>
          Dados Básicos
        </TabButton>
        <TabButton active={tab === "recurso"} onClick={() => setTab("recurso")}>
          Informações do Recurso
        </TabButton>
      </div>

      {/* ── Aba 1: Dados Básicos ──────────────────────────────────────────── */}
      {tab === "dados" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="flex flex-col gap-4">
            <Section title="Identificação Corporativa">
              <Input label="Matrícula" value={form.registrationNumber} onChange={(e) => updateField("registrationNumber", e.target.value)} placeholder="Matrícula" />
              <Select label="Status da Matrícula" value={form.registrationStatus} onChange={(e) => updateField("registrationStatus", e.target.value)} options={REGISTRATION_STATUS_OPTIONS} />
            </Section>
            <Section title="Override de nível">
              <Select value={form.levelOverride} onChange={(e) => updateField("levelOverride", e.target.value)} options={NIVEL_OPTIONS} />
            </Section>
            <Section title="Alocação e carreira">
              <Select label="Situação de alocação" value={form.allocationStatus} onChange={(e) => updateField("allocationStatus", e.target.value)} options={ALOCACAO_OPTIONS} />
              <Select label="Trilha de carreira" value={form.careerPath} onChange={(e) => updateField("careerPath", e.target.value)} options={TRILHA_OPTIONS} />
            </Section>
            <Section title="Identificação">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select label="Área" value={form.area} onChange={(e) => updateField("area", e.target.value)} options={[{ value: "", label: "-" }, ...AREA_OPTIONS]} />
                <Select label="Anos de exp." value={String(form.experienceYears)} onChange={(e) => updateField("experienceYears", e.target.value)} options={[{ value: "", label: "-" }, ...EXPERIENCE_OPTIONS]} />
              </div>
              <div className="mt-2">
                <label className="text-xs text-gray-400 block mb-1">Sobre</label>
                <textarea
                  value={form.about}
                  onChange={(e) => updateField("about", e.target.value)}
                  rows={3}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-pink-400 resize-none bg-white"
                />
              </div>
            </Section>
            <Section title="Links">
              <Input label="LinkedIn" value={form.linkedinUrl} onChange={(e) => updateField("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/in/..." />
              <Input label="GitHub" value={form.githubUrl} onChange={(e) => updateField("githubUrl", e.target.value)} placeholder="https://github.com/..." />
            </Section>
          </div>

          <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
            <Section title="Stack tecnológica">
              <StackInput value={stacks} onChange={setStacks} />
            </Section>
            <Section title="Avaliação de Soft Skills (Admin)">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-5">
                <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">Legenda da Escala (1 a 10)</p>
                <ul className="text-xs text-slate-500 space-y-1">
                  <li><strong className="text-slate-700">1 a 3</strong> - Em desenvolvimento inicial</li>
                  <li><strong className="text-slate-700">4 a 6</strong> - Pratica com regularidade</li>
                  <li><strong className="text-slate-700">7 a 8</strong> - Domínio e aplicação consistente</li>
                  <li><strong className="text-slate-700">9 a 10</strong> - Referência no time</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 mb-2">
                <div className="flex-1">
                  <Select
                    label="Soft Skill"
                    value={selectedSoftSkill}
                    onChange={(e) => setSelectedSoftSkill(e.target.value)}
                    options={[{ value: "", label: "Selecione uma skill..." }, ...availableSoftSkills.map(s => ({ value: s, label: s }))]}
                  />
                </div>
                <div className="w-32">
                  <Select
                    label="Nota (1 a 10)"
                    value={String(selectedSoftLevel)}
                    onChange={(e) => setSelectedSoftLevel(Number(e.target.value) || "")}
                    options={[{ value: "", label: "-" }, ...Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))]}
                  />
                </div>
                <button
                  type="button"
                  onClick={onAddSoftSkillClick}
                  disabled={!selectedSoftSkill || !selectedSoftLevel}
                  className="px-4 py-2.5 h-[38px] bg-slate-100 text-slate-600 font-medium text-sm rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Adicionar
                </button>
              </div>
              {form.softSkills.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  {form.softSkills.map((skillObj) => (
                    <div key={skillObj.name} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-2">
                      <span className="text-sm font-medium text-slate-700">{skillObj.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-pink">{skillObj.level} / 10</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSoftSkill(skillObj.name)}
                          className="text-slate-400 hover:text-red-500 transition-colors text-lg leading-none"
                          title="Remover"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
            <div className="flex flex-wrap items-center gap-3 pt-4">
              {isPendente && (
                <Button type="button" variant="primary" onClick={() => handleSave(true)} loading={saving} disabled={saving}>
                  {saving ? "Salvando..." : "Salvar e Ativar →"}
                </Button>
              )}
              <Button type="button" variant={isPendente ? "secondary" : "primary"} onClick={() => handleSave(false)} loading={saving} disabled={saving}>
                {saving ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Aba 2: Informações do Recurso ─────────────────────────────────── */}
      {tab === "recurso" && (
        <div className="flex flex-col gap-5">
          {recursoLoading || !r ? (
            <p className="text-sm text-slate-400">Carregando informações do recurso...</p>
          ) : (
            <>
              {/* Seção 1 — Status da Matrícula */}
              <Section title="Seção 1 — Status da Matrícula">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1.5">Status da Matrícula</label>
                    <Select
                      options={STATUS_MATRICULA_OPTIONS}
                      value={getRF("statusMatricula", r.statusMatricula)}
                      onChange={(e) => {
                        const v = e.target.value as StatusMatricula;
                        matriculaMutation.mutate(v);
                      }}
                    />
                    <p className="text-2xs text-slate-400 mt-1">
                      Status Recurso automático:{" "}
                      <strong>{STATUS_RECURSO_LABELS[r.statusRecurso]}</strong>
                    </p>
                  </div>

                  {matriculaAtiva && (
                    <>
                      <Input
                        label="Número da Matrícula"
                        value={getRF("numeroMatricula", r.numeroMatricula ?? "")}
                        onChange={(e) => setRF("numeroMatricula", e.target.value)}
                        placeholder="Ex: VLT-2024-001"
                      />
                      <Input
                        label="Data de Solicitação"
                        type="date"
                        value={getRF("dataSolicitacaoMatricula", r.dataSolicitacaoMatricula ?? "")}
                        onChange={(e) => setRF("dataSolicitacaoMatricula", e.target.value)}
                      />
                    </>
                  )}
                </div>
                {matriculaAtiva && (
                  <div className="mt-4">
                    <label className="text-xs text-slate-500 block mb-1.5">Observações da Matrícula</label>
                    <textarea
                      value={getRF("observacoesMatricula", r.observacoesMatricula ?? "")}
                      onChange={(e) => setRF("observacoesMatricula", e.target.value)}
                      rows={3}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-pink-400 resize-none bg-white"
                      placeholder="Observações sobre a matrícula..."
                    />
                  </div>
                )}
              </Section>

              {/* Seção 2 — Máquina do Cliente */}
              {matriculaAtiva && (
                <Section title="Seção 2 — Máquina do Cliente">
                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-sm text-slate-700 font-medium">Possui máquina do cliente?</label>
                    <button
                      type="button"
                      onClick={() => setRF("possuiMaquinaCliente", !getRF("possuiMaquinaCliente", r.possuiMaquinaCliente))}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        getRF("possuiMaquinaCliente", r.possuiMaquinaCliente) ? "bg-pink" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          getRF("possuiMaquinaCliente", r.possuiMaquinaCliente) ? "translate-x-4" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Grid de máquinas existentes */}
                  {r.maquinas.length > 0 && (
                    <div className="overflow-x-auto mb-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500">
                            <th className="text-left px-3 py-2">Tag / Série</th>
                            <th className="text-left px-3 py-2">Hostname</th>
                            <th className="text-left px-3 py-2">Nº Ativo</th>
                            <th className="text-left px-3 py-2">SO / Marca</th>
                            <th className="text-left px-3 py-2">Processador</th>
                            <th className="text-left px-3 py-2">Status</th>
                            <th className="px-3 py-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {r.maquinas.map((m) => (
                            <tr key={m.id} className="border-b border-slate-50">
                              <td className="px-3 py-2">{m.tagNumeroSerie ?? "—"}</td>
                              <td className="px-3 py-2">{m.hostname ?? "—"}</td>
                              <td className="px-3 py-2">{m.numeroAtivo ?? "—"}</td>
                              <td className="px-3 py-2">{m.marcaSistemaOperacional ?? "—"}</td>
                              <td className="px-3 py-2">{m.processador ?? "—"}</td>
                              <td className="px-3 py-2">
                                <Badge variant="info">{STATUS_MAQUINA_LABELS[m.statusMaquina]}</Badge>
                              </td>
                              <td className="px-3 py-2">
                                <button
                                  type="button"
                                  onClick={() => removeMaquinaMutation.mutate(m.id)}
                                  className="text-slate-400 hover:text-red-500 transition-colors"
                                  title="Remover"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Formulário nova máquina */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Nova Máquina</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                      <Input label="Tag / Nº de Série" value={newMaquina.tagNumeroSerie ?? ""} onChange={(e) => setNewMaquina(p => ({ ...p, tagNumeroSerie: e.target.value }))} />
                      <Input label="Hostname" value={newMaquina.hostname ?? ""} onChange={(e) => setNewMaquina(p => ({ ...p, hostname: e.target.value }))} />
                      <Input label="Nº Ativo" value={newMaquina.numeroAtivo ?? ""} onChange={(e) => setNewMaquina(p => ({ ...p, numeroAtivo: e.target.value }))} />
                      <Input label="SO / Marca" value={newMaquina.marcaSistemaOperacional ?? ""} onChange={(e) => setNewMaquina(p => ({ ...p, marcaSistemaOperacional: e.target.value }))} />
                      <Input label="Processador" value={newMaquina.processador ?? ""} onChange={(e) => setNewMaquina(p => ({ ...p, processador: e.target.value }))} />
                      <Select
                        label="Status"
                        options={STATUS_MAQUINA_OPTIONS}
                        value={newMaquina.statusMaquina ?? "VAZIO"}
                        onChange={(e) => setNewMaquina(p => ({ ...p, statusMaquina: e.target.value as StatusMaquina }))}
                      />
                    </div>
                    <Button type="button" variant="secondary" size="sm" onClick={handleAddMaquina}>
                      <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Máquina
                    </Button>
                  </div>
                </Section>
              )}

              {/* Seção 3 — Proposta Técnica */}
              {matriculaAtiva && (
                <Section title="Seção 3 — Proposta Técnica">
                  <div className="max-w-sm">
                    <Select
                      label="Status da Proposta Técnica"
                      options={STATUS_PROPOSTA_OPTIONS}
                      value={getRF("statusPropostaTecnica", r.statusPropostaTecnica ?? "")}
                      onChange={(e) => setRF("statusPropostaTecnica", e.target.value)}
                    />
                    {r.statusPropostaTecnica && (
                      <p className="text-xs text-slate-400 mt-1">
                        Atual: <strong>{STATUS_PROPOSTA_LABELS[r.statusPropostaTecnica]}</strong>
                      </p>
                    )}
                  </div>
                </Section>
              )}

              {/* Seção 4 — Dados da Contratação */}
              {estaAlocado && (
                <Section title="Seção 4 — Dados da Contratação">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input label="Área Contratante" value={getRF("areaContratante", r.areaContratante ?? "")} onChange={(e) => setRF("areaContratante", e.target.value)} />
                    <Input label="Centro de Custo" value={getRF("centroCustoContratante", r.centroCustoContratante ?? "")} onChange={(e) => setRF("centroCustoContratante", e.target.value)} />
                    <Input label="Data de Entrada" type="date" value={getRF("dataEntradaProjeto", r.dataEntradaProjeto ?? "")} onChange={(e) => setRF("dataEntradaProjeto", e.target.value)} />
                    <Input label="Gerente do Projeto" value={getRF("gerenteProjeto", r.gerenteProjeto ?? "")} onChange={(e) => setRF("gerenteProjeto", e.target.value)} />
                    <Input label="Projeto / Alocação" value={getRF("projetoAlocacao", r.projetoAlocacao ?? "")} onChange={(e) => setRF("projetoAlocacao", e.target.value)} />
                    <Input label="Squad / Time" value={getRF("squadAlocacao", r.squadAlocacao ?? "")} onChange={(e) => setRF("squadAlocacao", e.target.value)} />
                    <Select label="Billable" options={BOOL_OPTIONS} value={getRF("recursoBillable", r.recursoBillable === null || r.recursoBillable === undefined ? "" : String(r.recursoBillable))} onChange={(e) => setRF("recursoBillable", e.target.value === "" ? null : e.target.value === "true")} />
                    <Select label="Onboarding Porto Realizado" options={BOOL_OPTIONS} value={getRF("onboardingPortoRealizado", r.onboardingPortoRealizado === null || r.onboardingPortoRealizado === undefined ? "" : String(r.onboardingPortoRealizado))} onChange={(e) => setRF("onboardingPortoRealizado", e.target.value === "" ? null : e.target.value === "true")} />
                  </div>
                </Section>
              )}

              {/* Seção 5 — Contato e Endereço */}
              <Section title="Seção 5 — Contato e Endereço">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Contato" value={getRF("contato", r.contato ?? "")} onChange={(e) => setRF("contato", e.target.value)} placeholder="Telefone, Slack, etc." />
                  <div>
                    <label className="text-xs text-slate-500 block mb-1.5">Endereço</label>
                    <textarea
                      value={getRF("endereco", r.endereco ?? "")}
                      onChange={(e) => setRF("endereco", e.target.value)}
                      rows={2}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-pink-400 resize-none bg-white"
                      placeholder="Endereço completo..."
                    />
                  </div>
                </div>
              </Section>

              {/* Botão salvar lifecycle */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSaveRecurso}
                  loading={recursoMutation.isPending}
                  disabled={recursoMutation.isPending}
                >
                  {recursoMutation.isPending ? "Salvando..." : "Salvar Informações do Recurso"}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
