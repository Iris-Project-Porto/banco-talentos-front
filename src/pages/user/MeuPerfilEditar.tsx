import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button, Input, Select, Section } from "@/components/ui";
import {
    StackInput,
    AREA_OPTIONS,
    EXPERIENCE_OPTIONS,
    useMeuPerfilEditar,
    ContactAddressFields,
    ProfileTabButton,
} from "@/features/profiles";

type Tab = "identificacao" | "skills" | "contato" | "links";

export default function MeuPerfilEditar() {
    const navigate = useNavigate();
    const {
        form,
        stacks,
        setStacks,
        updateField,
        handleSave,
        loading,
        isError,
        isFirstSubmit,
        saving,
    } = useMeuPerfilEditar();
    const [tab, setTab] = useState<Tab>("identificacao");

    if (loading) {
        return <p className="text-sm text-slate-400">Carregando...</p>;
    }

    if (isError) {
        return (
            <div className="flex flex-col gap-4">
                <p className="text-sm text-slate-500">
                    Não foi possível carregar seu perfil. Tente sair e entrar novamente.
                </p>
                <Link to="/meu-perfil" className="text-sm text-pink hover:underline">
                    Voltar para Meu Perfil
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {!isFirstSubmit && (
                <div className="flex items-center gap-2">
                    <Link
                        to="/meu-perfil"
                        className="flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-gray-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar
                    </Link>
                </div>
            )}

            <div>
                <h1
                    className="text-xl font-bold text-gray-900"
                    style={{ fontFamily: "var(--font-syne)" }}
                >
                    {isFirstSubmit ? "Criar perfil" : "Editar perfil"}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                    {isFirstSubmit
                        ? "Este é o seu primeiro contato. Preencha identificação, skills, contato e links."
                        : "Atualize identificação, skills, contato e links."}
                </p>
            </div>

            <div className="-mb-2 flex overflow-x-auto border-b border-slate-200">
                <ProfileTabButton active={tab === "identificacao"} onClick={() => setTab("identificacao")}>
                    Identificação
                </ProfileTabButton>
                <ProfileTabButton active={tab === "skills"} onClick={() => setTab("skills")}>
                    Skills
                </ProfileTabButton>
                <ProfileTabButton active={tab === "contato"} onClick={() => setTab("contato")}>
                    Contato e Endereço
                </ProfileTabButton>
                <ProfileTabButton active={tab === "links"} onClick={() => setTab("links")}>
                    Links
                </ProfileTabButton>
            </div>

            {tab === "identificacao" && (
                <div className="flex max-w-3xl flex-col gap-4">
                    <Section title="Identificação">
                        <Input
                            label="URL da foto de perfil"
                            placeholder="https://..."
                            value={form.photoUrl}
                            onChange={(e) => updateField("photoUrl", e.target.value)}
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Select
                                label="Área de atuação"
                                options={[{ value: "", label: "Selecione..." }, ...AREA_OPTIONS]}
                                value={form.area}
                                onChange={(e) => updateField("area", e.target.value)}
                            />
                            <Select
                                label="Anos de experiência"
                                options={[{ value: "", label: "Selecione..." }, ...EXPERIENCE_OPTIONS]}
                                value={form.experienceYears}
                                onChange={(e) => updateField("experienceYears", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                                Sobre você
                            </label>
                            <textarea
                                placeholder="Um parágrafo curto descrevendo sua experiência e foco de atuação."
                                rows={3}
                                value={form.about}
                                onChange={(e) => updateField("about", e.target.value)}
                                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                            />
                        </div>
                    </Section>
                </div>
            )}

            {tab === "skills" && (
                <div className="flex max-w-3xl flex-col gap-4">
                    <Section title="Stack tecnológica">
                        <StackInput value={stacks} onChange={setStacks} />
                    </Section>
                </div>
            )}

            {tab === "contato" && (
                <div className="flex max-w-3xl flex-col gap-4">
                    <Section title="Contato e Endereço">
                        <ContactAddressFields form={form} updateField={updateField} />
                    </Section>
                </div>
            )}

            {tab === "links" && (
                <div className="flex max-w-3xl flex-col gap-4">
                    <Section title="Links">
                        <Input
                            label="LinkedIn"
                            placeholder="https://linkedin.com/in/..."
                            value={form.linkedinUrl}
                            onChange={(e) => updateField("linkedinUrl", e.target.value)}
                        />
                        <Input
                            label="GitHub"
                            placeholder="https://github.com/..."
                            value={form.githubUrl}
                            onChange={(e) => updateField("githubUrl", e.target.value)}
                        />
                    </Section>
                </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                    type="button"
                    variant="primary"
                    loading={saving}
                    disabled={saving}
                    onClick={handleSave}
                >
                    {isFirstSubmit ? "Criar perfil" : "Salvar alterações"}
                </Button>
                {!isFirstSubmit && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate("/meu-perfil")}
                        disabled={saving}
                    >
                        Cancelar
                    </Button>
                )}
            </div>
        </div>
    );
}
