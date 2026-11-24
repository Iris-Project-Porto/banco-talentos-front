import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2, Save } from "lucide-react";

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    icon?: ReactNode;
    loading?: boolean;
}

export function FloatingActionButton({
    label,
    icon = <Save className="h-4 w-4" aria-hidden="true" />,
    loading = false,
    disabled,
    className = "",
    type = "button",
    ...props
}: FloatingActionButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 rounded-full bg-pink px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-95 hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
            {...props}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
                icon
            )}
            <span>{label}</span>
        </button>
    );
}