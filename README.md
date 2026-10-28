# 🌟 VILT — Banco de Talentos Front-End

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.3.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-6.23-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.x-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query)
[![Zod](https://img.shields.io/badge/Zod-3.x-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![Axios](https://img.shields.io/badge/Axios-1.7.x-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

Aplicação web central da **VILT** para gerenciamento de talentos e recursos humanos. Permite a visualização, gestão e controle do status de colaboradores — alocados em projetos ou disponíveis no bench — com integração direta ao *Banco de Talentos Form Builder*.

---

## 📌 Sumário

- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Stack Tecnológica](#️-stack-tecnológica)
- [📂 Estrutura de Arquivos](#-estrutura-de-arquivos)
- [🗺️ Mapa de Rotas](#️-mapa-de-rotas)
- [⚙️ Variáveis de Ambiente](#️-variáveis-de-ambiente)
- [🚀 Como Executar](#-como-executar)
- [🔌 Endpoints da API](#-endpoints-da-api)
- [🚢 Deploy](#-deploy)

---

## ✨ Funcionalidades

**Gestão de Recursos**
Listagem e filtros de recursos em `/admin/talentos`, com cadastro exclusivo pelo admin (nome, e-mail, e grupo). O recurso recebe e-mail com senha provisória e completa o perfil em **Meu Perfil**. Hard e Soft Skills com níveis de proficiência de 1 a 10.

**Gestão de Vagas**
Módulo completo (CRUD) para controle de postos de trabalho (Aberta, Em triagem, Em alocação, Preenchida, Fechada, Cancelada) e filtragem por código, título, projeto, recrutador ou senioridade. Cadastro e edição em páginas dedicadas, com wizard de duas etapas: dados da vaga (projeto, squad, modalidade, skills obrigatórias/desejáveis com nível e peso) e ranking de match de recursos. Edição permitida apenas nos status Aberta, Em triagem e Em alocação; cancelamento com modal de confirmação.

**Match de Recursos**
Ranking de aderência dos talentos aos requisitos da vaga, com score visual, filtros por squad e disponibilidade, e modal de resumo do match.

**Gestão de Projetos**
CRUD de projetos com listagem paginada, filtros por nome e status (Ativo/Inativo), cards de resumo e visualização de detalhes com metadados de auditoria. Cadastro e edição em páginas dedicadas, com abas de Dados Gerais e Squads Participantes (vincular squads existentes ou criar uma nova).

**Gestão de Skills**
CRUD de hard e soft skills com categoria, filtros por nome e categoria, listagem paginada e inativação com confirmação.

**Gestão de Squads**
CRUD de squads com listagem paginada, filtros por nome e status (Ativa/Inativa) e modal de cadastro/edição.

**Gestão operacional de Recursos**
Consulta do ciclo de vida dos recursos com filtros por status, matrícula, gerente, projeto, billable, onboarding Porto e período de entrada. Cobertura de matrícula, histórico, máquinas e atualização de contato.

**Integração com Form Builder**
Seção dedicada para visualização e acesso à URL dos formulários customizados gerados pelo *Banco de Talentos Form Builder* (Next.js) através de um iFrame embutido.

**Perfis diferenciados por papel:**
- **Admin / Recrutador** — acesso global ao Banco de Talentos (cadastro e consulta de recursos), Vagas, Projetos, Squads, Skills, Fila de Revisão, Usuários Pendentes e Dashboards com KPIs.
- **Recurso (Talento)** — sidebar com "Meu Perfil" e "Meu Histórico". No primeiro acesso, é direcionado a criar o perfil; depois pode visualizar e editar seus dados.

**Autenticação completa e segura**
Fluxo de login, logout, registro público **apenas para Administrador** (com seleção de grupo), verificação de e-mail por OTP de 6 dígitos, recuperação e redefinição de senha (link com validade de 1 hora, validado ao abrir a página e no envio do formulário). Recursos **não** se auto-cadastram em `/register` — são criados pelo admin. A sessão utiliza access token e refresh token: o Axios renova tokens expirados automaticamente, repete a requisição original uma única vez e encerra a sessão caso a renovação falhe. No logout, o refresh token é invalidado no backend e os dados locais da sessão são removidos.

**Validação robusta de formulários**
Todos os formulários utilizam **React Hook Form** + **Zod** para validação de schema, incluindo:
- Registro restrito a e-mails `@vilt-group.com`
- Senha com regras de complexidade (mínimo 8 caracteres, maiúscula, número e caractere especial), exibidas em tempo real via `PasswordRequirements`
- Código OTP com exatamente 6 dígitos

**Tratamento global de erros**
`ErrorBoundary` global captura falhas de renderização, exibe mensagem amigável e oferece opção de recarregar a aplicação.

---

## 🛠️ Stack Tecnológica

| Tecnologia | Finalidade | Versão |
| :--- | :--- | :--- |
| **Vite** | Build tool e servidor de desenvolvimento | `5.3.x` |
| **React** | Biblioteca de interface declarativa | `18.3.x` |
| **TypeScript** | Tipagem estática | `5.x` |
| **React Router DOM** | Roteamento client-side (SPA) com Lazy Loading | `6.23.x` |
| **Tailwind CSS** | Estilização utilitária com design tokens customizados | `3.4.x` |
| **React Hook Form** | Gerenciamento de estado de formulários | `7.x` |
| **Zod** | Validação de schema | `3.x` |
| **TanStack Query** | Gerenciamento de estado assíncrono e cache | `5.x` |
| **Axios** | Cliente HTTP com interceptadores de token e refresh | `1.7.x` |
| **React Hot Toast** | Notificações toast | `2.x` |
| **React Error Boundary** | Captura de erros de renderização | `6.x` |
| **Lucide React** | Biblioteca de ícones | `1.x` |
| **Vitest** | Framework de testes unitários | `4.x` |
| **Testing Library** | Utilitários de testes para React | `16.x` |

---

## 📂 Estrutura de Arquivos

Arquitetura baseada no padrão **Feature-Sliced Design**, garantindo escalabilidade e separação de responsabilidades:

```text
src/
├── components/
│   ├── layouts/
│   │   ├── AdminLayout/       # Layout com sidebar e topbar para admins
│   │   ├── RecursoLayout/     # Layout simplificado para talentos (recursos)
│   │   └── AuthLayout/        # Layout centralizado para telas de autenticação
│   └── ui/                    # Biblioteca de componentes visuais base
│       ├── Avatar/
│       ├── Badge/
│       ├── Button/
│       ├── Card/
│       ├── ConfirmModal/
│       ├── Input/
│       ├── PageHeader/
│       ├── Pagination/
│       ├── PasswordRequirements/
│       ├── ProgressRing/
│       ├── Section/
│       ├── Select/
│       ├── StatCard/
│       ├── Stepper/
│       ├── Table/
│       ├── Tag/
│       └── index.ts           # Barrel export dos componentes UI
│
├── features/                  # Módulos de negócio independentes
│   ├── auth/
│   │   ├── api/               # Login, logout, registro e demais chamadas de autenticação
│   │   ├── contexts/          # AuthContext e AuthProvider
│   │   ├── hooks/             # Hooks personalizados (useAuth, etc.)
│   │   ├── types/             # Tipos e enums (UserRole)
│   │   ├── validations/       # Schemas Zod (login, register, verify, reset, forgot) e regras de senha
│   │   └── index.ts           # Barrel export do módulo auth
│   ├── profiles/
│   │   ├── api/               # Endpoints de perfil e listagem
│   │   ├── components/
│   │   │   ├── BancoTalentosList/  # Listagem do banco de talentos
│   │   │   ├── PersonCard/         # Card de exibição de talento
│   │   │   ├── ProfileReadOnly/    # Visualização do perfil em modo leitura
│   │   │   ├── StackInput/         # Input de skills com nível de proficiência
│   │   │   └── TalentoDetalhe/     # Abas e campos do detalhe (admin)
│   │   ├── hooks/             # Hooks de dados de perfis (incl. useMeuPerfilEditar)
│   │   ├── types/             # Tipos do domínio de perfis (contato em EN)
│   │   ├── utils/             # Funções auxiliares
│   │   ├── profile.ts         # Lógica de mapeamento de perfil
│   │   └── index.ts
│   ├── projects/
│   │   ├── api/               # Endpoints de projetos (CRUD, activate/inactivate)
│   │   ├── components/
│   │   │   ├── ProjectDetailModal/   # Visualização de detalhes
│   │   │   ├── ProjectForm/          # Cadastro e edição (abas Dados Gerais e Squads)
│   │   │   ├── ProjectsFilters/      # Filtros de busca e status
│   │   │   └── ProjectsTable/        # Tabela de listagem
│   │   ├── types/             # Tipos do domínio de projetos
│   │   ├── utils/             # Filtros e paginação local
│   │   ├── validations/       # Schemas Zod
│   │   └── index.ts
│   ├── recursos/              # Cadastro e listagem de recursos (admin)
│   │   ├── api/               # POST/GET/PATCH /v1/admin/resources
│   │   ├── components/
│   │   │   ├── ResourceCreateModal/  # Modal de cadastro (nome, e-mail, grupo)
│   │   │   ├── RecursosFilters/      # Filtros da listagem
│   │   │   └── RecursosList/         # Tabela/listagem de recursos
│   │   ├── hooks/             # useRecursosList
│   │   ├── types/             # Tipos e labels de status
│   │   ├── validations/       # Schema Zod do cadastro
│   │   └── index.ts
│   ├── squads/                # CRUD e regras de squads
│   │   ├── api/               # Endpoints de squads (CRUD, activate/inactivate)
│   │   ├── components/        # Componentes e formulários de squads
│   │   ├── types/             # Tipos do domínio de squads
│   │   ├── validations/       # Schemas Zod
│   │   └── index.ts
│   ├── skills/
│   │   ├── api/               # Endpoints de skills (CRUD, listagem e inativação)
│   │   ├── components/
│   │   │   ├── SkillFormModal/       # Cadastro e edição
│   │   │   ├── SkillsFilters/        # Filtros por nome e categoria
│   │   │   ├── SkillsTable/          # Tabela de listagem
│   │   │   └── SkillCategoryBadge/   # Badge de categoria
│   │   ├── types/             # Tipos do domínio de skills
│   │   ├── utils/             # Categorias, normalização e exibição
│   │   ├── validations/       # Schemas Zod
│   │   └── index.ts
│   └── vagas/
│       ├── api/               # Endpoints de vagas (CRUD)
│       ├── components/
│       │   ├── VagaCard/             # Card de listagem
│       │   ├── VagaWizard/           # Wizard de cadastro/edição (dados + match)
│       │   ├── VagaDataForm/         # Formulário de dados da vaga
│       │   ├── SkillsSection/        # Skills obrigatórias e desejáveis
│       │   ├── ResourceMatch/        # Ranking de match de recursos
│       │   ├── MatchFilters/         # Filtros do ranking
│       │   ├── MatchTable/           # Tabela do ranking
│       │   └── SummaryMatchModal/    # Resumo do match
│       ├── types/             # Tipos do domínio de vagas
│       ├── validations/       # Schemas Zod
│       └── index.ts
│
├── lib/
│   └── axios.ts               # Axios, autenticação, renovação de token em respostas 401 e helper getApiError
│
├── pages/
│   ├── admin/
│   │   ├── Dashboard.tsx          # KPIs e estatísticas gerais
│   │   ├── BancoTalentos.tsx      # Listagem e cadastro de recursos
│   │   ├── TalentoDetalhe.tsx     # Perfil completo de um talento
│   │   ├── FilaRevisao.tsx        # Currículos aguardando aprovação
│   │   ├── UsuariosPendentes.tsx  # Usuários aguardando liberação de acesso
│   │   ├── Projetos.tsx           # Gestão de projetos
│   │   ├── ProjetoForm.tsx        # Cadastro e edição de projeto
│   │   ├── Squads.tsx             # Gestão de squads
│   │   ├── Skills.tsx             # Gestão de skills
│   │   ├── Vagas.tsx              # Gestão de vagas
│   │   ├── VagaForm.tsx           # Cadastro e edição de vaga (wizard)
│   │   └── Forms.tsx              # Integração com o Form Builder (iFrame)
│   ├── public/
│   │   ├── Login.tsx
│   │   ├── Register.tsx           # Cadastro público apenas de Administrador
│   │   ├── VerifyEmail.tsx        # Verificação via OTP de 6 dígitos
│   │   ├── ForgotPassWord.tsx
│   │   └── ResetPassword.tsx
│   └── user/
│       ├── MeuPerfil.tsx          # Visualização do perfil do recurso logado
│       ├── MeuPerfilEditar.tsx    # Criação/edição do perfil (primeiro contato e updates)
│       └── MeuHistorico.tsx       # Histórico do talento
│
├── routes/
│   ├── index.tsx              # Mapa global de rotas com Lazy Loading
│   ├── ProtectedRoute.tsx     # Guardião de rotas privadas baseado em role (Admin/Recurso)
│   └── PublicRoute.tsx        # Guardião de rotas públicas, com acesso autenticado configurável
│
├── types/                     # Tipos globais compartilhados
│
├── App.tsx                    # ErrorBoundary, QueryClientProvider, AuthProvider e RouterProvider
├── main.tsx                   # Ponto de entrada e injeção global de CSS
├── index.css                  # Importações do Tailwind e estilos base
└── setupTests.ts              # Configuração do ambiente de testes (jest-dom)
```

---

## 🗺️ Mapa de Rotas

| Rota | Componente | Acesso |
| :--- | :--- | :--- |
| `/login` | `Login` | Público |
| `/register` | `Register` | Público |
| `/verify` | `VerifyEmail` | Público |
| `/forgot-password` | `ForgotPassword` | Público |
| `/reset-password` | `ResetPassword` | Público (requer `?token=` e `?email=` válidos na URL) |
| `/meu-perfil` | `MeuPerfil` | 🔒 Recurso |
| `/meu-perfil/editar` | `MeuPerfilEditar` | 🔒 Recurso |
| `/meu-historico` | `MeuHistorico` | 🔒 Recurso |
| `/admin/dashboard` | `Dashboard` | 🔒 Admin |
| `/admin/talentos` | `BancoTalentos` | 🔒 Admin |
| `/admin/talentos/:id` | `TalentoDetalhe` | 🔒 Admin |
| `/admin/fila` | `FilaRevisao` | 🔒 Admin |
| `/admin/usuarios` | `UsuariosPendentes` | 🔒 Admin |
| `/admin/projetos` | `Projetos` | 🔒 Admin |
| `/admin/projetos/novo` | `ProjetoForm` | 🔒 Admin |
| `/admin/projetos/:id/editar` | `ProjetoForm` | 🔒 Admin |
| `/admin/squads` | `Squads` | 🔒 Admin |
| `/admin/skills` | `Skills` | 🔒 Admin |
| `/admin/vagas` | `Vagas` | 🔒 Admin |
| `/admin/vagas/nova` | `VagaForm` | 🔒 Admin |
| `/admin/vagas/:id/editar` | `VagaForm` | 🔒 Admin |
| `/admin/forms` | `Forms` | 🔒 Admin |
| `*` | — | Redireciona para `/login` |

> Todas as páginas são carregadas via **Lazy Loading** para otimização do bundle.

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` (ou `.env.local`) na raiz do projeto com as seguintes variáveis:

```env
# Em desenvolvimento, o proxy do Vite já redireciona /api → http://localhost:8080
# A variável abaixo é usada apenas em produção (Vercel)
VITE_API_URL=https://iris-banco-talentos.onrender.com/api

# URL do Form Builder (banco-talentos-form — Next.js)
# Desenvolvimento: rode o Next.js na porta 3000
VITE_FORM_BUILDER_URL=https://banco-talentos-form.netlify.app
# Produção: substitua pela URL do seu deploy
# VITE_FORM_BUILDER_URL=https://your-form-builder.vercel.app
```

> **Nota:** Em desenvolvimento, o proxy configurado no `vite.config.ts` encaminha automaticamente todas as requisições `/api` para `http://localhost:8080`, então `VITE_API_URL` não é necessário localmente.

---

## 🚀 Como Executar

### Pré-requisitos

- **Node.js** `18.x` ou superior
- **npm** (incluso com Node.js)

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd banco-talentos-front
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
# Crie o arquivo .env na raiz e preencha com os valores acima
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse em [http://localhost:5173](http://localhost:5173).

### 5. Executar os testes

```bash
npm run test
```

### 6. Build para produção

```bash
npm run build   # Compila TypeScript e gera bundle otimizado
npm run preview # Pré-visualiza o build localmente
```

---

## 🔌 Endpoints da API

Todas as chamadas são feitas via `src/lib/axios.ts` com autenticação JWT.

### 🔒 Autenticação

Base path: `/v1/auth` (prefixo `/api` é adicionado pelo Axios em produção ou pelo proxy do Vite em desenvolvimento).

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/v1/auth/login` | Autentica e retorna os tokens e dados do usuário (`name`, `email`, `role`, `hasProfile`, `mustChangePassword`) |
| `POST` | `/v1/auth/refresh` | Renova a sessão e rotaciona os tokens |
| `POST` | `/v1/auth/logout` | Invalida o refresh token e encerra a sessão |
| `POST` | `/v1/auth/first-password-reset` | Gera um link de redefinição para o usuário autenticado com senha provisória |
| `POST` | `/v1/auth/register` | Cria conta de **Administrador** (nome, e-mail, senha, role `ADMIN` e grupo). Recurso não é aceito neste endpoint |
| `POST` | `/v1/auth/verify` | Valida o código OTP de ativação de e-mail |
| `POST` | `/v1/auth/resend-verification-code` | Reenvia o código OTP de ativação de e-mail |
| `POST` | `/v1/auth/forgot-password` | Solicita e-mail de recuperação de senha |
| `GET` | `/v1/auth/validate-reset-token` | Valida se o link de redefinição ainda é válido (`?email=` e `?token=`; expira em 1 hora) |
| `POST` | `/v1/auth/reset-password` | Redefine a senha via token enviado por e-mail |

O front persiste `token`, `refreshToken` e `user` no `localStorage`. O interceptor adiciona o access token ao header `Authorization` e, em caso de 401, compartilha uma única tentativa de renovação entre requisições simultâneas. Se a renovação falhar, a sessão local é limpa.

**Fluxo de redefinição de senha (`ResetPassword.tsx`):**
1. Usuário acessa `/reset-password?token=...&email=...` recebido por e-mail.
2. O front chama `GET /v1/auth/validate-reset-token` ao carregar a página.
3. Se o token estiver expirado ou inválido, exibe mensagem e orienta a solicitar novo link em `/forgot-password`.
4. Se válido, exibe o formulário; ao salvar, chama `POST /v1/auth/reset-password` (validação repetida no backend).

No primeiro acesso com senha provisória, `POST /v1/auth/login` retorna `mustChangePassword: true`; o front chama `POST /v1/auth/first-password-reset` com o JWT recém-recebido e redireciona para a URL de reset retornada.

### 👤 Perfil do Recurso

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/v1/profile` | Busca o perfil do recurso logado |
| `POST` | `/v1/profile` | Primeiro envio / criação do perfil (vai para revisão) |
| `PATCH` | `/v1/profile` | Atualiza o próprio perfil (contato, skills, links etc.) |

### 👥 Recursos (Admin)

Base path: `/v1/admin/resources`

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/v1/admin/resources` | Cadastra recurso (nome, e-mail, grupo) e dispara e-mail com senha provisória |
| `GET` | `/v1/admin/resources` | Lista recursos com filtros e paginação |
| `GET` | `/v1/admin/resources/:id` | Busca um recurso por ID |
| `PATCH` | `/v1/admin/resources/:id` | Atualiza dados operacionais do recurso |

### 👑 Área Administrativa

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/v1/admin/dashboard` | Busca estatísticas e KPIs gerais |
| `GET` | `/v1/admin/users/pending` | Lista usuários aguardando aprovação |
| `POST` | `/v1/admin/users/:id/approve` | Aprova acesso de um usuário |
| `POST` | `/v1/admin/users/:id/reject` | Rejeita ou bloqueia acesso de um usuário |
| `GET` | `/v1/admin/profiles` | Lista irrestrita de todos os perfis |
| `GET` | `/v1/admin/profiles/active` | Lista talentos ativos (Banco de Talentos e Alocados) |
| `GET` | `/v1/admin/profiles/pending` | Lista currículos na fila de revisão |
| `GET` | `/v1/admin/profiles/:id` | Abre o perfil completo de um talento |
| `PATCH` | `/v1/admin/profiles/:id` | Edita o status de um talento |

### 🏢 Grupos

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/v1/groups` | Carrega os grupos disponíveis para cadastro (paginado) |

### 🎯 Vagas (Job Postings)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/v1/admin/job-postings/active` | Lista as vagas ativas (paginado) |
| `GET` | `/v1/admin/job-postings/inactive` | Lista as vagas inativas (paginado) |
| `GET` | `/v1/admin/job-postings/:id` | Busca detalhes de uma vaga específica |
| `GET` | `/v1/admin/job-postings/:id/matches` | Ranking de candidatos compatíveis com a vaga (score, skills e resumo) |
| `POST` | `/v1/admin/job-postings` | Cria uma nova vaga |
| `PUT` | `/v1/admin/job-postings/:id` | Atualiza os dados de uma vaga |
| `PATCH`| `/v1/admin/job-postings/:id/activate` | Ativa uma vaga |
| `PATCH`| `/v1/admin/job-postings/:id/deactivate` | Desativa uma vaga |

> **Campos da vaga:** `vacancyCode`, `title`, `projectId`, `squadId`, `experienceLevel`, `modality`, `recruiter`, `estimatedAllocationWeeks`, `status`, `openingDate`, `skills` (obrigatórias/desejáveis, nível mínimo e peso). Edição bloqueada fora de `OPEN`, `SCREENING` e `ALLOCATING`.

### 🛡️ Squads e Projetos

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/v1/admin/squads/active` | Lista os squads ativos (paginado) |
| `GET` | `/v1/admin/squads/inactive` | Lista os squads inativos (paginado) |
| `GET` | `/v1/admin/squads/:id` | Busca detalhes de um squad |
| `POST` | `/v1/admin/squads` | Cria um novo squad |
| `PUT` | `/v1/admin/squads/:id` | Atualiza os dados de um squad |
| `PATCH`| `/v1/admin/squads/:id/activate` | Ativa um squad |
| `PATCH`| `/v1/admin/squads/:id/inactivate` | Inativa um squad |
| `GET` | `/v1/admin/projects/active` | Lista os projetos ativos (paginado) |
| `GET` | `/v1/admin/projects/inactive` | Lista os projetos inativos (paginado) |
| `GET` | `/v1/admin/projects/:id` | Busca detalhes de um projeto |
| `POST` | `/v1/admin/projects` | Cria um novo projeto |
| `PUT` | `/v1/admin/projects/:id` | Atualiza nome, descrição e squads participantes |
| `PATCH`| `/v1/admin/projects/:id/activate` | Reativa um projeto |
| `PATCH`| `/v1/admin/projects/:id/inactivate` | Inativa um projeto (exclusão lógica) |

> **Campos do projeto:** `name` (obrigatório, único), `description` (obrigatório), `squadIds` (squads participantes), `active` (padrão `true`). Metadados de auditoria: `createdAt`, `updatedAt`, `createdBy`, `updatedBy`. Uma squad não pode estar vinculada a mais de um projeto.

### 🛠️ Skills

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/v1/admin/skills` | Lista skills para gestão (paginado; filtros `name` e `category`) |
| `GET` | `/v1/admin/skills/active` | Lista as skills ativas |
| `GET` | `/v1/admin/skills/inactive` | Lista as skills inativas |
| `POST` | `/v1/admin/skills` | Cria uma nova skill |
| `PUT` | `/v1/admin/skills/:id` | Atualiza os dados de uma skill |
| `PATCH`| `/v1/admin/skills/:id/inactivate` | Inativa uma skill |

> **Campos da skill:** `name` (obrigatório, único), `type` (`HARD` / `SOFT`), `category` (compatível com o tipo), `description` (opcional).

### 👷 Recursos (Gestão operacional)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/v1/admin/recursos` | Lista recursos com filtros (nome, status, matrícula, gerente, projeto, billable, onboarding, período) |
| `GET` | `/v1/admin/recursos/:id` | Busca detalhes de um recurso |
| `PATCH` | `/v1/admin/recursos/:id` | Atualiza dados operacionais do recurso |
| `PATCH` | `/v1/admin/recursos/:id/matricula` | Atualiza o status de matrícula |
| `GET` | `/v1/admin/recursos/:id/historico` | Lista o histórico de matrícula |
| `POST` | `/v1/admin/recursos/:id/maquinas` | Adiciona uma máquina ao recurso |
| `PUT` | `/v1/admin/recursos/:id/maquinas/:maqId` | Atualiza uma máquina |
| `DELETE` | `/v1/admin/recursos/:id/maquinas/:maqId` | Remove uma máquina |
| `PATCH` | `/v1/recurso/me/contato` | Atualiza contato e endereço do recurso logado |

---

## 🚢 Deploy

O projeto é configurado para deploy na **Vercel** com suporte a SPA via `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Isso garante que todas as rotas client-side sejam corretamente redirecionadas para o `index.html`, evitando erros 404 em refresh ou acesso direto por URL.

**Variáveis de ambiente a configurar no painel da Vercel:**
- `VITE_API_URL` — URL do backend em produção
- `VITE_FORM_BUILDER_URL` — URL do Form Builder em produção

---

> Desenvolvido com 💙 pela equipe VILT.
