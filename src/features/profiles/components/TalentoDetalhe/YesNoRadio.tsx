export function YesNoRadio({
    label,
    value,
    onChange,
}: {
    label: string;
    value: boolean | null;
    onChange: (v: boolean) => void;
}) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-600">{label}</span>
            <div className="flex h-10 items-center gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                        type="radio"
                        className="size-4 accent-sky-600"
                        checked={value === true}
                        onChange={() => onChange(true)}
                    />
                    Sim
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                        type="radio"
                        className="size-4 accent-sky-600"
                        checked={value === false}
                        onChange={() => onChange(false)}
                    />
                    Não
                </label>
            </div>
        </div>
    );
}
