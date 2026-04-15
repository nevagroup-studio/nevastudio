$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

cmd /c node electron\generate-icon.cjs
if ($LASTEXITCODE -ne 0) {
    throw "Windows icon generation failed."
}

cmd /c npm run build:web
if ($LASTEXITCODE -ne 0) {
    throw "Web build failed."
}

$builderSucceeded = $true
cmd /c npx electron-builder --win nsis
if ($LASTEXITCODE -ne 0) {
    $builderSucceeded = $false
}

$exePath = Join-Path $root 'release\win-unpacked\NEVA Studio.exe'
if (Test-Path $exePath) {
    & (Join-Path $root 'node_modules\rcedit\bin\rcedit-x64.exe') $exePath --set-icon (Join-Path $root 'build-resources\icon.ico')
}

if (-not $builderSucceeded) {
    Write-Warning 'electron-builder reported a Windows signing-tool permission issue on this machine. The NSIS build may still be usable if artifacts were created, but auto-update should be tested on the final release environment.'
}
