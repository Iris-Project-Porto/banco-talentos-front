interface Props {
  variant: "senior" | "pleno" | "junior" | "success" | "info" | "warning" | "alert" | "pending" | "danger";
  children: React.ReactNode;
  className?: string;
}

const styles: Record<Props["variant"], string> = {
  senior: "bg-status-warning-bg text-status-warning-text",
  pleno: "bg-status-success-bg text-status-success-text",
  junior: "bg-status-info-bg text-status-info-text",
  success: "bg-status-success-bg text-status-success-text",
  info: "bg-status-info-bg text-status-info-text",
  warning: "bg-status-warning-bg text-status-warning-text",
  alert: "bg-status-alert-bg text-status-alert-text",
  danger: "bg-status-danger-bg text-status-danger-text",
  pending: "bg-status-pending-bg text-status-pending-text",
};

export function Badge({ variant, children, className = "" }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-bold tracking-[0.04em] ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}