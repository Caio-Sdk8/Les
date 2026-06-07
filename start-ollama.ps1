# Script para inicializar Ollama com o modelo llama3
# Execute este script se Ollama já estiver instalado

Write-Host "================================" -ForegroundColor Green
Write-Host "Iniciando Ollama com llama3" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Verificar se Ollama está instalado
$ollamaPath = "C:\Users\$env:USERNAME\AppData\Local\Programs\Ollama"
if (-not (Test-Path $ollamaPath)) {
    Write-Host "❌ Ollama não encontrado em $ollamaPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Baixe Ollama em: https://ollama.ai/download/windows" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Ollama encontrado em $ollamaPath" -ForegroundColor Green
Write-Host ""

# Tentar executar ollama
try {
    Write-Host "Puxando modelo llama3 (pode levar alguns minutos na primeira vez)..." -ForegroundColor Cyan
    & "$ollamaPath\ollama.exe" pull llama3
    
    Write-Host ""
    Write-Host "================================" -ForegroundColor Green
    Write-Host "Iniciando servidor Ollama" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ollama irá rodar em: http://localhost:11434" -ForegroundColor Yellow
    Write-Host "Não feche esta janela enquanto estiver usando a IA!" -ForegroundColor Yellow
    Write-Host ""
    
    & "$ollamaPath\ollama.exe" serve
}
catch {
    Write-Host "❌ Erro ao executar Ollama: $_" -ForegroundColor Red
    exit 1
}
