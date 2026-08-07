import { paginateLocally } from "@/features/projects/utils/projectsList";
import type { Match, MatchAvailabilityFilter, MatchSquadFilter } from "../types/types";

export const MATCH_PAGE_SIZE = 5;

export const MOCK_SQUAD_OPTIONS = [
    { value: "all", label: "Todos" },
    { value: "Squad Alpha", label: "Squad Alpha" },
    { value: "Squad Beta", label: "Squad Beta" },
    { value: "Squad Gamma", label: "Squad Gamma" },
];

export const MOCK_AVAILABILITY_OPTIONS = [
    { value: "all", label: "Todos" },
    { value: "available", label: "Disponível" },
    { value: "in_project", label: "Em Projeto" },
] as const;

export const MOCK_MATCHES: Match[] = [
    {
        id: "1",
        name: "John Doe",
        description: "Engenheiro de software com 10 anos de experiência",
        squadName: "Squad Alpha",
        avaiability: "available",
        matchScore: 95,
        mainSkills: [
            { name: "JavaScript", contributionPercent: 40 },
            { name: "React", contributionPercent: 35 },
            { name: "Node.js", contributionPercent: 20 },
        ],
        rankingScore: 1,
    },
    {
        id: "2",
        name: "Jane Doe",
        description: "Especialista em frontend e design systems",
        squadName: "Squad Beta",
        avaiability: "in_project",
        matchScore: 88,
        mainSkills: [
            { name: "TypeScript", contributionPercent: 38 },
            { name: "React", contributionPercent: 32 },
            { name: "CSS", contributionPercent: 18 },
        ],
        rankingScore: 2,
    },
    {
        id: "3",
        name: "Jim Doe",
        description: "Desenvolvedor backend com foco em APIs",
        squadName: "Squad Gamma",
        avaiability: "available",
        matchScore: 82,
        mainSkills: [
            { name: "Java", contributionPercent: 40 },
            { name: "Spring", contributionPercent: 30 },
            { name: "PostgreSQL", contributionPercent: 12 },
        ],
        rankingScore: 3,
    },
    {
        id: "4",
        name: "Jill Doe",
        description: "Full stack com experiência em cloud",
        squadName: "Squad Alpha",
        avaiability: "in_project",
        matchScore: 79,
        mainSkills: [
            { name: "AWS", contributionPercent: 30 },
            { name: "Docker", contributionPercent: 28 },
            { name: "Kubernetes", contributionPercent: 21 },
        ],
        rankingScore: 4,
    },
    {
        id: "5",
        name: "Jack Doe",
        description: "Desenvolvedor mobile e integrações",
        squadName: "Squad Beta",
        avaiability: "available",
        matchScore: 76,
        mainSkills: [
            { name: "React Native", contributionPercent: 36 },
            { name: "GraphQL", contributionPercent: 24 },
            { name: "REST", contributionPercent: 16 },
        ],
        rankingScore: 5,
    },
    {
        id: "6",
        name: "Julia Doe",
        description: "QA engineer com automação de testes",
        squadName: "Squad Gamma",
        avaiability: "available",
        matchScore: 71,
        mainSkills: [
            { name: "Cypress", contributionPercent: 34 },
            { name: "Jest", contributionPercent: 26 },
            { name: "Selenium", contributionPercent: 11 },
        ],
        rankingScore: 6,
    },
];

export function filterMatches(
    matches: Match[],
    filters: {
        search: string;
        squad: MatchSquadFilter;
        availability: MatchAvailabilityFilter;
    },
) {
    const term = filters.search.trim().toLowerCase();

    return matches.filter((match) => {
        const matchesSearch = !term || match.name.toLowerCase().includes(term);
        const matchesSquad = filters.squad === "all" || match.squadName === filters.squad;
        const matchesAvailability =
            filters.availability === "all" || match.avaiability === filters.availability;

        return matchesSearch && matchesSquad && matchesAvailability;
    });
}

export { paginateLocally };
