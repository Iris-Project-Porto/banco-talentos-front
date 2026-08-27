export type StatusRecurso = "AVAILABLE" | "WAITING" | "ALLOCATED";

export type StatusMatricula =
  | "NOT_REQUIRED"
  | "REQUESTED_VIA_TICKET"
  | "TICKET_AWAITING_APPROVAL"
  | "TICKET_AWAITING_SERVICE"
  | "RELEASED";

export type StatusMaquina =
  | "EMPTY"
  | "REQUEST_IN_PROGRESS"
  | "REQUESTED"
  | "WITHDRAWN"
  | "SENT_TO_RESOURCE"
  | "IN_USE"
  | "RETURNED"
  | "INACTIVE";

export type StatusPropostaTecnica =
  | "PENDING_SEND"
  | "SENT_TO_COORDINATOR"
  | "FOLLOW_UP_REQUIRED"
  | "SIGNED"
  | "SIGNATURE_ERROR";

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
  statusRecurso: StatusRecurso;
  statusMatricula: StatusMatricula;
  numeroMatricula?: string;
  dataSolicitacaoMatricula?: string;
  observacoesMatricula?: string;
  possuiMaquinaCliente: boolean;
  maquinas: Maquina[];
  statusPropostaTecnica?: StatusPropostaTecnica;
  areaContratante?: string;
  centroCustoContratante?: string;
  dataEntradaProjeto?: string;
  recursoBillable?: boolean;
  onboardingPortoRealizado?: boolean;
  gerenteProjeto?: string;
  projetoAlocacao?: string;
  squadAlocacao?: string;
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
  AVAILABLE: "Disponível",
  WAITING: "Aguardando",
  ALLOCATED: "Alocado",
};

export const STATUS_MATRICULA_LABELS: Record<StatusMatricula, string> = {
  NOT_REQUIRED: "Não Necessário",
  REQUESTED_VIA_TICKET: "Solicitado via chamado",
  TICKET_AWAITING_APPROVAL: "Aguardando aprovação",
  TICKET_AWAITING_SERVICE: "Aguardando atendimento",
  RELEASED: "Liberada",
};

export const STATUS_MAQUINA_LABELS: Record<StatusMaquina, string> = {
  EMPTY: "Vazio",
  REQUEST_IN_PROGRESS: "Em processo de solicitação",
  REQUESTED: "Solicitado",
  WITHDRAWN: "Retirado",
  SENT_TO_RESOURCE: "Envio para o recurso",
  IN_USE: "Em Uso",
  RETURNED: "Devolvido",
  INACTIVE: "Inativo",
};

export const STATUS_PROPOSTA_LABELS: Record<StatusPropostaTecnica, string> = {
  PENDING_SEND: "Pendente de envio",
  SENT_TO_COORDINATOR: "Enviado ao Coordenador",
  FOLLOW_UP_REQUIRED: "Cobrar retorno",
  SIGNED: "Assinado",
  SIGNATURE_ERROR: "Erro de assinatura",
};
