import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";

export default function FilaRevisao() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPendentes().then((data) => setProfiles(Array.isArray(data) ? data : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-400 text-sm">Carregando...</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>
            Fila de revisão
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Perfis aguardando análise e ativação</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${profiles.length > 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-400"}`}>
          {profiles.length} pendente{profiles.length !== 1 ? "s" : ""}
        </span>
      </div>

      {profiles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <p className="text-gray-400 text-sm">Nenhum perfil aguardando revisão.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {profiles.map((p) => (
            <Link
              key={p.id}
              to={`/admin/talentos/${p.id}`}
              className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5 hover:border-pink-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                    style={{ background: "var(--pink)" }}
                  >
                    {(p.user?.name ?? "?").split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>
                      {p.user?.name}
                    </p>
                    <p className="text-xs text-gray-400">{p.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400">
                    {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    Aguardando revisão →
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {p.cargo && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Cargo</p>
                    <p className="text-sm text-gray-700">{p.cargo}</p>
                  </div>
                )}
                {p.area && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Área</p>
                    <p className="text-sm text-gray-700">{p.area}</p>
                  </div>
                )}
                {p.alocacaoStatus && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Alocação</p>
                    <p className="text-sm text-gray-700">{p.alocacaoStatus}</p>
                  </div>
                )}
                {p.autonomia && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Autonomia</p>
                    <p className="text-sm text-gray-700">{p.autonomia}</p>
                  </div>
                )}
              </div>

              {p.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.skills.map((ps: any, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200">
                      {ps.skill?.name}
                      {ps.level && <span className="text-gray-400 ml-1">· {ps.level}</span>}
                    </span>
                  ))}
                </div>
              )}

              {p.sobre && (
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{p.sobre}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
