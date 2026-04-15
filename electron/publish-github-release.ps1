$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not $env:GH_OWNER) {
    throw "Missing GH_OWNER environment variable."
}

if (-not $env:GH_REPO) {
    throw "Missing GH_REPO environment variable."
}

if (-not $env:GITHUB_TOKEN -and -not $env:GH_TOKEN) {
    throw "Missing GITHUB_TOKEN or GH_TOKEN environment variable."
}

cmd /c node electron\generate-icon.cjs
if ($LASTEXITCODE -ne 0) {
    throw "Windows icon generation failed."
}

cmd /c npm run build:web
if ($LASTEXITCODE -ne 0) {
    throw "Web build failed."
}

cmd /c npx electron-builder --win nsis --publish always
if ($LASTEXITCODE -ne 0) {
    throw "GitHub release publish failed."
}
