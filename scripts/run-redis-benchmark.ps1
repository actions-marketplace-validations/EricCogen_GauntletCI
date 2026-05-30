#!/usr/bin/env pwsh
# Runs GauntletCI against the StackExchange.Redis PR #2995 diff and writes eval/redis-2995-latest.json
param(
    [string]$DiffPath = "$env:TEMP\redis-2995-eval.diff",
    [string]$RepoRoot = (Split-Path $PSScriptRoot -Parent)
)

$ErrorActionPreference = "Stop"
Set-Location $RepoRoot

if (-not (Test-Path $DiffPath)) {
    Write-Host "Fetching diff from GitHub..."
    $diffDir = Split-Path $DiffPath -Parent
    if ($diffDir) {
        New-Item -ItemType Directory -Force -Path $diffDir | Out-Null
    }

    $token = if ($env:GH_TOKEN) { $env:GH_TOKEN } elseif ($env:GITHUB_TOKEN) { $env:GITHUB_TOKEN } else { $null }
    if ($token) {
        Invoke-WebRequest `
            -Uri "https://api.github.com/repos/StackExchange/StackExchange.Redis/pulls/2995" `
            -Headers @{
                Authorization = "Bearer $token"
                Accept        = "application/vnd.github.diff"
            } `
            -OutFile $DiffPath
    }
    else {
        gh api repos/StackExchange/StackExchange.Redis/pulls/2995 `
            --header "Accept: application/vnd.github.diff" `
            -o $DiffPath
    }
}

if (-not (Test-Path $DiffPath)) {
    throw "Failed to fetch Redis PR #2995 diff to $DiffPath"
}

$configDir = Join-Path $env:TEMP "gci-redis-eval"
New-Item -ItemType Directory -Force -Path $configDir | Out-Null
@'
{
  "domain": { "profile": "library" },
  "output": { "delivery": { "enabled": true, "globalMaxFindings": 25 } },
  "provenance": { "enabled": true },
  "semantics": { "enabled": true }
}
'@ | Set-Content (Join-Path $configDir ".gauntletci.json") -Encoding utf8

dotnet build GauntletCI.slnx -v quiet --nologo | Out-Null
$out = Join-Path $RepoRoot "eval\redis-2995-latest.json"
dotnet run --project src/GauntletCI.Cli --no-build -- analyze `
    --diff $DiffPath `
    --repo $configDir `
    --output $out `
    --sensitivity permissive `
    --no-banner | Out-Null

Write-Host "Wrote $out"
python -c "import json, pathlib; p=pathlib.Path(r'$out'); d=json.loads(p.read_text(encoding='utf-8-sig')); fs=d.get('Findings',[]); print('findings',len(fs)); g58=[f for f in fs if f.get('RuleId')=='GCI0058']; print('GCI0058',len(g58)); print('ground_truth', bool(g58))"
