import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  useTalentoDetalhe,
    ProfileTabButton,
    TalentoDetalheHeader,
    TalentoDetalheDadosTab,
    TalentoDetalheSkillsTab,
    TalentoDetalheCorporativaTab,
} from "@/features/profiles";

type Tab = "dados" | "skills" | "corporativa";

export default function TalentoDetalhe() {
  const { id } = useParams<{ id: string }>();

  const {
        profile,
        form,
        stacks,
        saving,
        loading,
        setStacks,
        updateField,
        handleAddSoftSkill,
        handleRemoveSoftSkill,
        handleSave,
  } = useTalentoDetalhe(id);

  const [tab, setTab] = useState<Tab>("dados");

  if (loading || !profile) {
    return <p className="text-gray-400 text-sm">Carregando...</p>;
  }

  const isPendente = profile.status === "PENDING";
  const backLink = isPendente ? "/admin/fila" : "/admin/talentos";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link
          to={backLink}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {isPendente ? "Fila de revisão" : "Voltar"}
        </Link>
      </div>

            <TalentoDetalheHeader profile={profile} form={form} isPendente={isPendente} />

      <div className="flex border-b border-slate-200 -mb-2">
                <ProfileTabButton active={tab === "dados"} onClick={() => setTab("dados")}>
          Dados Básicos
                </ProfileTabButton>
                <ProfileTabButton active={tab === "skills"} onClick={() => setTab("skills")}>
          Skills
                </ProfileTabButton>
                <ProfileTabButton active={tab === "corporativa"} onClick={() => setTab("corporativa")}>
          Identificação Corporativa
                </ProfileTabButton>
            </div>

            {tab === "dados" && (
                <TalentoDetalheDadosTab
                    form={form}
                    updateField={updateField}
                    isPendente={isPendente}
                    saving={saving}
                    onSave={handleSave}
                />
            )}

      {tab === "skills" && (
                <TalentoDetalheSkillsTab
                    form={form}
                    stacks={stacks}
                    setStacks={setStacks}
                    saving={saving}
                    onAddSoftSkill={handleAddSoftSkill}
                    onRemoveSoftSkill={handleRemoveSoftSkill}
                    onSave={() => handleSave(false)}
                />
            )}

            {tab === "corporativa" && (
                <TalentoDetalheCorporativaTab
                    form={form}
                    updateField={updateField}
                    saving={saving}
                    onSave={() => handleSave(false)}
                />
      )}
    </div>
  );
}
