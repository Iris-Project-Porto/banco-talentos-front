import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const successMsg = params.get("verified") === "1"
    ? "E-mail verificado! Faça login para continuar."
    : params.get("reset") === "1"
    ? "Senha redefinida com sucesso!"
    : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      const stored = localStorage.getItem("user");
      const role = stored ? JSON.parse(stored).role : null;
      navigate(role === "ADMIN" ? "/admin/dashboard" : "/meu-perfil", { replace: true });
    } catch {
      setError("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      footer={
        <p className="text-xs text-slate-400">
          Não tem conta?{" "}
          <Link to="/register" className="text-pink font-medium hover:underline">
            Cadastrar-se
          </Link>
        </p>
      }
    >
      <h1 className="text-lg font-bold text-slate-900 mb-1">Acesso interno</h1>
      <p className="text-sm text-slate-400 mb-7">Entre com suas credenciais corporativas</p>

      {successMsg && (
        <p className="rounded-lg px-3 py-2 text-xs bg-green-50 text-green-700 border border-green-100 mb-4">
          {successMsg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@vilt-group.com"
          required
          autoFocus
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          labelRight={
            <Link to="/forgot-password" className="text-xs text-pink hover:underline">
              Esqueceu a senha?
            </Link>
          }
        />

        {error && (
          <p className="rounded-lg px-3 py-2 text-xs bg-red-50 text-red-600 border border-red-100">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-1">
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </AuthLayout>
  );
}
