import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button, PageHeader } from "@/components/ui";
import { RecursosList, ResourceCreateModal, recursosApi } from "@/features/recursos";
import type { ResourceCreatePayload } from "@/features/recursos/validations/resourceCreate";
import { getApiError } from "@/lib/axios";

export default function BancoTalentos() {
  const queryClient = useQueryClient();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const createMutation = useMutation({
    mutationFn: (payload: ResourceCreatePayload) => recursosApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles-catalog"] });
      queryClient.invalidateQueries({ queryKey: ["profiles-pendentes"] });
      setCreateModalOpen(false);
      toast.success("Recurso cadastrado com sucesso! Um e-mail com as credenciais foi enviado.");
    },
    onError: (error: unknown) => {
      toast.error(getApiError(error, "Erro ao cadastrar recurso."));
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Recursos"
        subtitle="Consulta e cadastro de recursos na plataforma"
        actions={
          <Button variant="primary" size="md" type="button" onClick={() => setCreateModalOpen(true)}>
            + Cadastra Recurso
          </Button>
        }
      />
      <RecursosList />

      {createModalOpen && (
        <ResourceCreateModal
          saving={createMutation.isPending}
          onSave={(data) => createMutation.mutate(data)}
          onClose={() => setCreateModalOpen(false)}
        />
      )}
    </div>
  );
}
