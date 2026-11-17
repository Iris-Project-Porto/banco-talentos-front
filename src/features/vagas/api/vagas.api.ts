import { http } from "@/lib/axios";
import type {
  CandidateFiltersParams,
  JobPosting,
  JobPostingPayload,
  JobStatus,
  MatchCandidatesResponse,
  VagaFiltersParams,
} from "../types/types";

const formatParams = (
  page: number,
  size: number,
  filters?: VagaFiltersParams,
) => {
  const params: any = { page, size, ...filters };
  if (params.skills && Array.isArray(params.skills)) {
    params.skills = params.skills.join(",");
  }
  return params;
};
export const vagasApi = {
  getActive: (page = 0, size = 20, filters?: VagaFiltersParams) =>
    http
      .get(`/v1/admin/job-postings/active`, {
        params: formatParams(page, size, filters), 
      })
      .then((r) => r.data),

  getInactive: (page = 0, size = 20, filters?: VagaFiltersParams) =>
    http
      .get(`/v1/admin/job-postings/inactive`, {
        params: formatParams(page, size, filters), 
      })
      .then((r) => r.data),

  getProjects: (page = 0, size = 100) =>
    http
      .get(`/v1/admin/projects/active`, { params: { page, size } })
      .then((r) => r.data),

  getSquads: (page = 0, size = 100) =>
    http
      .get(`/v1/admin/squads/active`, { params: { page, size } })
      .then((r) => r.data),

  getSquadById: (id: string) =>
    http.get(`/v1/admin/squads/${id}`).then((r) => r.data),

  getById: (id: string) =>
    http.get<JobPosting>(`/v1/admin/job-postings/${id}`).then((r) => r.data),

  getMatches: (id: string, params?: CandidateFiltersParams) =>
    http
      .get<MatchCandidatesResponse>(`/v1/admin/job-postings/${id}/matches`, {
        params,
      })
      .then((r) => r.data),

  create: (data: JobPostingPayload) =>
    http.post<JobPosting>("/v1/admin/job-postings", data).then((r) => r.data),

  update: (id: string, data: JobPostingPayload) =>
    http
      .put<JobPosting>(`/v1/admin/job-postings/${id}`, data)
      .then((r) => r.data),

  updateStatus: (id: string, status: JobStatus) =>
    http
      .patch<void>(`/v1/admin/job-postings/${id}/status`, { status })
      .then((r) => r.data),

  activate: (id: string) =>
    http.patch(`/v1/admin/job-postings/${id}/activate`).then((r) => r.data),

  deactivate: (id: string) =>
    http.patch(`/v1/admin/job-postings/${id}/deactivate`).then((r) => r.data),
};
