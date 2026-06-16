### 1. Instalar e iniciar Ollama

#### Windows

1. Baixar em: https://ollama.ai/download/windows
2. Instalar e executar
3. Abrir PowerShell/CMD e executar:

```powershell
ollama pull llama3
ollama serve
```

Olama vai escutar em `http://localhost:11434`

#### Linux/Mac

```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3
ollama serve
```

### 2. Testar a API (opcional)

```powershell
$body = @{
    model = "llama3"
    messages = @(
        @{
            role = "user"
            content = "Olá, quem é você?"
        }
    )
    stream = $false
} | ConvertTo-Json -Depth 10

Invoke-RestMethod `
    -Uri "http://localhost:11434/api/chat" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### 3. Usar a IA na aplicação

1. Fazer login na plataforma
2. Clicar no botão 💊 no canto inferior esquerdo
3. Digitar a pergunta
4. Enviar com Enter ou clique no botão Enviar

## Variáveis de ambiente (opcional)

Se quiser personalizar a porta ou modelo, pode adicionar em `src/services/ollama/ollamaService.ts`:

```typescript
const OLLAMA_BASE_URL = "http://localhost:11434"; // Customizar aqui
const MODEL = "llama3"; // Ou outro modelo instalado
```

## Troubleshooting

### "Não consegui falar com o assistente"

- Verifique se Ollama está rodando: `http://localhost:11434`
- Verifique se o modelo `llama3` está instalado: `ollama list`
- Verifique o console do navegador (F12) para erros detalhados

### Resposta muito lenta

- Ollama está processando. Primeira requisição é mais lenta
- Use modelo menor se precisar de performance: `ollama pull neural-chat`

### Modelo não encontrado

```bash
ollama pull llama3
# ou outro modelo
ollama pull neural-chat
ollama pull mistral
```