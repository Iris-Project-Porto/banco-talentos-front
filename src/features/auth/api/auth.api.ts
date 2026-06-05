import { http } from "@/lib/axios";

export const authApi = {
    login: (email: string, password: string) =>
        http.post("/auth/login", { email, password }).then((r) => r.data),
    register: (name: string, email: string, password: string, role: "ADMIN" | "RECURSO", groupId: string) =>
        http.post("/auth/register", { name, email, password, role, groupId }).then((r) => r.data),
    verifyEmail: (email: string, code: string) =>
        http.post("/auth/verify", { email, code }).then((r) => r.data),
    resendVerificationCode: (email: string) =>
        http.post("/auth/resend-verification-code", { email }).then((r) => r.data),
    forgotPassword: (email: string) =>
        http.post("/auth/forgot-password", { email }).then((r) => r.data),
    resetPassword: (email: string, token: string, newPassword: string) =>
        http.post("/auth/reset-password", { email, token, newPassword }).then((r) => r.data),
    getGroups: () => http.get("/v1/groups").then((r) => r.data),
};