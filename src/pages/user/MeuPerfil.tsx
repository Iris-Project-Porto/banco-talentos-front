import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { ProfileReadOnly, useMeuPerfil } from "@/features/profiles";

export default function MeuPerfil() {
  const navigate = useNavigate();
  const { profile, loading, needsFirstSubmit } = useMeuPerfil();

  const isAtivo = profile?.status === "ACTIVE";
  const canEdit = Boolean(profile) && isAtivo && !needsFirstSubmit;

  useEffect(() => {
    if (!loading && needsFirstSubmit) {
      navigate("/meu-perfil/editar", { replace: true });
    }
  }, [loading, needsFirstSubmit, navigate]);

  if (loading || needsFirstSubmit) {
    return <p className="text-sm text-slate-400">Carregando...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>
            Meu Perfil
          </h1>
          {profile && (
            <span
              className={`mt-1 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isAtivo ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {isAtivo ? "Ativo no banco de talentos" : "Aguardando revisão"}
            </span>
          )}
        </div>
        {canEdit && (
          <Link to="/meu-perfil/editar">
            <Button type="button" variant="primary" size="md">
              Editar perfil
            </Button>
          </Link>
        )}
      </div>

      <div>
        {profile ? (
          <ProfileReadOnly profile={profile} />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <p className="mb-4 text-sm text-slate-500">
              Seu perfil ainda não foi criado. Preencha identificação, skills, contato e links.
            </p>
            <Link to="/meu-perfil/editar">
              <Button type="button" variant="primary">
                Criar perfil
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
