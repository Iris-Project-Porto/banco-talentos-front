import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/features/auth";
import { Button, Input } from "@/components/ui";
import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/features/auth/validations/validations";
import { getApiError } from "@/lib/axios";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setError("");
    try {
      await authApi.forgotPassword(data.email);
      setSent(true);
    } catch (err) {
      setError(getApiError(err, "Erro ao enviar o link. Tente novamente."));
    }
  }

  return (
    <AuthLayout footer={<Link to="/login" className="text-xs text-pink font-medium hover:underline">Voltar ao login</Link>}>
      <h1 className="text-lg font-bold text-slate-900 mb-1">Esqueceu a senha?</h1>
      <p className="text-sm text-slate-400 mb-7">Informe seu e-mail e enviaremos um link de redefinição.</p>

      {error && <p className="rounded-lg px-3 py-2 text-xs bg-red-50 text-red-600 border border-red-100 mb-4">{error}</p>}

      {sent ? (
        <p className="rounded-lg px-4 py-3 text-sm bg-green-50 text-green-700 border border-green-100">
          Se o e-mail existir em nossa base, um link de redefinição será enviado em breve.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="voce@vilt-group.com"
            autoFocus
            {...register("email")}
            error={errors.email?.message}
          />
          <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="mt-1">
            {isSubmitting ? "Enviando..." : "Enviar link"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}