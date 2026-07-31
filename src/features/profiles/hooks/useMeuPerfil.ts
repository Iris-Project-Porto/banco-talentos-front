import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import type { UserProfile } from "../types/profile";
import { profilesApi } from "../api/profiles.api";
import { needsFirstProfileSubmit } from "../utils/profileUtils";

export function useMeuPerfil() {
    const { user } = useAuth();

    const {
        data: profile,
        isFetching,
        isFetched,
    } = useQuery<UserProfile>({
        queryKey: ["meu-perfil"],
        queryFn: profilesApi.getMyProfile,
        retry: false,
        enabled: user?.hasProfile === true,
    });

    const hasNoProfile = user?.hasProfile === false;
    const loading = user?.hasProfile === true && isFetching && !isFetched;
    const needsFirstSubmit = hasNoProfile || needsFirstProfileSubmit(profile ?? null);

    return {
        profile: profile ?? null,
        loading,
        needsFirstSubmit,
    };
}
