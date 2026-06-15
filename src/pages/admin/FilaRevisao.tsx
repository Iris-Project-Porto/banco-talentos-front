import { Link } from "react-router-dom";
import { PageHeader, Badge, Tag, Avatar, Card } from "@/components/ui";
import { profilesApi, type UserProfile } from "@/features/profiles";
import { useQuery } from "@tanstack/react-query";

export default function FilaRevisao() {
  const { data: profiles = [] as UserProfile[], isLoading: loading } = useQuery({
    queryKey: ['profiles-pendentes'],
    queryFn: async (): Promise<UserProfile[]> => {
      const data = await profilesApi.getPendentes();

      if (Array.isArray(data)) return data;

      return (data as any)?.content || (data as any)?.data || [];
    }
  });
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
                  <Avatar name={p.name ?? ""} size={40} />
                  <div>
                    <p className="font-bold text-base text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-400">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString("pt-BR") : ""}
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
                {p.allocationStatus && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Alocação</p>
                    <p className="text-sm text-slate-700">{p.allocationStatus}</p>
                  </div>
                )}
              </div>

              {p.skills && p.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.skills.map((ps: any, i: number) => (
                    <Tag key={i} kind="skill">
                      {ps.skill?.name || ps.name}
                      {(ps.proficiencyLevel ?? ps.level) && (
                        <span className="text-slate-400 ml-1">· {ps.proficiencyLevel ?? ps.level}</span>
                      )}
                    </Tag>
                  ))}
                </div>
              )}

              {p.about && (
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{p.about}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
