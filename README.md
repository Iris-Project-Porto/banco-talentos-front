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

**Gestão de Recursos (Bench & Alocados)**
Painéis dedicados para visualizar talentos em projetos ativos e filtros robustos para encontrar profissionais disponíveis no bench. Gestão de Hard e Soft Skills com níveis de proficiência de 1 a 10.

**Gestão de Vagas**
Módulo completo (CRUD) para controle de postos de trabalho (Abertas, Em andamento, Fechadas, Canceladas) e filtragem por requisitos técnicos ou senioridade.

**Integração com Form Builder**
Seção dedicada para visualização e acesso à URL dos formulários customizados gerados pelo *Banco de Talentos Form Builder* (Next.js) através de um iFrame embutido.

**Perfis diferenciados por papel:**
- **Admin / Recrutador** — acesso global ao Banco de Talentos, Vagas, Fila de Revisão, Usuários Pendentes e Dashboards com KPIs.
- **Recurso (Talento)** — sidebar exclusiva com "Meu Perfil" e "Meu Histórico", permitindo ao talento atualizar seus dados e acompanhar seu progresso.

**Autenticação completa e segura**
Fluxo de login, registro (com seleção de perfil e grupo), verificação de e-mail por OTP de 6 dígitos, recuperação e redefinição de senha, via JWT com interceptadores Axios que previnem loops em respostas 401.

**Validação robusta de formulários**
Todos os formulários utilizam **React Hook Form** + **Zod** para validação de schema, incluindo:
- Registro restrito a e-mails `@vilt-group.com`
- Senha com regras de complexidade (maiúscula + caractere especial)
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
│       ├── Input/
│       ├── PageHeader/
│       ├── Pagination/
│       ├── Section/
│       ├── Select/
│       ├── StatCard/
│       ├── Tag/
│       └── index.ts           # Barrel export dos componentes UI
│
├── features/                  # Módulos de negócio independentes
│   ├── auth/
│   │   ├── api/               # Chamadas HTTP de autenticação
│   │   ├── contexts/          # AuthContext e AuthProvider
│   │   ├── hooks/             # Hooks personalizados (useAuth, etc.)
│   │   ├── types/             # Tipos e enums (UserRole)
│   │   ├── validations/       # Schemas Zod (login, register, verify, reset, forgot)
│   │   └── index.ts           # Barrel export do módulo auth
│   ├── profiles/
│   │   ├── api/               # Endpoints de perfil e listagem
│   │   ├── components/
│   │   │   ├── BancoTalentosList/  # Listagem do banco de talentos
│   │   │   ├── PersonCard/         # Card de exibição de talento
│   │   │   ├── ProfileReadOnly/    # Visualização do perfil em modo leitura
│   │   │   └── StackInput/         # Input de skills com nível de proficiência
│   │   ├── hooks/             # Hooks de dados de perfis
│   │   ├── types/             # Tipos do domínio de perfis
│   │   ├── utils/             # Funções auxiliares
│   │   ├── profile.ts         # Lógica de mapeamento de perfil
│   │   └── index.ts
│   ├── skills/
│   │   └── api/               # Endpoints e tipos de skills
│   └── vagas/
│       ├── api/               # Endpoints de vagas (CRUD)
│       ├── components/        # Componentes de listagem e formulário de vagas
│       ├── types.ts           # Tipos do domínio de vagas
│       └── index.ts
│
├── lib/
│   └── axios.ts               # Instância global do Axios, interceptadores de 401 e helper getApiError
│
├── pages/
│   ├── admin/
│   │   ├── Dashboard.tsx          # KPIs e estatísticas gerais
│   │   ├── BancoTalentos.tsx      # Listagem de todos os talentos
│   │   ├── TalentoDetalhe.tsx     # Perfil completo de um talento
│   │   ├── RecursosAlocados.tsx   # Talentos em projetos ativos
│   │   ├── FilaRevisao.tsx        # Currículos aguardando aprovação
│   │   ├── UsuariosPendentes.tsx  # Usuários aguardando liberação de acesso
│   │   ├── Vagas.tsx              # Gestão de vagas
│   │   └── Forms.tsx              # Integração com o Form Builder (iFrame)
│   ├── public/
│   │   ├── Login.tsx
│   │   ├── Register.tsx           # Cadastro com seleção de perfil e grupo
│   │   ├── VerifyEmail.tsx        # Verificação via OTP de 6 dígitos
│   │   ├── ForgotPassWord.tsx
│   │   └── ResetPassword.tsx
│   └── user/
│       ├── MeuPerfil.tsx          # Edição do currículo do talento logado
│       └── MeuHistorico.tsx       # Histórico do talento
│
├── routes/
│   ├── index.tsx              # Mapa global de rotas com Lazy Loading
│   ├── ProtectedRoute.tsx     # Guardião de rotas privadas baseado em role (Admin/Recurso)
│   └── PublicRoute.tsx        # Guardião para usuários não autenticados
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
| `/reset-password` | `ResetPassword` | Público |
| `/meu-perfil` | `MeuPerfil` | 🔒 Recurso |
| `/meu-historico` | `MeuHistorico` | 🔒 Recurso |
| `/admin/dashboard` | `Dashboard` | 🔒 Admin |
| `/admin/talentos` | `BancoTalentos` | 🔒 Admin |
| `/admin/talentos/:id` | `TalentoDetalhe` | 🔒 Admin |
| `/admin/alocados` | `RecursosAlocados` | 🔒 Admin |
| `/admin/fila` | `FilaRevisao` | 🔒 Admin |
| `/admin/usuarios` | `UsuariosPendentes` | 🔒 Admin |
| `/admin/vagas` | `Vagas` | 🔒 Admin |
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

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Autentica o usuário e retorna o token |
| `POST` | `/auth/register` | Cria nova conta com nome, e-mail, senha, role e grupo |
| `POST` | `/auth/verify` | Valida o código OTP de ativação de e-mail |
| `POST` | `/auth/resend-verification-code` | Reenvia o código OTP de ativação de e-mail |
| `POST` | `/auth/forgot-password` | Solicita e-mail de recuperação de senha |
| `POST` | `/auth/reset-password` | Redefine a senha via token enviado por e-mail |

### 👤 Perfil do Talento

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/profile/me` | Busca os dados do talento logado |
| `POST` | `/profile` | Salva ou atualiza o currículo do talento |

### 👑 Área Administrativa

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/admin/dashboard` | Busca estatísticas e KPIs gerais |
| `GET` | `/admin/users/pending` | Lista usuários aguardando aprovação |
| `POST` | `/admin/users/:id/approve` | Aprova acesso de um usuário |
| `POST` | `/admin/users/:id/reject` | Rejeita ou bloqueia acesso de um usuário |
| `GET` | `/admin/profiles` | Lista irrestrita de todos os perfis |
| `GET` | `/admin/profiles/ativos` | Lista talentos ativos (Banco de Talentos e Alocados) |
| `GET` | `/admin/profiles/pendentes` | Lista currículos na fila de revisão |
| `GET` | `/admin/profiles/:id` | Abre o perfil completo de um talento |
| `PATCH` | `/admin/profiles/:id` | Edita o status de um talento |

### 🏢 Grupos

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/v1/groups` | Carrega os grupos disponíveis para cadastro (paginado) |

### 🎯 Vagas (Job Postings)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/admin/job-postings/active` | Lista as vagas ativas (paginado) |
| `GET` | `/admin/job-postings/inactive` | Lista as vagas inativas (paginado) |
| `GET` | `/admin/job-postings/:id` | Busca detalhes de uma vaga específica |
| `POST` | `/admin/job-postings` | Cria uma nova vaga |
| `PUT` | `/admin/job-postings/:id` | Atualiza os dados de uma vaga |
| `PATCH`| `/admin/job-postings/:id/activate` | Ativa uma vaga |
| `PATCH`| `/admin/job-postings/:id/deactivate` | Desativa uma vaga |

### 🛡️ Squads e Projetos

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/admin/squads/active` | Lista os squads ativos (paginado) |
| `GET` | `/admin/squads/inactive` | Lista os squads inativas (paginado) |
| `GET` | `/admin/squads/:id` | Busca detalhes de um squad |
| `POST` | `/admin/squads` | Cria um novo squad |
| `PUT` | `/admin/squads/:id` | Atualiza os dados de um squad |
| `PATCH`| `/admin/squads/:id/activate` | Ativa um squad |
| `PATCH`| `/admin/squads/:id/inactivate` | Inativa um squad |
| `GET` | `/admin/projects/active` | Lista os projetos ativos |

### 🛠️ Skills

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/admin/skills/active` | Lista as skills ativas |
| `GET` | `/admin/skills/inactive` | Lista as skills inativas |
| `GET` | `/admin/skills/:id` | Busca detalhes de uma skill |
| `PUT` | `/admin/skills/:id` | Atualiza os dados de uma skill |
| `PATCH`| `/admin/skills/:id/activate` | Ativa uma skill |
| `PATCH`| `/admin/skills/:id/inactivate` | Inativa uma skill |

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