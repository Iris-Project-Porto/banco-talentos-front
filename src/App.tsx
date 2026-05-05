import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "@/pages/Login";
import MeuPerfil from "@/pages/MeuPerfil";
import Dashboard from "@/pages/admin/Dashboard";
import FilaRevisao from "@/pages/admin/FilaRevisao";
import BancoTalentos from "@/pages/admin/BancoTalentos";
import TalentoDetalhe from "@/pages/admin/TalentoDetalhe";
import AdminLayout from "@/components/AdminLayout";

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/meu-perfil" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/meu-perfil" element={
            <ProtectedRoute><MeuPerfil /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute role="ADMIN"><AdminLayout /></ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="fila" element={<FilaRevisao />} />
            <Route path="talentos" element={<BancoTalentos />} />
            <Route path="talentos/:id" element={<TalentoDetalhe />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
