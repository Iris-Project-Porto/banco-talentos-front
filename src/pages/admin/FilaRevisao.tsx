import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";

export default function FilaRevisao() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPendentes()
      .then((data) => setProfiles(Array.isArray(data) ? data : []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-400 text-sm">Carregando...</p>;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fila de revisão"
        subtitle="Perfis aguardando análise e ativação"
        actions={
          <Badge variant={profiles.length > 0 ? "pending" : "info"}>
            {profiles.length} pendente{profiles.length !== 1 ? "s" : ""}
          </Badge>
        }
      />

      {profiles.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-slate-400 text-sm">Nenhum perfil aguardando revisão.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {profiles.map((p) => (
            <Link
              key={p.id}
              to={`/admin/talentos/${p.id}`}
              className="bg-white border border-slate-200 rounded-xl shadow-card p-6 flex flex-col gap-5 transition-all hover:shadow-card-hover hover:-translate-y-px"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar name={p.user?.name ?? "?"} size={40} />
                  <div>
                    <p className="font-bold text-base text-slate-900">{p.user?.name}</p>
                    <p className="text-xs text-slate-400">{p.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-400">
                    {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <Badge variant="pending">Aguardando revisão →</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {p.area && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Área</p>
                    <p className="text-sm text-slate-700">{p.area}</p>
                  </div>
                )}
                {p.alocacaoStatus && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Alocação</p>
                    <p className="text-sm text-slate-700">{p.alocacaoStatus}</p>
                  </div>
                )}
              </div>

              {p.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.skills.map((ps: any, i: number) => (
                    <Tag key={i} kind="skill">
                      {ps.skill?.name}{(ps.proficiencyLevel ?? ps.level) && <span className="text-slate-400 ml-1">· {ps.proficiencyLevel ?? ps.level}</span>}
                    </Tag>
                  ))}
                </div>
              )}

              {p.sobre && (
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{p.sobre}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
