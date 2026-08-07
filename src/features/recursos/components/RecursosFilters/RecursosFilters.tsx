import { Search, X } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import type { ProfileListFilters } from "../../types/profileFilters";
import {
    ALOCACAO_FILTER_OPTIONS,
    AREA_FILTER_OPTIONS,
    FILTER_LABEL_CLS,
    NIVEL_FILTER_OPTIONS,
    PROFILE_STATUS_FILTER_OPTIONS,
    REGISTRATION_STATUS_FILTER_OPTIONS,
} from "../../utils/profileFilterOptions";

interface Props {
    filters: ProfileListFilters;
    areas: string[];
    groups: string[];
    onChange: (key: keyof ProfileListFilters, value: string) => void;
    onApply: () => void;
    onClear: () => void;
}

export function RecursosFilters({ filters, areas, groups, onChange, onApply, onClear }: Props) {
    const areaOptions = [
        { value: "", label: "Todas" },
        ...areas.map((area) => ({ value: area, label: area })),
    ];

    const groupOptions = [
        { value: "", label: "Todos" },
        ...groups.map((group) => ({ value: group, label: group })),
    ];

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <label className={FILTER_LABEL_CLS}>NOME / E-MAIL</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Buscar..."
                            value={filters.nome}
                            onChange={(e) => onChange("nome", e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
                <div>
                    <label className={FILTER_LABEL_CLS}>ÁREA</label>
                    <Select
                        options={areaOptions.length > 1 ? areaOptions : AREA_FILTER_OPTIONS}
                        value={filters.area}
                        onChange={(e) => onChange("area", e.target.value)}
                    />
                </div>
                <div>
                    <label className={FILTER_LABEL_CLS}>GRUPO</label>
                    <Select
                        options={groupOptions}
                        value={filters.groupName}
                        onChange={(e) => onChange("groupName", e.target.value)}
                    />
                </div>
                <div>
                    <label className={FILTER_LABEL_CLS}>STATUS</label>
                    <Select
                        options={PROFILE_STATUS_FILTER_OPTIONS}
                        value={filters.status}
                        onChange={(e) => onChange("status", e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <label className={FILTER_LABEL_CLS}>ALOCAÇÃO</label>
                    <Select
                        options={ALOCACAO_FILTER_OPTIONS}
                        value={filters.allocationStatus}
                        onChange={(e) => onChange("allocationStatus", e.target.value)}
                    />
                </div>
                <div>
                    <label className={FILTER_LABEL_CLS}>STATUS MATRÍCULA</label>
                    <Select
                        options={REGISTRATION_STATUS_FILTER_OPTIONS}
                        value={filters.registrationStatus}
                        onChange={(e) => onChange("registrationStatus", e.target.value)}
                    />
                </div>
                <div>
                    <label className={FILTER_LABEL_CLS}>NÍVEL</label>
                    <Select
                        options={NIVEL_FILTER_OPTIONS}
                        value={filters.nivel}
                        onChange={(e) => onChange("nivel", e.target.value)}
                    />
                </div>
                <div>
                    <label className={`${FILTER_LABEL_CLS} invisible`} aria-hidden="true">&nbsp;</label>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" size="sm" type="button" onClick={onClear}>
                            <X className="mr-1 h-3.5 w-3.5" /> Limpar
                        </Button>
                        <Button variant="primary" size="sm" type="button" onClick={onApply}>
                            Aplicar Filtros
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
