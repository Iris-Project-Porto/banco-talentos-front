import { http } from "@/lib/axios";

export const profilesApi = {
    getMyProfile: () => http.get("/v1/profile").then((r) => r.data),
    submitProfile: (data: unknown) => http.post("/v1/profile", data).then((r) => r.data),

    getPendentes: (page = 0, size = 20) => http.get(`/v1/admin/profiles/pending?page=${page}&size=${size}`).then((r) => r.data),

    getAtivos: (page = 0, size = 20, skill?: string) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        if (skill) params.append("skill", skill);
        return http.get(`/v1/admin/profiles/active?${params.toString()}`).then((r) => r.data);
    },

    getAllProfiles: (page = 0, size = 1000, skill?: string) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        if (skill) params.append("skill", skill);
        return http.get(`/v1/admin/profiles?${params.toString()}`).then((r) => r.data);
    },

    getProfileById: (id: string) => http.get(`/v1/admin/profiles/${id}`).then((r) => r.data),
    updateProfile: (id: string, data: unknown) => http.patch(`/v1/admin/profiles/${id}`, data).then((r) => r.data),
    getDashboard: () => http.get("v1/admin/dashboard").then((r) => r.data),

    getPendingUsers: (page = 0, size = 20) => http.get(`/v1/admin/users/pending?page=${page}&size=${size}`).then((r) => r.data),
    approveUser: (id: string) => http.post(`/v1/admin/users/${id}/approve`).then((r) => r.data),
    rejectUser: (id: string) => http.post(`/v1/admin/users/${id}/reject`).then((r) => r.data),
};