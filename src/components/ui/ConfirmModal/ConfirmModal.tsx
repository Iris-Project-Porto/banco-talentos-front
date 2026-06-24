import { Button } from "../Button/Button";

interface Props {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export function ConfirmModal({
    title,
    message,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    loading = false,
    onConfirm,
    onClose,
}: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-login w-full max-w-md">
                <div className="px-7 py-5 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                </div>
                <div className="px-7 py-6">
                    <p className="text-sm text-slate-600">{message}</p>
                </div>
                <div className="px-7 py-5 border-t border-slate-200 flex items-center justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                        {cancelLabel}
                    </Button>
                    <Button type="button" variant="danger" onClick={onConfirm} loading={loading}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
