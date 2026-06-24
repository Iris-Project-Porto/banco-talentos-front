import type { Skill } from "../types/types";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

function resolveAvatarUrl(url?: string) {
    if (!url) return undefined;
    if (/^https?:\/\//i.test(url)) return url;

    const origin = API_BASE.replace(/\/api\/?$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;

    return `${origin}${path}`;
}

export function normalizeSkill(skill: Skill): Skill {
    return {
        ...skill,
        avatarUrls: skill.avatarUrls?.map((url) => resolveAvatarUrl(url) ?? url),
    };
}

export function normalizeSkills(skills: Skill[]): Skill[] {
    return skills.map(normalizeSkill);
}
