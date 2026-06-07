# Script de exemplo: Testando Ollama diretamente

Write-Host "Testando conexão com Ollama..." -ForegroundColor Cyan
Write-Host ""

# Verificar se Ollama está rodando
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:11434/api/chat" -Method Post -ContentType "application/json" -Body (ConvertTo-Json @{
        model = "llama3"
        messages = @(@{ role = "user"; content = "teste" })
        stream = $false
    }) -TimeoutSec 5 -ErrorAction Stop
    
    Write-Host "✅ Ollama está rodando!" -ForegroundColor Green
} catch {
    Write-Host "❌ Não consegui conectar em http://localhost:11434" -ForegroundColor Red
    Write-Host "Execute start-ollama.ps1 primeiro" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Testando modelo llama3" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Exemplo 1: Pergunta simples
Write-Host "📝 Pergunta: Quem é você?" -ForegroundColor Cyan
$body1 = @{
    model = "llama3"
    messages = @(
        @{
            role = "user"
            content = "Quem é você?"
        }
    )
    stream = $false
} | ConvertTo-Json -Depth 10

$response1 = Invoke-RestMethod `
    -Uri "http://localhost:11434/api/chat" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body1

Write-Host "🤖 Resposta:" -ForegroundColor Green
Write-Host $response1.message.content
Write-Host ""

# Exemplo 2: Com contexto
Write-Host "📝 Pergunta com contexto: Recomende um vitamina para imunidade do nosso catálogo" -ForegroundColor Cyan
$bodyWithContext = @{
    model = "llama3"
    messages = @(
        @{
            role = "system"
            content = "Você é um assistente farmacêutico. NUNCA recomende medicamentos para situações perigosas. NUNCA use linguagem ofensiva. Produtos disponíveis: 1. Vitamina C 500mg (R$ 15.00), 2. Vitamina D3 1000IU (R$ 20.00), 3. Vitamina A 5000IU (R$ 18.00)"
        }
        @{
            role = "user"
            content = "Qual vitamina vocês recomendam para imunidade?"
        }
    )
    stream = $false
} | ConvertTo-Json -Depth 10

$response2 = Invoke-RestMethod `
    -Uri "http://localhost:11434/api/chat" `
    -Method Post `
    -ContentType "application/json" `
    -Body $bodyWithContext

Write-Host "🤖 Resposta:" -ForegroundColor Green
Write-Host $response2.message.content
Write-Host ""

Write-Host "✅ Testes concluídos!" -ForegroundColor Green
