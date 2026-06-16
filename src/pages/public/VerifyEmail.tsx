import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/features/auth";
import { verifyEmailSchema, type VerifyEmailFormData } from "@/features/auth/validations/validations";
import { Button, Input } from "@/components/ui";
import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import { getApiError } from "@/lib/axios";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: params.get("email") ?? "",
      code: ""
    }
  });

  const currentEmail = watch("email");

  async function onSubmit(data: VerifyEmailFormData) {
    setError("");
    setResendMsg("");
    try {
      await authApi.verifyEmail(data.email, data.code);
      navigate("/login?verified=1");
    } catch (err: unknown) {
      setError(getApiError(err, "Código inválido. Tente novamente."));
    }
  }

  async function handleResend() {
    if (!currentEmail) {
      setError("Por favor, preencha o e-mail para reenviar o código.");
      return;
    }
    setError("");
    setResendMsg("");
    setResendLoading(true);
    try {
      await authApi.resendVerificationCode(currentEmail);
      setResendMsg("Novo código enviado! Verifique sua caixa de entrada (e o spam).");
    } catch (err) {
      setError(getApiError(err, "Erro ao reenviar o código. Tente novamente mais tarde."));
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <AuthLayout footer={<Link to="/login" className="text-xs text-pink font-medium hover:underline">Voltar ao login</Link>}>
      <h1 className="text-lg font-bold text-slate-900 mb-1">Verificar e-mail</h1>
      <p className="text-sm text-slate-400 mb-7">Enviamos um código de 6 dígitos. Insira abaixo para confirmar sua conta.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          readOnly
          className="bg-slate-50 cursor-not-allowed text-slate-500"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Código de verificação"
          type="text"
          placeholder="123456"
          maxLength={6}
          autoFocus
          className="tracking-widest text-center font-mono"
          {...register("code", { onChange: (e) => e.target.value = e.target.value.replace(/\D/g, "") })}
          error={errors.code?.message}
        />

        {error && <p className="rounded-lg px-3 py-2 text-xs bg-red-50 text-red-600 border border-red-100">{error}</p>}
        {resendMsg && <p className="rounded-lg px-3 py-2 text-xs bg-green-50 text-green-700 border border-green-100">{resendMsg}</p>}

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} disabled={resendLoading} className="mt-1">
          {isSubmitting ? "Verificando..." : "Verificar"}
        </Button>

        <div className="text-center mt-2">
          <button type="button" onClick={handleResend} disabled={resendLoading || isSubmitting} className="text-xs text-slate-500 hover:text-pink font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {resendLoading ? "Reenviando..." : "Não recebeu o código? Reenviar"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}