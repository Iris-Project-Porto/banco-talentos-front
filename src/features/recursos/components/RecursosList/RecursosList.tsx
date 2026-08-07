import { Card, Pagination } from "@/components/ui";
import { PersonCard } from "@/features/profiles";
import type { UserProfile } from "@/features/profiles";
import { useRecursosList } from "../../hooks/useRecursosList";
import { RecursosFilters } from "../RecursosFilters/RecursosFilters";

export function RecursosList() {
    const {
        filters,
        setFilter,
        applyFilters,
        clearFilters,
        page,
        setPage,
        profiles,
        totalElements,
        totalPages,
        isLoading,
        isError,
        skillParam,
        clearSkillFilter,
        areas,
        groups,
    } = useRecursosList();

    function handleClearFilters() {
        clearFilters();
        if (skillParam) clearSkillFilter();
    }

    return (
        <>
            <RecursosFilters
                filters={filters}
                areas={areas}
                groups={groups}
                onChange={setFilter}
                onApply={applyFilters}
                onClear={handleClearFilters}
            />

            {skillParam && (
                <div className="flex w-fit items-center gap-2 rounded-md border border-pink/20 bg-pink/10 px-3 py-1.5 text-pink">
                    <span className="text-sm font-semibold">Skill: {skillParam}</span>
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="transition-colors hover:text-pink-dark"
                        title="Remover filtro"
                    >
                        ×
                    </button>
                </div>
            )}

            {isLoading ? (
                <p className="text-sm text-slate-400">Carregando...</p>
            ) : isError ? (
                <Card className="py-12 text-center">
                    <p className="text-sm text-slate-400">Não foi possível carregar os recursos.</p>
                </Card>
            ) : (
                <>
                    <p className="text-sm text-slate-500">
                        {totalElements} pessoa{totalElements !== 1 ? "s" : ""} no total
                    </p>

                    {profiles.length === 0 ? (
                        <Card className="py-12 text-center">
                            <p className="text-sm text-slate-400">Nenhum talento encontrado.</p>
                        </Card>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {profiles.map((profile: UserProfile) => (
                                    <PersonCard
                                        key={profile.id}
                                        id={profile.id}
                                        name={profile.name ?? "?"}
                                        email={profile.email}
                                        photoUrl={profile.photoUrl}
                                        area={profile.area}
                                        nivel={profile.levelOverride ?? profile.level ?? profile.nivel}
                                        allocationStatus={profile.allocationStatus}
                                        skills={profile.skills}
                                        createdAt={profile.createdAt}
                                        registrationStatus={profile.registrationStatus}
                                    />
                                ))}
                            </div>

                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </>
                    )}
                </>
            )}
        </>
    );
}
