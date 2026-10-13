# Install the careful-engineering skill for Claude Code.
# ASCII only on purpose: Windows PowerShell 5.1 reads a BOM-less script as ANSI, and any
# non-ASCII character would break it.
#
# Usage (PowerShell):
#   irm https://darkend16987.github.io/inno-ai-coding-guide/install.ps1 | iex
#       -> installs for this Windows user: %USERPROFILE%\.claude\skills\careful-engineering
#   & ([scriptblock]::Create((irm https://darkend16987.github.io/inno-ai-coding-guide/install.ps1))) -Project
#       -> installs into the CURRENT folder's repo: .\.claude\skills\careful-engineering
#   .\install.ps1 -Dest D:\somewhere\skills      (custom target folder)
param(
  [string]$Dest = "",
  [switch]$Project,
  [string]$Repo = "darkend16987/inno-ai-coding-guide",
  [string]$Branch = "main"
)
$ErrorActionPreference = "Stop"
$name = "careful-engineering"
if (-not $Dest) {
  if ($Project) { $Dest = Join-Path (Get-Location) ".claude\skills" }
  else { $Dest = Join-Path $HOME ".claude\skills" }
}
$target = Join-Path $Dest $name
$tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("ce-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
try {
  $zip = Join-Path $tmp "src.zip"
  $url = "https://github.com/$Repo/archive/refs/heads/$Branch.zip"
  Write-Host "Downloading $url"
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
  Expand-Archive -Path $zip -DestinationPath $tmp -Force
  $src = Get-ChildItem -Path $tmp -Directory | Where-Object { Test-Path (Join-Path $_.FullName "skills\$name\SKILL.md") } | Select-Object -First 1
  if (-not $src) { throw "skills\$name\SKILL.md not found in the downloaded archive" }
  New-Item -ItemType Directory -Force -Path $Dest | Out-Null
  if (Test-Path $target) {
    $bak = "$target.bak-" + (Get-Date -Format "yyyyMMdd-HHmmss")
    Move-Item -Path $target -Destination $bak
    Write-Host "Existing skill backed up to $bak"
  }
  Copy-Item -Path (Join-Path $src.FullName "skills\$name") -Destination $target -Recurse
  # Verify on disk rather than trusting the copy: the entry file and every reference must exist.
  $files = Get-ChildItem -Path $target -Recurse -File
  if (-not (Test-Path (Join-Path $target "SKILL.md"))) { throw "install failed: SKILL.md missing in $target" }
  Write-Host ("OK: installed $name to $target (" + $files.Count + " files)")
  Write-Host "Open a NEW Claude Code session, then type /$name or ask: 'Which skills are available?'"
}
finally {
  Remove-Item -Recurse -Force -Path $tmp -ErrorAction SilentlyContinue
}
