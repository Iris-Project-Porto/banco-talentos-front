import { Building2, Users } from "lucide-react";

export type SquadFormTab = "general" | "resources";

interface Props {
    active: SquadFormTab;
    onChange: (tab: SquadFormTab) => void;
}

const TABS = [
    {
        id: "general" as const,
        label: "Dados Gerais",
        icon: Building2,
    },
    {
        id: "resources" as const,
        label: "Recursos da Squad",
        icon: Users,
    },
];

export function SquadFormTabs({ active, onChange }: Props) {
    return (
        <div className="flex border-b border-slate-200">
            {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = active === tab.id;

                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onChange(tab.id)}
                        className={
                            "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 " +
                            (isActive
                                ? "border-pink text-pink"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300")
                        }
                    >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
