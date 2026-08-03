interface Props {
    vagaId?: string;
}

export function MatchRecursos({ vagaId }: Props) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-card px-7 py-16 text-center">
            <p className="text-sm font-medium text-slate-700">Ranking de Recursos</p>
            <p className="text-xs text-slate-400 mt-2">
                {vagaId
                    ? "Em breve: recursos elegíveis ranqueados pelo match com os requisitos da vaga."
                    : "Salve os dados da vaga para visualizar o ranking de recursos."}
            </p>
        </div>
    );
}
