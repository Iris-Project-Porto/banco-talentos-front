import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useVagas } from "@/contexts/VagasContext";

const staticNavItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/fila", label: "Fila de revisão" },
  { to: "/admin/talentos", label: "People" },
  { to: "/admin/alocados", label: "Alocados" },
  { to: "/admin/usuarios", label: "Usuários" },
  // { to: "/admin/forms",     label: "Forms" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { vagas } = useVagas();
  const vagasAbertas = vagas.filter((v) => v.status === "Aberta" || v.status === "Em andamento").length;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-40 shrink-0 flex flex-col bg-slate-950 h-screen">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <span className="font-bold text-lg tracking-tight text-white">VILT</span>
          <span className="text-pink text-lg font-bold">.</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          <p className="px-5 pt-2 pb-1 text-2xs font-semibold uppercase tracking-[0.08em] text-slate-500">Menu</p>
          {staticNavItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
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
          {/* <NavLink
            to="/admin/vagas"
            end
            className={({ isActive }) =>
              `flex items-center justify-between px-5 py-[9px] text-sm transition-colors border-l-[3px] ${
                isActive
                  ? "border-l-pink bg-white/5 text-white font-medium"
                  : "border-l-transparent text-white/55 hover:text-white/80"
              }`
            }
          >
            <span>Vagas</span>
            {vagasAbertas > 0 && (
              <span className="bg-pink text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                {vagasAbertas}
              </span>
            )}
          </NavLink> */}
        </nav>

        {/* Footer */}
        <div className="px-5 py-5 border-t border-white/[0.06]">
          <p className="text-xs font-medium text-white truncate mb-0.5">{user?.name}</p>
          <p className="text-xs text-white/40 truncate mb-3">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
