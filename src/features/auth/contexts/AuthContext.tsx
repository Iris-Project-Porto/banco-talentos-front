import { createContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "../api/auth.api";
import { UserRole } from "../types/roles";

interface AuthUser {
    token: string;
    name: string;
    email: string;
    role: UserRole;
    hasProfile: boolean;
}

export interface AuthContextType {
    user: AuthUser | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    markProfileCreated: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>(null!);

function persistUser(user: Omit<AuthUser, "token">) {
    localStorage.setItem("user", JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    }

    function markProfileCreated() {
        setUser((current) => {
            if (!current) return current;
            persistUser({ name: current.name, email: current.email, role: current.role, hasProfile: true });
            return { ...current, hasProfile: true };
        });
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        const stored = localStorage.getItem("user");
        if (token && stored) {
            const parsed = JSON.parse(stored);
            setUser({
                token,
                name: parsed.name,
                email: parsed.email,
                role: parsed.role,
                hasProfile: parsed.hasProfile === true,
            });
        }
        setLoading(false);

        const handleUnauthorized = () => logout();
        window.addEventListener("unauthorized", handleUnauthorized);

        return () => window.removeEventListener("unauthorized", handleUnauthorized);
    }, []);

    async function login(email: string, password: string) {
        const data = await authApi.login(email, password);
        localStorage.setItem("token", data.token);
        persistUser({
            name: data.name,
            email: data.email,
            role: data.role,
            hasProfile: data.hasProfile === true,
        });
        setUser({
            token: data.token,
            name: data.name,
            email: data.email,
            role: data.role,
            hasProfile: data.hasProfile === true,
        });
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, markProfileCreated, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
