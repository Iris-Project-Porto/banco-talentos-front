import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { StackInput, type StackItem } from "@/components/ui/StackInput";

const NIVEL_OPTIONS = ["Jr", "Pleno", "Sr"];
const NIVEL_STYLE: Record<string, { color: string; bg: string }> = {
  Sr: { color: "#92400e", bg: "#fef3c7" },
  Pleno: { color: "#065f46", bg: "#d1fae5" },
  Jr: { color: "#1e40af", bg: "#dbeafe" },
};

const SOFTSKILLS_LIST = [
  "Comprometimento e engajamento",
  "Proatividade",
  "Comunicação técnica para negócio",
  "Comunicação assertiva",
  "Organização e prioridades",
  "Trabalho em equipe e colaboração",
  "Gestão do tempo e prazos",
  "Resolução de problemas",
  "Pensamento crítico e cenários",
  "Aderência a processos e padrões",
  "Transparência (impedimentos)",
  "Foco em resultados",
  "Senso de dono (ownership)",
  "Adaptabilidade e flexibilidade",
  "Disponibilidade no chat",
];

const AREA_OPTIONS = [
  "Frontend", "Backend", "Fullstack", "Mobile", "QA", "DevOps", "Infra",
  "Outros",
];
const ALOCACAO_OPTIONS = [
  "Alocado Integral (100%)",
  "Alocado Parcial",
  "Disponível (Bench)",
  "Em Transição (saindo de projeto)",
];
const TRILHA_OPTIONS = [
  "Especialista Técnico (Carreira em Y)",
  "Liderança de Pessoas (Gestão)",
  "Produto / Negócio (Product Engineer)",
  "Generalista",
];
const EXPERIENCE_OPTIONS = [
  { value: "0", label: "Menos de 1 ano" },
  { value: "1", label: "1 a 2 anos" },
  { value: "3", label: "3 a 5 anos" },
  { value: "6", label: "6 anos ou mais" },
];

function Avatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const colors = ["#e91e8c", "#6366f1", "#0ea5e9", "#10b981", "#f59e0b"];
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
  const [stacks, setStacks] = useState<StackItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Estados temporários para adicionar Soft Skills
  const [selectedSoftSkill, setSelectedSoftSkill] = useState("");
  const [selectedSoftLevel, setSelectedSoftLevel] = useState<number | "">("");

  useEffect(() => {
    api.getProfileById(id!).then((p: any) => {
      setProfile(p);
      setForm({
        area: p.area ?? "",
        sobre: p.sobre ?? "",
        alocacaoStatus: p.alocacaoStatus ?? "",
        trilhaCarreira: p.trilhaCarreira ?? "",
        experienceYears: p.experienceYears ?? "",
        linkedinUrl: p.linkedinUrl ?? "",
        githubUrl: p.githubUrl ?? "",
        nivelOverride: p.nivelOverride ?? "",
        softSkills: p.softSkills ?? {},
        registrationNumber: p.registrationNumber ?? "",
        registrationStatus: p.registrationStatus ?? "NOT_REQUESTED",
      });
      // Populate stacks with level
      if (p.skills?.length) {
        setStacks(
          p.skills.map((ps: any) => ({
            name: ps.skill?.name ?? ps.name ?? "",
            level: typeof ps.level === "number" ? ps.level : 5,
          }))
        );
      }
    }).catch(() => { });
  }, [id]);

  function set(field: string, value: any) {
    setForm((f: any) => ({ ...f, [field]: value }));
  }

  function handleAddSoftSkill() {
    if (selectedSoftSkill && selectedSoftLevel) {
      setForm((f: any) => ({
        ...f,
        softSkills: {
          ...f.softSkills,
          [selectedSoftSkill]: Number(selectedSoftLevel),
        },
      }));
      setSelectedSoftSkill("");
      setSelectedSoftLevel("");
    }
  }

  function handleRemoveSoftSkill(skillName: string) {
    setForm((f: any) => {
      const updated = { ...f.softSkills };
      delete updated[skillName];
      return { ...f, softSkills: updated };
    });
  }

  async function handleSave(activate = false) {
    setSaving(true);
    const skillList = stacks.map((s) => ({ name: s.name, level: s.level }));

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

  const expLabel = EXPERIENCE_OPTIONS.find(
    (o) => String(o.value) === String(form.experienceYears)
  )?.label ?? "";

  // Filtra as soft skills que ainda não foram adicionadas
  const availableSoftSkills = SOFTSKILLS_LIST.filter(
    (skill) => !(form.softSkills && form.softSkills[skill])
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link to={isPendente ? "/admin/fila" : "/admin/talentos"}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← {isPendente ? "Fila de revisão" : "Voltar"}
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
              {form.area && (
                <p className="text-sm text-gray-500 mt-0.5">{form.area}</p>
              )}
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
          {expLabel && (
            <p className="text-xs text-gray-400 mt-1">{expLabel} de experiência</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Coluna esquerda */}
        <div className="flex flex-col gap-4">
          <Section title="Identificação Corporativa">
            <div className="flex flex-col gap-4">
              <EditField label="Matrícula" value={form.registrationNumber} onChange={(v) => set("registrationNumber", v)} placeholder="Matrícula" />
              <SelectField
                label="Status da Matrícula"
                value={form.registrationStatus}
                onChange={(v) => set("registrationStatus", v)}
                options={["NÃO SOLICITADO", "SOLICITADO", "AGUARDANDO APROVAÇÃO", "APROVADO", "RECUSADO"]}
                optionValues={["NOT_REQUESTED", "REQUESTED", "AWAITING_APPROVAL", "APPROVED", "REJECTED"]}
              />
            </div>
          </Section>

          <Section title="Override de nível">
            <select value={form.nivelOverride} onChange={(e) => set("nivelOverride", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-pink-400 bg-white">
              {NIVEL_OPTIONS.map((v) => (
                <option key={v} value={v}>{v === "" ? "Manter avaliação IA" : v}</option>
              ))}
            </select>
          </Section>

          <Section title="Alocação e carreira">
            <SelectField
              label="Situação de alocação"
              value={form.alocacaoStatus}
              onChange={(v) => set("alocacaoStatus", v)}
              options={ALOCACAO_OPTIONS}
            />
            <SelectField
              label="Trilha de carreira"
              value={form.trilhaCarreira}
              onChange={(v) => set("trilhaCarreira", v)}
              options={TRILHA_OPTIONS}
            />
          </Section>

          <Section title="Identificação">
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Área" value={form.area} onChange={(v) => set("area", v)} options={AREA_OPTIONS} />
              <SelectField
                label="Anos de exp."
                value={String(form.experienceYears)}
                onChange={(v) => set("experienceYears", v)}
                options={EXPERIENCE_OPTIONS.map((o) => o.label)}
                optionValues={EXPERIENCE_OPTIONS.map((o) => o.value)}
              />
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

          <Section title="Links">
            <EditField label="LinkedIn" value={form.linkedinUrl} onChange={(v) => set("linkedinUrl", v)} placeholder="https://linkedin.com/in/..." />
            <EditField label="GitHub" value={form.githubUrl} onChange={(v) => set("githubUrl", v)} placeholder="https://github.com/..." />
          </Section>
        </div>

        {/* Coluna direita */}
        <div className="col-span-2 flex flex-col gap-4">
          <Section title="Stack tecnológica">
            <StackInput value={stacks} onChange={setStacks} />
          </Section>

          <Section title="Avaliação de Soft Skills (Admin)">
            {/* Legenda */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-5">
              <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">Legenda da Escala (1 a 10)</p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li><strong className="text-slate-700">1 a 3</strong> — Em desenvolvimento inicial, requer apoio frequente</li>
                <li><strong className="text-slate-700">4 a 6</strong> — Pratica com regularidade, ainda em aprimoramento</li>
                <li><strong className="text-slate-700">7 a 8</strong> — Domínio e aplicação de forma consistente</li>
                <li><strong className="text-slate-700">9 a 10</strong> — Referência no time, capaz de orientar outros</li>
              </ul>
            </div>

            {/* Inputs de Adicionar */}
            <div className="flex items-end gap-3 mb-2">
              <div className="flex-1">
                <label className="text-xs text-gray-400 block mb-1">Soft Skill</label>
                <select
                  value={selectedSoftSkill}
                  onChange={(e) => setSelectedSoftSkill(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-pink-400 bg-white"
                >
                  <option value="">Selecione uma skill...</option>
                  {availableSoftSkills.map((skill) => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
              <div className="w-32">
                <label className="text-xs text-gray-400 block mb-1">Nota (1 a 10)</label>
                <select
                  value={selectedSoftLevel}
                  onChange={(e) => setSelectedSoftLevel(Number(e.target.value) || "")}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-pink-400 bg-white"
                >
                  <option value="">—</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddSoftSkill}
                disabled={!selectedSoftSkill || !selectedSoftLevel}
                className="px-4 py-2 bg-slate-100 text-slate-600 font-medium text-sm rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Adicionar
              </button>
            </div>

            {/* Lista de Soft Skills Adicionadas */}
            {form.softSkills && Object.keys(form.softSkills).length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                {Object.entries(form.softSkills).map(([skill, level]) => (
                  <div key={skill} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-2">
                    <span className="text-sm font-medium text-slate-700">{skill}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-pink">{String(level)} / 10</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSoftSkill(skill)}
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
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-3 border-b border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</p>
      </div>
      <div className="p-5 flex flex-col gap-3">{children}</div>
    </div>
  );
}

function EditField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-gray-400 block mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-pink-400 bg-white" />
    </div>
  );
}

function SelectField({ label, value, onChange, options, optionValues }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  optionValues?: string[];
}) {
  return (
    <div>
      <label className="text-xs text-gray-400 block mb-1">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-pink-400 bg-white">
        <option value="">—</option>
        {options.map((o, i) => (
          <option key={o} value={optionValues ? optionValues[i] : o}>{o}</option>
        ))}
      </select>
    </div>
  );
}