import { Pagination } from "@/components/ui";
import { Loader2, UsersRoundIcon } from "lucide-react";
import { MatchTable } from "../MatchTable/MatchTable";
import { useEffect, useMemo, useState } from "react";
import { MatchFilters } from "../MatchFilters/MatchFilters";
import type { Match, MatchAvailabilityFilter, MatchSquadFilter } from "../../types/types";
import { SummaryMatchModal } from "../SummaryMatchModal/SummaryMatchModal";
import { useQuery } from "@tanstack/react-query";
import { vagasApi } from "../../api/vagas.api";

const MATCH_PAGE_SIZE = 5;

interface Props {
    vagaId?: string;
}

export function MatchResources({ vagaId }: Props) {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [squad, setSquad] = useState<MatchSquadFilter>("all");
    const [availability, setAvailability] = useState<MatchAvailabilityFilter>("all");
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    const trimmedSearch = search.trim();

    useEffect(() => {
        setPage(0);
    }, [search, squad, availability]);

    const { data: squadsPage } = useQuery({
        queryKey: ["squads", "active-options"],
        queryFn: () => vagasApi.getSquads(0, 100),
    });

    const squadOptions = useMemo(() => {
        const options = [{ value: "all", label: "Todas" }];
        if (squadsPage?.content) {
            squadsPage.content.forEach((s: { name: string }) => {
                if (s.name) options.push({ value: s.name, label: s.name });
            });
        }
        return options;
    }, [squadsPage]);

    const {
        data: candidatesData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["vagas", vagaId, "matches", page, trimmedSearch, availability],
        queryFn: () =>
            vagasApi.getMatches(vagaId!, {
                page,
                size: MATCH_PAGE_SIZE,
                search: trimmedSearch || undefined,
                availability: availability !== "all" ? availability : undefined,
            }),
        enabled: Boolean(vagaId),
    });

    const candidates = useMemo(() => {
        const content = candidatesData?.content ?? [];
        if (squad === "all") return content;
        return content.filter((c) => c.squadName?.toLowerCase() === squad.toLowerCase());
    }, [candidatesData?.content, squad]);

    const totalPages = candidatesData?.totalPages ?? 1;

    function handleClearFilters() {
        setSearch("");
        setSquad("all");
        setAvailability("all");
        setPage(0);
    }

    function handleView(match: Match) {
        setSelectedMatch(match);
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <UsersRoundIcon className="size-6 shrink-0 text-pink" aria-hidden="true" />
                <div className="min-w-0">
                    <h2 className="text-xl font-bold text-slate-900">Ranking de Recursos</h2>
                    <p className="mt-0.5 text-sm text-slate-400">
                        Recursos elegíveis ordenados pela aderência aos requisitos da vaga.
                    </p>
                </div>
            </div>

            <MatchFilters
                search={search}
                squad={squad}
                availability={availability}
                squadOptions={squadOptions}
                onSearchChange={setSearch}
                onSquadChange={setSquad}
                onAvailabilityChange={setAvailability}
                onClear={handleClearFilters}
            />

            {!vagaId ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 shadow-card">
                    Salve as informações da vaga para calcular e visualizar os candidatos compatíveis.
                </div>
            ) : isLoading ? (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 shadow-card">
                    <Loader2 className="size-8 animate-spin text-pink" />
                    <p className="mt-3 text-sm font-medium text-slate-600">
                        Calculando compatibilidade dos candidatos...
                    </p>
                </div>
            ) : isError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600 shadow-card">
                    Ocorreu um erro ao carregar os candidatos compatíveis. Verifique se o backend está ativo e tente novamente.
                </div>
            ) : (
                <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
                    <MatchTable data={candidates} onView={handleView} />
                    <Pagination
                        className="mt-0 py-4 px-4 border-t-0"
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}

            {selectedMatch && (
                <SummaryMatchModal
                    match={selectedMatch}
                    onClose={() => setSelectedMatch(null)}
                />
            )}
        </div>
    );
}
