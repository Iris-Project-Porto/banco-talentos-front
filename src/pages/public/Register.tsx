import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select } from "@/components/ui";
import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import { authApi, UserRole } from "@/features/auth";
import { registerSchema, type RegisterFormData } from "@/features/auth/validations/validations";
import { getApiError } from "@/lib/axios";

interface Group {
  id: string;
  name: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [error, setError] = useState("");

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange"
  });

  const selectedRole = watch("role");

  useEffect(() => {
    authApi.getGroups(0, 100).then((data) => {
      const list: Group[] = data?.content || [];
      setGroups(list);
      if (list.length > 0) {
        setValue("groupId", list[0].id);
      }
    });
  }, [setValue]);

  async function onSubmit(data: RegisterFormData) {
    setError("");
    try {
      await authApi.register(data.name, data.email, data.password, data.role, data.groupId);
      navigate(`/verify?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      setError(getApiError(err, "Erro ao realizar cadastro. Tente novamente."));
    }
  }

  const groupOptions = groups.length === 0
    ? [{ value: "", label: "Carregando grupos..." }]
    : groups.map(g => ({ value: g.id, label: g.name }));

  return (
    <AuthLayout
      footer={
        <p className="text-xs text-slate-400">
          Já tem conta? <Link to="/login" className="text-pink font-medium hover:underline">Entrar</Link>
        </p>
      }
    >
      <h1 className="text-lg font-bold text-slate-900 mb-1">Criar conta</h1>
      <p className="text-sm text-slate-400 mb-7">Use seu e-mail corporativo @vilt-group.com</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Nome completo" placeholder="Seu nome" autoFocus {...register("name")} error={errors.name?.message} />
        <Input label="E-mail" type="email" placeholder="voce@vilt-group.com" {...register("email")} error={errors.email?.message} />
        <Input label="Senha" type="password" placeholder="Ex: Senha@123" {...register("password")} error={errors.password?.message} />
        <Input label="Confirmar senha" type="password" placeholder="Ex: Senha@123" {...register("confirm")} error={errors.confirm?.message} />

        <Select
          label="Perfil"
          options={[
            { value: "", label: "Selecione o Perfil" },
            { value: UserRole.RESOURCE, label: "Recurso" },
            { value: UserRole.ADMIN, label: "Administrador" }
          ]}
          {...register("role")}
          error={errors.role?.message}
        />

        {selectedRole === UserRole.ADMIN && (
          <p className="text-xs text-amber-600 -mt-2">Contas de admin precisam de aprovação antes do primeiro acesso.</p>
        )}

        <Select label="Grupo" options={groupOptions} {...register("groupId")} error={errors.groupId?.message} />

        {error && <p className="rounded-lg px-3 py-2 text-xs bg-red-50 text-red-600 border border-red-100">{error}</p>}

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="mt-1">
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
    </AuthLayout>
  );
}