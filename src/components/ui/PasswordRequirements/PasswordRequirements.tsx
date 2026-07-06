import { Check, Circle } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { getPasswordRuleStatus } from "@/features/auth/validations/passwordRules";

interface Props {
  password: string;
  className?: string;
}

export function PasswordRequirements({ password, className = "" }: Props) {
  const rules = getPasswordRuleStatus(password);

  return (
    <ul
      className={twMerge("flex flex-col gap-1", className)}
      aria-label="Requisitos de senha"
    >
      {rules.map(({ id, label, met }) => (
        <li
          key={id}
          className={twMerge(
            "flex items-center gap-1.5 text-xs transition-colors",
            met ? "text-status-success-text" : "text-slate-400",
          )}
        >
          {met ? (
            <Check className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden />
          ) : (
            <Circle className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
          )}
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
