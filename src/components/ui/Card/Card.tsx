import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md";
}

export function Card({ padding = "md", className = "", children, ...props }: Props) {
  const p = padding === "md" ? "p-6" : "p-5";
  return (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-card ${p} ${className}`} {...props}>
      {children}
    </div>
  );
}
