# Arquitetura do Sistema

## Visão Geral

O PharmaLais é uma aplicação web fullstack com arquitetura cliente-servidor. O frontend React se comunica com o backend ASP.NET via API REST. O assistente de IA é uma exceção: o frontend se conecta diretamente ao Ollama local, sem passar pelo backend.

```
┌─────────────────────────────────────────────────────────┐
│                     Navegador (Cliente)                  │
│                                                         │
│   React 19 + Vite + TypeScript + Styled Components      │
│                                                         │
│   ┌─────────────────────┐   ┌────────────────────────┐  │
│   │   Aplicação React   │   │   IAChatWidget (💊)    │  │
│   │   (rotas, páginas,  │   │   Conexão direta com   │  │
│   │    componentes)     │   │   Ollama local         │  │
│   └──────────┬──────────┘   └──────────┬─────────────┘  │
└──────────────┼───────────────────────── ┼───────────────┘
               │ REST / JSON              │ HTTP
               ▼                          ▼
┌──────────────────────────┐   ┌─────────────────────────┐
│   ASP.NET Core (.NET 10) │   │   Ollama (localhost:     │
│                          │   │   11434)                 │
│   Controllers            │   │                         │
│   Services               │   │   Modelo: llama3        │
│   Repositories           │   │   (ou outro instalado)  │
│   Entity Framework Core  │   └─────────────────────────┘
│            │             │
│            ▼             │
│        SQLite            │
│    (projetoles.db)       │
└──────────────────────────┘
```

---

## Backend — ASP.NET Core

### Padrão de camadas

```
Controllers      → recebem requisições HTTP, delegam para Services
Services         → lógica de negócio
Repositories     → acesso ao banco via EF Core
Models           → entidades do banco de dados
DTOs             → contratos de entrada/saída da API
```

### Controllers e responsabilidades

| Controller | Responsabilidade |
|-----------|-----------------|
| `AuthController` | Login e geração de token JWT |
| `CustomerController` | CRUD de clientes, endereços, cartões, telefones |
| `ProductController` | Consulta de produtos e catálogo da loja |
| `StockController` | Consulta e entrada de estoque |
| `TransactionController` | Checkout, pedidos, receitas, trocas e devoluções |
| `ChatController` | Endpoint de chat (integração com serviço de IA no backend) |
| `CategoryController` | Listagem de categorias |
| `CardBrandController` | Listagem de bandeiras de cartão |
| `SupplierController` | CRUD de fornecedores |
| `RoleController` | Gerenciamento de perfis de acesso |
| `UserController` | Gerenciamento de usuários internos |

### Autenticação

JWT Bearer. O token é gerado no login e deve ser enviado no header `Authorization: Bearer <token>` em todas as rotas protegidas. Perfis: `Admin` e `Customer`.

### Banco de dados

SQLite via Entity Framework Core. As migrations ficam em `ProjetoLES.Server/Migrations/` e já incluem seed com dados iniciais.

---

## Frontend — React

### Bibliotecas principais

| Biblioteca | Uso |
|-----------|-----|
| React 19 + Vite | Base da aplicação |
| React Router DOM 7 | Roteamento client-side |
| React Query (TanStack) | Cache e gerenciamento de estado do servidor |
| Axios | Requisições HTTP |
| React Hook Form + Yup | Formulários e validação |
| Styled Components | Estilização |
| Chart.js + react-chartjs-2 | Gráficos administrativos |

### Páginas implementadas

**Área do cliente**

| Rota | Página |
|------|--------|
| `/cadastro` | Cadastro de novo cliente |
| `/login` | Autenticação |
| `/loja` | Catálogo de produtos |
| `/produto/:id` | Detalhes do produto |
| `/carrinho` | Carrinho e checkout |
| `/pedidos` | Histórico de pedidos |
| `/editar-cliente` | Edição de dados cadastrais |
| `/editar-endereco` | Gerenciamento de endereços |

**Área administrativa**

| Rota | Página |
|------|--------|
| `/estoque` | Consulta e entrada de estoque |
| `/clientes` | Listagem de clientes |
| `/avaliacao-receitas` | Aprovação/reprovação de receitas |
| `/avaliacao-trocas-devolucoes` | Gestão de pós-venda |
| `/grafico` | Gráficos e relatórios de vendas |
| `/ia` | Página completa do assistente de IA |

### Assistente de IA (IAChatWidget)

O widget flutuante (💊) está presente em todas as páginas após login. Ao abrir:

1. Busca todos os produtos da API para montar o contexto
2. Envia a mensagem do usuário + histórico + contexto de produtos para `http://localhost:11434/api/chat`
3. Exibe a resposta do modelo `llama3` diretamente no chat

A conexão é feita diretamente do navegador para o Ollama local — o backend não participa desse fluxo.

---

## Testes — Cypress

Testes E2E que simulam o comportamento real do usuário no navegador, com interceptação de chamadas à API via `cy.intercept`.

| Arquivo | Perfil testado |
|---------|---------------|
| `cadastro.cy.js` | Público |
| `login.cy.js` | Público |
| `cliente-fluxo-compra.cy.js` | Cliente |
| `clientes.cy.js` | Admin |
| `edicao-cliente.cy.js` | Cliente |
| `edicao-endereco.cy.js` | Cliente |
| `admin-integrado.cy.js` | Admin |
| `ia.cy.js` | Cliente / Admin |
