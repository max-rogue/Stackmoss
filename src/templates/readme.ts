/**
 * Template: README_AGENT_TEAM.md
 * User-facing playbook shown after bootstrap.
 */

import type { GeneratedFile, TemplateInput } from './types.js';

function renderVietnamese(projectName: string): string {
    return `# Huong Dan Dung Agent Team StackMoss
_Day la playbook quan trong nhat sau khi bootstrap._

## Day la gi?

\`team.md\` la so tay doi agent cua du an ${projectName}.
StackMoss chi bootstrap team ban dau. Sau do Tech Lead phai scan repo that, hoi tiep khi can, va calibrate lai team theo BRD hien co.

## Quy trinh dung

### Buoc 1 - Kiem tra BRD
- Neu BRD da lock: Tech Lead calibrate team quanh BRD do.
- Neu BRD chua lock: F1 phai tro thanh lock BRD, scope, constraints, va success criteria.

### Buoc 2 - Chat voi Tech Lead truoc
Gui prompt nay trong runtime ban dang dung:

> "Tech Lead, hay scan repo nay, hoi tiep bat ky cau hoi can thiet, calibrate lai agent team theo BRD hien co, thay thong tin sai hoac TBD bang thong tin dung trong team.md, va de xuat moi thay doi config cho toi review. Khong duoc apply patch khi chua hoi toi."

Tech Lead phai:
- scan repo va stack thuc te
- hoi tiep khi facts con thieu hoac mau thuan
- thay thong tin sai hoac TBD bang thong tin dung
- de xuat doi role hoac so lane neu repo that can team shape khac bootstrap
- khong duoc apply patch khi user chua xac nhan

### Buoc 3 - Review calibration
- Review patch cua Tech Lead
- Dam bao team shape, commands, paths, va facts hop ly
- Neu on thi moi cho apply

### Buoc 4 - Chay sanity check
\`\`\`
stackmoss check
\`\`\`

Neu muon test hanh vi team that:
\`\`\`
stackmoss eval smoke
\`\`\`

### Buoc 5 - Bat dau feature work
Sau khi calibration on:
- Yeu cau Tech Lead break down F1
- Assign subtasks cho team
- Ship feature theo workflow

## Bootstrap outputs da co san

| Runtime | Cau truc can co |
|---|---|
| Claude Code | \`CLAUDE.md\` + \`.claude/skills/<skill-name>/SKILL.md\` |
| Cursor | \`.cursor/skills/<skill-name>/SKILL.md\` |
| VS Code / Copilot | \`.github/copilot-instructions.md\` |
| Codex | \`AGENTS.md\` + \`.agents/skills/<skill-name>/SKILL.md\` |
| Antigravity | \`.agent/skills/<skill-name>/SKILL.md\` + \`.agent/rules/*.md\` + \`.agent/workflows/*.md\` |

## Eval flow

### Chuan bi eval
\`\`\`
stackmoss eval smoke
\`\`\`

CLI se tao:
- \`evals/current/case.md\`
- \`evals/current/instructions.md\`
- \`evals/current/expected.json\`

### Chay eval bang LLM cua ban
- Mo runtime ban dang dung
- Gui prompt eval cho Tech Lead
- Yeu cau agent ghi ket qua vao \`evals/current/result.md\`

### Cham eval
\`\`\`
stackmoss eval smoke --grade
\`\`\`

## File can biet

| File | Muc dich |
|---|---|
| \`team.md\` | Source of truth cua doi agent |
| \`FEATURES.md\` | Backlog va status feature |
| \`NORTH_STAR.md\` | Direction va scope cap cao |
| \`README_AGENT_TEAM.md\` | Playbook dung team |
| \`CALIBRATE.md\` | Huong dan recalibrate |
| \`evals/current/*\` | Case eval hien tai |
`;
}

function renderEnglish(projectName: string): string {
    return `# StackMoss Agent Team Guide
_This is the main playbook after bootstrap._

## What is this?

\`team.md\` is the team handbook for ${projectName}.
StackMoss only bootstraps the initial team. After that, Tech Lead must scan the real repo, ask follow-up questions, and recalibrate the team around the actual BRD and stack.

## Operating flow

### Step 1 - Check BRD status
- If the BRD is locked: Tech Lead calibrates the team around that BRD.
- If the BRD is not locked: F1 must become lock-BRD work for scope, constraints, and success criteria.

### Step 2 - Chat with Tech Lead first
Send this prompt in the runtime you actually use:

> "Tech Lead, scan this repo, ask any follow-up questions you need, recalibrate the agent team around the current BRD, replace stale or TBD facts in team.md with verified facts, and propose any config changes for my review. Do not apply shared config patches before asking me."

Tech Lead must:
- scan the real repo and stack
- ask follow-up questions when facts are missing or conflicting
- replace stale or TBD facts with verified facts
- propose team-shape changes if the real repo needs different roles or lane counts
- never apply patches before user confirmation

### Step 3 - Review calibration
- Review the Tech Lead patch
- Make sure team shape, commands, paths, and facts are reasonable
- Only then approve apply

### Step 4 - Run sanity checks
\`\`\`
stackmoss check
\`\`\`

If you want to test live team behavior:
\`\`\`
stackmoss eval smoke
\`\`\`

### Step 5 - Start feature work
After calibration is healthy:
- Ask Tech Lead to break down F1
- Assign subtasks to the team
- Ship the feature flow

## Bootstrap outputs

| Runtime | Required structure |
|---|---|
| Claude Code | \`CLAUDE.md\` + \`.claude/skills/<skill-name>/SKILL.md\` |
| Cursor | \`.cursor/skills/<skill-name>/SKILL.md\` |
| VS Code / Copilot | \`.github/copilot-instructions.md\` |
| Codex | \`AGENTS.md\` + \`.agents/skills/<skill-name>/SKILL.md\` |
| Antigravity | \`.agent/skills/<skill-name>/SKILL.md\` + \`.agent/rules/*.md\` + \`.agent/workflows/*.md\` |

## Eval flow

### Prepare the eval
\`\`\`
stackmoss eval smoke
\`\`\`

The CLI will create:
- \`evals/current/case.md\`
- \`evals/current/instructions.md\`
- \`evals/current/expected.json\`

### Run the eval with your LLM
- Open the runtime you actually use
- Send the eval prompt to Tech Lead
- Ask the agent to write the result to \`evals/current/result.md\`

### Grade the eval
\`\`\`
stackmoss eval smoke --grade
\`\`\`

## Files you should know

| File | Purpose |
|---|---|
| \`team.md\` | Source of truth for the agent team |
| \`FEATURES.md\` | Feature backlog and status |
| \`NORTH_STAR.md\` | High-level direction and scope |
| \`README_AGENT_TEAM.md\` | Team playbook |
| \`CALIBRATE.md\` | Recalibration instructions |
| \`evals/current/*\` | Current eval case artifacts |
`;
}

export function generateReadme(input: TemplateInput): GeneratedFile {
    const { projectName, intake } = input;

    return {
        path: 'README_AGENT_TEAM.md',
        content: intake.language === 'vi'
            ? renderVietnamese(projectName)
            : renderEnglish(projectName),
    };
}
