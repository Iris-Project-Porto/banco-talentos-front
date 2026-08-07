import { Pagination } from "@/components/ui";
import { UsersRoundIcon } from "lucide-react";
import { MatchTable } from "../MatchTable/MatchTable";
import { useEffect, useMemo, useState } from "react";
import { MatchFilters } from "../MatchFilters/MatchFilters";
import type { MatchAvailabilityFilter, MatchSquadFilter } from "../../types/types";
import {
    filterMatches,
    MATCH_PAGE_SIZE,
    MOCK_MATCHES,
    paginateLocally,
} from "../../utils/matchList";

interface Props {
    vagaId?: string;
}

export function MatchResources({ vagaId: _vagaId }: Props) {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [squad, setSquad] = useState<MatchSquadFilter>("all");
    const [availability, setAvailability] = useState<MatchAvailabilityFilter>("all");

    const trimmedSearch = search.trim();

    useEffect(() => {
        setPage(0);
    }, [search, squad, availability]);

    const listResult = useMemo(() => {
        const filtered = filterMatches(MOCK_MATCHES, {
            search: trimmedSearch,
            squad,
            availability,
        });

        return paginateLocally(filtered, page, MATCH_PAGE_SIZE);
    }, [trimmedSearch, squad, availability, page]);

    function handleClearFilters() {
        setSearch("");
        setSquad("all");
        setAvailability("all");
        setPage(0);
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
                onSearchChange={setSearch}
                onSquadChange={setSquad}
                onAvailabilityChange={setAvailability}
                onClear={handleClearFilters}
            />

            <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
                <MatchTable data={listResult.content} />
                <Pagination
                    className="mt-0 py-4 px-4 border-t-0"
                    currentPage={page}
                    totalPages={listResult.totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}
