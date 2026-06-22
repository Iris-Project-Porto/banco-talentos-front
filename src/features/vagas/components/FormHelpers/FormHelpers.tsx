import React from "react";

export const INPUT_CLS = "w-full font-sans text-base rounded-lg px-3.5 py-2.5 outline-none transition-all bg-white border border-slate-300 focus:border-pink focus:shadow-focus-pink text-slate-900 placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed";

export const ErrorMsg = ({ msg }: { msg?: string }) =>
    msg ? <span className="text-xs text-red-500 block mt-1 leading-tight">{msg}</span> : null;

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">{label}</label>
            {children}
        </div>
    );
}