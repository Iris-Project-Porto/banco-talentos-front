import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useVagas, type Vaga, type Senioridade, type StatusVaga as Status, type Prioridade } from "@/contexts/VagasContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SENIORIDADE_BADGE: Record<Senioridade, "junior" | "pleno" | "senior"> = {
  Jr: "junior", Pleno: "pleno", Sr: "senior",
};

const PRIORIDADE_COLOR: Record<Prioridade, string> = {
  Baixa:   "bg-slate-100 text-slate-600",
  Média:   "bg-[#DBEAFE] text-[#1E40AF]",
  Alta:    "bg-[#FEF9C3] text-[#92400E]",
  Urgente: "bg-red-100 text-red-700",
};

const STATUS_COLOR: Record<Status, string> = {
  "Aberta":       "bg-[#DCFCE7] text-[#166534]",
  "Em andamento": "bg-[#DBEAFE] text-[#1E40AF]",
  "Fechada":      "bg-slate-100 text-slate-500",
  "Cancelada":    "bg-red-50 text-red-500",
};

const EMPTY: Omit<Vaga, "id"> = {
  titulo: "", senioridade: "Pleno", time: "", solicitante: "",
  tempoContratacao: "", numeroVagas: 1, area: "", skills: [],
  descricao: "", status: "Aberta", prioridade: "Média",
  dataAbertura: new Date().toISOString().slice(0, 10),
};

// ─── VagaCard ─────────────────────────────────────────────────────────────────

function VagaCard({
  vaga,
  onEdit,
  onDelete,
}: {
  vaga: Vaga;
  onEdit: (v: Vaga) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card p-5 flex flex-col gap-4 transition-all hover:shadow-card-hover hover:-translate-y-px">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base text-slate-900 truncate">{vaga.titulo}</p>
          <p className="text-xs text-slate-500 mt-0.5">{vaga.time} · {vaga.solicitante}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(vaga)}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors p-1"
            title="Editar"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(vaga.id)}
            className="text-xs text-slate-300 hover:text-red-500 transition-colors p-1"
            title="Remover"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        <Badge variant={SENIORIDADE_BADGE[vaga.senioridade]}>{vaga.senioridade}</Badge>
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLOR[vaga.status]}`}>
          {vaga.status}
        </span>
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${PRIORIDADE_COLOR[vaga.prioridade]}`}>
          {vaga.prioridade}
        </span>
        {vaga.area && <Tag kind="area">{vaga.area}</Tag>}
      </div>

      {/* Skills */}
      {vaga.skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {vaga.skills.slice(0, 5).map((s) => (
            <Tag key={s} kind="skill">{s}</Tag>
          ))}
          {vaga.skills.length > 5 && (
            <span className="text-xs text-slate-400 px-1">+{vaga.skills.length - 5}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-400">
        <span>{vaga.numeroVagas} vaga{vaga.numeroVagas !== 1 ? "s" : ""} · {vaga.tempoContratacao}</span>
        <span>{new Date(vaga.dataAbertura).toLocaleDateString("pt-BR")}</span>
      </div>
    </div>
  );
}

// ─── Field helpers ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full font-sans text-base rounded-lg px-3.5 py-2.5 outline-none transition-all bg-white border border-slate-300 focus:border-pink focus:shadow-focus-pink text-slate-900 placeholder:text-slate-400";

// ─── Modal ────────────────────────────────────────────────────────────────────

function VagaModal({
  initial,
  saving,
  onSave,
  onClose,
}: {
  initial: Omit<Vaga, "id"> & { id?: string };
  saving: boolean;
  onSave: (v: Omit<Vaga, "id"> & { id?: string }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [skillInput, setSkillInput] = useState(initial.skills.join(", "));

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const skills = skillInput.split(",").map((s) => s.trim()).filter(Boolean);
    onSave({ ...form, skills });
  }

  const isEdit = Boolean(initial.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-login w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            {isEdit ? "Editar vaga" : "Nova vaga"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="px-7 py-6 flex flex-col gap-5">

            <Field label="Título da vaga">
              <input
                className={inputCls}
                placeholder="ex: Desenvolvedor Full Stack"
                value={form.titulo}
                onChange={(e) => set("titulo", e.target.value)}
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Senioridade">
                <select className={inputCls} value={form.senioridade} onChange={(e) => set("senioridade", e.target.value as Senioridade)}>
                  <option value="Jr">Júnior</option>
                  <option value="Pleno">Pleno</option>
                  <option value="Sr">Sênior</option>
                </select>
              </Field>
              <Field label="Área">
                <input className={inputCls} placeholder="ex: Engenharia" value={form.area} onChange={(e) => set("area", e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Time">
                <input className={inputCls} placeholder="ex: Squad Pagamentos" value={form.time} onChange={(e) => set("time", e.target.value)} required />
              </Field>
              <Field label="Solicitante">
                <input className={inputCls} placeholder="Nome do solicitante" value={form.solicitante} onChange={(e) => set("solicitante", e.target.value)} required />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Número de vagas">
                <input
                  type="number" min={1} className={inputCls}
                  value={form.numeroVagas}
                  onChange={(e) => set("numeroVagas", Number(e.target.value))}
                  required
                />
              </Field>
              <Field label="Tempo de contratação">
                <input className={inputCls} placeholder="ex: CLT, PJ 3 meses" value={form.tempoContratacao} onChange={(e) => set("tempoContratacao", e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field label="Status">
                <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value as Status)}>
                  <option>Aberta</option>
                  <option>Em andamento</option>
                  <option>Fechada</option>
                  <option>Cancelada</option>
                </select>
              </Field>
              <Field label="Prioridade">
                <select className={inputCls} value={form.prioridade} onChange={(e) => set("prioridade", e.target.value as Prioridade)}>
                  <option>Baixa</option>
                  <option>Média</option>
                  <option>Alta</option>
                  <option>Urgente</option>
                </select>
              </Field>
              <Field label="Data de abertura">
                <input type="date" className={inputCls} value={form.dataAbertura} onChange={(e) => set("dataAbertura", e.target.value)} required />
              </Field>
            </div>

            <Field label="Skills (separadas por vírgula)">
              <input
                className={inputCls}
                placeholder="React, TypeScript, Node.js"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
              />
              {skillInput.trim() && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {skillInput.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                    <Tag key={s} kind="skill">{s}</Tag>
                  ))}
                </div>
              )}
            </Field>

            <Field label="Descrição">
              <textarea
                className={`${inputCls} min-h-[100px] resize-y`}
                placeholder="Descreva as responsabilidades, requisitos e contexto da vaga..."
                value={form.descricao}
                onChange={(e) => set("descricao", e.target.value)}
              />
            </Field>
          </div>

          <div className="px-7 py-5 border-t border-slate-200 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>Cancelar</Button>
            <Button type="submit" variant="primary" loading={saving}>
              {isEdit ? "Salvar alterações" : "Criar vaga"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const STATUS_FILTERS: Array<Status | "Todas"> = ["Todas", "Aberta", "Em andamento", "Fechada", "Cancelada"];

export default function Vagas() {
  const { vagas, setVagas } = useVagas();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<(Omit<Vaga, "id"> & { id?: string }) | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | "Todas">("Todas");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.getVagas()
      .then((data) => setVagas(data))
      .catch(() => setError("Não foi possível carregar as vagas."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = vagas.filter((v) => {
    const q = search.toLowerCase();
    return (
      (statusFilter === "Todas" || v.status === statusFilter) &&
      (!q || v.titulo.toLowerCase().includes(q) || v.time.toLowerCase().includes(q) ||
        v.area.toLowerCase().includes(q) || v.skills.some((s) => s.toLowerCase().includes(q)))
    );
  });

  function openNew() {
    setEditing(EMPTY);
    setModalOpen(true);
  }

  function openEdit(v: Vaga) {
    setEditing(v);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  async function handleSave(data: Omit<Vaga, "id"> & { id?: string }) {
    setSaving(true);
    setError("");
    try {
      if (data.id) {
        const updated: Vaga = await api.updateVaga(data.id, data);
        setVagas((prev) => prev.map((v) => v.id === updated.id ? updated : v));
      } else {
        const created: Vaga = await api.createVaga(data);
        setVagas((prev) => [...prev, created]);
      }
      closeModal();
    } catch {
      setError("Erro ao salvar a vaga. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover esta vaga?")) return;
    try {
      await api.deleteVaga(id);
      setVagas((prev) => prev.filter((v) => v.id !== id));
    } catch {
      setError("Erro ao remover a vaga.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vagas"
        subtitle="Gestão de vagas abertas e em andamento"
        actions={
          <Button variant="primary" size="sm" onClick={openNew}>+ Nova vaga</Button>
        }
      />

      {error && (
        <p className="rounded-lg px-3 py-2 text-xs bg-red-50 text-red-600 border border-red-100">{error}</p>
      )}

      {/* Filtros */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-card px-5 py-4 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === s
                  ? "bg-pink text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex-1">
          <input
            placeholder="Buscar por título, time, área ou skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-md px-3 py-1.5 outline-none focus:border-pink focus:shadow-focus-pink bg-white text-slate-900"
          />
        </div>

        <span className="text-xs text-slate-400 shrink-0">
          {filtered.length} vaga{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid de cards */}
      {loading ? (
        <p className="text-sm text-slate-400">Carregando...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl shadow-card py-16 text-center">
          <p className="text-slate-400 text-sm">
            {vagas.length === 0 ? "Nenhuma vaga cadastrada ainda." : "Nenhuma vaga encontrada."}
          </p>
          {vagas.length === 0 && (
            <button onClick={openNew} className="mt-4 text-sm text-pink font-medium hover:underline">
              Cadastrar primeira vaga →
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((v) => (
            <VagaCard key={v.id} vaga={v} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && editing && (
        <VagaModal
          initial={editing}
          saving={saving}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
