import { Input, Select, Button, Section } from "@/components/ui";
import { StackInput, ProfileReadOnly, AREA_OPTIONS, EXPERIENCE_OPTIONS, useMeuPerfil } from "@/features/profiles";

export default function MeuPerfil() {
  const { profile, loading, saved, stacks, setStacks, form, onSubmit } = useMeuPerfil();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

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
          <ProfileReadOnly profile={profile!} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

            <Section title="Identificação" subtitle="Dados que vão aparecer no seu card.">
              <Input label="URL da foto de perfil" placeholder="https://..." {...register("photoUrl")} />
              <Input label="Matrícula" placeholder="Sua matrícula corporativa" {...register("registrationNumber")} />
            </Section>

            <Section title="Perfil Técnico">
              <Select label="Área de atuação *" options={[{ value: "", label: "Selecione..." }, ...AREA_OPTIONS]} {...register("area")} error={errors.area?.message} />

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

              <Select label="Anos de experiência na área *" options={[{ value: "", label: "Selecione..." }, ...EXPERIENCE_OPTIONS]} {...register("experienceYears")} />
            </Section>

            <Section title="Links">
              <Input label="LinkedIn" placeholder="https://linkedin.com/in/..." {...register("linkedinUrl")} />
              <Input label="GitHub" placeholder="https://github.com/..." {...register("githubUrl")} />
            </Section>

            <div className="flex items-center gap-3 pb-8">
              <Button type="submit" loading={isSubmitting} size="lg" variant="primary">
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

