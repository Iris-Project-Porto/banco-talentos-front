import { useQuery } from "@tanstack/react-query";
import { skillsApi } from "../api/skills.api";
import { type Skill, type SkillsPaginatedResponse } from "../types/skills";

export function useSkillsQuery(inactive = false) {
  return useQuery({
    queryKey: ["skills", { inactive }],
    queryFn: async (): Promise<Skill[]> => {
      const response = await (inactive ? skillsApi.getInactiveSkills() : skillsApi.getActiveSkills());
      const paginatedResponse = response as SkillsPaginatedResponse;
      return paginatedResponse?.content || [];
    },
  });
}
