import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/features/auth";
import { Button, Input } from "@/components/ui";
import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/features/auth/validations";
import { getApiError } from "@/lib/axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: params.get("email") ?? "",
      token: params.get("token") ?? "",
      password: "",
      confirm: ""
    }
  });

  async function onSubmit(data: ResetPasswordFormData) {
    setError("");
    try {
      await authApi.resetPassword(data.email, data.token, data.password);
      navigate("/login?reset=1");
    } catch (err: unknown) {
      setError(getApiError(err, "Erro ao redefinir senha. O link pode ter expirado."));
    }
  }

  return (
    <AuthLayout footer={
      <Link to="/login" className="text-xs text-pink font-medium hover:underline">Voltar ao login</Link>
    }>
      <h1 className="text-lg font-bold text-slate-900 mb-1">Nova senha</h1>
      <p className="text-sm text-slate-400 mb-7">Defina uma nova senha para sua conta.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="E-mail" type="email" readOnly className="bg-slate-50 cursor-not-allowed text-slate-500" {...register("email")} />

        <Input label="Nova senha" type="password" placeholder="Mínimo 6 caracteres" autoFocus {...register("password")} error={errors.password?.message} />
        <Input label="Confirmar senha" type="password" placeholder="••••••••" {...register("confirm")} error={errors.confirm?.message} />

        {error && <p className="rounded-lg px-3 py-2 text-xs bg-red-50 text-red-600 border border-red-100">{error}</p>}

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="mt-1">
          {isSubmitting ? "Salvando..." : "Salvar nova senha"}
        </Button>
      </form>
    </AuthLayout>
  );
}