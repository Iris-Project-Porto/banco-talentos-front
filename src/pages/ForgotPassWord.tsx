import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try { await api.forgotPassword(email); } finally {
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <AuthLayout footer={
      <Link to="/login" className="text-xs text-pink font-medium hover:underline">Voltar ao login</Link>
    }>
      <h1 className="text-lg font-bold text-slate-900 mb-1">Esqueceu a senha?</h1>
      <p className="text-sm text-slate-400 mb-7">
        Informe seu e-mail e enviaremos um link de redefinição.
      </p>

      {sent ? (
        <p className="rounded-lg px-4 py-3 text-sm bg-green-50 text-green-700 border border-green-100">
          Se o e-mail existir em nossa base, um link de redefinição será enviado em breve.
        </p>
      ) : (
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
          <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-1">
            {loading ? "Enviando..." : "Enviar link"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
