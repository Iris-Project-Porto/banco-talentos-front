import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/features/auth";
import { Button, Input } from "@/components/ui";
import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/features/auth/validations/validations";
import { getApiError } from "@/lib/axios";

type TokenStatus = "loading" | "valid" | "invalid";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState("");
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("loading");

  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      token,
      password: "",
      confirm: ""
    }
  });

  useEffect(() => {
    if (!email || !token) {
      setTokenStatus("invalid");
      return;
    }

    authApi.validateResetToken(email, token)
      .then(() => setTokenStatus("valid"))
      .catch(() => setTokenStatus("invalid"));
  }, [email, token]);

  async function onSubmit(data: ResetPasswordFormData) {
    setError("");
    try {
      await authApi.resetPassword(data.email, data.token, data.password);
      navigate("/login?reset=1");
    } catch (err: unknown) {
      setError(getApiError(err, "Erro ao redefinir senha. O link pode ter expirado."));
    }
  }

  if (tokenStatus === "loading") {
    return (
      <AuthLayout footer={
        <Link to="/login" className="text-xs text-pink font-medium hover:underline">Voltar ao login</Link>
      }>
        <p className="text-sm text-slate-400">Verificando link de redefinição...</p>
      </AuthLayout>
    );
  }

  if (tokenStatus === "invalid") {
    return (
      <AuthLayout footer={
        <Link to="/login" className="text-xs text-pink font-medium hover:underline">Voltar ao login</Link>
      }>
        <h1 className="text-lg font-bold text-slate-900 mb-1">Link expirado</h1>
        <p className="text-sm text-slate-400 my-4">
          Este link de redefinição de senha expirou ou é inválido. Solicite um novo link para continuar.
        </p>
        <div className="flex justify-center">
          <Link
            to="/forgot-password"
            className="inline-flex items-center justify-center rounded-lg bg-pink px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Solicitar novo link
          </Link>
        </div>
     
      </AuthLayout>
    );
  }

  return (
    <AuthLayout footer={
      <Link to="/login" className="text-xs text-pink font-medium hover:underline">Voltar ao login</Link>
    }>
      <h1 className="text-lg font-bold text-slate-900 mb-1">Nova senha</h1>
      <p className="text-sm text-slate-400 mb-7">Defina uma nova senha para sua conta.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="E-mail" type="email" readOnly className="bg-slate-50 cursor-not-allowed text-slate-500" {...register("email")} />
        <Input label="Nova senha" type="password" placeholder="Ex: Senha@123" autoFocus {...register("password")} error={errors.password?.message} />
        <Input label="Confirmar senha" type="password" placeholder="••••••••" {...register("confirm")} error={errors.confirm?.message} />

        {error && <p className="rounded-lg px-3 py-2 text-xs bg-red-50 text-red-600 border border-red-100">{error}</p>}

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="mt-1">
          {isSubmitting ? "Salvando..." : "Salvar nova senha"}
        </Button>
      </form>
    </AuthLayout>
  );
}
