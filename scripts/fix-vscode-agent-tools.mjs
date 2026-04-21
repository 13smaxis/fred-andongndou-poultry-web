import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const userHome = os.homedir();

const targets = [
  {
    filePath: path.join(userHome, '.vscode', 'extensions', 'vscjava.vscode-java-upgrade-2.1.1', 'agents', 'modernize-java.agent.md'),
    remove: [
      "'vscjava.vscode-java-upgrade/confirm_upgrade_plan', ",
      "'vscjava.vscode-java-upgrade/build_java_project', ",
      "'vscjava.vscode-java-upgrade/run_tests_for_java', ",
      "'vscjava.vscode-java-upgrade/validate_cves_for_java', ",
      "'vscjava.vscode-java-upgrade/generate_tests_for_java', "
    ]
  },
  {
    filePath: path.join(userHome, 'AppData', 'Roaming', 'Code', 'User', 'globalStorage', 'github.copilot-chat', 'ask-agent', 'Ask.agent.md'),
    remove: [
      "'github/issue_read', ",
      "'github.vscode-pull-request-github/issue_fetch', ",
      "'github.vscode-pull-request-github/activePullRequest', "
    ]
  },
  {
    filePath: path.join(userHome, 'AppData', 'Roaming', 'Code', 'User', 'globalStorage', 'github.copilot-chat', 'explore-agent', 'Explore.agent.md'),
    remove: [
      "'github/issue_read', ",
      "'github.vscode-pull-request-github/issue_fetch', ",
      "'github.vscode-pull-request-github/activePullRequest', "
    ]
  },
  {
    filePath: path.join(userHome, 'AppData', 'Roaming', 'Code', 'User', 'globalStorage', 'github.copilot-chat', 'plan-agent', 'Plan.agent.md'),
    remove: [
      "'github/issue_read', ",
      "'github.vscode-pull-request-github/issue_fetch', ",
      "'github.vscode-pull-request-github/activePullRequest', "
    ]
  }
];

let filesChanged = 0;

for (const target of targets) {
  if (!fs.existsSync(target.filePath)) {
    console.log(`Skipped missing file: ${target.filePath}`);
    continue;
  }

  const original = fs.readFileSync(target.filePath, 'utf8');
  let updated = original;

  for (const token of target.remove) {
    updated = updated.split(token).join('');
  }

  if (updated !== original) {
    fs.writeFileSync(target.filePath, updated, 'utf8');
    filesChanged += 1;
    console.log(`Updated: ${target.filePath}`);
  } else {
    console.log(`No change needed: ${target.filePath}`);
  }
}

console.log(`Completed. Files changed: ${filesChanged}`);
