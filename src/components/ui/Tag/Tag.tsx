interface Props {
  kind: "area" | "skill" | "status-success" | "status-info" | "status-warning" | "status-alert";
  children: React.ReactNode;
  className?: string;
}

const styles: Record<Props["kind"], string> = {
  "area": "bg-pink-light text-pink rounded-full px-2.5 py-[3px] font-semibold",
  "skill": "bg-slate-100 text-slate-600 border border-slate-200 rounded-sm px-2 py-0.5 font-normal",
  "status-success": "bg-status-success-bg text-status-success-text rounded-full px-2.5 py-[3px] font-semibold",
  "status-info": "bg-status-info-bg text-status-info-text rounded-full px-2.5 py-[3px] font-semibold",
  "status-warning": "bg-status-warning-bg text-status-warning-text rounded-full px-2.5 py-[3px] font-semibold",
  "status-alert": "bg-status-alert-bg text-status-alert-text rounded-full px-2.5 py-[3px] font-semibold",
};

export function Tag({ kind, children, className = "" }: Props) {
  return (
    <span className={`inline-flex items-center text-xs ${styles[kind]} ${className}`}>
      {children}
    </span>
  );
}