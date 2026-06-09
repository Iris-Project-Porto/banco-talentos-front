import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/components/ui";
import { useAuth, UserRole } from "@/features/auth";
import { loginSchema, type LoginFormData } from "@/features/auth/validations";
import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import { getApiError } from "@/lib/axios";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const successMsg = params.get("verified") === "1"
    ? "E-mail verificado! Faça login para continuar."
    : params.get("reset") === "1"
      ? "Senha redefinida com sucesso!"
      : null;

  async function onSubmit(data: LoginFormData) {
    setError("");
    try {
      await login(data.email, data.password);
      const stored = localStorage.getItem("user");
      const role = stored ? JSON.parse(stored).role : null;
      navigate(role === UserRole.ADMIN ? "/admin/dashboard" : "/meu-perfil", { replace: true });
    } catch (err) {
      setError(getApiError(err, "E-mail ou senha incorretos."));
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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          placeholder="voce@vilt-group.com"
          autoFocus
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
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

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="mt-1">
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </AuthLayout>
  );
}