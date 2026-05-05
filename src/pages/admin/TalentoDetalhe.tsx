import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";

const NIVEL_OPTIONS = ["", "Jr", "Pleno", "Sr"];
const NIVEL_STYLE: Record<string, { color: string; bg: string }> = {
  Sr:    { color: "#92400e", bg: "#fef3c7" },
  Pleno: { color: "#065f46", bg: "#d1fae5" },
  Jr:    { color: "#1e40af", bg: "#dbeafe" },
};

const AREA_OPTIONS = ["Frontend", "Backend", "Fullstack", "Mobile", "Dados & BI", "Inovação", "Tecnologia", "Outros (QA, DevOps, Dados)"];
const ALOCACAO_OPTIONS = ["Alocado Integral (100%)", "Alocado Parcial", "Disponível (Bench)", "Em Transição (saindo de projeto)"];
const AUTONOMIA_OPTIONS = [
  "Baixa — preciso de orientações detalhadas",
  "Média — executo bem, mas dependo de validações",
  "Alta — sou autônomo e resolvo impedimentos sozinho",
  "Proativa — além de autônomo, proponho melhorias em processos e arquitetura",
];
const TRILHA_OPTIONS = ["Especialista Técnico (Carreira em Y)", "Liderança de Pessoas (Gestão)", "Produto / Negócio (Product Engineer)", "Generalista"];
const CERT_OPTIONS = ["Nenhum", "1 a 2", "3 a 5", "Mais de 5"];
const CODE_REVIEW_OPTIONS = [
  "Recebo feedback — ainda não reviso PRs de outros",
  "Reviso PRs do squad com feedback técnico qualificado",
  "Defino padrões de review e identifico riscos de design",
];

const ACOMPANHAMENTO_OPTIONS = [
  "Independente — me organizo bem, check-ins pontuais são suficientes",
  "Padrão — acompanhamento regular de sprint/ciclo atende minhas necessidades",
  "Próximo — prefiro contato mais frequente para alinhar direção e prioridades",
  "Intensivo — estou em adaptação ou momento de desafio, preciso de suporte frequente",
];
const PRONTIDAO_OPTIONS = [
  "Especialista — foco total na stack atual, sem interesse em mudar",
  "Adaptável — conheço as bases, levaria 3–6 meses para performar em outra stack",
  "Poliglota — já domino múltiplas stacks e transito entre elas",
  "Explorador — estudando novas tecnologias para transição",
];

function Avatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const colors = ["#e91e8c","#6366f1","#0ea5e9","#10b981","#f59e0b"];
  const color = colors[name.charCodeAt(0) % colors.length];
  if (photoUrl) return <img src={photoUrl} alt={name} className="w-14 h-14 rounded-full object-cover" />;
  return (
    <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
         style={{ background: color }}>{initials}</div>
  );
}

export default function TalentoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getProfileById(id!).then((p: any) => {
      setProfile(p);
      setForm({
        cargo: p.cargo ?? "",
        area: p.area ?? "",
        sobre: p.sobre ?? "",
        prontidaoStack: p.prontidaoStack ?? "",
        alocacaoStatus: p.alocacaoStatus ?? "",
        nivelMentoria: p.nivelMentoria ?? 1,
        autonomia: p.autonomia ?? "",
        trilhaCarreira: p.trilhaCarreira ?? "",
        certificacoesCount: p.certificacoesCount ?? "",
        nivelAcompanhamento: p.nivelAcompanhamento ?? "",
        codeReviewAtuacao: p.codeReviewAtuacao ?? "",
        linkedinUrl: p.linkedinUrl ?? "",
        githubUrl: p.githubUrl ?? "",
        nivelOverride: p.nivelOverride ?? "",
        skills: p.skills?.map((ps: any) => ps.skill?.name).join(", ") ?? "",
      });
    }).catch(() => {});
  }, [id]);

  function set(field: string, value: any) {
    setForm((f: any) => ({ ...f, [field]: value }));
  }

  async function handleSave(activate = false) {
    setSaving(true);
    const skillList = (form.skills ?? "")
      .split(",").map((s: string) => s.trim()).filter(Boolean)
      .map((name: string) => ({ name, level: "Intermediário" }));

    const payload: any = {
      ...form,
      nivelOverride: form.nivelOverride || null,
      skills: skillList,
    };
    if (activate) payload.status = "ATIVO";

    const updated = await api.updateProfile(id!, payload);
    setProfile(updated);
    setSaving(false);
    if (activate) {
      navigate("/admin/talentos");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  if (!profile) return <p className="text-gray-400 text-sm">Carregando...</p>;

  const isPendente = profile.status === "PENDENTE";
  const nivel = form.nivelOverride || profile.nivel;
  const ns = nivel ? NIVEL_STYLE[nivel] : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link to={isPendente ? "/admin/fila" : "/admin/talentos"}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← {isPendente ? "Fila de revisão" : "People"}
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-start gap-4">
        <Avatar name={profile.user?.name ?? "?"} photoUrl={profile.photoUrl} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>
                {profile.user?.name}
              </h1>
              <p className="text-sm text-gray-400">{profile.user?.email}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {ns && nivel && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: ns.bg, color: ns.color }}>{nivel}</span>
              )}
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isPendente ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                {isPendente ? "Pendente" : "Ativo"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Coluna esquerda */}
        <div className="flex flex-col gap-4">
          <Section title="Avaliação IA">
            {profile.nivel && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Nível sugerido:</span>
                {(() => { const s = NIVEL_STYLE[profile.nivel]; return s ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: s.bg, color: s.color }}>
                    {profile.nivel === "Jr" ? "Júnior" : profile.nivel === "Sr" ? "Sênior" : "Pleno"}
                  </span>
                ) : null; })()}
              </div>
            )}
            {profile.nivelScore != null && profile.nivelScore > 0 && (
              <p className="text-sm text-gray-600">Score: <strong>{profile.nivelScore}</strong></p>
            )}
            {profile.nivelJustificativa && profile.nivelJustificativa !== "Avaliação pendente." && (
              <p className="text-xs text-gray-400 leading-relaxed">{profile.nivelJustificativa}</p>
            )}
            {(!profile.nivel || profile.nivelJustificativa === "Avaliação pendente.") && (
              <p className="text-xs text-gray-400">IA indisponível — defina o nível manualmente abaixo.</p>
            )}
          </Section>

          <Section title="Override de nível">
            <select value={form.nivelOverride} onChange={(e) => set("nivelOverride", e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-pink-400 bg-white">
              {NIVEL_OPTIONS.map((v) => (
                <option key={v} value={v}>{v === "" ? "Manter avaliação IA" : v}</option>
              ))}
            </select>
          </Section>

          <Section title="Skills">
            <textarea
              value={form.skills}
              onChange={(e) => set("skills", e.target.value)}
              rows={4}
              placeholder="Java, Spring Boot, Docker..."
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-pink-400 resize-none bg-white"
            />
            <p className="text-xs text-gray-400 mt-1">Separe por vírgula</p>
          </Section>

          <Section title="Links">
            <EditField label="LinkedIn" value={form.linkedinUrl} onChange={(v) => set("linkedinUrl", v)} placeholder="https://linkedin.com/in/..." />
            <EditField label="GitHub" value={form.githubUrl} onChange={(v) => set("githubUrl", v)} placeholder="https://github.com/..." />
          </Section>
        </div>

        {/* Coluna direita */}
        <div className="col-span-2 flex flex-col gap-4">
          <Section title="Identificação">
            <div className="grid grid-cols-2 gap-4">
              <EditField label="Cargo / Função" value={form.cargo} onChange={(v) => set("cargo", v)} />
              <SelectField label="Área" value={form.area} onChange={(v) => set("area", v)} options={AREA_OPTIONS} />
            </div>
            <div className="mt-2">
              <label className="text-xs text-gray-400 block mb-1">Sobre</label>
              <textarea
                value={form.sobre}
                onChange={(e) => set("sobre", e.target.value)}
                rows={3}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-pink-400 resize-none bg-white"
              />
            </div>
          </Section>

          <Section title="Perfil Técnico e Alocação">
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Prontidão de stack" value={form.prontidaoStack} onChange={(v) => set("prontidaoStack", v)} options={PRONTIDAO_OPTIONS} />
              <SelectField label="Situação de alocação" value={form.alocacaoStatus} onChange={(v) => set("alocacaoStatus", v)} options={ALOCACAO_OPTIONS} />
              <SelectField label="Autonomia" value={form.autonomia} onChange={(v) => set("autonomia", v)} options={AUTONOMIA_OPTIONS} />
              <SelectField label="Trilha de carreira" value={form.trilhaCarreira} onChange={(v) => set("trilhaCarreira", v)} options={TRILHA_OPTIONS} />
              <SelectField label="Certificações (12m)" value={form.certificacoesCount} onChange={(v) => set("certificacoesCount", v)} options={CERT_OPTIONS} />
              <SelectField label="Nível de acompanhamento" value={form.nivelAcompanhamento} onChange={(v) => set("nivelAcompanhamento", v)} options={ACOMPANHAMENTO_OPTIONS} />
              <SelectField label="Code Review" value={form.codeReviewAtuacao} onChange={(v) => set("codeReviewAtuacao", v)} options={CODE_REVIEW_OPTIONS} />
            </div>
            <div className="mt-2">
              <label className="text-xs text-gray-400 block mb-2">Frequência de mentoria (1–4)</label>
              <div className="flex gap-2">
                {[1,2,3,4].map((n) => (
                  <button key={n} type="button"
                          onClick={() => set("nivelMentoria", n)}
                          className={`flex-1 py-2 rounded-lg text-sm border transition-all ${form.nivelMentoria === n ? "border-pink-500 bg-pink-50 text-pink-600 font-medium" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* Ações */}
          <div className="flex items-center gap-3">
            {isPendente && (
              <button onClick={() => handleSave(true)} disabled={saving}
                      className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
                      style={{ background: saving ? "#166534" : "#16a34a" }}>
                {saving ? "Salvando..." : "Salvar e Ativar →"}
              </button>
            )}
            <button onClick={() => handleSave(false)} disabled={saving}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:border-gray-300 transition-colors bg-white">
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
            {saved && <span className="text-sm text-green-600 font-medium">Salvo ✓</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</p>
      </div>
      <div className="p-5 flex flex-col gap-3">{children}</div>
    </div>
  );
}

function EditField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs text-gray-400 block mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
             className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-pink-400 bg-white" />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-xs text-gray-400 block mb-1">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-pink-400 bg-white">
        <option value="">—</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
