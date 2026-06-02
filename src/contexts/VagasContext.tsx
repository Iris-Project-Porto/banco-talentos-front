// src/contexts/VagasContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

export type Senioridade = "INTERN" | "JUNIOR" | "MID_LEVEL" | "SENIOR" | "SPECIALIST";
export type StatusVaga = "Aberta" | "Em andamento" | "Fechada" | "Cancelada";
export type Prioridade = "Baixa" | "Média" | "Alta" | "Urgente";

export interface Vaga {
  id: string;
  titulo: string;
  senioridade: Senioridade;
  time: string;
  solicitante: string;
  tempoContratacao: string;
  area: string;
  skills: string[];
  descricao: string;
  status: StatusVaga;
  prioridade: Prioridade;
  dataAbertura: string;
}

interface VagasCtx {
  vagas: Vaga[];
  setVagas: React.Dispatch<React.SetStateAction<Vaga[]>>;
}

const VagasContext = createContext<VagasCtx | null>(null);

export function VagasProvider({ children }: { children: ReactNode }) {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  return <VagasContext.Provider value={{ vagas, setVagas }}>{children}</VagasContext.Provider>;
}

export function useVagas() {
  const ctx = useContext(VagasContext);
  if (!ctx) throw new Error("useVagas must be used inside VagasProvider");
  return ctx;
}