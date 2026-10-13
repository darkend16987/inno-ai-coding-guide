# Install the team's Claude Code skills: careful-engineering + caveman (caveman, ultracave, megacave).
# ASCII only on purpose: Windows PowerShell 5.1 reads a BOM-less script as ANSI, and any
# non-ASCII character would break it.
#
# Usage (PowerShell):
#   irm https://darkend16987.github.io/inno-ai-coding-guide/install.ps1 | iex
#       -> installs every skill for this Windows user: %USERPROFILE%\.claude\skills\<name>
#   & ([scriptblock]::Create((irm https://darkend16987.github.io/inno-ai-coding-guide/install.ps1))) -Project
#       -> installs into the CURRENT folder's repo: .\.claude\skills\<name>
#   & ([scriptblock]::Create((irm https://darkend16987.github.io/inno-ai-coding-guide/install.ps1))) -Skill careful-engineering
#       -> installs only the named skill(s); comma-separate several: -Skill caveman,ultracave
#   .\install.ps1 -Dest D:\somewhere\skills      (custom target folder)
param(
  [string]$Dest = "",
  [switch]$Project,
  [string[]]$Skill = @("careful-engineering", "caveman", "ultracave", "megacave"),
  [string]$Repo = "darkend16987/inno-ai-coding-guide",
  [string]$Branch = "main"
)
$ErrorActionPreference = "Stop"
if (-not $Dest) {
  if ($Project) { $Dest = Join-Path (Get-Location) ".claude\skills" }
  else { $Dest = Join-Path $HOME ".claude\skills" }
}
$tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("ce-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
try {
  $zip = Join-Path $tmp "src.zip"
  $url = "https://github.com/$Repo/archive/refs/heads/$Branch.zip"
  Write-Host "Downloading $url"
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
  Expand-Archive -Path $zip -DestinationPath $tmp -Force
  $src = Get-ChildItem -Path $tmp -Directory | Where-Object { Test-Path (Join-Path $_.FullName "skills") } | Select-Object -First 1
  if (-not $src) { throw "skills folder not found in the downloaded archive" }
  # Check every requested skill before touching the target, so a typo installs nothing.
  foreach ($name in $Skill) {
    if (-not (Test-Path (Join-Path $src.FullName "skills\$name\SKILL.md"))) { throw "skills\$name\SKILL.md not found in the downloaded archive" }
  }
  New-Item -ItemType Directory -Force -Path $Dest | Out-Null
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  foreach ($name in $Skill) {
    $target = Join-Path $Dest $name
    if (Test-Path $target) {
      $bak = "$target.bak-$stamp"
      Move-Item -Path $target -Destination $bak
      Write-Host "Existing $name backed up to $bak"
    }
    Copy-Item -Path (Join-Path $src.FullName "skills\$name") -Destination $target -Recurse
    # Verify on disk rather than trusting the copy.
    if (-not (Test-Path (Join-Path $target "SKILL.md"))) { throw "install failed: SKILL.md missing in $target" }
    $files = Get-ChildItem -Path $target -Recurse -File
    Write-Host ("OK: installed $name to $target (" + $files.Count + " files)")
  }
  Write-Host "Open a NEW Claude Code session, then type /careful-engineering or /caveman, or ask: 'Which skills are available?'"
}
finally {
  Remove-Item -Recurse -Force -Path $tmp -ErrorAction SilentlyContinue
}
