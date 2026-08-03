import { http } from "@/lib/axios";

export const authApi = {
    login: (email: string, password: string) =>
        http.post("/v1/auth/login", { email, password }).then((r) => r.data),
    logout: (refreshToken: string) =>
        http.post("/v1/auth/logout", { refreshToken }).then((r) => r.data),
    register: (name: string, email: string, password: string, role: "ADMIN" | "RESOURCE", groupId: string) =>
        http.post("/v1/auth/register", { name, email, password, role, groupId }).then((r) => r.data),
    verifyEmail: (email: string, code: string) =>
        http.post("/v1/auth/verify", { email, code }).then((r) => r.data),
    resendVerificationCode: (email: string) =>
        http.post("/v1/auth/resend-verification-code", { email }).then((r) => r.data),
    forgotPassword: (email: string) =>
        http.post("/v1/auth/forgot-password", { email }).then((r) => r.data),
    validateResetToken: (email: string, token: string) =>
        http.get("/v1/auth/validate-reset-token", { params: { email, token } }).then((r) => r.data),
    resetPassword: (email: string, token: string, newPassword: string) =>
        http.post("/v1/auth/reset-password", { email, token, newPassword }).then((r) => r.data),
    getGroups: (page = 0, size = 100) => http.get(`/v1/groups?page=${page}&size=${size}`).then((r) => r.data),
};