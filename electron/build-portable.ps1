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
cmd /c npx electron-builder --win dir
if ($LASTEXITCODE -ne 0) {
    $builderSucceeded = $false
}

$exePath = Join-Path $root 'release\win-unpacked\NEVA Studio.exe'
if (!(Test-Path $exePath)) {
    throw "Desktop package was not created."
}

& (Join-Path $root 'node_modules\rcedit\bin\rcedit-x64.exe') $exePath --set-icon (Join-Path $root 'build-resources\icon.ico')
if ($LASTEXITCODE -ne 0) {
    throw "Executable icon patch failed."
}

powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'package-portable.ps1')
if ($LASTEXITCODE -ne 0) {
    throw "Portable zip packaging failed."
}

if (-not $builderSucceeded) {
    Write-Warning 'electron-builder reported a Windows signing-tool permission issue, but the unpacked app and portable zip were still created successfully.'
}
