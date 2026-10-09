import { Search } from "lucide-react";
import { Button, Input } from "@/components/ui";

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
    const viewActive = statusType === "ACTIVE";

    return (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card">
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                <button
                    type="button"
                    onClick={() => onStatusChange("ACTIVE")}
                    className={`rounded-md px-4 py-1.5 text-xs font-semibold ${
                        viewActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                    }`}
                >
                    Ativos
                </button>
                <button
                    type="button"
                    onClick={() => onStatusChange("INACTIVE")}
                    className={`rounded-md px-4 py-1.5 text-xs font-semibold ${
                        !viewActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                    }`}
                >
                    Inativos / Histórico
                </button>
            </div>

            <div className="relative min-w-[280px] flex-1">
                <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                    placeholder="Buscar por nome do projeto..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 pr-3"
                />
            </div>

            <Button type="button" variant="secondary" size="md" onClick={onClear}>
                Limpar Filtros
            </Button>
        </div>
    );
}
