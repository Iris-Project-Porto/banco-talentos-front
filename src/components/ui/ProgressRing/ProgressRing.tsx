import { twMerge } from "tailwind-merge";

interface Props {
    value: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
    color?: string;
}

export function getProgressColor(value: number): string {
    if (value <= 33) return "text-red-500";
    if (value <= 66) return "text-yellow-500";
    return "text-emerald-500";
}

export function ProgressRing({
    value,
    size = 44,
    strokeWidth = 4,
    className,
    color,
}: Props) {
    const normalizedValue = Math.min(Math.max(value, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference * (1 - normalizedValue / 100);
    const valueSizeClass =
        size >= 72 ? "text-base" : size >= 56 ? "text-xs" : "text-2xs";
    const progressColor = color || getProgressColor(normalizedValue);

    return (
        <div
            className={twMerge("relative inline-flex shrink-0 items-center justify-center", className)}
            style={{ width: size, height: size }}
            role="progressbar"
            aria-label={`Match de ${normalizedValue}%`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={normalizedValue}
        >
            <svg
                className="-rotate-90"
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                aria-hidden="true"
            >
                <circle
                    className="text-slate-200"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                />
                <circle
                    className={twMerge("transition-[stroke-dashoffset] duration-500", progressColor)}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    data-testid="progress-ring-indicator"
                />
            </svg>
            <span className={twMerge("absolute font-bold tabular-nums text-slate-900", valueSizeClass)}>
                {normalizedValue}%
            </span>
        </div>
    );
}
