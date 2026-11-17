import { AlertCircle, Calendar, CheckCircle2, Info, Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui";
import type { JobPostingAllocationResponse } from "../../types/types";

interface Props {
    allocations: JobPostingAllocationResponse[];
    loading?: boolean;
    error?: boolean;
}

function formatDateBr(isoDate?: string) {
    if (!isoDate) return "—";
    return isoDate.slice(0, 10).split("-").reverse().join("/");
}

/**
 * Displays why a vacancy has status FILLED (either resource allocation details or manual status change).
 */
export function FilledAllocationInfo({ allocations, loading = false, error = false }: Props) {
    if (loading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card flex items-center gap-3 text-sm text-slate-500">
                <Loader2 className="size-4 animate-spin text-pink shrink-0" />
                <span>Carregando motivo do preenchimento da vaga...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 flex items-center gap-3 text-sm text-red-700">
                <AlertCircle className="size-5 text-red-600 shrink-0" />
                <span>Não foi possível carregar os detalhes da alocação desta vaga.</span>
            </div>
        );
    }

    const activeAllocations = allocations.filter((a) => a.active);
    const list = activeAllocations.length > 0 ? activeAllocations : allocations;

    if (list.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 flex items-start gap-3">
                <Info className="size-5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                    <h3 className="text-sm font-semibold text-slate-800">Motivo do preenchimento</h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                        Vaga marcada manualmente como <b>Preenchida</b> (sem alocação de recurso registrada pelo sistema).
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-card">
            <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <h3 className="text-base font-bold">Vaga preenchida por alocação de recurso</h3>
            </div>
            <p className="text-xs text-emerald-700 mt-1">
                Esta vaga foi preenchida com o recurso selecionado na etapa de alocação:
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3">
                {list.map((alloc) => (
                    <div
                        key={alloc.id}
                        className="rounded-lg border border-emerald-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <Avatar name={alloc.resourceName} size={42} />
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{alloc.resourceName}</p>
                                <p className="text-xs text-slate-500 truncate">
                                    Papel: <span className="font-semibold text-slate-700">{alloc.role}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                            {(alloc.projectName || alloc.squadName) && (
                                <div>
                                    <span className="text-slate-400">Alocado em: </span>
                                    <span className="font-semibold text-slate-800">
                                        {[alloc.projectName, alloc.squadName].filter(Boolean).join(" • ")}
                                    </span>
                                </div>
                            )}
                            <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                                <Calendar className="size-3.5 text-slate-500" />
                                Início: {formatDateBr(alloc.startDate)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {list[0]?.createdBy && (
                <p className="text-[11px] text-emerald-700/80 mt-3">
                    Alocação registrada por <span className="font-semibold">{list[0].createdBy}</span>
                    {list[0].createdAt ? ` em ${formatDateBr(list[0].createdAt)}` : ""}.
                </p>
            )}
        </div>
    );
}

