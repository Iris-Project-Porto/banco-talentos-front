import type { ReactNode } from "react";

export type ProjectFormTab = "general" | "squads";

const TABS: { id: ProjectFormTab; label: string }[] = [
    { id: "general", label: "Dados Gerais" },
    { id: "squads", label: "Squads Participantes" },
];

function TabButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                active
                    ? "border-pink text-pink"
                    : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
        >
            {children}
        </button>
    );
}

interface Props {
    active: ProjectFormTab;
    onChange: (tab: ProjectFormTab) => void;
}

export function ProjectFormTabs({ active, onChange }: Props) {
    return (
        <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-slate-200 px-7">
            {TABS.map((tab) => (
                <TabButton
                    key={tab.id}
                    active={active === tab.id}
                    onClick={() => onChange(tab.id)}
                >
                    {tab.label}
                </TabButton>
            ))}
        </div>
    );
}
