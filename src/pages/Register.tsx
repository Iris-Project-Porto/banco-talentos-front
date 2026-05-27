import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Group {
  id: string;
  name: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "RECURSO" as "ADMIN" | "RECURSO",
    groupId: "",
  });
  const [groups, setGroups] = useState<Group[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getGroups().then((data) => {
      const list: Group[] = Array.isArray(data) ? data : data.content ?? [];
      setGroups(list);
      if (list.length > 0) {
        setForm((prev) => ({ ...prev, groupId: list[0].id }));
      }
    });
  }, []);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.register(form.name, form.email, form.password, form.role, form.groupId);
      navigate(`/verify?email=${encodeURIComponent(form.email)}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      footer={
        <p className="text-xs text-slate-400">
          Já tem conta?{" "}
          <Link to="/login" className="text-pink font-medium hover:underline">Entrar</Link>
        </p>
      }
    >
      <h1 className="text-lg font-bold text-slate-900 mb-1">Criar conta</h1>
      <p className="text-sm text-slate-400 mb-7">Use seu e-mail corporativo @vilt-group.com</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nome completo"
          type="text"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Seu nome"
          required
          autoFocus
        />
        <Input
          label="E-mail"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="voce@vilt-group.com"
          required
        />
        <Input
          label="Senha"
          type="password"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          placeholder="Mínimo 6 caracteres"
          required
          minLength={6}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">Perfil</label>
          <select
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            className="w-full font-sans text-base rounded-lg px-3.5 py-2.5 outline-none transition-all bg-white border border-slate-300 focus:border-pink focus:shadow-focus-pink text-slate-900"
          >
            <option value="RECURSO">Recurso</option>
            <option value="ADMIN">Administrador</option>
          </select>
          {form.role === "ADMIN" && (
            <p className="text-xs text-amber-600">Contas de admin precisam de aprovação antes do primeiro acesso.</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">Grupo</label>
          <select
            value={form.groupId}
            onChange={(e) => set("groupId", e.target.value)}
            required
            className="w-full font-sans text-base rounded-lg px-3.5 py-2.5 outline-none transition-all bg-white border border-slate-300 focus:border-pink focus:shadow-focus-pink text-slate-900"
          >
            {groups.length === 0 && (
              <option value="" disabled>Carregando grupos...</option>
            )}
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="rounded-lg px-3 py-2 text-xs bg-red-50 text-red-600 border border-red-100">{error}</p>
        )}

        <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-1">
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
    </AuthLayout>
  );
}
