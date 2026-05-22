import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { VagasProvider } from "@/contexts/VagasContext";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import VerifyEmail from "@/pages/VerifyEmail";
import ForgotPassword from "@/pages/ForgotPassWord";
import ResetPassword from "@/pages/ResetPassword";
import MeuPerfil from "@/pages/MeuPerfil";
import Dashboard from "@/pages/admin/Dashboard";
import FilaRevisao from "@/pages/admin/FilaRevisao";
import BancoTalentos from "@/pages/admin/BancoTalentos";
import TalentoDetalhe from "@/pages/admin/TalentoDetalhe";
import RecursosAlocados from "@/pages/admin/RecursosAlocados";
import Forms from "@/pages/admin/Forms";
import UsuariosPendentes from "@/pages/admin/UsuariosPendentes";
import Vagas from "@/pages/admin/Vagas";
import AdminLayout from "@/components/AdminLayout";
import RecursoLayout from "@/components/RecursoLayout";
import MeuHistorico from "@/pages/MeuHistorico";

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
      <VagasProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={
            <ProtectedRoute><RecursoLayout /></ProtectedRoute>
          }>
            <Route path="meu-perfil" element={<MeuPerfil />} />
            <Route path="meu-historico" element={<MeuHistorico />} />
          </Route>
          <Route path="/admin" element={
            <ProtectedRoute role="ADMIN"><AdminLayout /></ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="fila" element={<FilaRevisao />} />
            <Route path="talentos" element={<BancoTalentos />} />
            <Route path="talentos/:id" element={<TalentoDetalhe />} />
            <Route path="alocados" element={<RecursosAlocados />} />
            <Route path="forms" element={<Forms />} />
            <Route path="usuarios" element={<UsuariosPendentes />} />
            <Route path="vagas" element={<Vagas />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      </VagasProvider>
    </AuthProvider>
  );
}
