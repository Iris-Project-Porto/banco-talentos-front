import { Search } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import type { ProfileListFilters } from "../../types/profileFilters";
import {
    FILTER_LABEL_CLS,
    REGISTRATION_STATUS_FILTER_OPTIONS,
    STATUS_RECURSO_FILTER_OPTIONS,
    YES_NO_FILTER_OPTIONS,
} from "../../utils/profileFilterOptions";

interface Props {
    filters: ProfileListFilters;
    projects: { id: string; name: string }[];
    onChange: (key: keyof ProfileListFilters, value: string) => void;
    onApply: () => void;
    onClear: () => void;
}

function SearchField({
    label,
    placeholder,
    value,
    onChange,
}: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label className={FILTER_LABEL_CLS}>{label}</label>
            <div className="relative">
                <Input
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="pr-9"
                />
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
        </div>
    );
}

export function RecursosFilters({ filters, projects = [], onChange, onApply, onClear }: Props) {
    const projectOptions = [
        { value: "", label: "Selecione" },
        ...projects.map((project) => ({ value: project.id, label: project.name })),
    ];

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <SearchField
                    label="Nome ou E-mail"
                    placeholder="Buscar por nome ou e-mail"
                    value={filters.nome}
                    onChange={(value) => onChange("nome", value)}
                />
                <div>
                    <label className={FILTER_LABEL_CLS}>Status do Recurso</label>
                    <Select
                        options={STATUS_RECURSO_FILTER_OPTIONS}
                        value={filters.statusRecurso}
                        onChange={(e) => onChange("statusRecurso", e.target.value)}
                    />
                </div>
                <div>
                    <label className={FILTER_LABEL_CLS}>Status da Matrícula</label>
                    <Select
                        options={REGISTRATION_STATUS_FILTER_OPTIONS}
                        value={filters.registrationStatus}
                        onChange={(e) => onChange("registrationStatus", e.target.value)}
                    />
                </div>
                <SearchField
                    label="Gerente do Projeto"
                    placeholder="Digitar nome do gerente"
                    value={filters.projectManagerName}
                    onChange={(value) => onChange("projectManagerName", value)}
                />
                <div>
                    <label className={FILTER_LABEL_CLS}>Projeto</label>
                    <Select
                        options={projectOptions}
                        value={filters.allocationProjectId}
                        onChange={(e) => onChange("allocationProjectId", e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                    <label className={FILTER_LABEL_CLS}>Billable</label>
                    <Select
                        options={YES_NO_FILTER_OPTIONS}
                        value={filters.billable}
                        onChange={(e) => onChange("billable", e.target.value)}
                    />
                </div>
                <div>
                    <label className={FILTER_LABEL_CLS}>Onboarding Porto realizado?</label>
                    <Select
                        options={YES_NO_FILTER_OPTIONS}
                        value={filters.portoOnboarding}
                        onChange={(e) => onChange("portoOnboarding", e.target.value)}
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className={FILTER_LABEL_CLS}>Período de Entrada no Projeto</label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                        <Input
                            type="date"
                            value={filters.projectEntryDateFrom}
                            onChange={(e) => onChange("projectEntryDateFrom", e.target.value)}
                        />
                        <span className="text-center text-sm text-slate-500">até</span>
                        <Input
                            type="date"
                            value={filters.projectEntryDateTo}
                            onChange={(e) => onChange("projectEntryDateTo", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" type="button" onClick={onClear}>
                    Limpar filtros
                </Button>
                <Button variant="primary" size="sm" type="button" onClick={onApply}>
                    Filtrar
                </Button>
            </div>
        </div>
    );
}
