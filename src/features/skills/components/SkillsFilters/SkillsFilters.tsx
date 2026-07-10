import { Search } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import { SKILL_CATEGORIES } from "../../utils/skillCategories";
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="min-w-0 lg:col-span-4">
                    <label className={filterLabelCls}>NOME DA SKILL</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                        <Input
                            placeholder="Ex: React, Python, Scrum..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 pr-3"
                        />
                    </div>
                </div>

                <div className="min-w-0 lg:col-span-4">
                    <label className={filterLabelCls}>CATEGORIA</label>
                    <Select
                        options={CATEGORY_OPTIONS}
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
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
