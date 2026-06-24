import type { SkillCategory } from "../../types/types";
import { getCategoryBadgeStyle, getSkillCategoryLabel } from "../../utils/skillDisplay";

interface Props {
    category: SkillCategory;
}

export function SkillCategoryBadge({ category }: Props) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${getCategoryBadgeStyle(category)}`}
        >
            {getSkillCategoryLabel(category)}
        </span>
    );
}
