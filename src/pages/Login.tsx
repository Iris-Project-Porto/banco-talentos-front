import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      const stored = localStorage.getItem("user");
      const role = stored ? JSON.parse(stored).role : null;
      navigate(role === "ADMIN" ? "/admin/dashboard" : "/meu-perfil", { replace: true });
    } catch {
      setError("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center" style={{ background: "#f4f5f7" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 28, color: "#111827", letterSpacing: "-1px" }}>
            VILT
          </span>
          <span style={{ color: "var(--pink)", fontSize: 28, fontWeight: 900, marginLeft: 2 }}>›</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, color: "#111827", marginBottom: 2 }}>
            Acesso interno
          </h1>
          <p className="text-sm text-gray-400 mb-7">Entre com suas credenciais corporativas</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">E-mail</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com" required autoFocus
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none border border-gray-200 bg-white text-gray-900 focus:border-pink-400 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">Senha</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none border border-gray-200 bg-white text-gray-900 focus:border-pink-400 transition-colors"
              />
            </div>

            {error && (
              <p className="rounded-lg px-3 py-2 text-xs bg-red-50 text-red-600 border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ background: loading ? "#c4177a" : "var(--pink)", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
