import { ProgressRing } from "@/components/ui";
import { Sparkles } from "lucide-react";
import type { Match } from "../../types/types";

interface Props {
    match?: Match | null;
    onClose: () => void;
}

function SkillProgress({
    label,
    detail,
    percent,
}: {
    label: string;
    detail: string;
    percent: number;
}) {
    const normalizedPercent = Math.min(Math.max(percent, 0), 100);

    return (
        <div className="flex w-full flex-col gap-2">
            <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-0.5 text-sm text-slate-600">{detail}</p>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
                    style={{ width: `${normalizedPercent}%` }}
                    role="progressbar"
                    aria-label={label}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={normalizedPercent}
                />
            </div>
        </div>
    );
}

export function SummaryMatchModal({ match, onClose }: Props) {
    if (!match) return null;

    const summary = match.summary ?? {
        requiredSkillsMatched: 0,
        requiredSkillsTotal: 0,
        desirableSkillsMatched: 0,
        desirableSkillsTotal: 0,
    };

    const requiredPercent =
        summary.requiredSkillsTotal > 0
            ? (summary.requiredSkillsMatched / summary.requiredSkillsTotal) * 100
            : 0;
    const desirablePercent =
        summary.desirableSkillsTotal > 0
            ? (summary.desirableSkillsMatched / summary.desirableSkillsTotal) * 100
            : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative flex w-full max-w-md flex-col rounded-2xl bg-white shadow-login">
                <div className="flex items-center justify-between border-b border-slate-200 px-7 py-5">
                    <div className="flex items-center gap-2.5">
                        <Sparkles className="size-5 shrink-0 text-sky-500" aria-hidden="true" />
                        <h2 className="text-lg font-bold text-slate-900">Resumo do Match</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xl leading-none text-slate-400 hover:text-slate-600"
                        aria-label="Fechar"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex flex-col gap-6 px-7 py-6">
                    <div className="flex items-center gap-5">
                        <ProgressRing
                            value={match.matchScore}
                            size={72}
                            strokeWidth={5}
                        />
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Candidato #{match.rankingScore}
                            </p>
                            <p className="truncate text-lg font-bold text-slate-900">
                                {match.name}
                            </p>
                            {match.description && (
                                <p className="truncate text-xs text-slate-500">{match.description}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <SkillProgress
                            label="Skills obrigatórias atendidas"
                            detail={`${summary.requiredSkillsMatched} de ${summary.requiredSkillsTotal} obrigatórias`}
                            percent={requiredPercent}
                        />
                        <SkillProgress
                            label="Skills desejáveis atendidas"
                            detail={`${summary.desirableSkillsMatched} de ${summary.desirableSkillsTotal} desejáveis`}
                            percent={desirablePercent}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
