# IA Chat Widget com Ollama

## O que foi implementado

### Mudanças principais

1. **Widget flutuante redimensionado**: Botão circular de **80px** no canto inferior esquerdo com emoji 💊
2. **Integração com Ollama**: A IA agora usa Ollama (localhost:11434) em vez de chamar o backend
3. **Contexto de produtos**: Todos os produtos do banco de dados são carregados automaticamente para contextualizar a IA
4. **Sistema de restrições**: A IA tem instruções explícitas para:
   - ❌ Nunca recomendar medicamentos para situações perigosas (suicídio, automutilação)
   - ❌ Nunca usar linguagem ofensiva ou xingamentos
   - ❌ Nunca sair do contexto farmacêutico
   - ❌ Nunca fazer diagnósticos específicos
   - ✅ Sempre recomendar ajuda profissional quando necessário
5. **Design melhorado**: Chat com animações, interface mais intuitiva e feedback visual melhor

### Arquivos criados/modificados

- `src/components/IAChatWidget/IAChatWidget.tsx` - Widget principal (refatorado)
- `src/components/IAChatWidget/style.ts` - Estilos do widget (redesenhado)
- `src/services/ollama/ollamaService.ts` - **NOVO** - Integração com Ollama
- `src/services/products/productContextService.ts` - **NOVO** - Busca e contexto de produtos
- `src/App.jsx` - Integração do widget globalmente (já feito)
- `cypress/e2e/ia.cy.js` - Testes atualizados

## Como usar

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

## Como funciona

### Fluxo da IA

1. **Carregamento de produtos**: Ao abrir o modal, a IA busca todos os produtos da API
2. **Preparação do contexto**: Produtos são formatados em uma lista legível
3. **System prompt**: Define as regras e restrições da IA
4. **Envio para Ollama**: Mensagem do usuário + histórico + contexto vai para Ollama
5. **Resposta**: Resultado é exibido no chat

### Restrições da IA (no System Prompt)

```
RESTRIÇÕES ABSOLUTAS - VOCÊ DEVE CUMPRIR:
- ❌ NUNCA recomende medicamentos para situações de risco de vida (automutilação, suicídio, etc)
- ❌ NUNCA use linguagem ofensiva, xingamentos ou seja desrespeitoso
- ❌ NUNCA saia do contexto de farmácia/saúde
- ❌ NUNCA faça diagnósticos médicos específicos
- ❌ NUNCA substitua orientação médica profissional
- ✅ Sempre recomende que o usuário consulte um profissional de saúde para dúvidas sérias
- ✅ Mantenha tom profissional, educado e empático
```

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

## Personalizações futuras

- [ ] Permitir escolher modelo via UI
- [ ] Salvar histórico de chats
- [ ] Adicionar feedback de qualidade (👍/👎)
- [ ] Implementar rate limiting
- [ ] Cache de respostas frequentes
