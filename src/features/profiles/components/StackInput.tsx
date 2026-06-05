import { useState, useRef, useEffect } from "react";

export interface StackItem {
  name: string;
  level: number;
}

interface Props {
  value: StackItem[];
  onChange: (stacks: StackItem[]) => void;
}

const STACK_SUGGESTIONS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Angular", "Svelte",
  "Node.js", "Express", "NestJS", "Java", "Spring Boot", "Kotlin", "Python",
  "Django", "FastAPI", "Flask", "Go", "Rust", "C#", ".NET", "PHP", "Laravel",
  "Ruby", "Rails", "Swift", "Dart", "Flutter", "React Native",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "SQLite",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform", "Ansible",
  "GraphQL", "REST API", "gRPC", "Kafka", "RabbitMQ",
  "Git", "GitHub Actions", "GitLab CI", "Jenkins", "CircleCI",
  "Tailwind CSS", "Sass", "Figma", "Storybook",
  "Jest", "Cypress", "Playwright", "Vitest",
  "Linux", "Bash", "SQL", "Pandas", "Spark", "Airflow",
];

function getLevelLabel(level: number): { label: string; color: string; bg: string } {
  if (level <= 3) return { label: "Em desenvolvimento", color: "#9333ea", bg: "#f3e8ff" };
  if (level <= 6) return { label: "Pratico com regularidade", color: "#2563eb", bg: "#dbeafe" };
  if (level <= 8) return { label: "Domínio consistente", color: "#059669", bg: "#d1fae5" };
  return { label: "Referência no time", color: "#b45309", bg: "#fef3c7" };
}

function LevelBadge({ level }: { level: number }) {
  const { label, color, bg } = getLevelLabel(level);
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ color, background: bg }}
    >
      <span className="font-bold">{level}</span>
      <span className="hidden sm:inline">- {label}</span>
    </span>
  );
}

export function StackInput({ value, onChange }: Props) {
  const [inputVal, setInputVal] = useState("");
  const [selectedStack, setSelectedStack] = useState<string | null>(null);
  const [pendingLevel, setPendingLevel] = useState<number>(5);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editingStackName, setEditingStackName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const filtered = inputVal.trim()
    ? STACK_SUGGESTIONS.filter(
      (s) =>
        s.toLowerCase().includes(inputVal.toLowerCase()) &&
        !value.find((v) => v.name.toLowerCase() === s.toLowerCase())
    ).slice(0, 8)
    : [];

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectSuggestion(name: string) {
    setSelectedStack(name);
    setInputVal(name);
    setShowSuggestions(false);
  }

  function confirmAdd() {
    const name = (selectedStack || inputVal).trim();
    if (!name) return;
    const alreadyExists = value.find((v) => v.name.toLowerCase() === name.toLowerCase());
    if (alreadyExists) return;

    onChange([...value, { name, level: pendingLevel }]);
    setInputVal("");
    setSelectedStack(null);
    inputRef.current?.focus();
  }

  function removeStack(index: number) {
    const stackToRemove = value[index];
    onChange(value.filter((_, i) => i !== index));
    if (editingStackName === stackToRemove.name) setEditingStackName(null);
  }

  function startEdit(name: string) {
    setEditingStackName(editingStackName === name ? null : name);
  }

  function updateLevel(index: number, level: number) {
    const updated = value.map((s, i) => (i === index ? { ...s, level } : s));
    onChange(updated);
  }

  const hasInput = inputVal.trim().length > 0;
  const { label: levelLabel } = getLevelLabel(pendingLevel);

  const LEGEND = [
    { range: "1 - 3", desc: "Em desenvolvimento inicial, requer apoio frequente", color: "#9333ea", bg: "#f3e8ff" },
    { range: "4 - 6", desc: "Pratico com regularidade, ainda em aprimoramento", color: "#2563eb", bg: "#dbeafe" },
    { range: "7 - 8", desc: "Domínio e aplicação de forma consistente", color: "#059669", bg: "#d1fae5" },
    { range: "9 - 10", desc: "Referência no time, capaz de orientar outros", color: "#b45309", bg: "#fef3c7" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <label className="text-xs font-medium text-gray-600 block">
        Stack tecnológica *
      </label>


      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                setSelectedStack(null);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (filtered.length > 0 && !selectedStack) {
                    selectSuggestion(filtered[0]);
                  }
                }
              }}
              placeholder="Ex: React, Python, Docker..."
              className="w-full rounded-lg px-3 py-2 text-sm outline-none bg-white border border-gray-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            />

            {showSuggestions && filtered.length > 0 && (
              <div
                ref={suggestionRef}
                className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
              >
                {filtered.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseDown={() => selectSuggestion(s)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {hasInput && (
          <div className="mt-3 bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">
                Nível de conhecimento em <span className="text-pink-600 font-semibold">{inputVal}</span>
              </span>
              <LevelBadge level={pendingLevel} />
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={pendingLevel}
              onChange={(e) => setPendingLevel(Number(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-medium">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 italic">{levelLabel}</p>
            <button
              type="button"
              onClick={confirmAdd}
              disabled={!inputVal.trim() || !!value.find((v) => v.name.toLowerCase() === inputVal.trim().toLowerCase())}
              className="self-end mt-1 px-4 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              + Adicionar
            </button>
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2.5">
          {value.map((stack, i) => {
            const { color, bg } = getLevelLabel(stack.level);
            return (
              <div
                key={stack.name}
                className="relative flex items-stretch bg-white border border-gray-200 rounded-full overflow-visible shadow-sm hover:shadow transition-shadow"
              >
                <span className="text-sm font-medium text-gray-800 pl-4 pr-3 py-1.5 flex items-center">
                  {stack.name}
                </span>
                <button
                  type="button"
                  onClick={() => startEdit(stack.name)}
                  className="flex items-center justify-center px-3 border-l border-r border-gray-100 hover:opacity-80 transition-opacity"
                  style={{ color, backgroundColor: bg }}
                  title="Editar nível"
                >
                  <span className="text-xs font-bold">{stack.level}</span>
                </button>
                <button
                  type="button"
                  onClick={() => removeStack(i)}
                  className="pr-3.5 pl-2.5 py-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-r-full transition-colors flex items-center justify-center"
                  title="Remover"
                >
                  <span className="text-xs leading-none">✕</span>
                </button>

                {editingStackName === stack.name && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-20 w-64 p-4 border border-gray-100 shadow-xl rounded-2xl bg-white flex flex-col gap-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-700">Nível: {stack.name}</span>
                      <button type="button" onClick={() => setEditingStackName(null)} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={stack.level}
                      onChange={(e) => updateLevel(i, Number(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <span key={n}>{n}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Escala de nível
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LEGEND.map(({ range, desc, color, bg }) => (
            <div key={range} className="flex items-start gap-2">
              <span
                className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ color, background: bg }}
              >
                {range}
              </span>
              <span className="text-[11px] text-gray-500 leading-tight">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
