export type StatusRecurso = "DISPONIVEL" | "AGUARDANDO" | "ALOCADO";

export type StatusMatricula =
  | "NAO_NECESSARIO"
  | "SOLICITADO_VIA_CHAMADO"
  | "CHAMADO_AGUARDANDO_APROVACAO"
  | "CHAMADO_AGUARDANDO_ATENDIMENTO"
  | "LIBERADA";

export type StatusMaquina =
  | "VAZIO"
  | "EM_PROCESSO_DE_SOLICITACAO"
  | "SOLICITADO"
  | "RETIRADO"
  | "ENVIO_PARA_O_RECURSO"
  | "EM_USO"
  | "DEVOLVIDO";

export type StatusPropostaTecnica =
  | "PENDENTE_DE_ENVIO"
  | "ENVIADO_AO_COORDENADOR"
  | "COBRAR_RETORNO"
  | "ASSINADO"
  | "ERRO_DE_ASSINATURA";

export interface Maquina {
  id: string;
  tagNumeroSerie?: string;
  hostname?: string;
  numeroAtivo?: string;
  marcaSistemaOperacional?: string;
  processador?: string;
  statusMaquina: StatusMaquina;
  createdAt?: string;
  updatedAt?: string;
}

export interface MatriculaHistorico {
  id: string;
  valorAnterior?: string;
  valorNovo: string;
  alteradoPorNome?: string;
  alteradoEm: string;
}

export interface Recurso {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  jobTitle?: string;
  area?: string;
  status: string;
  // Seção 1
  statusRecurso: StatusRecurso;
  statusMatricula: StatusMatricula;
  numeroMatricula?: string;
  dataSolicitacaoMatricula?: string;
  observacoesMatricula?: string;
  // Seção 2
  possuiMaquinaCliente: boolean;
  maquinas: Maquina[];
  // Seção 3
  statusPropostaTecnica?: StatusPropostaTecnica;
  // Seção 4
  areaContratante?: string;
  centroCustoContratante?: string;
  dataEntradaProjeto?: string;
  recursoBillable?: boolean;
  onboardingPortoRealizado?: boolean;
  gerenteProjeto?: string;
  projetoAlocacao?: string;
  squadAlocacao?: string;
  // Seção 5
  contato?: string;
  endereco?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecursoPage {
  content: Recurso[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface RecursoFilterParams {
  nome?: string;
  statusRecurso?: StatusRecurso | "";
  statusMatricula?: StatusMatricula | "";
  gerenteProjeto?: string;
  projeto?: string;
  billable?: boolean | "";
  onboarding?: boolean | "";
  dataEntradaDe?: string;
  dataEntradaAte?: string;
}

export const STATUS_RECURSO_LABELS: Record<StatusRecurso, string> = {
  DISPONIVEL: "Disponível",
  AGUARDANDO: "Aguardando",
  ALOCADO: "Alocado",
};

export const STATUS_MATRICULA_LABELS: Record<StatusMatricula, string> = {
  NAO_NECESSARIO: "Não necessário",
  SOLICITADO_VIA_CHAMADO: "Solicitado via chamado",
  CHAMADO_AGUARDANDO_APROVACAO: "Aguardando aprovação",
  CHAMADO_AGUARDANDO_ATENDIMENTO: "Aguardando atendimento",
  LIBERADA: "Liberada",
};

export const STATUS_MAQUINA_LABELS: Record<StatusMaquina, string> = {
  VAZIO: "—",
  EM_PROCESSO_DE_SOLICITACAO: "Em processo",
  SOLICITADO: "Solicitado",
  RETIRADO: "Retirado",
  ENVIO_PARA_O_RECURSO: "Enviado ao recurso",
  EM_USO: "Em uso",
  DEVOLVIDO: "Devolvido",
};

export const STATUS_PROPOSTA_LABELS: Record<StatusPropostaTecnica, string> = {
  PENDENTE_DE_ENVIO: "Pendente de envio",
  ENVIADO_AO_COORDENADOR: "Enviado ao Coordenador",
  COBRAR_RETORNO: "Cobrar retorno",
  ASSINADO: "Assinado",
  ERRO_DE_ASSINATURA: "Erro de assinatura",
};
