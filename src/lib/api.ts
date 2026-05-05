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
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const api = {
  login: (email: string, password: string) =>
    http.post("/auth/login", { email, password }).then((r) => r.data),

  getMyProfile: () => http.get("/profile/me").then((r) => r.data),
  submitProfile: (data: unknown) => http.post("/profile", data).then((r) => r.data),

  getDashboard: () => http.get("/admin/dashboard").then((r) => r.data),
  getPendentes: () => http.get("/admin/profiles/pendentes").then((r) => r.data),
  getAtivos: () => http.get("/admin/profiles/ativos").then((r) => r.data),
  getAllProfiles: () => http.get("/admin/profiles").then((r) => r.data),
  getProfileById: (id: string) => http.get(`/admin/profiles/${id}`).then((r) => r.data),
  updateProfile: (id: string, data: unknown) =>
    http.patch(`/admin/profiles/${id}`, data).then((r) => r.data),
};
