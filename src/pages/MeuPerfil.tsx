import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  photoUrl: z.string().optional(),
  cargo: z.string().min(1, "Obrigatório"),
  area: z.string().min(1, "Obrigatório"),
  sobre: z.string().optional(),
  prontidaoStack: z.string().optional(),
  alocacaoStatus: z.string().min(1, "Obrigatório"),
  nivelMentoria: z.coerce.number().min(1).max(4).optional(),
  experienceYears: z.coerce.number().optional(),
  codeReviewAtuacao: z.string().optional(),
  autonomia: z.string().optional(),
  trilhaCarreira: z.string().optional(),
  certificacoesCount: z.string().optional(),
  nivelAcompanhamento: z.string().min(1, "Obrigatório"),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  skills: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const AREA_OPTIONS = [
  { value: "", label: "Selecione..." },
  { value: "Frontend", label: "Frontend" },
  { value: "Backend", label: "Backend" },
  { value: "Fullstack", label: "Fullstack" },
  { value: "Mobile", label: "Mobile" },
  { value: "Outros (QA, DevOps, Dados)", label: "Outros (QA, DevOps, Dados)" },
];

const PRONTIDAO_OPTIONS = [
  { value: "", label: "Selecione..." },
  { value: "Especialista — foco total na stack atual, sem interesse em mudar", label: "Especialista — foco total na stack atual" },
  { value: "Adaptável — conheço as bases, levaria 3–6 meses para performar em outra stack", label: "Adaptável — 3–6 meses para outra stack" },
  { value: "Poliglota — já domino múltiplas stacks e transito entre elas", label: "Poliglota — domino múltiplas stacks" },
  { value: "Explorador — estudando novas tecnologias para transição", label: "Explorador — em transição" },
];

const ALOCACAO_OPTIONS = [
  { value: "", label: "Selecione..." },
  { value: "Alocado Integral (100%)", label: "Alocado Integral (100%)" },
  { value: "Alocado Parcial", label: "Alocado Parcial" },
  { value: "Disponível (Bench)", label: "Disponível (Bench)" },
  { value: "Em Transição (saindo de projeto)", label: "Em Transição (saindo de projeto)" },
];

const AUTONOMIA_OPTIONS = [
  { value: "", label: "Selecione..." },
  { value: "Baixa — preciso de orientações detalhadas", label: "Baixa — preciso de orientações detalhadas" },
  { value: "Média — executo bem, mas dependo de validações", label: "Média — dependo de validações" },
  { value: "Alta — sou autônomo e resolvo impedimentos sozinho", label: "Alta — autônomo" },
  { value: "Proativa — além de autônomo, proponho melhorias em processos e arquitetura", label: "Proativa — proponho melhorias" },
];

const TRILHA_OPTIONS = [
  { value: "", label: "Selecione..." },
  { value: "Especialista Técnico (Carreira em Y)", label: "Especialista Técnico (Carreira em Y)" },
  { value: "Liderança de Pessoas (Gestão)", label: "Liderança de Pessoas (Gestão)" },
  { value: "Produto / Negócio (Product Engineer)", label: "Produto / Negócio" },
  { value: "Generalista", label: "Generalista" },
];

const CERT_OPTIONS = [
  { value: "", label: "Selecione..." },
  { value: "Nenhum", label: "Nenhum" },
  { value: "1 a 2", label: "1 a 2" },
  { value: "3 a 5", label: "3 a 5" },
  { value: "Mais de 5", label: "Mais de 5" },
];

const ACOMPANHAMENTO_OPTIONS = [
  { value: "", label: "Selecione..." },
  { value: "Independente — me organizo bem, check-ins pontuais são suficientes", label: "Independente — check-ins pontuais" },
  { value: "Padrão — acompanhamento regular de sprint/ciclo atende minhas necessidades", label: "Padrão — acompanhamento de sprint" },
  { value: "Próximo — prefiro contato mais frequente para alinhar direção e prioridades", label: "Próximo — contato frequente" },
  { value: "Intensivo — estou em adaptação ou momento de desafio, preciso de suporte frequente", label: "Intensivo — suporte frequente" },
];

const MENTORIA_OPTIONS = [
  { value: "1", label: "1 — Nunca / Individual" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4 — Constantemente / Referência" },
];

const CODE_REVIEW_OPTIONS = [
  { value: "", label: "Selecione..." },
  { value: "Recebo feedback — ainda não reviso PRs de outros", label: "Recebo feedback — ainda não reviso PRs de outros" },
  { value: "Reviso PRs do squad com feedback técnico qualificado", label: "Reviso PRs do squad com feedback técnico" },
  { value: "Defino padrões de review e identifico riscos de design", label: "Defino padrões de review e identifico riscos de design" },
];

const EXPERIENCE_OPTIONS = [
  { value: "", label: "Selecione..." },
  { value: "0", label: "Menos de 1 ano" },
  { value: "1", label: "1 a 2 anos" },
  { value: "3", label: "3 a 5 anos" },
  { value: "6", label: "6 anos ou mais" },
];

export default function MeuPerfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    api.getMyProfile()
      .then((p) => {
        setProfile(p);
        reset({
          photoUrl: p.photoUrl ?? "",
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
          experienceYears: p.experienceYears ?? "",
          codeReviewAtuacao: p.codeReviewAtuacao ?? "",
          linkedinUrl: p.linkedinUrl ?? "",
          githubUrl: p.githubUrl ?? "",
          skills: p.skills?.map((ps: any) => ps.skill?.name).join(", ") ?? "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reset]);

  async function onSubmit(data: FormData) {
    const skillList = (data.skills ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({ name, level: "Intermediário" }));

    const result = await api.submitProfile({ ...data, skills: skillList });
    setProfile(result);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const isAtivo = profile?.status === "ATIVO";
  const isPendente = profile?.status === "PENDENTE";

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="bg-white border-b border-gray-200 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-1.5">
          <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, color: "var(--sidebar-bg)", fontSize: 18 }}>VILT</span>
          <span style={{ color: "var(--pink)", fontSize: 18, fontWeight: 900 }}>›</span>
          <span className="text-sm text-gray-400 ml-2">Meu Perfil</span>
        </div>
        <div className="flex items-center gap-4">
          {profile && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isAtivo ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
              {isAtivo ? "Ativo no banco de talentos" : "Aguardando revisão"}
            </span>
          )}
          <span className="text-sm text-gray-500">{user?.name}</span>
          <Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/login"); }}>Sair</Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-gray-400 text-sm">Carregando...</p>
        ) : isPendente || isAtivo ? (
          <ProfileReadOnly profile={profile} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

            {/* Seção 1 — Identificação */}
            <Section title="Identificação" subtitle="Dados que vão aparecer no seu card.">
              <Input label="URL da foto de perfil" placeholder="https://..." {...register("photoUrl")} />
              <Input label="Cargo / Função atual *" placeholder="Ex: Backend Developer, Data Scientist..." {...register("cargo")} error={errors.cargo?.message} />
            </Section>

            {/* Seção 2 — Perfil Técnico */}
            <Section title="Perfil Técnico">
              <Select label="Área de atuação *" options={AREA_OPTIONS} {...register("area")} error={errors.area?.message} />
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Skills e tecnologias *</label>
                <textarea
                  placeholder="Liste suas principais skills separadas por vírgula. Ex: Java, Spring Boot, Docker, SQL"
                  rows={3}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none bg-white border border-gray-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-none"
                  {...register("skills")}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Sobre você</label>
                <textarea
                  placeholder="Um parágrafo curto descrevendo sua experiência e foco de atuação."
                  rows={3}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none bg-white border border-gray-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-none"
                  {...register("sobre")}
                />
              </div>
              <Select label="Anos de experiência na área *" options={EXPERIENCE_OPTIONS} {...register("experienceYears")} />
              <Select label="Prontidão para atuar em stack diferente" options={PRONTIDAO_OPTIONS} {...register("prontidaoStack")} />
            </Section>

            {/* Seção 3 — Alocação e Potencial */}
            <Section title="Alocação e Potencial">
              <Select label="Situação atual de alocação *" options={ALOCACAO_OPTIONS} {...register("alocacaoStatus")} error={errors.alocacaoStatus?.message} />
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">
                  Com que frequência você atua como mentor ou referência técnica?
                </label>
                <div className="flex gap-3">
                  {MENTORIA_OPTIONS.map((o) => (
                    <label key={o.value} className="flex-1 cursor-pointer">
                      <input type="radio" value={o.value} {...register("nivelMentoria")} className="sr-only peer" />
                      <div className="text-center py-2 px-1 rounded-lg border border-gray-200 text-xs text-gray-500 peer-checked:border-pink-500 peer-checked:bg-pink-50 peer-checked:text-pink-600 transition-all">
                        {o.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <Select label="Autonomia na entrega ponta a ponta" options={AUTONOMIA_OPTIONS} {...register("autonomia")} />
              <Select label="Principal foco de crescimento no próximo ciclo" options={TRILHA_OPTIONS} {...register("trilhaCarreira")} />
              <Select label="Certificações concluídas nos últimos 12 meses" options={CERT_OPTIONS} {...register("certificacoesCount")} />
              <Select label="Nível de acompanhamento necessário *" options={ACOMPANHAMENTO_OPTIONS} {...register("nivelAcompanhamento")} error={errors.nivelAcompanhamento?.message} />
              <Select label="Atuação em code review" options={CODE_REVIEW_OPTIONS} {...register("codeReviewAtuacao")} />
            </Section>

            {/* Links */}
            <Section title="Links">
              <Input label="LinkedIn" placeholder="https://linkedin.com/in/..." {...register("linkedinUrl")} />
              <Input label="GitHub" placeholder="https://github.com/..." {...register("githubUrl")} />
            </Section>

            <div className="flex items-center gap-3 pb-8">
              <Button type="submit" loading={isSubmitting} size="lg">
                Enviar perfil
              </Button>
              {saved && <span className="text-sm text-green-600 font-medium">Enviado ✓</span>}
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

function ProfileReadOnly({ profile }: { profile: any }) {
  const isAtivo = profile.status === "ATIVO";
  const nivel = profile.nivelOverride ?? profile.nivel;
  const nivelStyle: Record<string, { color: string; bg: string }> = {
    Sr: { color: "#92400e", bg: "#fef3c7" },
    Pleno: { color: "#065f46", bg: "#d1fae5" },
    Jr: { color: "#1e40af", bg: "#dbeafe" },
  };
  const ns = nivel ? nivelStyle[nivel] : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>
            {isAtivo ? "Seu perfil está ativo no banco de talentos 🎉" : "Perfil enviado — aguardando revisão do RH"}
          </h2>
          <div className="flex items-center gap-2">
            {ns && nivel && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: ns.bg, color: ns.color }}>{nivel}</span>
            )}
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isAtivo ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
              {isAtivo ? "Ativo" : "Em análise"}
            </span>
          </div>
        </div>
        {!isAtivo && <p className="text-sm text-gray-400 mt-1">O RH irá revisar suas respostas e ativar seu perfil em breve.</p>}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Suas respostas</p>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <ReadField label="Cargo" value={profile.cargo} />
          <ReadField label="Área" value={profile.area} />
          <ReadField label="Alocação" value={profile.alocacaoStatus} />
          <ReadField label="Autonomia" value={profile.autonomia} />
          <ReadField label="Trilha de carreira" value={profile.trilhaCarreira} />
          <ReadField label="Certificações (12m)" value={profile.certificacoesCount} />
          <ReadField label="Prontidão de stack" value={profile.prontidaoStack} />
          <ReadField label="Acompanhamento" value={profile.nivelAcompanhamento} />
          {profile.nivelMentoria && <ReadField label="Frequência de mentoria" value={`${profile.nivelMentoria}/4`} />}
          {profile.experienceYears != null && <ReadField label="Anos de experiência" value={profile.experienceYears >= 6 ? "6 anos ou mais" : profile.experienceYears >= 3 ? "3 a 5 anos" : profile.experienceYears >= 1 ? "1 a 2 anos" : "Menos de 1 ano"} />}
          <ReadField label="Code review" value={profile.codeReviewAtuacao} />
        </div>
        {profile.sobre && (
          <div className="px-6 pb-5">
            <p className="text-xs text-gray-400 mb-1">Sobre você</p>
            <p className="text-sm text-gray-700 leading-relaxed">{profile.sobre}</p>
          </div>
        )}
        {profile.skills?.length > 0 && (
          <div className="px-6 pb-5">
            <p className="text-xs text-gray-400 mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((ps: any, i: number) => (
                <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600">{ps.skill?.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReadField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-gray-700">{value}</p>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800" style={{ fontFamily: "var(--font-syne)" }}>{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-6 py-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}
