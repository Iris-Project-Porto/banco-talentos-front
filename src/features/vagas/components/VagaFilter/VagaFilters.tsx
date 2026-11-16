import { Search } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import type { VagaFiltersParams } from "../../types/types";
import {
  FILTER_LABEL_CLS,
  MODALIDADE_OPTIONS,
  SENIORIDADE_OPTIONS,
  STATUS_VAGA_OPTIONS,
} from "../../utils/vagasFilterOptions";

interface Props {
  filters: VagaFiltersParams;
  projects: { id: string; name: string }[];
  squads: { id: string; name: string }[];
  onChange: (key: keyof VagaFiltersParams, value: any) => void;
  onApply: () => void;
  onClear: () => void;
}

function SearchField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className={FILTER_LABEL_CLS}>{label}</label>
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-9"
        />
        <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

export function VagaFilters({ filters, projects = [], squads = [], onChange, onApply, onClear }: Props) {
  const projectOptions = [
    { value: "", label: "Selecione" },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];

  const squadOptions = [
    { value: "", label: "Selecione" },
    ...squads.map((s) => ({ value: s.id, label: s.name })),
  ];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SearchField
          label="Código da Vaga"
          placeholder="Ex: VAG-001"
          value={filters.vacancyCode || ""}
          onChange={(value) => onChange("vacancyCode", value)}
        />
        <SearchField
          label="Título da Vaga"
          placeholder="Ex: Desenvolvedor Front-end"
          value={filters.title || ""}
          onChange={(value) => onChange("title", value)}
        />
        <div>
          <label className={FILTER_LABEL_CLS}>Status da Vaga</label>
          <Select
            options={STATUS_VAGA_OPTIONS}
            value={filters.status || ""}
            onChange={(e) => onChange("status", e.target.value)}
          />
        </div>
        <div>
          <label className={FILTER_LABEL_CLS}>Senioridade</label>
          <Select
            options={SENIORIDADE_OPTIONS}
            value={filters.experienceLevel || ""}
            onChange={(e) => onChange("experienceLevel", e.target.value)}
          />
        </div>
        <div>
          <label className={FILTER_LABEL_CLS}>Modalidade</label>
          <Select
            options={MODALIDADE_OPTIONS}
            value={filters.modality || ""}
            onChange={(e) => onChange("modality", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SearchField
          label="Recrutador"
          placeholder="Nome do recrutador"
          value={filters.recruiter || ""}
          onChange={(value) => onChange("recruiter", value)}
        />
        <div>
          <label className={FILTER_LABEL_CLS}>Projeto</label>
          <Select
            options={projectOptions}
            value={filters.projectId || ""}
            onChange={(e) => onChange("projectId", e.target.value)}
          />
        </div>
        <div>
          <label className={FILTER_LABEL_CLS}>Squad responsável</label>
          <Select
            options={squadOptions}
            value={filters.squadId || ""}
            onChange={(e) => onChange("squadId", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <SearchField
            label="Skills"
            placeholder="Ex: Java, React, SQL"
            value={filters.skills?.join(", ") || ""}
            onChange={(value) => {
              const skillsArray = value ? value.split(",").map(s => s.trim()).filter(Boolean) : undefined;
              onChange("skills", skillsArray);
            }}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <Button variant="secondary" size="sm" type="button" onClick={onClear}>
          Limpar filtros
        </Button>
        <Button variant="primary" size="sm" type="button" onClick={onApply}>
          Filtrar
        </Button>
      </div>
    </div>
  );
}