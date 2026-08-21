$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$output = Join-Path $root "dist"
$archive = Join-Path $output "smplwise-ha-dashboard.zip"
New-Item -ItemType Directory -Force -Path $output | Out-Null
Compress-Archive -Path (Join-Path $root "custom_components\smplwise_ha_dashboard") -DestinationPath $archive -Force
Write-Output $archive

