import { createContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "../api/auth.api";
import { UserRole } from "../types/roles";

interface AuthUser {
    token: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface AuthContextType {
    user: AuthUser | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null); // O state muda e o `<ProtectedRoute/>` redireciona sem reload
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        const stored = localStorage.getItem("user");
        if (token && stored) {
            setUser({ ...JSON.parse(stored), token });
        }
        setLoading(false);

        const handleUnauthorized = () => logout();
        window.addEventListener("unauthorized", handleUnauthorized);

        return () => window.removeEventListener("unauthorized", handleUnauthorized);
    }, []);

    async function login(email: string, password: string) {
        const data = await authApi.login(email, password);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email, role: data.role }));
        setUser(data);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}