$ErrorActionPreference = 'Stop'

$userProfile = [Environment]::GetFolderPath('UserProfile')

$targets = @(
  @{
    Path = Join-Path $userProfile '.vscode\extensions\vscjava.vscode-java-upgrade-2.1.1\agents\modernize-java.agent.md'
    Remove = @(
      "'vscjava.vscode-java-upgrade/confirm_upgrade_plan', ",
      "'vscjava.vscode-java-upgrade/build_java_project', ",
      "'vscjava.vscode-java-upgrade/run_tests_for_java', ",
      "'vscjava.vscode-java-upgrade/validate_cves_for_java', ",
      "'vscjava.vscode-java-upgrade/generate_tests_for_java', "
    )
  }
  @{
    Path = Join-Path $userProfile 'AppData\Roaming\Code\User\globalStorage\github.copilot-chat\ask-agent\Ask.agent.md'
    Remove = @(
      "'github/issue_read', ",
      "'github.vscode-pull-request-github/issue_fetch', ",
      "'github.vscode-pull-request-github/activePullRequest', "
    )
  }
  @{
    Path = Join-Path $userProfile 'AppData\Roaming\Code\User\globalStorage\github.copilot-chat\explore-agent\Explore.agent.md'
    Remove = @(
      "'github/issue_read', ",
      "'github.vscode-pull-request-github/issue_fetch', ",
      "'github.vscode-pull-request-github/activePullRequest', "
    )
  }
  @{
    Path = Join-Path $userProfile 'AppData\Roaming\Code\User\globalStorage\github.copilot-chat\plan-agent\Plan.agent.md'
    Remove = @(
      "'github/issue_read', ",
      "'github.vscode-pull-request-github/issue_fetch', ",
      "'github.vscode-pull-request-github/activePullRequest', "
    )
  }
)

$filesChanged = 0

foreach ($target in $targets) {
  if (-not (Test-Path -LiteralPath $target.Path)) {
    Write-Output "Skipped missing file: $($target.Path)"
    continue
  }

  $original = Get-Content -LiteralPath $target.Path -Raw
  $updated = $original

  foreach ($token in $target.Remove) {
    $updated = $updated.Replace($token, '')
  }

  if ($updated -ne $original) {
    Set-Content -LiteralPath $target.Path -Value $updated -NoNewline
    $filesChanged++
    Write-Output "Updated: $($target.Path)"
  }
  else {
    Write-Output "No change needed: $($target.Path)"
  }
}

Write-Output "Completed. Files changed: $filesChanged"
