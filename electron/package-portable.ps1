$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$version = (Get-Content package.json -Raw | ConvertFrom-Json).version
$output = Join-Path $root "release\\NEVA-Studio-Portable-$version.zip"
$source = Join-Path $root "release\\win-unpacked\\*"

if (Test-Path $output) {
    Remove-Item $output -Force
}

Compress-Archive -Path $source -DestinationPath $output -Force
Write-Host "Portable package created at $output"
