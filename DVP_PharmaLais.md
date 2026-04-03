# Documento de Visão do Projeto – Sistema de Gestão de Drogaria (PharmaLais)

## 1. Introdução
O objetivo deste documento é apresentar a visão geral do sistema de gestão para a drogaria PharmaLais, detalhando requisitos, regras de negócio, estimativas, cronograma e diagramas, adaptados do modelo de DVP acadêmico para o contexto farmacêutico.

## 2. Objetivos do Sistema
- Automatizar processos de vendas, estoque, cadastro de clientes, fornecedores e produtos.
- Garantir rastreabilidade de medicamentos e controle de receitas.
- Facilitar o atendimento ao cliente e a gestão financeira.

## 3. Regras de Negócio
- Cada venda de medicamento controlado exige cadastro e validação de receita.
- O estoque deve ser atualizado automaticamente após cada venda ou entrada de mercadoria.
- Clientes podem ser cadastrados com múltiplos endereços e telefones.
- Produtos vencidos não podem ser vendidos.
- O sistema deve alertar sobre produtos próximos do vencimento.
- Fornecedores devem ser cadastrados e vinculados aos produtos fornecidos.
- O sistema deve permitir CRUD (criar, ler, atualizar, deletar) de clientes, produtos, fornecedores e funcionários.

## 4. Requisitos Funcionais
- RF01: Cadastro e manutenção de clientes.
- RF02: Cadastro e manutenção de produtos (medicamentos, perfumaria, etc).
- RF03: Cadastro e manutenção de fornecedores.
- RF04: Controle de estoque (entrada, saída, ajuste, alerta de vencimento).
- RF05: Registro e controle de vendas (incluindo validação de receita).
- RF06: Emissão de relatórios gerenciais.
- RF07: Controle de usuários e permissões.

## 5. Requisitos Não Funcionais
- RNF01: Interface responsiva e intuitiva, com predominância da cor azul (padrão do sistema).
- RNF02: Backup automático diário.
- RNF03: Autenticação segura de usuários.
- RNF04: Compatibilidade com dispositivos móveis.

## 6. Cronograma de Entregas

| Entrega                | Semana | Data Estimada      | Descrição                                 |
|------------------------|--------|--------------------|-------------------------------------------|
| Início do Projeto      | 1      | Fevereiro          | Levantamento de requisitos                |
| Protótipo do Sistema   | 4      | Final de Fevereiro | Protótipo navegável                       |
| CRUD de Clientes       | 5      | Início de Março    | Cadastro, edição, exclusão de clientes    |
| DVP (este documento)   | 6      | Março              | Documento de visão do projeto             |
| Fluxo de Vendas        | 7      | Março              | Implementação do processo de vendas       |
| Estoque e Produtos     | 8-10   | Março-Abril        | Cadastro e controle de produtos/estoque   |
| Fornecedores           | 11     | Abril              | Cadastro e gestão de fornecedores         |
| Relatórios             | 12-14  | Abril-Maio         | Relatórios gerenciais e de vendas         |
| Ajustes Finais         | 15-18  | Maio-Junho         | Testes, ajustes, documentação             |
| Entrega Final          | 19     | Final de Junho     | Apresentação e entrega do sistema         |

## 7. Diagramas

### 7.1 Diagrama de Casos de Uso (exemplo)

```mermaid
title Casos de Uso - Sistema PharmaLais
actor Cliente
actor Atendente
actor Gerente
rectangle Sistema {
  Cliente -- (Realizar Cadastro)
  Atendente -- (Registrar Venda)
  Atendente -- (Consultar Estoque)
  Gerente -- (Emitir Relatórios)
  Gerente -- (Gerenciar Usuários)
}
```

### 7.2 Diagrama de Fluxo de Vendas (exemplo)

```mermaid
title Fluxo de Vendas - PharmaLais
graph TD
  A[Início da Venda] --> B[Identificar Cliente]
  B --> C[Selecionar Produtos]
  C --> D[Validar Receita (se necessário)]
  D --> E[Registrar Pagamento]
  E --> F[Atualizar Estoque]
  F --> G[Fim]
```

## 8. Estimativas e Considerações
- O projeto terá duração de aproximadamente 5 meses (fevereiro a junho).
- Entregas parciais a cada etapa, conforme cronograma.
- O sistema será desenvolvido em arquitetura web, com backend em .NET e frontend em React/Vite.
- A cor predominante da interface será azul, conforme identidade visual do sistema.

---

> Diagramas podem ser convertidos para imagens posteriormente para inclusão em Word/PDF.
