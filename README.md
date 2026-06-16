# PharmaLais — Sistema de E-Commerce para Drogaria

> Projeto acadêmico desenvolvido para a disciplina de Laboratório de Engenharia de Software (LES).  
> Simulação de um sistema completo de e-commerce farmacêutico com painel administrativo, fluxo de compra, controle de estoque, receitas, trocas/devoluções e assistente de IA.

---

## 👥 Equipe

| Nome | RA |
|------|----|
| Caio Soares | 1840482322021 |
| Lucas Athié | 1840482322017 |

---

## 📁 Estrutura do Repositório

```
Les/
├── ProjetoLES.Server/          # Backend — ASP.NET Core (.NET 10)
│   ├── Controllers/            # Endpoints REST
│   ├── Services/               # Lógica de negócio
│   ├── Repositories/           # Acesso a dados (padrão repository)
│   ├── Models/                 # Entidades do domínio
│   ├── DTO's/                  # Data Transfer Objects
│   ├── Migrations/             # Migrations do EF Core (SQLite)
│   └── Program.cs              # Entry point e DI
├── projetoles.client/          # Frontend — React + Vite + TypeScript
│   └── src/
│       ├── pages/              # Telas da aplicação
│       └── components/         # Componentes reutilizáveis
├── cypress/                    # Testes E2E automatizados
│   └── e2e/
│       ├── admin-integrado.cy.js
│       ├── cadastro.cy.js
│       ├── cliente-fluxo-compra.cy.js
│       ├── clientes.cy.js
│       ├── edicao-cliente.cy.js
│       ├── edicao-endereco.cy.js
│       ├── ia.cy.js
│       └── login.cy.js
├── docs/
│   ├── COMO_EXECUTAR.md        # Guia completo de instalação e execução
│   ├── ARQUITETURA.md          # Arquitetura do sistema e decisões técnicas
│   └── API.md                  # Referência completa dos endpoints REST
├── DVP_PharmaLais.md           # Documento de Visão do Projeto
├── OLLAMA_IA_SETUP.md          # Guia de configuração da IA (Ollama)
├── PharmaPro.postman_collection.json  # Coleção Postman para testes de API
└── README.md
```

> 📎 **Anexos no repositório:** Apresentação PPT (com todas as entregas do semestre) e histórico do quadro Kanban estão disponíveis na pasta `/docs` ou como releases do projeto.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Backend | ASP.NET Core (.NET 10), Entity Framework Core |
| Banco de dados | SQLite |
| Frontend | React 18 + Vite + TypeScript |
| Testes E2E | Cypress |
| IA | Ollama (local, conectado direto no frontend) |
| Autenticação | JWT |

---

## ⚙️ Como Executar

### Pré-requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [Ollama](https://ollama.com/) instalado e rodando localmente (para o assistente de IA)

### Backend

```bash
cd ProjetoLES.Server
dotnet restore
dotnet ef database update   # aplica as migrations (cria o SQLite)
dotnet run
```

O servidor sobe em `https://localhost:5001` por padrão.

### Frontend

```bash
cd projetoles.client
npm install
npm run dev
```

O cliente sobe em `http://localhost:5173`.

### Testes E2E (Cypress)

```bash
# na raiz do projeto
npm install
npx cypress open       # modo interativo
npx cypress run        # modo headless (CI)
```

---

## ✅ Testes Automatizados (Cypress)

Os testes cobrem os principais fluxos da aplicação e devem ser executados com o backend e frontend em funcionamento.

### Fluxo do Cliente

| Arquivo | O que testa |
|---------|-------------|
| `cadastro.cy.js` | Registro de novo cliente |
| `login.cy.js` | Autenticação e sessão |
| `cliente-fluxo-compra.cy.js` | Listagem de produtos, filtro de catálogo, detalhes do produto, substitutos, validação de interações medicamentosas, exigência de receita para antibióticos, finalização do checkout, pedidos e reenvio de receita |
| `edicao-cliente.cy.js` | Edição de dados cadastrais do cliente |
| `edicao-endereco.cy.js` | Gerenciamento de endereços |
| `clientes.cy.js` | Listagem de clientes (visão admin) |
| `ia.cy.js` | Assistente de IA flutuante — abertura do modal e envio de perguntas |

### Fluxo Administrativo

| Arquivo | O que testa |
|---------|-------------|
| `admin-integrado.cy.js` | Consulta e filtragem de estoque, registro de nova entrada, gráfico de vendas com troca de modo de análise, avaliação de receitas (aprovar/reprovar/reenviar), avaliação de trocas e devoluções |

---

## 🎬 Vídeos de Demonstração

### 📹 Fluxo do Cliente

> _Demonstração das funcionalidades de cadastro, login, navegação pela loja, carrinho, checkout e acompanhamento de pedidos._

🔗 **[Assistir ao vídeo — Fluxo do Cliente](https://youtu.be/GR-Q_tKwbhE)**

---

### 📹 Fluxo Administrativo

> _Demonstração das funcionalidades administrativas: gestão de estoque, avaliação de receitas, aprovação de trocas/devoluções, gráficos gerenciais e IA._

🔗 **[Assistir ao vídeo — Fluxo Administrativo](https://www.youtube.com/watch?v=LINK_ADMIN_AQUI)**

---

> ⚠️ **Sobre os vídeos:** As funcionalidades com testes automatizados são demonstradas via execução do Cypress, narrada pelos autores. As funcionalidades sem cobertura de testes são demonstradas por execução manual, também narrada.

---

## 📋 Funcionalidades Implementadas

### Cliente
- Cadastro e autenticação com JWT
- Navegação pela loja com filtro por categoria
- Visualização de detalhes do produto e medicamentos substitutos
- Detecção de interações medicamentosas no carrinho
- Validação e upload de receita médica para medicamentos controlados
- Checkout com seleção de endereço e cartão de crédito
- Histórico de pedidos com rastreamento de status
- Solicitação de troca ou devolução
- Gerenciamento de endereços e dados cadastrais
- Assistente de IA farmacêutico (chat flutuante)

### Administrador
- Gestão de estoque (consulta, filtro, entrada de mercadoria)
- Avaliação de receitas médicas (aprovar, reprovar, solicitar reenvio)
- Avaliação de solicitações de troca e devolução
- Gráficos de vendas com múltiplos modos de análise
- Listagem e gerenciamento de clientes
- Catálogo de produtos com controle de ativação

---

## 📄 Documentação Adicional

- [`docs/COMO_EXECUTAR.md`](./docs/COMO_EXECUTAR.md) — Guia completo de instalação, configuração e execução do projeto
- [`docs/ARQUITETURA.md`](./docs/ARQUITETURA.md) — Arquitetura do sistema, camadas, páginas e fluxo da IA
- [`docs/API.md`](./docs/API.md) — Referência completa de todos os endpoints REST
- [`DVP_PharmaLais.md`](./DVP_PharmaLais.md) — Documento de Visão do Projeto com requisitos, regras de negócio, cronograma e diagramas
- [`OLLAMA_IA_SETUP.md`](./OLLAMA_IA_SETUP.md) — Guia de configuração do Ollama (instalação, modelos, troubleshooting)
- [`PharmaPro.postman_collection.json`](./PharmaPro.postman_collection.json) — Coleção Postman com exemplos de requisição para a API

---

## 📌 Observações

- O banco de dados SQLite é criado automaticamente pelo EF Core na primeira execução (`dotnet ef database update`).
- As migrations já incluem seed com dados iniciais de produtos, categorias, bandeiras de cartão e usuário administrador.
- O assistente de IA utiliza o **Ollama rodando localmente**, conectado diretamente pelo frontend. Consulte [`OLLAMA_IA_SETUP.md`](./OLLAMA_IA_SETUP.md) para instruções completas de instalação e configuração do modelo, ou [`docs/COMO_EXECUTAR.md`](./docs/COMO_EXECUTAR.md) para o passo a passo resumido.
