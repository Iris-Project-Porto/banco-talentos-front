import axios, { isAxiosError, type InternalAxiosRequestConfig } from "axios";

const BASE = import.meta.env.VITE_API_URL || "/api";
const apiBase = BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;

export const http = axios.create({ baseURL: apiBase });

http.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

async function refreshSession(): Promise<string> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("Sessão expirada.");

    const { data } = await axios.post<{ token: string; refreshToken: string }>(
        `${apiBase}/v1/auth/refresh`,
        { refreshToken }
    );
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data.token;
}

http.interceptors.response.use(
    (r) => r,
    async (err) => {
        const original = err.config as RetriableRequestConfig | undefined;
        const url = original?.url ?? "";
        const isAuthRoute = url.includes("/auth/") && !url.includes("/auth/logout");

        if (err.response?.status !== 401 || isAuthRoute || !original || original._retry) {
            return Promise.reject(err);
        }

        original._retry = true;
        try {
            refreshPromise = refreshPromise ?? refreshSession();
            const newToken = await refreshPromise;
            original.headers.Authorization = `Bearer ${newToken}`;
            return http(original);
        } catch {
            window.dispatchEvent(new Event("unauthorized"));
            return Promise.reject(err);
        } finally {
            refreshPromise = null;
        }
    }
);

export function getApiError(error: unknown, fallbackMessage = "Ocorreu um erro inesperado."): string {
    if (isAxiosError(error) && error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return fallbackMessage;
}