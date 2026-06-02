# 🌟 VILT - Banco de Talentos Front-End

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.3.1-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-6.23-CA4245?style=for-the-badge&logo=react-router)](https://reactrouter.com/)

O **VILT Banco de Talentos Front-End** é a aplicação web central para o gerenciamento de talentos e recursos da VILT. Desenvolvida com as tecnologias mais modernas do ecossistema React, ela permite a visualização, gestão e controle do status dos colaboradores (alocados, em bench), incluindo a integração direta com as respostas e definições geradas pelo *Banco de Talentos Form Builder*.

---

## 📌 Sumário

- [✨ Funcionalidades Principais](#-funcionalidades-principais)
- [🛠️ Stack Tecnológica](#️-stack-tecnológica)
- [📂 Estrutura de Arquivos](#-estrutura-de-arquivos)
- [🔌 Endpoints da API](#-endpoints-da-api)
- [🚀 Como Executar o Projeto](#-como-executar-o-projeto)

---

## ✨ Funcionalidades Principais

*   **👥 Gestão de Recursos Alocados e Bench:** Painéis dedicados para listar talentos que estão atualmente em projetos ("recursos alocados") e filtros robustos para encontrar talentos disponíveis ("bench-only cards").
*   **📑 Integração com Formulários Customizados:** Seção dedicada para visualização e acesso à URL dos formulários gerados pelo nosso *Form Builder*.
*   **👤 Painéis por Perfil:** 
    *   **Visão Admin/Recrutador:** Acesso global a todos os talentos (Banco de Talentos), Vagas, Fila de Revisão, Usuários Pendentes e Dashboards gerenciais.
    *   **Visão Recurso (Talento):** Sidebar layout customizado para perfis "Recurso", com a área de "Meu Histórico" e "Meu Perfil", possibilitando ao talento visualizar seu próprio progresso e atualizar seus dados.
*   **🔒 Autenticação e Autorização Seguras:** Fluxo de login validado via API (Axios e JWT) com tratamento correto contra loopings em respostas 401, recuperações de senha e validação de e-mails.
*   **🧩 Componentização Avançada e Validação:** Formulários de interação do usuário validados pelo **Zod** através do **React Hook Form**, garantindo integridade das informações enviadas e com uma robusta biblioteca de UI (`components/ui`).

---

## 🛠️ Stack Tecnológica

| Tecnologia | Finalidade | Versão Principal |
| :--- | :--- | :--- |
| **Vite** | Build tool super rápida para o ambiente de desenvolvimento e produção. | `5.3.x` |
| **React** | Biblioteca de interface declarativa. | `18.3.x` |
| **React Router DOM** | Gerenciamento de rotas do lado do cliente (SPA). | `6.23.x` |
| **Tailwind CSS** | Framework utilitário para estilização CSS com customizações de layout. | `3.4.x` |
| **React Hook Form & Zod** | Gerenciamento de estado de formulários de alta performance e schema de validação. | `7.51.x` & `3.23.x` |
| **Axios** | Cliente HTTP robusto para chamadas seguras e interceptadores na comunicação com o backend. | `1.7.x` |

---

## 📂 Estrutura de Arquivos

Abaixo está o mapeamento completo e detalhado da arquitetura de pastas (`src/`) do front-end:

```text
├── src/
│   ├── components/
│   │   ├── AdminLayout.tsx       # Estrutura principal com Sidebar para perfil de Administrador e Recrutador.
│   │   ├── RecursoLayout.tsx     # Estrutura e Sidebar exclusivos para perfil de Recurso.
│   │   ├── AuthLayout.tsx        # Layout centralizado para páginas de Login, Registro e recuperação de senha.
│   │   └── ui/                   # Biblioteca de componentes visuais reaproveitáveis.
│   │       ├── Avatar.tsx        # Componente visual para fotos de perfil.
│   │       ├── Badge.tsx         # Indicadores de status e contagens.
│   │       ├── Button.tsx        # Botões estilizados da aplicação.
│   │       ├── Card.tsx          # Container padrão em formato de cartão.
│   │       ├── Input.tsx         # Campos de texto padronizados.
│   │       ├── PageHeader.tsx    # Cabeçalho padrão das páginas com título e ações.
│   │       ├── PersonCard.tsx    # Cartão de exibição das informações resumidas de um talento.
│   │       ├── Select.tsx        # Caixa de seleção customizada.
│   │       ├── StackInput.tsx    # Input avançado para seleção e inserção de Stacks/Skills.
│   │       ├── StatCard.tsx      # Cartões de estatísticas para o Dashboard.
│   │       └── Tag.tsx           # Tags visuais (ex: sênior, júnior).
│   ├── contexts/
│   │   ├── AuthContext.tsx       # Gerenciamento de estado global de sessão e usuário logado.
│   │   └── VagasContext.tsx      # Gerenciamento de estado global para controle de vagas ativas.
│   ├── lib/
│   │   └── api.ts                # Instância do Axios com interceptadores de token e tratamento de Refresh/401.
│   ├── pages/
│   │   ├── Login.tsx             # Página de autenticação de usuários.
│   │   ├── Register.tsx          # Cadastro de novos usuários no banco de talentos.
│   │   ├── ForgotPassWord.tsx    # Fluxo de esquecimento de senha.
│   │   ├── ResetPassword.tsx     # Fluxo de redefinição de senha.
│   │   ├── VerifyEmail.tsx       # Tela de validação de e-mail pós-cadastro.
│   │   ├── MeuPerfil.tsx         # Gerenciamento de dados e currículo do próprio usuário logado.
│   │   ├── MeuHistorico.tsx      # Acompanhamento do histórico (específico do Recurso).
│   │   └── admin/                # Páginas restritas ao perfil de Admin/Recrutador.
│   │       ├── Dashboard.tsx         # Visão geral, KPIs e métricas do banco de talentos.
│   │       ├── BancoTalentos.tsx     # Lista principal de pessoas (Pessoas/Bench).
│   │       ├── FilaRevisao.tsx       # Talentos aguardando validação ou revisão de currículo.
│   │       ├── RecursosAlocados.tsx  # Listagem focada em quem está atualmente alocado em projetos.
│   │       ├── TalentoDetalhe.tsx    # Visão aprofundada (Perfil Completo) de um recurso selecionado.
│   │       ├── UsuariosPendentes.tsx # Área de aprovação de novos cadastros.
│   │       ├── Vagas.tsx             # Gestão de vagas (Criação, edição e exclusão).
│   │       └── Forms.tsx             # Integração/Placeholder para o Banco de Talentos Form Builder.
│   ├── App.tsx                   # Definição e roteamento global da aplicação (React Router DOM).
│   ├── main.tsx                  # Ponto de entrada do React e provedores globais (Contexts).
│   └── index.css                 # Importações do Tailwind e estilos base da aplicação.
```

---

## 🔌 Endpoints da API

Abaixo está o mapeamento dos endpoints consumidos pelo front-end (via `src/lib/api.ts`):

### 🔒 Autenticação e Gestão de Contas (Auth)
| Método | Endpoint | Função na Interface (Onde é usado) |
| :--- | :--- | :--- |
| **POST** | `/auth/login` | Tela de `Login.tsx` (Autentica o usuário e gera o token). |
| **POST** | `/auth/register` | Tela de `Register.tsx` (Cria a conta do usuário no banco). |
| **POST** | `/auth/verify` | Tela de `VerifyEmail.tsx` (Valida o código de ativação do e-mail). |
| **POST** | `/auth/forgot-password` | Tela `ForgotPassWord.tsx` (Solicita e-mail de recuperação). |
| **POST** | `/auth/reset-password` | Tela `ResetPassword.tsx` (Envia o novo password após clicar no link). |

### 👤 Perfis e Dados do Talento (Recursos)
| Método | Endpoint | Função na Interface (Onde é usado) |
| :--- | :--- | :--- |
| **GET** | `/profile/me` | Tela `MeuPerfil.tsx` (Busca os dados do próprio talento logado). |
| **POST** | `/profile` | Tela `MeuPerfil.tsx` (Salva/atualiza o currículo do talento logado). |

### 👑 Visão Administrativa / Recrutamento (Admin)
| Método | Endpoint | Função na Interface (Onde é usado) |
| :--- | :--- | :--- |
| **GET** | `/admin/dashboard` | Tela `Dashboard.tsx` (Busca estatísticas gerais). |
| **GET** | `/admin/users/pending` | Tela `UsuariosPendentes.tsx` (Lista usuários aguardando aprovação). |
| **POST** | `/admin/users/:id/approve` | Botões em `UsuariosPendentes.tsx` (Aprova acesso). |
| **POST** | `/admin/users/:id/reject` | Botões em `UsuariosPendentes.tsx` (Rejeita/bloqueia acesso). |
| **GET** | `/admin/profiles` | Tela `Dashboard.tsx` (Lista irrestrita de todos os perfis). |
| **GET** | `/admin/profiles/ativos` | Telas `BancoTalentos.tsx` e `RecursosAlocados.tsx` (Lista os talentos). |
| **GET** | `/admin/profiles/pendentes` | Tela `FilaRevisao.tsx` (Lista de currículos precisando de revisão). |
| **GET** | `/admin/profiles/:id` | Tela `TalentoDetalhe.tsx` (Abre o modal/tela detalhada de um talento). |
| **PATCH**| `/admin/profiles/:id` | Utilizado para edições rápidas de status pelo admin no talento. |

### 🏢 Grupos
| Método | Endpoint | Função na Interface (Onde é usado) |
| :--- | :--- | :--- |
| **GET** | `/v1/groups` | Tela `Register.tsx` (Carrega grupos disponíveis no cadastro). |

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
*   **Node.js:** Versão 18.x ou superior.
*   **Gerenciador de Pacotes:** `npm` (incluso com Node.js).

### 1. Clone o repositório e navegue até a pasta:
```bash
cd c:/Users/leticia.sampaio/Documents/banco-talentos-front
```

### 2. Instale as dependências:
```bash
npm install
```

### 3. Inicie o servidor Vite:
```bash
npm run dev
```

### 4. Acesse a aplicação:
Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

### 5. Compilação para Produção:
```bash
npm run build
npm run preview
```
