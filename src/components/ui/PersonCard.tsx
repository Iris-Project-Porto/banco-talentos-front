import { Link } from "react-router-dom";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Tag } from "./Tag";

interface Skill { skill?: { name: string }; level?: string }

interface Props {
  id: string;
  name: string;
  email?: string;
  photoUrl?: string;
  area?: string;
  nivel?: string;
  alocacaoStatus?: string;
  skills?: Skill[];
  createdAt?: string;
  href?: string;
}

const NIVEL_BADGE: Record<string, "senior" | "pleno" | "junior"> = {
  Sr: "senior", Pleno: "pleno", Jr: "junior",
};

const ALOC_TAG: Record<string, "status-success" | "status-info" | "status-warning" | "status-alert"> = {
  "Disponível (Bench)": "status-success",
  "Alocado Integral (100%)": "status-info",
  "Alocado Parcial": "status-warning",
  "Em Transição (saindo de projeto)": "status-alert",
};

const ALOC_LABEL: Record<string, string> = {
  "Disponível (Bench)": "Disponível",
  "Alocado Integral (100%)": "Integral",
  "Alocado Parcial": "Parcial",
  "Em Transição (saindo de projeto)": "Em Transição",
};

export function PersonCard({ id, name, email, photoUrl, area, nivel, alocacaoStatus, skills, createdAt, href }: Props) {
  const badgeVariant = nivel ? NIVEL_BADGE[nivel] : undefined;
  const tagKind = alocacaoStatus ? ALOC_TAG[alocacaoStatus] : undefined;
  const tagLabel = alocacaoStatus ? (ALOC_LABEL[alocacaoStatus] ?? alocacaoStatus.split(" ")[0]) : undefined;

  return (
    <Link
      to={href ?? `/admin/talentos/${id}`}
      className="bg-white border border-slate-200 rounded-xl shadow-card p-5 flex flex-col gap-4 transition-all hover:shadow-card-hover hover:-translate-y-px cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <Avatar name={name} photoUrl={photoUrl} size={44} />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-base text-slate-900 truncate">{name}</p>
          {/* {area && <p className="text-xs text-slate-500 truncate mt-0.5">{area}</p>} */}
          {email && <p className="text-xs text-slate-400 truncate">{email}</p>}
        </div>
        {badgeVariant && nivel && (
          <Badge variant={badgeVariant} className="shrink-0">{nivel}</Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {area && <Tag kind="area">{area}</Tag>}
        {tagKind && tagLabel && <Tag kind={tagKind}>{tagLabel}</Tag>}
      </div>

      {skills && skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {skills.slice(0, 4).map((ps, i) => (
            <Tag key={i} kind="skill">{ps.skill?.name}</Tag>
          ))}
          {skills.length > 4 && (
            <span className="text-xs text-slate-400 px-2 py-0.5">+{skills.length - 4}</span>
          )}
        </div>
      )}

      {createdAt && (
        <p className="text-xs text-slate-400">
          Desde {new Date(createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
        </p>
      )}
    </Link>
  );
}
