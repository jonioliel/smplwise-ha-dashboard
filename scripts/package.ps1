$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$output = Join-Path $root "dist"
$archive = Join-Path $output "smplwise-ha-dashboard.zip"
$source = Join-Path $root "custom_components\smplwise_ha_dashboard"
New-Item -ItemType Directory -Force -Path $output | Out-Null
if (Test-Path -LiteralPath $archive) {
    Remove-Item -LiteralPath $archive -Force
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open(
    $archive,
    [System.IO.Compression.ZipArchiveMode]::Create
)
try {
    Get-ChildItem -LiteralPath $source -File -Recurse |
        Where-Object {
            $_.FullName -notmatch '[\\/]__pycache__[\\/]' -and
            $_.Extension -ne '.pyc'
        } |
        ForEach-Object {
            $relative = $_.FullName.Substring($source.Length).TrimStart([char[]]"\/")
            $entry = "smplwise_ha_dashboard/" + $relative.Replace('\', '/')
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $zip,
                $_.FullName,
                $entry,
                [System.IO.Compression.CompressionLevel]::Optimal
            ) | Out-Null
        }
}
finally {
    $zip.Dispose()
}
Write-Output $archive

