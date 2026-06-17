import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { UserRole } from "@/features/auth";

// IMPORTAÇÕES SÍNCRONAS (Layouts devem carregar de imediato)
import AdminLayout from "@/components/layouts/AdminLayout/AdminLayout";
import RecursoLayout from "@/components/layouts/RecursoLayout/RecursoLayout";


// IMPORTAÇÕES ASSÍNCRONAS (Lazy Loading - Separação do Bundle)

// Páginas Públicas
const Login = lazy(() => import("@/pages/public/Login"));
const Register = lazy(() => import("@/pages/public/Register"));
const VerifyEmail = lazy(() => import("@/pages/public/VerifyEmail"));
const ForgotPassword = lazy(() => import("@/pages/public/ForgotPassWord"));
const ResetPassword = lazy(() => import("@/pages/public/ResetPassword"));

// Páginas Privadas (Recurso)
const MeuPerfil = lazy(() => import("@/pages/user/MeuPerfil"));
const MeuHistorico = lazy(() => import("@/pages/user/MeuHistorico"));

// Páginas Admin
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const FilaRevisao = lazy(() => import("@/pages/admin/FilaRevisao"));
const BancoTalentos = lazy(() => import("@/pages/admin/BancoTalentos"));
const TalentoDetalhe = lazy(() => import("@/pages/admin/TalentoDetalhe"));
const RecursosAlocados = lazy(() => import("@/pages/admin/RecursosAlocados"));
const UsuariosPendentes = lazy(() => import("@/pages/admin/UsuariosPendentes"));
const Vagas = lazy(() => import("@/pages/admin/Vagas"));
const Forms = lazy(() => import("@/pages/admin/Forms"));
const Squads = lazy(() => import("@/pages/admin/Squads"));
const SquadDetalhe = lazy(() => import("@/pages/admin/SquadDetalhe"));

// DEFINIÇÃO DAS ROTAS

export const router = createBrowserRouter([
    // Rotas Públicas
    {
        element: <PublicRoute />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "/verify", element: <VerifyEmail /> },
            { path: "/forgot-password", element: <ForgotPassword /> },
            { path: "/reset-password", element: <ResetPassword /> },
        ]
    },

    // Rota de Recurso (Usuário Padrão)
    {
        path: "/",
        element: <ProtectedRoute role={UserRole.RESOURCE} />,
        children: [
            {
                element: <RecursoLayout />,
                children: [
                    { index: true, element: <Navigate to="/meu-perfil" replace /> },
                    { path: "meu-perfil", element: <MeuPerfil /> },
                    { path: "meu-historico", element: <MeuHistorico /> },
                ],
            },
        ],
    },

    // Rota de Admin
    {
        path: "/admin",
        element: <ProtectedRoute role={UserRole.ADMIN} />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { index: true, element: <Navigate to="/admin/dashboard" replace /> },
                    { path: "dashboard", element: <Dashboard /> },
                    { path: "fila", element: <FilaRevisao /> },
                    { path: "talentos", element: <BancoTalentos /> },
                    { path: "talentos/:id", element: <TalentoDetalhe /> },
                    { path: "alocados", element: <RecursosAlocados /> },
                    { path: "usuarios", element: <UsuariosPendentes /> },
                    { path: "vagas", element: <Vagas /> },
                    { path: "forms", element: <Forms /> },
                    { path: "squads", element: <Squads /> },
                    { path: "squads/:id", element: <SquadDetalhe /> },
                ],
            },
        ],
    },

    // Fallback global
    { path: "*", element: <Navigate to="/login" replace /> },
]);