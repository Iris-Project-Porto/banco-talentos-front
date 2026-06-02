import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { StackInput, type StackItem } from "@/components/ui/StackInput";

const schema = z.object({
  photoUrl: z.string().optional(),
  area: z.string().min(1, "Obrigatório"),
  sobre: z.string().optional(),
  experienceYears: z.coerce.number().optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  registrationNumber: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const AREA_OPTIONS = [
  { value: "", label: "Selecione..." },
  { value: "Frontend", label: "Frontend" },
  { value: "Backend", label: "Backend" },
  { value: "Fullstack", label: "Fullstack" },
  { value: "Mobile", label: "Mobile" },
  { value: "QA", label: "QA" },
  { value: "DevOps", label: "DevOps" },
  { value: "Infra", label: "Infra" },
  { value: "Outros", label: "Outros" },
];

const EXPERIENCE_OPTIONS = [
  { value: "", label: "Selecione..." },
  { value: "0", label: "Menos de 1 ano" },
  { value: "1", label: "1 a 2 anos" },
  { value: "3", label: "3 a 5 anos" },
  { value: "6", label: "6 anos ou mais" },
];

export default function MeuPerfil() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [stacks, setStacks] = useState<StackItem[]>([]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    api.getMyProfile()
      .then((p) => {
        setProfile(p);
        reset({
          photoUrl: p.photoUrl ?? "",
          area: p.area ?? "",
          sobre: p.sobre ?? "",
          experienceYears: p.experienceYears ?? "",
          linkedinUrl: p.linkedinUrl ?? "",
          githubUrl: p.githubUrl ?? "",
          registrationNumber: p.registrationNumber ?? "",
        });
        if (p.skills?.length) {
          setStacks(
            p.skills.map((ps: any) => ({
              name: ps.skill?.name ?? ps.name ?? "",
              level: typeof ps.level === "number" ? ps.level : 5,
            }))
          );
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) {
        } else if (err.response?.status === 401) {
          console.error("Token inválido ao buscar perfil");
        }
      })
      .finally(() => setLoading(false));
  }, [reset]);

  async function onSubmit(data: FormData) {
    const skillList = stacks.map((s) => ({ name: s.name, level: s.level }));
    const result = await api.submitProfile({ ...data, skills: skillList });
    setProfile(result);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const isAtivo = profile?.status === "ATIVO";
  const isPendente = profile?.status === "PENDENTE";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>Meu Perfil</h1>
        {profile && (
          <span className={`mt-1 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${isAtivo ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {isAtivo ? "Ativo no banco de talentos" : "Aguardando revisão"}
          </span>
        )}
      </div>

      <div>
        {loading ? (
          <p className="text-gray-400 text-sm">Carregando...</p>
        ) : isPendente || isAtivo ? (
          <ProfileReadOnly profile={profile} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

            <Section title="Identificação" subtitle="Dados que vão aparecer no seu card.">
              <Input label="URL da foto de perfil" placeholder="https://..." {...register("photoUrl")} />
              <Input label="Matrícula" placeholder="Sua matrícula corporativa" {...register("registrationNumber")} />
            </Section>

            <Section title="Perfil Técnico">
              <Select label="Área de atuação *" options={AREA_OPTIONS} {...register("area")} error={errors.area?.message} />

              <StackInput value={stacks} onChange={setStacks} />

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
            </Section>

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
      </div>
    </div>
  );
}

function getLevelLabel(level: number): string {
  if (level <= 3) return "Em desenvolvimento";
  if (level <= 6) return "Pratico com regularidade";
  if (level <= 8) return "Domínio consistente";
  return "Referência no time";
}

function getLevelStyle(level: number): { color: string; bg: string } {
  if (level <= 3) return { color: "#9333ea", bg: "#f3e8ff" };
  if (level <= 6) return { color: "#2563eb", bg: "#dbeafe" };
  if (level <= 8) return { color: "#059669", bg: "#d1fae5" };
  return { color: "#b45309", bg: "#fef3c7" };
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

  const statusLabels: Record<string, string> = {
    APPROVED: "Aprovada",
    AWAITING_APPROVAL: "Aguardando aprovação",
    REQUESTED: "Solicitada",
    NOT_REQUESTED: "Não solicitada",
  };
  const regStatus = profile.registrationStatus ? (statusLabels[profile.registrationStatus] || profile.registrationStatus) : "";

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>
            {isAtivo ? "Seu perfil está ativo no banco de talentos" : "Perfil enviado — aguardando revisão do RH"}
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
          {profile.registrationNumber && (
            <ReadField label="Matrícula" value={`${profile.registrationNumber} (${regStatus})`} />
          )}
          {profile.area && <ReadField label="Área" value={profile.area} />}

          {profile.experienceYears != null && (
            <ReadField
              label="Anos de experiência"
              value={
                profile.experienceYears >= 6 ? "6 anos ou mais"
                  : profile.experienceYears >= 3 ? "3 a 5 anos"
                    : profile.experienceYears >= 1 ? "1 a 2 anos"
                      : "Menos de 1 ano"
              }
            />
          )}
          {profile.linkedinUrl && (
            <div>
              <p className="text-xs text-gray-400 mb-0.5">LinkedIn</p>
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-pink-600 hover:underline">{profile.linkedinUrl}</a>
            </div>
          )}
          {profile.githubUrl && (
            <div>
              <p className="text-xs text-gray-400 mb-0.5">GitHub</p>
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-pink-600 hover:underline">{profile.githubUrl}</a>
            </div>
          )}
        </div>
        {profile.sobre && (
          <div className="px-6 pb-5">
            <p className="text-xs text-gray-400 mb-1">Sobre você</p>
            <p className="text-sm text-gray-700 leading-relaxed">{profile.sobre}</p>
          </div>
        )}
        {profile.skills?.length > 0 && (
          <div className="px-6 pb-5">
            <p className="text-xs text-gray-400 mb-3">Stack tecnológica</p>
            <div className="flex flex-wrap gap-2.5">
              {profile.skills.map((ps: any, i: number) => {
                const skillName = ps.skill?.name ?? ps.name ?? "";
                const skillLevel = typeof ps.level === "number" ? ps.level : null;
                const { color, bg } = skillLevel ? getLevelStyle(skillLevel) : { color: "#6b7280", bg: "#f3f4f6" };
                return (
                  <div key={i} className="flex items-stretch bg-white border border-gray-200 rounded-full overflow-hidden shadow-sm">
                    <span className="text-sm text-gray-700 font-medium pl-4 pr-3 py-1.5 flex items-center">{skillName}</span>
                    {skillLevel && (
                      <span
                        className="text-xs font-bold px-3 py-1.5 flex items-center justify-center border-l border-gray-100"
                        style={{ color, background: bg }}
                        title={getLevelLabel(skillLevel)}
                      >
                        {skillLevel}
                      </span>
                    )}
                  </div>
                );
              })}
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
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800" style={{ fontFamily: "var(--font-syne)" }}>{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-6 py-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}