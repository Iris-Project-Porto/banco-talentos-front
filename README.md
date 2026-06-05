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
- [⚙️ Variáveis de Ambiente](#️-variáveis-de-ambiente)
- [🚀 Como Executar](#-como-executar)
- [🔌 Integrações e APIs](#-integrações-e-apis)
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
Fluxo de login, registro, verificação de e-mail (OTP), recuperação e redefinição de senha, via JWT com interceptadores Axios que previnem loops em respostas 401.

**Validação robusta de formulários**
Todos os formulários utilizam **React Hook Form** + **Zod** para validação de schema, garantindo integridade dos dados enviados.

---

## 🛠️ Stack Tecnológica

| Tecnologia | Finalidade | Versão |
| :--- | :--- | :--- |
| **Vite** | Build tool e servidor de desenvolvimento | `5.3.x` |
| **React** | Biblioteca de interface declarativa | `18.3.x` |
| **TypeScript** | Tipagem estática | `5.x` |
| **React Router DOM** | Roteamento client-side (SPA) | `6.23.x` |
| **Tailwind CSS** | Estilização utilitária com design tokens customizados | `3.4.x` |
| **React Hook Form** | Gerenciamento de estado de formulários | `7.x` |
| **Zod** | Validação de schema | `3.x` |
| **TanStack Query** | Gerenciamento de estado assíncrono e cache | `5.x` |
| **Axios** | Cliente HTTP com interceptadores de token e refresh | `1.7.x` |

---

## 📂 Estrutura de Arquivos

Arquitetura baseada no padrão **Feature-Sliced Design**, garantindo escalabilidade e separação de responsabilidades:

```text
src/
├── components/
│   ├── layouts/               # Layouts estruturais (AdminLayout, RecursoLayout, AuthLayout)
│   └── ui/                    # Biblioteca de componentes visuais base (Avatar, Badge, Button, Select, etc.)
│
├── features/                  # Módulos de negócio independentes
│   ├── auth/                  # Lógica de autenticação, validações, tipos e hooks (Contexts, API)
│   ├── profiles/              # Gestão de perfis, componentes de listagem (StackInput, BancoTalentosList)
│   ├── skills/                # API e tipos para gestão de skills
│   └── vagas/                 # CRUD e interfaces para a gestão de Vagas
│
├── lib/
│   └── axios.ts               # Instância global do Axios e interceptadores (Tratamento de erro 401)
│
├── pages/
│   ├── admin/                 # Dashboards, Fila de Revisão, Vagas, Forms, Recursos
│   ├── public/                # Login, Register, ForgotPassword, ResetPassword, VerifyEmail
│   └── user/                  # MeuPerfil, MeuHistorico
│
├── routes/
│   ├── index.tsx              # Mapa global de rotas com Lazy Loading
│   ├── ProtectedRoute.tsx     # Guardião de rotas privadas baseado em permissões (Admin/Recurso)
│   └── PublicRoute.tsx        # Guardião para não-autenticados
│
├── App.tsx                    # ErrorBoundary, QueryClientProvider, AuthProvider e RouterProvider
├── main.tsx                   # Ponto de entrada e injeção global de CSS
└── index.css                  # Importações do Tailwind e estilos base

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Em desenvolvimento, o proxy do Vite já redireciona /api → http://localhost:8080
# A variável abaixo é usada apenas em produção (Vercel)
VITE_API_URL=[https://iris-banco-talentos.onrender.com/api](https://iris-banco-talentos.onrender.com/api)

# URL do Form Builder (banco-talentos-form — Next.js)
# Desenvolvimento: rode o Next.js na porta 3000
VITE_FORM_BUILDER_URL=[https://banco-talentos-form.netlify.app](https://banco-talentos-form.netlify.app)
# Produção: substitua pela URL do seu deploy
# VITE_FORM_BUILDER_URL=[https://your-form-builder.vercel.app](https://your-form-builder.vercel.app)
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
cp .env.local.example .env.local
# Edite o arquivo conforme necessário
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse em [http://localhost:5173](http://localhost:5173).

### 5. Build para produção

```bash
npm run build   # Compila TypeScript e gera bundle
npm run preview # Pré-visualiza o build localmente
```

---

## 🔌 Endpoints da API

Todas as chamadas são feitas via `src/lib/api.ts` com autenticação JWT.

### 🔒 Autenticação

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Autentica o usuário e retorna o token |
| `POST` | `/auth/register` | Cria nova conta no banco de talentos |
| `POST` | `/auth/verify` | Valida o código de ativação de e-mail |
| `POST` | `/auth/forgot-password` | Solicita e-mail de recuperação de senha |
| `POST` | `/auth/reset-password` | Redefine a senha via link enviado por e-mail |

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
| `GET` | `/v1/groups` | Carrega os grupos disponíveis para cadastro |

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