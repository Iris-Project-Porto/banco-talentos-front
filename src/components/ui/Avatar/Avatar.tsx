interface Props {
  name: string;
  photoUrl?: string;
  size?: number;
}

export function Avatar({ name, photoUrl, size = 44 }: Props) {
  const isAlreadyInitials = name.length <= 2 && name === name.toUpperCase() && !name.includes(" ");
  const initials = isAlreadyInitials 
    ? name 
    : name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 bg-pink-light text-pink font-bold"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
    >
      {initials}
    </div>
  );
}
