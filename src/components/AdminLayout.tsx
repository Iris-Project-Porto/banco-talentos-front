import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", exact: true },
  { to: "/admin/fila", label: "Fila de revisão" },
  { to: "/admin/talentos", label: "People", exact: true },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      <aside className="w-52 flex flex-col shrink-0" style={{ background: "var(--sidebar-bg)" }}>
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, color: "#fff", fontSize: 18, letterSpacing: "-0.5px" }}>VILT</span>
            <span style={{ color: "var(--pink)", fontSize: 18, fontWeight: 900 }}>›</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">Menu</p>
          {navItems.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className="flex items-center px-3 py-2 rounded-lg text-sm transition-all"
              style={({ isActive }) => isActive
                ? { background: "rgba(233,30,140,0.15)", color: "var(--pink)", fontWeight: 500 }
                : { color: "var(--sidebar-text)" }}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-xs truncate font-medium text-white mb-0.5">{user?.name}</p>
          <p className="text-xs truncate text-white/40 mb-3">{user?.email}</p>
          <button onClick={handleLogout} className="text-xs text-white/40 hover:text-white/70 transition-colors">
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
