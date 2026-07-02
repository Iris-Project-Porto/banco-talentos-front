import { Search } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";

const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Ativo" },
    { value: "INACTIVE", label: "Inativo" },
];

const filterLabelCls = "block text-[11px] font-semibold tracking-wide text-slate-500 mb-1.5";

interface Props {
    search: string;
    statusType: "ACTIVE" | "INACTIVE";
    onSearchChange: (value: string) => void;
    onStatusChange: (value: "ACTIVE" | "INACTIVE") => void;
    onClear: () => void;
}

export function ProjectsFilters({
    search,
    statusType,
    onSearchChange,
    onStatusChange,
    onClear,
}: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-card px-5 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="min-w-0 lg:col-span-4">
                    <label className={filterLabelCls}>NOME DO PROJETO</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                        <Input
                            placeholder="Buscar por nome do projeto..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 pr-3"
                        />
                    </div>
                </div>

                <div className="min-w-0 lg:col-span-4">
                    <label className={filterLabelCls}>STATUS</label>
                    <Select
                        options={STATUS_OPTIONS}
                        value={statusType}
                        onChange={(e) => onStatusChange(e.target.value as "ACTIVE" | "INACTIVE")}
                    />
                </div>

                <div className="min-w-0 lg:col-span-4">
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
