import { twMerge } from "tailwind-merge";

interface Props {
    value: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export function ProgressRing({
    value,
    size = 44,
    strokeWidth = 4,
    className,
}: Props) {
    const normalizedValue = Math.min(Math.max(value, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference * (1 - normalizedValue / 100);
    const valueSizeClass =
        size >= 72 ? "text-base" : size >= 56 ? "text-xs" : "text-2xs";

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
                    className="text-status-success-text transition-[stroke-dashoffset] duration-500"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                />
            </svg>
            <span className={twMerge("absolute font-bold tabular-nums text-slate-900", valueSizeClass)}>
                {normalizedValue}%
            </span>
        </div>
    );
}
