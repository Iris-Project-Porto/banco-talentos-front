import type { ReactNode } from "react";

interface Props {
    active: boolean;
    onClick: () => void;
    children: ReactNode;
}

export function ProfileTabButton({ active, onClick, children }: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                active
                    ? "border-pink text-pink"
                    : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
        >
            {children}
        </button>
    );
}
