import { useEffect, useMemo } from "react";
import type { UseFormSetValue } from "react-hook-form";
import {
    buildCategorySelectOptions,
    getSkillCategoriesByType,
    isCategoryCompatibleWithType,
} from "../../../../utils/skillCategories";
import type { SkillFormInput } from "../../../../validations/validations";

export function useSkillCategories(
    selectedType: string,
    selectedCategory: string,
    setValue: UseFormSetValue<SkillFormInput>,
) {
    const categoryOptions = useMemo(() => {
        if (selectedType !== "HARD" && selectedType !== "SOFT") {
            return buildCategorySelectOptions([]);
        }
        return buildCategorySelectOptions(getSkillCategoriesByType(selectedType));
    }, [selectedType]);

    useEffect(() => {
        if (selectedCategory && !isCategoryCompatibleWithType(selectedType, selectedCategory)) {
            setValue("category", "", { shouldValidate: false });
        }
    }, [selectedType, selectedCategory, setValue]);

    return { categoryOptions };
}
