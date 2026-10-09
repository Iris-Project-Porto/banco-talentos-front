import type { ReactNode } from "react";

export function CorporateCard({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-3 border-b border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</p>
            </div>
            <div className="p-5 flex flex-col gap-4">{children}</div>
        </section>
    );
}
