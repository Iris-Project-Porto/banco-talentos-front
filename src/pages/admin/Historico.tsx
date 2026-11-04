import { useState } from "react";
import { PageHeader } from "@/components/ui";

const tabs = ["Projetos", "Squads", "Recursos"] as const;
type HistoryTab = (typeof tabs)[number];

export default function Historico() {
    const [activeTab, setActiveTab] = useState<HistoryTab>("Projetos");

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Histórico"
                subtitle="Histórico de eventos e alterações"
            />

            <div className="border-b border-slate-200">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-6 overflow-x-auto" role="tablist" aria-label="Categorias do histórico">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                                    activeTab === tab
                                        ? "border-slate-900 text-slate-900"
                                        : "border-transparent text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <span className="pb-3 text-xs font-medium text-slate-500">
                        Total de registros: 0
                    </span>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-16 text-center text-sm text-slate-400">
                Não há histórico de eventos registrados para esta aba
            </div>
        </div>
    );
}
