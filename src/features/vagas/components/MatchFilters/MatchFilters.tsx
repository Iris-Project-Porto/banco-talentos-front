import { Search } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import type { MatchAvailabilityFilter, MatchSquadFilter } from "../../types/types";

const filterLabelCls = "block text-[11px] font-semibold tracking-wide text-slate-500 mb-1.5";

const DEFAULT_SQUAD_OPTIONS = [{ value: "all", label: "Todas" }];

const AVAILABILITY_OPTIONS = [
    { value: "all", label: "Todas" },
    { value: "available", label: "Disponível" },
    { value: "allocated", label: "Em projeto" },
    { value: "waiting", label: "Aguardando" },
];

interface Props {
    search: string;
    squad: MatchSquadFilter;
    availability: MatchAvailabilityFilter;
    squadOptions?: { value: string; label: string }[];
    onSearchChange: (value: string) => void;
    onSquadChange: (value: MatchSquadFilter) => void;
    onAvailabilityChange: (value: MatchAvailabilityFilter) => void;
    onClear: () => void;
}

export function MatchFilters({
    search,
    squad,
    availability,
    squadOptions,
    onSearchChange,
    onSquadChange,
    onAvailabilityChange,
    onClear,
}: Props) {
    const finalSquadOptions = squadOptions && squadOptions.length > 0 ? squadOptions : DEFAULT_SQUAD_OPTIONS;

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-card px-5 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="min-w-0 lg:col-span-3">
                    <label className={filterLabelCls}>NOME DO RECURSO</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                        <Input
                            placeholder="Buscar por nome do recurso..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 pr-3"
                        />
                    </div>
                </div>

                <div className="min-w-0 lg:col-span-3">
                    <label className={filterLabelCls}>SQUAD</label>
                    <Select
                        options={[...finalSquadOptions]}
                        value={squad}
                        onChange={(e) => onSquadChange(e.target.value)}
                    />
                </div>

                <div className="min-w-0 lg:col-span-3">
                    <label className={filterLabelCls}>DISPONIBILIDADE</label>
                    <Select
                        options={AVAILABILITY_OPTIONS}
                        value={availability}
                        onChange={(e) => onAvailabilityChange(e.target.value as MatchAvailabilityFilter)}
                    />
                </div>

                <div className="min-w-0 lg:col-span-3">
                    <label className={`${filterLabelCls} invisible`} aria-hidden="true">&nbsp;</label>
                    <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        fullWidth
                        onClick={onClear}
                    >
                        Limpar Filtros
                    </Button>
                </div>
            </div>
        </div>
    );
}
