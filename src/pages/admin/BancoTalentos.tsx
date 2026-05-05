import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";

const NIVEL_STYLE: Record<string, { color: string; bg: string }> = {
  Sr:    { color: "#92400e", bg: "#fef3c7" },
  Pleno: { color: "#065f46", bg: "#d1fae5" },
  Jr:    { color: "#1e40af", bg: "#dbeafe" },
};

const ALOCACAO_COLOR: Record<string, string> = {
  "Disponível (Bench)":              "bg-green-100 text-green-700",
  "Alocado Integral (100%)":         "bg-blue-100 text-blue-700",
  "Alocado Parcial":                 "bg-yellow-100 text-yellow-700",
  "Em Transição (saindo de projeto)":"bg-orange-100 text-orange-700",
};

function Avatar({ name, photoUrl, size = 56 }: { name: string; photoUrl?: string; size?: number }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const colors = ["#e91e8c","#6366f1","#0ea5e9","#10b981","#f59e0b","#ef4444","#8b5cf6"];
  const color = colors[name.charCodeAt(0) % colors.length];

  if (photoUrl) return (
    <img src={photoUrl} alt={name} className="rounded-full object-cover"
         style={{ width: size, height: size }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
  );
  return (
    <div className="rounded-full flex items-center justify-center shrink-0 font-semibold text-white"
         style={{ width: size, height: size, background: color, fontSize: size * 0.35 }}>
      {initials}
    </div>
  );
}

export default function BancoTalentos() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAtivos().then((data) => setProfiles(Array.isArray(data) ? data : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const areas = useMemo(() => Array.from(new Set(profiles.map((p) => p.area).filter(Boolean))), [profiles]);

  const filtered = useMemo(() => profiles.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.user?.name?.toLowerCase().includes(q) ||
      p.area?.toLowerCase().includes(q) || p.cargo?.toLowerCase().includes(q) ||
      p.skills?.some((s: any) => s.skill?.name?.toLowerCase().includes(q));
    return matchSearch && (!area || p.area === area);
  }), [profiles, search, area]);

  if (loading) return <p className="text-gray-400 text-sm">Carregando...</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>People</h1>
          <p className="text-sm text-gray-400 mt-0.5">Banco de talentos ativos</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Business Unit:</span>
          <select value={area} onChange={(e) => setArea(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-pink-400 bg-white">
            <option value="">All</option>
            {areas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <input
            placeholder="Search..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-pink-400 bg-white"
          />
        </div>
        <span className="text-xs text-gray-400">{filtered.length} pessoa{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">Nenhum talento encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((p) => {
            const nivel = p.nivelOverride ?? p.nivel;
            const ns = nivel ? NIVEL_STYLE[nivel] : null;
            const alocClass = p.alocacaoStatus ? (ALOCACAO_COLOR[p.alocacaoStatus] ?? "bg-gray-100 text-gray-600") : null;
            return (
              <Link key={p.id} to={`/admin/talentos/${p.id}`}
                    className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 hover:border-pink-300 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                  <Avatar name={p.user?.name ?? "?"} photoUrl={p.photoUrl} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate text-sm" style={{ fontFamily: "var(--font-syne)" }}>
                      {p.user?.name}
                    </p>
                    {p.cargo && <p className="text-xs text-gray-500 truncate mt-0.5">{p.cargo}</p>}
                    <p className="text-xs text-gray-400 truncate">{p.user?.email}</p>
                  </div>
                  {ns && nivel && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0"
                          style={{ background: ns.bg, color: ns.color }}>{nivel}</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {p.area && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-600">{p.area}</span>
                  )}
                  {alocClass && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${alocClass}`}>
                      {p.alocacaoStatus?.split(" ")[0]}
                    </span>
                  )}
                </div>

                {p.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.skills.slice(0, 4).map((ps: any, i: number) => (
                      <span key={i} className="rounded-md px-2 py-0.5 text-xs bg-gray-100 text-gray-600">
                        {ps.skill?.name}
                      </span>
                    ))}
                    {p.skills.length > 4 && (
                      <span className="rounded-md px-2 py-0.5 text-xs bg-gray-100 text-gray-400">+{p.skills.length - 4}</span>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  Enrolled since {new Date(p.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
