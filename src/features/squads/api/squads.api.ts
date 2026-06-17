import { http } from "@/lib/axios";
import type { Squad, SquadPayload, PageableResponse } from "../types/types";

export const squadsApi = {
    create: (data: SquadPayload) =>
        http.post<Squad>("/v1/admin/squads", data).then((r) => r.data),

    getById: (id: string) =>
        http.get<Squad>(`/v1/admin/squads/${id}`).then((r) => r.data),

    update: (id: string, data: SquadPayload) =>
        http.put<Squad>(`/v1/admin/squads/${id}`, data).then((r) => r.data),

    activate: (id: string) =>
        http.patch(`/v1/admin/squads/${id}/activate`).then((r) => r.data),

    inactivate: (id: string) =>
        http.patch(`/v1/admin/squads/${id}/inactivate`).then((r) => r.data),

    getActive: (params?: any) =>
        http.get<PageableResponse<Squad>>("/v1/admin/squads/active", { params }).then((r) => r.data),

    getInactive: (params?: any) =>
        http.get<PageableResponse<Squad>>("/v1/admin/squads/inactive", { params }).then((r) => r.data),
};