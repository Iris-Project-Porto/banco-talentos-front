import axios from "axios";

const BASE = import.meta.env.VITE_API_URL ?? "/api";

export const http = axios.create({ baseURL: BASE });

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      const url = err.config?.url ?? "";
      if (!url.includes("/profile/me")) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export const api = {
  login: (email: string, password: string) =>
    http.post("/auth/login", { email, password }).then((r) => r.data),

  register: (name: string, email: string, password: string, role: "ADMIN" | "RECURSO", groupId: string) =>
    http.post("/auth/register", { name, email, password, role, groupId }).then((r) => r.data),

  verifyEmail: (email: string, code: string) =>
    http.post("/auth/verify", { email, code }).then((r) => r.data),

  forgotPassword: (email: string) =>
    http.post(`/auth/forgot-password?email=${encodeURIComponent(email)}`).then((r) => r.data),

  resetPassword: (email: string, token: string, newPassword: string) =>
    http.post("/auth/reset-password", { email, token, newPassword }).then((r) => r.data),

  getPendingUsers: () => http.get("/admin/users/pending").then((r) => r.data),

  approveUser: (id: string) =>
    http.post(`/admin/users/${id}/approve`).then((r) => r.data),

  rejectUser: (id: string) =>
    http.post(`/admin/users/${id}/reject`).then((r) => r.data),

  getMyProfile: () => http.get("/profile/me").then((r) => r.data),
  submitProfile: (data: unknown) => http.post("/profile", data).then((r) => r.data),

  getDashboard: () => http.get("/admin/dashboard").then((r) => r.data),
  getPendentes: () => http.get("/admin/profiles/pendentes").then((r) => r.data),
  getAtivos: () => http.get("/admin/profiles/ativos").then((r) => r.data),
  getAllProfiles: () => http.get("/admin/profiles").then((r) => r.data),
  getProfileById: (id: string) => http.get(`/admin/profiles/${id}`).then((r) => r.data),
  updateProfile: (id: string, data: unknown) =>
    http.patch(`/admin/profiles/${id}`, data).then((r) => r.data),

  getVagas: () => http.get("/admin/vagas").then((r) => r.data),
  createVaga: (data: unknown) => http.post("/admin/vagas", data).then((r) => r.data),
  updateVaga: (id: string, data: unknown) => http.put(`/admin/vagas/${id}`, data).then((r) => r.data),
  deleteVaga: (id: string) => http.delete(`/admin/vagas/${id}`).then((r) => r.data),

  // Admin Groups
  getActiveGroups: () => http.get("/admin/groups/active").then((r) => r.data),
  getInactiveGroups: () => http.get("/admin/groups/inactive").then((r) => r.data),
  getGroupById: (id: string) => http.get(`/admin/groups/${id}`).then((r) => r.data),
  createGroup: (data: unknown) => http.post("/admin/groups", data).then((r) => r.data),
  updateGroup: (id: string, data: unknown) => http.put(`/admin/groups/${id}`, data).then((r) => r.data),
  activateGroup: (id: string) => http.patch(`/admin/groups/${id}/activate`).then((r) => r.data),
  inactivateGroup: (id: string) => http.patch(`/admin/groups/${id}/inactivate`).then((r) => r.data),

  // Public Groups
  getGroups: () => http.get("/v1/groups").then((r) => r.data),
};