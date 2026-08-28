import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button, Input, Select, Badge } from "@/components/ui";
import { Table } from "@/components/ui/Table/Table";
import { EQUIPMENT_STATUS_LABELS, EQUIPMENT_STATUS_OPTIONS } from "../../profile";
import type { EquipmentStatus, ResourceEquipment } from "../../types/profile";
import { profilesApi } from "../../api/profiles.api";
import { YesNoRadio } from "./YesNoRadio";

const emptyEquipmentForm = {
    tag: "",
    hostname: "",
    assetNumber: "",
    brandOs: "",
    processor: "",
    status: "EMPTY" as EquipmentStatus,
    notes: "",
};

interface Props {
    profileId: string;
    hasClientMachine: boolean;
    onHasClientMachineChange: (value: boolean) => void;
}

export function ClientMachinesSection({ profileId, hasClientMachine, onHasClientMachineChange }: Props) {
    const queryClient = useQueryClient();
    const [equipmentForm, setEquipmentForm] = useState(emptyEquipmentForm);
    const [editingEquipmentId, setEditingEquipmentId] = useState<string | null>(null);
    const [showEquipmentForm, setShowEquipmentForm] = useState(false);

    const { data: equipments = [] } = useQuery<ResourceEquipment[]>({
        queryKey: ["profile-equipments", profileId],
        queryFn: () => profilesApi.listEquipments(profileId),
    });

    const saveEquipmentMutation = useMutation({
        mutationFn: async () => {
            if (equipmentForm.status === "INACTIVE" && !equipmentForm.notes.trim()) {
                throw new Error("NOTES_REQUIRED");
            }
            const payload = {
                ...equipmentForm,
                notes: equipmentForm.status === "INACTIVE" ? equipmentForm.notes.trim() : null,
            };
            if (editingEquipmentId) {
                return profilesApi.updateEquipment(profileId, editingEquipmentId, payload);
            }
            return profilesApi.createEquipment(profileId, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile-equipments", profileId] });
            setShowEquipmentForm(false);
            setEditingEquipmentId(null);
            setEquipmentForm(emptyEquipmentForm);
            toast.success(editingEquipmentId ? "Máquina atualizada." : "Máquina adicionada.");
        },
        onError: (error: Error) => {
            if (error.message === "NOTES_REQUIRED") {
                toast.error("Informe a observação quando o status da máquina for Inativo.");
                return;
            }
            toast.error("Não foi possível salvar a máquina.");
        },
    });

    function openCreateEquipment() {
        setEditingEquipmentId(null);
        setEquipmentForm(emptyEquipmentForm);
        setShowEquipmentForm(true);
    }

    function openEditEquipment(equipment: ResourceEquipment) {
        setEditingEquipmentId(equipment.id);
        setEquipmentForm({
            tag: equipment.tag ?? "",
            hostname: equipment.hostname ?? "",
            assetNumber: equipment.assetNumber ?? "",
            brandOs: equipment.brandOs ?? "",
            processor: equipment.processor ?? "",
            status: equipment.status ?? "EMPTY",
            notes: equipment.notes ?? "",
        });
        setShowEquipmentForm(true);
    }

    return (
        <>
            <YesNoRadio
                label="Possui máquina do cliente?"
                value={hasClientMachine}
                onChange={(v) => {
                    onHasClientMachineChange(v);
                    if (!v) {
                        setShowEquipmentForm(false);
                        setEditingEquipmentId(null);
                    }
                }}
            />

            {hasClientMachine && (
                <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
                    <div>
                        <h4 className="text-sm font-semibold text-slate-800">Cadastro de Máquinas</h4>
                        <p className="mt-1 text-xs text-slate-500">
                            Cadastre uma ou mais máquinas vinculadas a este recurso.
                        </p>
                    </div>

                    <Table<ResourceEquipment>
                        columns={[
                            { header: "Tag / Nº de Série", render: (row) => row.tag || "—" },
                            { header: "Hostname", render: (row) => row.hostname || "—" },
                            { header: "Nº do Ativo", render: (row) => row.assetNumber || "—" },
                            { header: "Marca e SO", render: (row) => row.brandOs || "—" },
                            { header: "Processador", render: (row) => row.processor || "—" },
                            {
                                header: "Status da Máquina",
                                render: (row) => (
                                    <Badge variant="success">
                                        {EQUIPMENT_STATUS_LABELS[row.status] ?? row.status}
                                    </Badge>
                                ),
                            },
                            {
                                header: "Ações",
                                render: (row) => (
                                    <button
                                        type="button"
                                        className="text-sm font-medium text-sky-600 hover:underline"
                                        onClick={() => openEditEquipment(row)}
                                    >
                                        Editar
                                    </button>
                                ),
                            },
                        ]}
                        data={equipments}
                        keyExtractor={(row) => row.id}
                        emptyMessage="Nenhuma máquina cadastrada."
                    />

                    {showEquipmentForm ? (
                        <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
                            <Input
                                label="Tag / Número de Série do Notebook"
                                value={equipmentForm.tag}
                                onChange={(e) => setEquipmentForm((p) => ({ ...p, tag: e.target.value }))}
                            />
                            <Input
                                label="Hostname do Notebook"
                                value={equipmentForm.hostname}
                                onChange={(e) => setEquipmentForm((p) => ({ ...p, hostname: e.target.value }))}
                            />
                            <Input
                                label="Número do Ativo"
                                value={equipmentForm.assetNumber}
                                onChange={(e) => setEquipmentForm((p) => ({ ...p, assetNumber: e.target.value }))}
                            />
                            <Input
                                label="Marca e Sistema Operacional"
                                value={equipmentForm.brandOs}
                                onChange={(e) => setEquipmentForm((p) => ({ ...p, brandOs: e.target.value }))}
                            />
                            <Input
                                label="Processador"
                                value={equipmentForm.processor}
                                onChange={(e) => setEquipmentForm((p) => ({ ...p, processor: e.target.value }))}
                            />
                            <Select
                                label="Status da Máquina"
                                value={equipmentForm.status}
                                onChange={(e) => {
                                    const status = e.target.value as EquipmentStatus;
                                    setEquipmentForm((p) => ({
                                        ...p,
                                        status,
                                        notes: status === "INACTIVE" ? p.notes : "",
                                    }));
                                }}
                                options={EQUIPMENT_STATUS_OPTIONS}
                            />
                            {equipmentForm.status === "INACTIVE" && (
                                <label className="flex flex-col gap-1.5 md:col-span-2">
                                    <span className="text-xs font-medium text-slate-600">Observação *</span>
                                    <textarea
                                        className="min-h-[96px] w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-500"
                                        value={equipmentForm.notes}
                                        onChange={(e) =>
                                            setEquipmentForm((p) => ({ ...p, notes: e.target.value }))
                                        }
                                        placeholder="Informe o motivo da inativação"
                                    />
                                </label>
                            )}
                            <div className="flex items-end gap-2 md:col-span-2">
                                <Button
                                    type="button"
                                    variant="primary"
                                    loading={saveEquipmentMutation.isPending}
                                    onClick={() => saveEquipmentMutation.mutate()}
                                >
                                    {editingEquipmentId ? "Atualizar Máquina" : "Salvar Máquina"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setShowEquipmentForm(false);
                                        setEditingEquipmentId(null);
                                        setEquipmentForm(emptyEquipmentForm);
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Button type="button" variant="secondary" onClick={openCreateEquipment}>
                                + Adicionar Máquina
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
