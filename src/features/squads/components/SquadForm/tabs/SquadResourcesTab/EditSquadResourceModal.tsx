import { useState } from "react";
import { Button, Input } from "@/components/ui";
import type { Recurso } from "@/features/recursos/types/recurso";

interface Props {
    recurso: Recurso;
    onClose: () => void;
    onSave: (recurso: Recurso, newJobTitle: string) => void;
}

export function EditSquadResourceModal({ recurso, onClose, onSave }: Props) {
    const [jobTitle, setJobTitle] = useState(recurso.jobTitle || "");

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        onSave(recurso, jobTitle.trim());
        onClose();
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-login w-full max-w-lg flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Editar Recurso da Squad</h2>
                        <p className="text-sm text-slate-400">Altere o cargo ou função deste recurso na squad.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                        aria-label="Fechar modal"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSave}>
                    <div className="p-6 flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-slate-700">Recurso</label>
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                <p className="text-sm font-semibold text-slate-900">{recurso.name}</p>
                                {recurso.email && <p className="text-xs text-slate-500">{recurso.email}</p>}
                            </div>
                        </div>

                        <Input
                            label="Cargo/Função"
                            placeholder="Ex: Tech Lead, Desenvolvedor Frontend, Scrum Master"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                        />
                    </div>

                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary">
                            Salvar Alteração
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

