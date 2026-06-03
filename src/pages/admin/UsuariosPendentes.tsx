import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "RECURSO";
  status: string;
  emailVerified: boolean;
  createdAt: string;
}

export default function UsuariosPendentes() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await api.getPendingUsers();
      setUsers(data);
    } catch {
      setError("Não foi possível carregar os usuários pendentes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleApprove(id: string) {
    setActionId(id);
    try {
      await api.approveUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setError("Erro ao aprovar usuário.");
    } finally {
      setActionId(null);
    }
  }

  async function handleReject(id: string) {
    setActionId(id);
    try {
      await api.rejectUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setError("Erro ao rejeitar usuário.");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Usuários pendentes" subtitle="Aprovação de novas contas aguardando liberação." />

      {error && (
        <p className="rounded-lg px-3 py-2 text-xs bg-red-50 text-red-600 border border-red-100">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-slate-400">Carregando...</p>
      ) : users.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-slate-400 text-sm">Nenhum usuário pendente no momento.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((u) => (
            <div key={u.id} className="bg-white border border-slate-200 rounded-xl shadow-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-slate-900 truncate">{u.name}</span>
                  <Badge variant={u.role === "ADMIN" ? "warning" : "success"}>
                    {u.role === "ADMIN" ? "Admin" : "Recurso"}
                  </Badge>
                  {!u.emailVerified && (
                    <Badge variant="alert">E-mail não verificado</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{u.email}</p>
                <p className="text-xs text-slate-300 mt-0.5">
                  Cadastrado em {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div className="flex gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleApprove(u.id)}
                  disabled={actionId === u.id}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  Aprovar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleReject(u.id)}
                  disabled={actionId === u.id}
                >
                  Rejeitar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
