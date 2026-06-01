import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Novos estados para controlar o reenvio do código
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResendMsg(""); // Limpa mensagem de reenvio se houver
    setLoading(true);
    try {
      await api.verifyEmail(email, code);
      navigate("/login?verified=1");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Código inválido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  // Função para lidar com o reenvio do código
  async function handleResend() {
    if (!email) {
      setError("Por favor, preencha o e-mail para reenviar o código.");
      return;
    }
    setError("");
    setResendMsg("");
    setResendLoading(true);
    try {
      await api.resendVerificationCode(email);
      setResendMsg("Novo código enviado! Verifique sua caixa de entrada (e o spam).");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Erro ao reenviar o código. Tente novamente mais tarde.");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <AuthLayout footer={
      <Link to="/login" className="text-xs text-pink font-medium hover:underline">Voltar ao login</Link>
    }>
      <h1 className="text-lg font-bold text-slate-900 mb-1">Verificar e-mail</h1>
      <p className="text-sm text-slate-400 mb-7">
        Enviamos um código de 6 dígitos. Insira abaixo para confirmar sua conta.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@vilt-group.com"
          required
        />
        <Input
          label="Código de verificação"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="123456"
          required
          autoFocus
          maxLength={6}
          className="tracking-widest text-center font-mono"
        />

        {/* Exibição de Erros */}
        {error && (
          <p className="rounded-lg px-3 py-2 text-xs bg-red-50 text-red-600 border border-red-100">{error}</p>
        )}

        {/* Exibição de Sucesso ao Reenviar */}
        {resendMsg && (
          <p className="rounded-lg px-3 py-2 text-xs bg-green-50 text-green-700 border border-green-100">{resendMsg}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          disabled={code.length !== 6 || resendLoading}
          className="mt-1"
        >
          {loading ? "Verificando..." : "Verificar"}
        </Button>

        {/* Botão de Reenvio de Código */}
        <div className="text-center mt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading || loading}
            className="text-xs text-slate-500 hover:text-pink font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? "Reenviando..." : "Não recebeu o código? Reenviar"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}