import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/meu-perfil",    label: "Meu Perfil" },
  { to: "/meu-historico", label: "Meu Histórico" },
];

export default function RecursoLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className="w-40 shrink-0 flex flex-col bg-slate-950 h-screen">
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <span className="font-bold text-lg tracking-tight text-white">VILT</span>
          <span className="text-pink text-lg font-bold">.</span>
        </div>

        <nav className="flex-1 py-4">
          <p className="px-5 pt-2 pb-1 text-2xs font-semibold uppercase tracking-[0.08em] text-slate-500">Menu</p>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center px-5 py-[9px] text-sm transition-colors border-l-[3px] ${
                  isActive
                    ? "border-l-pink bg-white/5 text-white font-medium"
                    : "border-l-transparent text-white/55 hover:text-white/80"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-5 border-t border-white/[0.06]">
          <p className="text-xs font-medium text-white truncate mb-0.5">{user?.name}</p>
          <p className="text-xs text-white/40 truncate mb-3">{user?.email}</p>
          <button onClick={handleLogout} className="text-xs text-white/40 hover:text-white/70 transition-colors">
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
