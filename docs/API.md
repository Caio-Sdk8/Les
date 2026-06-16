# Referência da API REST

Base URL: `https://localhost:5001`

Todas as rotas protegidas exigem o header:
```
Authorization: Bearer <token>
```

O token é obtido via `POST /api/auth/login`.

> A coleção Postman com exemplos de requisição está disponível em [`PharmaPro.postman_collection.json`](../PharmaPro.postman_collection.json).

---

## 🔑 Auth

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/api/auth/login` | ❌ | Autentica o usuário e retorna o JWT |

---

## 👥 Customers (Clientes)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/api/customers/register` | ❌ | Cadastro de novo cliente (público) |
| `GET` | `/api/customers` | Admin | Lista todos os clientes |
| `GET` | `/api/customers/:uuid` | Admin | Busca cliente por UUID |
| `POST` | `/api/customers` | Admin | Cria cliente (via admin) |
| `PUT` | `/api/customers/:uuid` | ✅ | Atualiza dados do cliente |
| `PATCH` | `/api/customers/:uuid/password` | ✅ | Altera senha |
| `PATCH` | `/api/customers/:uuid/deactivate` | Admin | Desativa cliente |
| `GET` | `/api/customers/:uuid/addresses` | ✅ | Lista endereços do cliente |
| `POST` | `/api/customers/:uuid/addresses` | ✅ | Adiciona endereço |
| `PUT` | `/api/customers/:uuid/addresses/:addressUuid` | ✅ | Atualiza endereço |
| `POST` | `/api/customers/:uuid/phones` | ✅ | Adiciona telefone |
| `GET` | `/api/customers/:uuid/credit-cards` | ✅ | Lista cartões de crédito |
| `POST` | `/api/customers/:uuid/credit-cards` | ✅ | Adiciona cartão |
| `PATCH` | `/api/customers/:uuid/credit-cards/:cardUuid/set-preferred` | ✅ | Define cartão preferido |
| `GET` | `/api/customers/:uuid/transactions` | ✅ | Histórico de pedidos do cliente |

---

## 🛒 Transactions (Pedidos)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/api/transactions/checkout` | Cliente | Finaliza compra |
| `GET` | `/api/transactions/my` | Cliente | Pedidos do cliente autenticado |
| `GET` | `/api/transactions` | Admin | Lista todos os pedidos |
| `GET` | `/api/transactions/:uuid` | ✅ | Detalhes de um pedido |
| `GET` | `/api/transactions/:uuid/prescription-file` | ✅ | Arquivo de receita do pedido |
| `PATCH` | `/api/transactions/:uuid/prescription-resubmission` | Cliente | Reenvia receita |
| `GET` | `/api/transactions/my/exchange-credit` | Cliente | Saldo de crédito de troca |
| `POST` | `/api/transactions/:uuid/after-sales-requests` | Cliente | Solicita troca ou devolução |
| `GET` | `/api/transactions/after-sales-requests` | Admin | Lista solicitações de pós-venda |
| `PATCH` | `/api/transactions/:uuid/after-sales-requests/:requestUuid/approve` | Admin | Aprova troca/devolução |
| `PATCH` | `/api/transactions/:uuid/after-sales-requests/:requestUuid/reject` | Admin | Reprova troca/devolução |
| `GET` | `/api/transactions/prescriptions` | Admin | Lista receitas aguardando avaliação |
| `PATCH` | `/api/transactions/prescriptions/:uuid/approve` | Admin | Aprova receita |
| `PATCH` | `/api/transactions/prescriptions/:uuid/reject` | Admin | Reprova receita |
| `PATCH` | `/api/transactions/prescriptions/:uuid/request-resubmission` | Admin | Solicita reenvio de receita |
| `GET` | `/api/transactions/sales-catalog` | Admin | Catálogo de vendas para gráficos |

---

## 📦 Products (Produtos)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/products` | ❌ | Lista produtos (catálogo da loja) |
| `GET` | `/api/products/:uuid` | ❌ | Detalhes de um produto |

---

## 📋 Stock (Estoque)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/stock` | Admin | Lista itens de estoque |
| `POST` | `/api/stock/entry` | Admin | Registra entrada de mercadoria |

---

## 🏷️ Categories

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/categories` | ❌ | Lista categorias de produtos |

---

## 💳 Card Brands (Bandeiras de Cartão)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/card-brands` | ✅ | Lista bandeiras disponíveis |

---

## 🏭 Suppliers (Fornecedores)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/suppliers` | Admin | Lista fornecedores |
| `POST` | `/api/suppliers` | Admin | Cadastra fornecedor |

---

## 👤 Users (Usuários Internos)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/users` | Admin | Lista usuários |
| `GET` | `/api/users/:uuid` | Admin | Busca usuário por UUID |
| `POST` | `/api/users` | Admin | Cria funcionário/admin |
| `PUT` | `/api/users/:uuid` | Admin | Atualiza usuário |
| `PATCH` | `/api/users/:uuid/password` | Admin | Altera senha |
| `PATCH` | `/api/users/:uuid/deactivate` | Admin | Desativa usuário |
| `POST` | `/api/users/:uuid/roles/:roleUuid` | Admin | Atribui perfil ao usuário |
| `DELETE` | `/api/users/:uuid/roles/:roleUuid` | Admin | Remove perfil do usuário |

---

## 🎭 Roles (Perfis de Acesso)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/roles` | Admin | Lista perfis |
| `GET` | `/api/roles/:uuid` | Admin | Busca perfil por UUID |
| `POST` | `/api/roles` | Admin | Cria perfil |
| `PUT` | `/api/roles/:uuid` | Admin | Atualiza perfil |
| `DELETE` | `/api/roles/:uuid` | Admin | Remove perfil |

---

## 🤖 Chat (IA — backend)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/api/chat` | ✅ | Envia mensagem para o serviço de IA do backend |

> **Nota:** o assistente de IA visível na interface (widget flutuante 💊) conecta-se diretamente ao Ollama local (`http://localhost:11434`), sem passar por este endpoint. O `ChatController` no backend existe como integração alternativa.
