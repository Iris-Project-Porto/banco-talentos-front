import { useState, Suspense } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { Menu, X, LogOut } from "lucide-react";

const staticNavItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/fila", label: "Fila de revisão" },
  { to: "/admin/talentos", label: "Recursos" },
  { to: "/admin/alocados", label: "Alocados" },
  { to: "/admin/usuarios", label: "Usuários" },
  { to: "/admin/skills", label: "Skills" },
  { to: "/admin/vagas", label: "Vagas" },
  { to: "/admin/projetos", label: "Projetos" },
  { to: "/admin/squads", label: "Squads" },
  { to: "/admin/recursos", label: "Gestão de Recursos" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const sidebarContent = (
    <>
      <div className="pr-5 pt-5 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center">
          <img src="/images/iris_branco.svg" alt="ÍRIS" className="h-28 w-auto p-1 pl-0 rounded-md" />
        </div>
        <button
          className="md:hidden text-white/50 hover:text-white p-1"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <p className="px-5 pt-2 pb-1 text-2xs font-semibold uppercase tracking-[0.08em] text-slate-500">Menu</p>
        {staticNavItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setIsMobileMenuOpen(false)}
            end={to === "/admin/talentos" || to === "/admin/dashboard"}
            className={({ isActive }) =>
              `flex items-center px-5 py-[9px] text-sm transition-colors border-l-[3px] ${isActive
                ? "border-l-pink bg-white/5 text-white font-medium"
                : "border-l-transparent text-white/55 hover:text-white/80"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-5 border-t border-white/[0.06] mt-auto">
        <p className="text-xs font-medium text-white truncate mb-0.5">{user?.name}</p>
        <p className="text-xs text-white/40 truncate mb-3">{user?.email}</p>
        <button onClick={handleLogout} className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1.5">
          <LogOut className="w-3.5 h-3.5" />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="relative w-72 max-w-[80%] flex flex-col bg-slate-950 h-full shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
      <aside className="hidden md:flex w-64 lg:w-72 shrink-0 flex-col bg-slate-950 h-screen">
        {sidebarContent}
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center justify-end px-4 py-3 bg-white border-b border-slate-200 shrink-0">
          <div className="hidden items-center">
            <img src="/images/iris_preto.svg" alt="ÍRIS" className="h-12 w-auto p-1 rounded-md" />
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-slate-600 hover:text-slate-900 focus:outline-none">
            <Menu className="w-6 h-6" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            <Suspense fallback={<div className="flex h-full items-center justify-center py-20 text-sm text-slate-400">Carregando módulo...</div>}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}