import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthLayout({ children, footer }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-10">
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">VILT</span>
          <span className="text-pink text-2xl font-extrabold">.</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-login p-8">
          {children}
        </div>

        {footer && (
          <div className="text-center mt-5">
            {footer}
          </div>
        )}
      </div>
    </main>
  );
}