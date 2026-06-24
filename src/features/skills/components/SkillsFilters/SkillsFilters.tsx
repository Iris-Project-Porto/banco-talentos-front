import { Search } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import { SKILL_CATEGORIES } from "../../types/types";
import { getSkillCategoryLabel } from "../../utils/skillDisplay";

const CATEGORY_OPTIONS = [
    { value: "", label: "Todas as Categorias" },
    ...SKILL_CATEGORIES.map((category) => ({
        value: category,
        label: getSkillCategoryLabel(category),
    })),
];

const filterLabelCls = "block text-[11px] font-semibold tracking-wide text-slate-500 mb-1.5";

interface Props {
    search: string;
    selectedCategory: string;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onClear: () => void;
}

export function SkillsFilters({
    search,
    selectedCategory,
    onSearchChange,
    onCategoryChange,
    onClear,
}: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-card px-5 py-4">
            <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                <div className="flex-1 min-w-[220px]">
                    <label className={filterLabelCls}>NOME DA SKILL</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                        <Input
                            placeholder="Ex: React, Python, Scrum..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 text-sm py-2.5"
                        />
                    </div>
                </div>

                <div className="w-full lg:w-56">
                    <label className={filterLabelCls}>CATEGORIA</label>
                    <Select
                        className="px-3.5 py-2.5 text-sm w-full border border-slate-300 rounded-lg focus:ring-pink focus:border-pink focus:shadow-focus-pink"
                        options={CATEGORY_OPTIONS}
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                    />
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={onClear}
                    className="border-0 bg-transparent text-slate-500 hover:text-pink hover:bg-transparent shadow-none font-medium self-end lg:mb-0.5"
                >
                    Limpar Filtros
                </Button>
            </div>
        </div>
    );
}
