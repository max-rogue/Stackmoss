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
- Neu BRD da lock: chuyen sang Buoc 2.
- Neu BRD chua lock: F1 phai tro thanh lock BRD, scope, constraints, va success criteria.

### Buoc 2 - Khoi tao Git va GitHub (BAT BUOC)
**Day la buoc quan trong nhat — phai lam TRUOC khi calibrate hoac bat dau feature.**

Tech Lead chiu trach nhiem huong dan user:
1. Khoi tao Git: \`git init && git add -A && git commit -m "chore: bootstrap with StackMoss"\`
2. Tao repository tren GitHub: https://github.com/new (KHONG tick init README)
3. Ket noi remote: \`git remote add origin <url> && git push -u origin main\`
4. Kiem tra \`.gitignore\` co \`node_modules/\`, \`.env\`, \`dist/\`
5. Xem chi tiet: \`.stackmoss/skill-kit/shared/git-init.skill.md\`

> Khong co GitHub, agent team khong the tao PR, review code, hoac track issues.

### Buoc 3 - Thiet lap MCP Server (BAT BUOC)
Da so vibe coder bo qua buoc nay — nhung day la buoc bat buoc de agent team lam viec duoc.

StackMoss da tao san config mau tai \`.stackmoss/mcp-configs/\`:

| Runtime | File config mau | Copy den |
|---|---|---|
| Claude Code | \`claude.mcp.json\` | \`.mcp.json\` (project root) |
| Codex | \`codex.config.toml\` | \`.codex/config.toml\` |
| Antigravity | \`antigravity.mcp_config.json\` | Merge vao Agent pane > MCP Servers > View raw config |

**Buoc bat buoc:** Mo file config mau, tim \`[REQUIRED]\` va dien credential cua ban:
- **GitHub PAT**: tao tai https://github.com/settings/tokens (scope: repo, read:org)
- **Database URL**: PostgreSQL connection string
- **Notion token**: tao tai https://www.notion.so/my-integrations

> Khong co MCP server, agent team chi la text. Co MCP server, agent team co tay chan.

### Buoc 4 - Calibrate voi Tech Lead
Gui prompt nay trong runtime ban dang dung:

> "Tech Lead, hay scan repo nay, hoi tiep bat ky cau hoi can thiet, calibrate lai agent team theo BRD hien co, thay thong tin sai hoac TBD bang thong tin dung trong team.md, cap nhat ROLE_SKILL_OVERRIDES.md voi role-specific deltas da verify, va de xuat moi thay doi config cho toi review. Khong duoc apply patch khi chua hoi toi."

Tech Lead phai:
- scan repo va stack thuc te
- hoi tiep khi facts con thieu hoac mau thuan
- thay thong tin sai hoac TBD bang thong tin dung
- ghi role-specific patterns, anti-patterns, va checklist additions vao \`ROLE_SKILL_OVERRIDES.md\`
- de xuat doi role hoac so lane neu repo that can team shape khac bootstrap
- khong duoc apply patch khi user chua xac nhan

### Buoc 5 - Review calibration
- Review patch cua Tech Lead
- Dam bao team shape, commands, paths, va facts hop ly
- Neu on thi moi cho apply

### Buoc 6 - Chay sanity check
\`\`\`
stackmoss check
\`\`\`

Neu muon test hanh vi team that:
\`\`\`
stackmoss eval smoke
\`\`\`

### Buoc 7 - Bat dau feature work
Sau khi calibration on:
- Yeu cau Tech Lead break down F1
- Assign subtasks cho team
- Ship feature theo workflow

## Bootstrap outputs da co san

| Runtime | Cau truc can co |
|---|---|
| Claude Code | \`CLAUDE.md\` + \`.claude/skills/<skill-name>/SKILL.md\` |
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
| \`ROLE_SKILL_OVERRIDES.md\` | Noi TL luu role-specific calibration ben vung |
| \`README_AGENT_TEAM.md\` | Playbook dung team |
| \`CODE_MAP.md\` | Map cau truc code va impact khi sua module |
| \`.stackmoss/skill-kit/*\` | Template role de skill-creator adapt truoc khi research |
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
- If the BRD is locked: proceed to Step 2.
- If the BRD is not locked: F1 must become lock-BRD work for scope, constraints, and success criteria.

### Step 2 - Initialize Git and GitHub (REQUIRED)
**This is the most important step — must be done BEFORE calibration or feature work.**

Tech Lead is responsible for guiding the user:
1. Initialize Git: \`git init && git add -A && git commit -m "chore: bootstrap with StackMoss"\`
2. Create a GitHub repository: https://github.com/new (do NOT check init README)
3. Connect remote: \`git remote add origin <url> && git push -u origin main\`
4. Verify \`.gitignore\` includes \`node_modules/\`, \`.env\`, \`dist/\`
5. See details: \`.stackmoss/skill-kit/shared/git-init.skill.md\`

> Without GitHub, your agent team cannot create PRs, review code, or track issues.

### Step 3 - Set up MCP Servers (REQUIRED)
Most vibe coders skip this — but this is mandatory for the agent team to actually work.

StackMoss has pre-generated config templates at \`.stackmoss/mcp-configs/\`:

| Runtime | Template File | Copy To |
|---|---|---|
| Claude Code | \`claude.mcp.json\` | \`.mcp.json\` (project root) |
| Codex | \`codex.config.toml\` | \`.codex/config.toml\` |
| Antigravity | \`antigravity.mcp_config.json\` | Merge into Agent pane > MCP Servers > View raw config |

**Required action:** Open the template file, find \`[REQUIRED]\` markers and fill in your credentials:
- **GitHub PAT**: create at https://github.com/settings/tokens (scope: repo, read:org)
- **Database URL**: PostgreSQL connection string
- **Notion token**: create at https://www.notion.so/my-integrations

> Without MCP servers, your agent team is just text. With MCP servers, your agent team has hands.

### Step 4 - Calibrate with Tech Lead
Send this prompt in the runtime you actually use:

> "Tech Lead, scan this repo, ask any follow-up questions you need, recalibrate the agent team around the current BRD, replace stale or TBD facts in team.md with verified facts, update ROLE_SKILL_OVERRIDES.md with verified role-specific deltas, and propose any config changes for my review. Do not apply shared config patches before asking me."

Tech Lead must:
- scan the real repo and stack
- ask follow-up questions when facts are missing or conflicting
- replace stale or TBD facts with verified facts
- record persistent role-specific patterns, anti-patterns, and checklist additions in \`ROLE_SKILL_OVERRIDES.md\`
- propose team-shape changes if the real repo needs different roles or lane counts
- never apply patches before user confirmation

### Step 5 - Review calibration
- Review the Tech Lead patch
- Make sure team shape, commands, paths, and facts are reasonable
- Only then approve apply

### Step 6 - Run sanity checks
\`\`\`
stackmoss check
\`\`\`

If you want to test live team behavior:
\`\`\`
stackmoss eval smoke
\`\`\`

### Step 7 - Start feature work
After calibration is healthy:
- Ask Tech Lead to break down F1
- Assign subtasks to the team
- Ship the feature flow

## Bootstrap outputs

| Runtime | Required structure |
|---|---|
| Claude Code | \`CLAUDE.md\` + \`.claude/skills/<skill-name>/SKILL.md\` |
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
| \`ROLE_SKILL_OVERRIDES.md\` | Persistent Tech Lead-owned role calibration source |
| \`README_AGENT_TEAM.md\` | Team playbook |
| \`CODE_MAP.md\` | Code structure and impact map for change planning |
| \`.stackmoss/skill-kit/*\` | Template-first role kit for skill-creator adaptation |
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
