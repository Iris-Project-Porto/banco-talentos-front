import type { UserProfile } from "../types/profile";
import { getLevelStyle, getLevelLabel, getRegistrationStatusLabel } from "../utils/profileUtils";
import { NIVEL_STYLE } from "../profile";

export function ProfileReadOnly({ profile }: { profile: UserProfile }) {
    const isAtivo = profile.status === "ATIVO";
    const nivel = profile.nivelOverride ?? profile.nivel;
    const ns = nivel ? NIVEL_STYLE[nivel] : null;

    const hardSkills = profile.skills?.filter((ps) => ps.skill?.type !== "SOFT" && ps.type !== "SOFT") || [];

    return (
        <div className="flex flex-col gap-5">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-base font-semibold text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>
                        {isAtivo ? "Seu perfil está ativo no banco de talentos" : "Perfil enviado - aguardando revisão do RH"}
                    </h2>
                    <div className="flex items-center gap-2">
                        {ns && nivel && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: ns.bg, color: ns.color }}>
                                {nivel}
                            </span>
                        )}
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isAtivo ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {isAtivo ? "Ativo" : "Em análise"}
                        </span>
                    </div>
                </div>
                {!isAtivo && <p className="text-sm text-gray-400 mt-1">O RH irá revisar suas respostas e ativar seu perfil em breve.</p>}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Suas respostas</p>
                </div>

                <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ReadField
                        label="Status da matrícula"
                        value={getRegistrationStatusLabel(profile.registrationStatus)}
                    />
                    {profile.registrationNumber && <ReadField label="Matrícula" value={profile.registrationNumber} />}
                    {profile.area && <ReadField label="Área" value={profile.area} />}
                    {profile.experienceYears != null && (
                        <ReadField
                            label="Anos de experiência"
                            value={
                                Number(profile.experienceYears) >= 6 ? "6 anos ou mais"
                                    : Number(profile.experienceYears) >= 3 ? "3 a 5 anos"
                                        : Number(profile.experienceYears) >= 1 ? "1 a 2 anos"
                                            : "Menos de 1 ano"
                            }
                        />
                    )}

                    {profile.linkedinUrl && (
                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">LinkedIn</p>
                            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-pink-600 hover:underline">{profile.linkedinUrl}</a>
                        </div>
                    )}
                    {profile.githubUrl && (
                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">GitHub</p>
                            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-pink-600 hover:underline">{profile.githubUrl}</a>
                        </div>
                    )}
                </div>

                {profile.sobre && (
                    <div className="px-4 sm:px-6 pb-5">
                        <p className="text-xs text-gray-400 mb-1">Sobre você</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{profile.sobre}</p>
                    </div>
                )}

                {hardSkills.length > 0 && (
                    <div className="px-4 sm:px-6 pb-5">
                        <p className="text-xs text-gray-400 mb-3">Stack tecnológica</p>
                        <div className="flex flex-wrap gap-2.5">
                            {hardSkills.map((ps, i) => {
                                const skillName = ps.skill?.name ?? ps.name ?? "";
                                const skillLevel = ps.proficiencyLevel !== undefined ? Number(ps.proficiencyLevel) : (ps.level !== undefined ? Number(ps.level) : null);
                                const { color, bg } = skillLevel ? getLevelStyle(skillLevel) : { color: "#6b7280", bg: "#f3f4f6" };

                                return (
                                    <div key={i} className="flex items-stretch bg-white border border-gray-200 rounded-full overflow-hidden shadow-sm">
                                        <span className="text-sm text-gray-700 font-medium pl-4 pr-3 py-1.5 flex items-center">{skillName}</span>
                                        {skillLevel && (
                                            <span
                                                className="text-xs font-bold px-3 py-1.5 flex items-center justify-center border-l border-gray-100"
                                                style={{ color, background: bg }}
                                                title={getLevelLabel(skillLevel)}
                                            >
                                                {skillLevel}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Subcomponente utilitário usado apenas na view
function ReadField({ label, value }: { label: string; value?: string | null }) {
    if (!value) return null;
    return (
        <div>
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            <p className="text-sm text-gray-700">{value}</p>
        </div>
    );
}