export function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-3 border-b border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</p>
                {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
            <div className="p-5 flex flex-col gap-4">{children}</div>
        </div>
    );
}