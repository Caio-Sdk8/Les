# Como Executar o Projeto

## Pré-requisitos

| Ferramenta | Versão mínima | Link |
|------------|---------------|------|
| .NET SDK | 10.0 | https://dotnet.microsoft.com/download |
| Node.js | 20+ | https://nodejs.org |
| Ollama | qualquer | https://ollama.com/download |

---

## 1. Configurar o Ollama (Assistente de IA)

O assistente de IA do sistema roda localmente via Ollama, sem necessidade de chave de API externa.

### Windows

1. Baixe e instale o Ollama em https://ollama.com/download/windows
2. Abra o PowerShell e execute:

```powershell
ollama pull llama3
ollama serve
```

### Linux / macOS

```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3
ollama serve
```

O Ollama ficará disponível em `http://localhost:11434`. O frontend se conecta a ele diretamente — nenhuma configuração adicional é necessária.

> Se quiser usar um modelo diferente (mais leve ou mais capaz), veja a seção [Modelos alternativos](#modelos-alternativos) ao final deste documento.

---

## 2. Executar o Backend (.NET)

```bash
cd ProjetoLES.Server

# Restaurar dependências
dotnet restore

# Aplicar migrations e criar o banco de dados SQLite
dotnet ef database update

# Iniciar o servidor
dotnet run
```

O servidor sobe em `https://localhost:5001` (ou conforme configurado no `launchSettings.json`).

> O banco de dados `projetoles.db` é criado automaticamente na raiz do projeto com dados de seed já incluídos (produtos, categorias, bandeiras de cartão e usuário administrador padrão).

---

## 3. Executar o Frontend (React)

```bash
cd projetoles.client

npm install
npm run dev
```

O cliente sobe em `http://localhost:5173`.

> Para rodar backend e frontend ao mesmo tempo com um único comando, use dentro de `projetoles.client`:
> ```bash
> npm run dev:full
> ```

---

## 4. Executar os Testes Automatizados (Cypress)

Os testes exigem que **backend e frontend estejam rodando**.

```bash
# na raiz do projeto (pasta Les/)
npm install

# Modo interativo (abre a interface do Cypress)
npx cypress open

# Modo headless (execução em terminal, ideal para apresentação)
npx cypress run
```

Para rodar um arquivo específico:

```bash
npx cypress run --spec "cypress/e2e/cliente-fluxo-compra.cy.js"
npx cypress run --spec "cypress/e2e/admin-integrado.cy.js"
```

---

## Usuário Administrador Padrão (seed)

| Campo | Valor |
|-------|-------|
| E-mail | `admin@pharmapro.com` |
| Senha | definida no seed — verifique `AppDbContext.cs` |

---

## Modelos alternativos

Se `llama3` estiver lento na sua máquina, experimente um modelo mais leve:

```bash
ollama pull neural-chat   # mais leve
ollama pull mistral       # boa relação custo/qualidade
```

Após baixar, altere o modelo em:

```
projetoles.client/src/services/ollama/ollamaService.ts
```

```typescript
const MODEL = "neural-chat"; // ou "mistral", etc.
```

---

## Troubleshooting

**`dotnet ef` não encontrado**
```bash
dotnet tool install --global dotnet-ef
```

**Porta já em uso**
Altere a porta no `launchSettings.json` (backend) ou no `vite.config.ts` (frontend).

**IA não responde**
- Verifique se o Ollama está rodando: acesse `http://localhost:11434` no navegador
- Verifique se o modelo está instalado: `ollama list`
- Abra o console do navegador (F12) para ver o erro detalhado
