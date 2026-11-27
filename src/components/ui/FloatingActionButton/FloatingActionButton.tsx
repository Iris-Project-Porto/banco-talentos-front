import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2, Save } from "lucide-react";

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
    loading?: boolean;
    variant?: "primary" | "secondary";
    floating?: boolean;
}

export function FloatingActionButton({
    label,
    icon = <Save className="h-4 w-4" aria-hidden="true" />,
    iconPosition = "left",
    loading = false,
    variant = "primary",
    floating = true,
    disabled,
    className = "",
    type = "button",
    ...props
}: FloatingActionButtonProps) {
    const positionClasses = floating ? "fixed bottom-6 right-6 z-40" : "";
    const variantClasses =
        variant === "secondary"
            ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-300"
            : "bg-pink text-white hover:brightness-95 focus-visible:ring-pink";

    const renderedIcon = loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
    ) : (
        icon
    );

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`${positionClasses} inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold shadow-lg transition-all hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses} ${className}`}
            {...props}
        >
            {iconPosition === "left" && renderedIcon}
            <span>{label}</span>
            {iconPosition === "right" && renderedIcon}
        </button>
    );
}