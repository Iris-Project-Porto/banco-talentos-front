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
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed "border-pink text-pink" ${
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
        <div className="flex items-center gap-1 px-7 border-b border-slate-200 shrink-0 overflow-x-auto">
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
