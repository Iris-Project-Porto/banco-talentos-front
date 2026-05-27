interface Props {
  variant: "senior" | "pleno" | "junior" | "success" | "info" | "warning" | "alert" | "pending";
  children: React.ReactNode;
  className?: string;
}

const styles: Record<Props["variant"], string> = {
  senior: "bg-[#FEF9C3] text-[#854D0E]",
  pleno: "bg-[#DCFCE7] text-[#166534]",
  junior: "bg-[#EFF6FF] text-[#1E40AF]",
  success: "bg-[#DCFCE7] text-[#166534]",
  info: "bg-[#DBEAFE] text-[#1E40AF]",
  warning: "bg-[#FEF9C3] text-[#92400E]",
  alert: "bg-[#FEF3C7] text-[#B45309]",
  pending: "bg-amber-100 text-amber-700",
};

export function Badge({ variant, children, className = "" }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-bold tracking-[0.04em] ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
