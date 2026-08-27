import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input, Select } from "@/components/ui";
import { projectsApi } from "@/features/projects/api/projects.api";
import { squadsApi } from "@/features/squads/api/squads.api";
import type { ProfileFormState } from "../../types/profile";
import type { ProfileFormUpdater } from "./ContactAddressFields";
import { YesNoRadio } from "./YesNoRadio";

interface Props {
    form: ProfileFormState;
    updateField: ProfileFormUpdater;
}

export function ProjectDataSection({ form, updateField }: Props) {
    const { data: projectsPage } = useQuery({
        queryKey: ["projects-active-options"],
        queryFn: () => projectsApi.getActive({ page: 0, size: 200 }),
    });

    const { data: squadsPage, isLoading: loadingSquads } = useQuery({
        queryKey: ["squads-active-options"],
        queryFn: () => squadsApi.getActive({ page: 0, size: 200 }),
    });

    const projectOptions = useMemo(
        () => [
            { value: "", label: "Selecione" },
            ...(projectsPage?.content ?? []).map((p: { id: string; name: string }) => ({
                value: p.id,
                label: p.name,
            })),
        ],
        [projectsPage]
    );

    const squadOptions = useMemo(
        () => [
            { value: "", label: loadingSquads ? "Carregando..." : "Selecione" },
            ...(squadsPage?.content ?? []).map((s: { id: string; name: string }) => ({
                value: s.id,
                label: s.name,
            })),
        ],
        [squadsPage, loadingSquads]
    );

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Input
                    label="Área Contratante *"
                    value={form.contractingArea}
                    onChange={(e) => updateField("contractingArea", e.target.value)}
                />
                <Input
                    label="Centro de Custo *"
                    value={form.costCenter}
                    onChange={(e) => updateField("costCenter", e.target.value)}
                />
                <Input
                    label="Data Entrada *"
                    type="date"
                    value={form.projectEntryDate}
                    onChange={(e) => updateField("projectEntryDate", e.target.value)}
                />
                <YesNoRadio
                    label="Recurso Billable?"
                    value={form.billable}
                    onChange={(v) => updateField("billable", v)}
                />
                <YesNoRadio
                    label="Onboarding Porto?"
                    value={form.portoOnboarding}
                    onChange={(v) => updateField("portoOnboarding", v)}
                />
                <Input
                    label="Gerente do Projeto *"
                    value={form.projectManagerName}
                    onChange={(e) => updateField("projectManagerName", e.target.value)}
                    placeholder="Nome do gerente"
                />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Select
                    label="Projeto *"
                    value={form.allocationProjectId}
                    onChange={(e) => updateField("allocationProjectId", e.target.value)}
                    options={projectOptions}
                />
                <Select
                    label="Squad *"
                    value={form.allocationSquadId}
                    onChange={(e) => updateField("allocationSquadId", e.target.value)}
                    options={squadOptions}
                />
            </div>
        </>
    );
}
