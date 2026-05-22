interface Props {
  kind: "area" | "skill" | "status-success" | "status-info" | "status-warning" | "status-alert";
  children: React.ReactNode;
  className?: string;
}

const styles: Record<Props["kind"], string> = {
  "area":           "bg-pink-light text-pink rounded-full px-2.5 py-[3px] font-semibold",
  "skill":          "bg-slate-100 text-slate-600 border border-slate-200 rounded-sm px-2 py-0.5 font-normal",
  "status-success": "bg-[#DCFCE7] text-[#166534] rounded-full px-2.5 py-[3px] font-semibold",
  "status-info":    "bg-[#DBEAFE] text-[#1E40AF] rounded-full px-2.5 py-[3px] font-semibold",
  "status-warning": "bg-[#FEF9C3] text-[#92400E] rounded-full px-2.5 py-[3px] font-semibold",
  "status-alert":   "bg-[#FEF3C7] text-[#B45309] rounded-full px-2.5 py-[3px] font-semibold",
};

export function Tag({ kind, children, className = "" }: Props) {
  return (
    <span className={`inline-flex items-center text-xs ${styles[kind]} ${className}`}>
      {children}
    </span>
  );
}
