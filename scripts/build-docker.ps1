# ==========================================
# Docker Build Script for Veterinary Chatbot (Windows)
# ==========================================
# Usage: .\scripts\build-docker.ps1 [tag]

param(
    [string]$Tag = "latest"
)

$ImageName = "vet-chatbot-server"

Write-Host "🐳 Building Docker image: $ImageName`:$Tag" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Navigate to project root
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
Set-Location $ProjectRoot

# Check if Dockerfile exists
if (-not (Test-Path "server\Dockerfile")) {
    Write-Host "❌ Error: server\Dockerfile not found!" -ForegroundColor Red
    exit 1
}

# Build the image
Write-Host "📦 Building server image..." -ForegroundColor Yellow
docker build -t "${ImageName}:${Tag}" -f server\Dockerfile .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Image: $ImageName`:$Tag" -ForegroundColor White
    Write-Host ""
    Write-Host "To run the container:" -ForegroundColor White
    Write-Host "  docker-compose up -d" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or manually:" -ForegroundColor White
    Write-Host "  docker run -d -p 3000:3000 \" -ForegroundColor Cyan
    Write-Host "    -e GEMINI_API_KEY=your_key \" -ForegroundColor Cyan
    Write-Host "    -e MONGODB_URI=mongodb://mongodb:27017/veterinary-chatbot \" -ForegroundColor Cyan
    Write-Host "    ${ImageName}:${Tag}" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
