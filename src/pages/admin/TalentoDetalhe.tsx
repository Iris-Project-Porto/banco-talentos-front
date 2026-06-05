import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Avatar, Input, Select, Section } from "@/components/ui";
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


export default function TalentoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const {
    profile, form, stacks, saving, saved, loading,
    setStacks, updateField, handleAddSoftSkill, handleRemoveSoftSkill, handleSave
  } = useTalentoDetalhe(id);

  const [selectedSoftSkill, setSelectedSoftSkill] = useState("");
  const [selectedSoftLevel, setSelectedSoftLevel] = useState<number | "">("");

  if (loading || !profile) {
    return <p className="text-gray-400 text-sm">Carregando...</p>;
  }

  const isPendente = profile.status === "PENDENTE";
  const nivel = form.nivelOverride || profile.nivel;
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link
          to={isPendente ? "/admin/fila" : "/admin/talentos"}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← {isPendente ? "Fila de revisão" : "Voltar"}
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
        <Avatar name={profile.user?.name ?? "?"} photoUrl={profile.photoUrl} size={56} />

        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>
                {profile.user?.name}
              </h1>
              <p className="text-sm text-gray-400">{profile.user?.email}</p>
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
            </div>
          </div>
          {expLabel && <p className="text-xs text-gray-400 mt-1">{expLabel} de experiência</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="flex flex-col gap-4">
          <Section title="Identificação Corporativa">
            <Input label="Matrícula" value={form.registrationNumber} onChange={(e) => updateField("registrationNumber", e.target.value)} placeholder="Matrícula" />
            <Select label="Status da Matrícula" value={form.registrationStatus} onChange={(e) => updateField("registrationStatus", e.target.value)} options={REGISTRATION_STATUS_OPTIONS} />
          </Section>

          <Section title="Override de nível">
            <Select value={form.nivelOverride} onChange={(e) => updateField("nivelOverride", e.target.value)} options={NIVEL_OPTIONS} />
          </Section>

          <Section title="Alocação e carreira">
            <Select label="Situação de alocação" value={form.alocacaoStatus} onChange={(e) => updateField("alocacaoStatus", e.target.value)} options={ALOCACAO_OPTIONS} />
            <Select label="Trilha de carreira" value={form.trilhaCarreira} onChange={(e) => updateField("trilhaCarreira", e.target.value)} options={TRILHA_OPTIONS} />
          </Section>

          <Section title="Identificação">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Área" value={form.area} onChange={(e) => updateField("area", e.target.value)} options={[{ value: "", label: "-" }, ...AREA_OPTIONS]} />
              <Select label="Anos de exp." value={String(form.experienceYears)} onChange={(e) => updateField("experienceYears", e.target.value)} options={[{ value: "", label: "-" }, ...EXPERIENCE_OPTIONS]} />
            </div>
            <div className="mt-2">
              <label className="text-xs text-gray-400 block mb-1">Sobre</label>
              <textarea
                value={form.sobre}
                onChange={(e) => updateField("sobre", e.target.value)}
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
              <Button
                type="button"
                variant="primary"
                onClick={() => handleSave(true)}
                loading={saving}
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar e Ativar →"}
              </Button>
            )}

            <Button
              type="button"
              variant={isPendente ? "secondary" : "primary"}
              onClick={() => handleSave(false)}
              loading={saving}
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>

            {saved && <span className="text-sm text-green-600 font-medium">Salvo ✓</span>}
          </div>
        </div>
      </div>
    </div>
  );
}