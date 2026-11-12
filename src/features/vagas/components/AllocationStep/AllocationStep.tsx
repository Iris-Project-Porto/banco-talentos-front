import { useMemo, useState } from "react";
import { Avatar, Button, Input } from "@/components/ui";
import type { Match } from "../../types/types";

export interface AllocationResourceData {
    resourceId: string;
    resourceName: string;
    startDate: string;
    role: string;
}

const EXPERIENCE_LEVEL_MAP: Record<string, string> = {
    JUNIOR: "Júnior",
    PLENO: "Pleno",
    SENIOR: "Sênior",
    ESPECIALISTA: "Especialista",
};

const MODALITY_MAP: Record<string, string> = {
    REMOTO: "Remoto",
    HIBRIDO: "Híbrido",
    PRESENCIAL: "Presencial",
};

const ROLE_SUGGESTIONS = [
    "Tech Lead Frontend",
    "Tech Lead Backend",
    "Dev Frontend",
    "Dev Backend",
    "Dev Fullstack",
    "QA Engineer",
    "Designer UI/UX",
    "Product Owner",
    "Scrum Master",
];

export interface AllocationStepProps {
    vaga: {
        title?: string;
        vacancyCode?: string;
        projectName?: string;
        squadName?: string;
        experienceLevel?: string;
        modality?: string;
        estimatedAllocationWeeks?: number;
        recruiter?: string;
        isUrgent?: boolean;
        status?: string;
        skills?: Array<{ name: string; type: "MANDATORY" | "DESIRABLE" }>;
    };
    selectedMatches: Match[];
    onBack: () => void;
    onConfirm: (allocation: AllocationResourceData) => void;
    saving?: boolean;
}

export function AllocationStep({
    vaga,
    selectedMatches,
    onBack,
    onConfirm,
    saving = false,
}: AllocationStepProps) {
    const today = new Date().toISOString().slice(0, 10);

    const sortedMatches = useMemo(() => {
        return [...selectedMatches].sort((a, b) => {
            const scoreDiff = (b.matchScore ?? 0) - (a.matchScore ?? 0);
            if (scoreDiff !== 0) return scoreDiff;
            return (a.rankingScore ?? 0) - (b.rankingScore ?? 0);
        });
    }, [selectedMatches]);

    const [selectedResourceId, setSelectedResourceId] = useState<string | null>(() =>
        sortedMatches.length === 1 ? sortedMatches[0].id : null
    );

    const effectiveSelectedId = useMemo(() => {
        if (selectedResourceId && sortedMatches.some((m) => m.id === selectedResourceId)) {
            return selectedResourceId;
        }
        return sortedMatches.length === 1 ? sortedMatches[0].id : null;
    }, [selectedResourceId, sortedMatches]);

    const selectedMatch = useMemo(
        () => sortedMatches.find((m) => m.id === effectiveSelectedId) || null,
        [sortedMatches, effectiveSelectedId]
    );

    function getDefaultAllocation(match: Match) {
        return {
            startDate: today,
            role: match.description || vaga.title || "Desenvolvedor",
        };
    }

    const [allocations, setAllocations] = useState<Record<string, { startDate: string; role: string }>>(() => {
        const initialMap: Record<string, { startDate: string; role: string }> = {};
        selectedMatches.forEach((m) => {
            initialMap[m.id] = getDefaultAllocation(m);
        });
        return initialMap;
    });

    const [fieldErrors, setFieldErrors] = useState<{ startDate?: string; role?: string }>({});

    function selectCandidate(matchId: string) {
        setSelectedResourceId(matchId);
        setFieldErrors({});
    }

    function updateField(match: Match, field: "startDate" | "role", value: string) {
        setAllocations((prev) => ({
            ...prev,
            [match.id]: {
                ...(prev[match.id] || getDefaultAllocation(match)),
                [field]: value,
            },
        }));
        if (effectiveSelectedId === match.id) {
            setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    }

    function handleConfirm() {
        if (!selectedMatch) return;
        const current = allocations[selectedMatch.id] || getDefaultAllocation(selectedMatch);
        const errors: { startDate?: string; role?: string } = {};
        if (!current.startDate) {
            errors.startDate = "Informe a data de início";
        }
        if (!current.role.trim()) {
            errors.role = "Informe o papel";
        }
        if (errors.startDate || errors.role) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});
        onConfirm({
            resourceId: selectedMatch.id,
            resourceName: selectedMatch.name,
            startDate: current.startDate,
            role: current.role.trim(),
        });
    }

    const mandatorySkills = (vaga.skills || [])
        .filter((s) => s.type === "MANDATORY")
        .map((s) => s.name)
        .join(", ");

    const formattedLevel = vaga.experienceLevel
        ? EXPERIENCE_LEVEL_MAP[vaga.experienceLevel] || vaga.experienceLevel
        : "—";

    const formattedModality = vaga.modality
        ? MODALITY_MAP[vaga.modality] || vaga.modality
        : "—";

    const count = selectedMatches.length;

    return (
        <div className="flex flex-col gap-6">
            {/* Card Resumo da Vaga */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
                <h3 className="text-base font-bold text-slate-800">Resumo da Vaga</h3>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{vaga.title || "Vaga sem título"}</h2>
                        <p className="text-xs font-mono text-slate-400 mt-0.5">#{vaga.vacancyCode || "—"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
                            <span className="inline-flex items-center justify-center size-3.5 rounded-full bg-blue-600 text-white text-[9px] font-black leading-none">
                                !
                            </span>
                            Em Alocação
                        </span>
                        {vaga.isUrgent && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-semibold text-red-700">
                                <span className="inline-flex items-center justify-center size-3.5 rounded-full bg-red-600 text-white text-[9px] font-black leading-none">
                                    !
                                </span>
                                Urgente
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                    <div className="lg:border-r lg:border-slate-200 lg:pr-3">
                        <p className="text-xs text-slate-400 font-medium">Projeto</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{vaga.projectName || "—"}</p>
                    </div>
                    <div className="lg:border-r lg:border-slate-200 lg:pr-3">
                        <p className="text-xs text-slate-400 font-medium">Squad</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{vaga.squadName || "—"}</p>
                    </div>
                    <div className="lg:border-r lg:border-slate-200 lg:pr-3">
                        <p className="text-xs text-slate-400 font-medium">Nível</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{formattedLevel}</p>
                    </div>
                    <div className="lg:border-r lg:border-slate-200 lg:pr-3">
                        <p className="text-xs text-slate-400 font-medium">Modelo</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{formattedModality}</p>
                    </div>
                    <div className="lg:border-r lg:border-slate-200 lg:pr-3">
                        <p className="text-xs text-slate-400 font-medium">Duração Estimada</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">
                            {vaga.estimatedAllocationWeeks ? `${vaga.estimatedAllocationWeeks} semanas` : "—"}
                        </p>
                    </div>
                    <div className="lg:border-r lg:border-slate-200 lg:pr-3">
                        <p className="text-xs text-slate-400 font-medium">Recrutador</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{vaga.recruiter || "—"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Skills Obrigatórias</p>
                        <p className="text-sm font-semibold text-slate-800 truncate" title={mandatorySkills}>
                            {mandatorySkills || "—"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Grid de Cards dos Recursos Finalistas */}
            {count === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 shadow-card">
                    Nenhum recurso selecionado para alocação. Volte ao Match para selecionar candidatos.
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <p className="text-sm font-semibold text-slate-700">
                            {count === 1
                                ? "Candidato selecionado para preencher a vaga"
                                : `Finalistas (${count}) — selecione 1 candidato para preencher a vaga`}
                        </p>
                        {count > 1 && !selectedMatch && (
                            <span className="text-xs font-medium text-amber-600">
                                Escolha um candidato abaixo para confirmar a alocação
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {sortedMatches.map((match, index) => {
                            const item = allocations[match.id] || getDefaultAllocation(match);
                            const isSelected = effectiveSelectedId === match.id;
                            return (
                                <div
                                    key={match.id}
                                    onClick={() => selectCandidate(match.id)}
                                    className={`rounded-xl border bg-white p-5 shadow-card flex flex-col justify-between cursor-pointer transition-all ${
                                        isSelected
                                            ? "border-pink ring-2 ring-pink/15"
                                            : "border-slate-200 hover:border-slate-300"
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-bold text-slate-400">{index + 1}</span>
                                            <label
                                                className="inline-flex items-center gap-2 cursor-pointer"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <input
                                                    type="radio"
                                                    name="allocation-candidate"
                                                    value={match.id}
                                                    checked={isSelected}
                                                    onChange={() => selectCandidate(match.id)}
                                                    aria-label={`Selecionar ${match.name}`}
                                                    className="size-4 accent-pink cursor-pointer"
                                                />
                                                <span
                                                    className={`text-xs font-semibold ${
                                                        isSelected ? "text-pink" : "text-slate-500"
                                                    }`}
                                                >
                                                    {isSelected ? "Selecionado" : "Selecionar"}
                                                </span>
                                            </label>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Avatar name={match.name} photoUrl={match.photoUrl} size={42} />
                                                <div className="min-w-0">
                                                    <h4 className="text-base font-bold text-slate-900 truncate">{match.name}</h4>
                                                    <p className="text-xs text-slate-500 truncate">
                                                        {match.description || match.squadName || "Colaborador"}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-emerald-600 shrink-0">
                                                {match.matchScore}% Match
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className="mt-4 border-t border-slate-100 pt-4 cursor-default"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <Input
                                                aria-label="Data Início"
                                                label="Data Início"
                                                type="date"
                                                value={item.startDate}
                                                error={isSelected ? fieldErrors.startDate : undefined}
                                                onChange={(e) => updateField(match, "startDate", e.target.value)}
                                            />
                                            <Input
                                                aria-label="Papel"
                                                label="Papel"
                                                list="role-suggestions"
                                                placeholder="Ex: Tech Lead Frontend"
                                                value={item.role}
                                                error={isSelected ? fieldErrors.role : undefined}
                                                onChange={(e) => updateField(match, "role", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <datalist id="role-suggestions">
                        {ROLE_SUGGESTIONS.map((role) => (
                            <option key={role} value={role} />
                        ))}
                    </datalist>
                </div>
            )}

            {/* Ações Inferiores */}
            <div className="flex items-center justify-end gap-3 mt-4">
                <Button type="button" variant="secondary" onClick={onBack} disabled={saving}>
                    Voltar ao Match
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    disabled={!selectedMatch}
                    loading={saving}
                    onClick={handleConfirm}
                >
                    {selectedMatch
                        ? `Confirmar Alocação de ${selectedMatch.name.split(" ")[0]}`
                        : "Confirmar Alocação do Recurso"}
                </Button>
            </div>
        </div>
    );
}

