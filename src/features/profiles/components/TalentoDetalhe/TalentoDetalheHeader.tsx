import { Avatar } from "@/components/ui";
import { EXPERIENCE_OPTIONS, NIVEL_STYLE } from "../../profile";
import type { ProfileFormState, UserProfile } from "../../types/profile";

interface Props {
    profile: UserProfile;
    form: ProfileFormState;
    isPendente: boolean;
}

export function TalentoDetalheHeader({ profile, form, isPendente }: Props) {
    const nivel = form.levelOverride || profile.nivel;
    const ns = nivel ? NIVEL_STYLE[nivel] : null;
    const expLabel =
        EXPERIENCE_OPTIONS.find((o) => String(o.value) === String(form.experienceYears))?.label ?? "";

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
            <Avatar name={profile.name ?? "?"} photoUrl={profile.photoUrl} size={56} />
            <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                    <div>
                        <h1
                            className="text-xl font-bold text-gray-900"
                            style={{ fontFamily: "var(--font-syne)" }}
                        >
                            {profile.name}
                        </h1>
                        <p className="text-sm text-gray-400">{profile.email}</p>
                        {form.area && <p className="text-sm text-gray-500 mt-0.5">{form.area}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {ns && nivel && (
                            <span
                                className="px-2.5 py-1 rounded-full text-xs font-medium"
                                style={{ background: ns.bg, color: ns.color }}
                            >
                                {nivel}
                            </span>
                        )}
                        <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                isPendente ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                            }`}
                        >
                            {isPendente ? "Pendente" : "Ativo"}
                        </span>
                    </div>
                </div>
                {expLabel && <p className="text-xs text-gray-400 mt-1">{expLabel} de experiência</p>}
            </div>
        </div>
    );
}
