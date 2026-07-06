import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "@/features/auth";
import { Button, Input, PasswordRequirements } from "@/components/ui";
import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/features/auth/validations/validations";
import { getApiError } from "@/lib/axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";
  const hasParams = Boolean(email && token);

  const { isLoading: isValidating, isError: isTokenInvalid } = useQuery({
    queryKey: ["validate-reset-token", email, token],
    queryFn: () => authApi.validateResetToken(email, token),
    enabled: hasParams,
    retry: false,
  });

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email,
      token,
      password: "",
      confirm: "",
    },
  });

  const password = watch("password") ?? "";

  const resetMutation = useMutation({
    mutationFn: (data: ResetPasswordFormData) =>
      authApi.resetPassword(data.email, data.token, data.password),
    onSuccess: () => {
      navigate("/login?reset=1");
    },
  });

  const submitError = resetMutation.isError
    ? getApiError(resetMutation.error, "Erro ao redefinir senha. O link pode ter expirado.")
    : "";

  const footer = (
    <Link to="/login" className="text-xs text-pink font-medium hover:underline">
      Voltar ao login
    </Link>
  );

  if (!hasParams || isTokenInvalid) {
    return (
      <AuthLayout footer={footer}>
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

  if (isValidating) {
    return (
      <AuthLayout footer={footer}>
        <p className="text-sm text-slate-400">Verificando link de redefinição...</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout footer={footer}>
      <h1 className="text-lg font-bold text-slate-900 mb-1">Nova senha</h1>
      <p className="text-sm text-slate-400 mb-7">Defina uma nova senha para sua conta.</p>

      <form
        onSubmit={handleSubmit((data) => resetMutation.mutate(data))}
        className="flex flex-col gap-4"
        autoComplete="off"
      >
        <Input
          label="E-mail"
          type="email"
          readOnly
          className="bg-slate-50 cursor-not-allowed text-slate-500"
          autoComplete="off"
          {...register("email")}
        />
        <div className="flex flex-col gap-1.5">
          <Input
            label="Nova senha"
            type="password"
            placeholder="Ex: Senha@123"
            autoFocus
            autoComplete="new-password"
            {...register("password")}
            error={errors.password?.message}
          />
          <PasswordRequirements password={password} />
        </div>
        <Input
          label="Confirmar senha"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          {...register("confirm")}
          error={errors.confirm?.message}
        />

        {submitError && (
          <p className="rounded-lg px-3 py-2 text-xs bg-red-50 text-red-600 border border-red-100">{submitError}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={resetMutation.isPending}
          disabled={!isValid}
          className="mt-1"
        >
          {resetMutation.isPending ? "Salvando..." : "Salvar nova senha"}
        </Button>
      </form>
    </AuthLayout>
  );
}
