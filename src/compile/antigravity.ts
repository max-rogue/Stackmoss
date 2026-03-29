import type { GeneratedFile } from '../templates/types.js';
import { extractRoleId } from '../templates/team.js';
import { ROLE_CAPABILITIES } from './claude-code.js';
import { ROLE_RUNTIME_NAMES } from './role-registry.js';
import { getCapabilitiesForRole } from '../budgets.js';
import {
    renderAntigravityMethodologyRule,
    renderAntigravityWorkflow,
} from './methodology.js';
import { canonicalUniqueRoles, uniqueRoleIds, uniqueRoles } from './utils.js';
import { renderDeepSkillContent, renderRoleOverrideGuidance } from './role-skills.js';

function renderRuleMd(projectName: string): string {
    return `# StackMoss Team Bootstrap - ${projectName}

## Always On
- Start in Tech Lead-first calibration mode after bootstrap.
- Read ROLE_SKILL_OVERRIDES.md before applying project-specific role behavior.
- Confirm BRD or NORTH_STAR is locked before implementation.
- Replace stale facts inside existing sections instead of appending logs.
- Ask the user before applying any shared config patch.
- Never store or push secrets, tokens, passwords, or private keys in generated agent files.
`;
}

function renderWorkflowMd(projectName: string): string {
    return `# Calibrate Team

Description: Scan the repository, ask follow-up questions, and recalibrate the StackMoss team for ${projectName}.

## Steps
1. Read team.md, ROLE_SKILL_OVERRIDES.md, FEATURES.md, NORTH_STAR.md, and NON_GOALS.md.
2. Confirm BRD or NORTH_STAR is locked. If not, stop and convert F1 into locking scope and constraints.
3. Scan the repository for stack, commands, paths, tests, and deployment facts.
4. Ask focused follow-up questions when facts are missing or conflicting.
5. Update ROLE_SKILL_OVERRIDES.md with verified role-specific deltas instead of editing generated role skills directly.
6. Prepare replace-only config changes for Tech Lead review.
7. Ask the user before applying any shared config patch.
`;
}

function renderThreeNineSupportFiles(
    roleRoot: string,
    owner: string,
): GeneratedFile[] {
    const ownerTemplates: GeneratedFile[] = [];

    if (owner === 'tech-lead') {
        ownerTemplates.push(
            {
                path: `${roleRoot}/assets/templates/feature-roadmap.md`,
                content: `# Feature Roadmap Template

## Outcome
- Feature:
- Why now:
- Success signal:

## Sequence
| Order | Slice | Dependency | Owner | Validation Command |
|:--|:--|:--|:--|:--|

## Risks
- Technical:
- Product:
- Operational:
`,
            },
            {
                path: `${roleRoot}/assets/templates/risk-register.md`,
                content: `# Risk Register

| ID | Risk | Severity | Mitigation | Owner | Status |
|:--|:--|:--|:--|:--|:--|
`,
            },
            {
                path: `${roleRoot}/assets/templates/team-topology.md`,
                content: `# Team Topology

- Current lanes:
- Runtime ownership:
- Hand-off contracts:
- Blocked escalations:
`,
            },
        );
    }

    if (owner === 'product-manager') {
        ownerTemplates.push(
            {
                path: `${roleRoot}/assets/templates/brd-lock-checklist.md`,
                content: `# BRD Lock Checklist

- Problem statement is explicit.
- Target audience is explicit.
- v1 scope and non-goals are explicit.
- Success metric has measurable threshold.
- Constraints are explicit (time, budget, compliance).
- BRD status is LOCKED.
`,
            },
            {
                path: `${roleRoot}/assets/templates/go-no-go.md`,
                content: `# Go/No-Go Decision Template

## Gates
- Acceptance criteria pass rate:
- Quality risk:
- Rollback readiness:
- Stakeholder alignment:

## Decision
- Verdict: GO | NO-GO
- Rationale:
- Follow-up owner:
`,
            },
            {
                path: `${roleRoot}/assets/templates/stakeholder-update.md`,
                content: `# Stakeholder Update Template

## Status
- Feature:
- Stage:
- Decision needed:

## Metrics and Risks
- Current metric:
- Gap to target:
- Open risks:
`,
            },
        );
    }

    if (owner === 'skill-creator') {
        ownerTemplates.push({
            path: `${roleRoot}/assets/templates/research-scorecard.md`,
            content: `# Research Scorecard

## Template Insufficiency Score (0-5)
- Iron Law present:
- >=3 workflow phases:
- Rationalization defenses:
- Executable validation + negative path:
- Deliverables + escalation clarity:

Decision:
- Score >= 4: adapt template-first
- Score <= 3: research required
`,
        });
    }

    return [
        {
            path: `${roleRoot}/references/layer-map.md`,
            content: `# 3-Layer to 9-Layer Map

- Layer 1: metadata in SKILL.md
- Layer 2: core instruction in SKILL.md
- Layer 3: references/
- Layer 4: examples/
- Layer 5: scripts/
- Layer 6: assets/templates/
- Layer 7: contracts/
- Layer 8: governance/
- Layer 9: data/
`,
        },
        {
            path: `${roleRoot}/examples/session-example.md`,
            content: `# Example Session

1. Read BRD and current constraints.
2. Execute validation command.
3. Record pass/fail in data/validation-log.ndjson.
4. Ask owner questions when validation cannot run.
`,
        },
        {
            path: `${roleRoot}/scripts/validate-and-log.mjs`,
            content: `#!/usr/bin/env node
import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const command = process.argv[2];
const logPath = resolve(process.cwd(), process.argv[3] ?? 'data/validation-log.ndjson');
if (!command) {
  console.error('Usage: node scripts/validate-and-log.mjs \"<command>\" [log-path]');
  process.exit(1);
}
const result = spawnSync(command, { shell: true, encoding: 'utf-8' });
mkdirSync(dirname(logPath), { recursive: true });
appendFileSync(logPath, JSON.stringify({
  ts: new Date().toISOString(),
  runtime: 'Antigravity',
  owner: '${owner}',
  command,
  status: result.status === 0 ? 'pass' : 'fail',
  stdout: (result.stdout ?? '').slice(0, 2000),
  stderr: (result.stderr ?? '').slice(0, 2000),
}) + '\\n', 'utf-8');
process.exit(result.status ?? 1);
`,
        },
        {
            path: `${roleRoot}/assets/templates/owner-questions.md`,
            content: `# Owner Questions

1. Which validation command should be used for this role skill?
2. Which negative case command should be used to validate failure handling?
3. Which prerequisites are missing in the current environment?
4. Which decision remains blocked and who can unblock it?
5. Should this role skill remain blocked until validation is available?
`,
        },
        ...ownerTemplates,
        {
            path: `${roleRoot}/contracts/output-contract.md`,
            content: `# Output Contract

- Return concise status and decision summary.
- Include command and pass/fail evidence.
- Include negative-path result.
- If failed, provide remediation plan.
`,
        },
        {
            path: `${roleRoot}/governance/evolution.md`,
            content: `# Governance

- Role skill updates are replace-only.
- Validation evidence must be logged to local data layer.
- Runtime boundary: Antigravity paths only.
`,
        },
        {
            path: `${roleRoot}/data/research-cutoff.json`,
            content: `${JSON.stringify({
                baseline_cutoff: '2026-03-28',
                runtime: 'Antigravity',
                owner,
            }, null, 2)}
`,
        },
        {
            path: `${roleRoot}/data/source-adoption-log.md`,
            content: '# Source Adoption Log\n\n',
        },
        {
            path: `${roleRoot}/data/validation-log.ndjson`,
            content: '',
        },
    ];
}

export function compileAntigravity(
    roles: string[],
    autoAddedRoles: string[],
    projectName: string,
): GeneratedFile[] {
    const roleIds = uniqueRoleIds(roles, autoAddedRoles);
    const files: GeneratedFile[] = [
        { path: '.agent/rules/team-bootstrap.md', content: renderRuleMd(projectName) },
        { path: '.agent/rules/methodology.md', content: renderAntigravityMethodologyRule(projectName, roleIds) },
        { path: '.agent/workflows/calibrate-team.md', content: renderWorkflowMd(projectName) },
        { path: '.agent/workflows/tdd-cycle.md', content: renderAntigravityWorkflow(projectName, 'tdd-cycle') },
        { path: '.agent/workflows/debugging-protocol.md', content: renderAntigravityWorkflow(projectName, 'debugging-protocol') },
        { path: '.agent/workflows/review-reception.md', content: renderAntigravityWorkflow(projectName, 'review-reception') },
        { path: '.agent/workflows/planning-protocol.md', content: renderAntigravityWorkflow(projectName, 'planning-protocol') },
        { path: '.agent/workflows/git-workflow.md', content: renderAntigravityWorkflow(projectName, 'git-workflow') },
        { path: '.agent/workflows/execution-loop.md', content: renderAntigravityWorkflow(projectName, 'execution-loop') },
        {
            path: '.agent/skills/skill-creator/SKILL.md',
            content: `---
name: skill-creator
description: Runtime-specific skill factory for Antigravity. Generates only .agent/skills/* bundles using the 3-layer + 9-layer structure.
---

# Skill Creator - ${projectName}

## Scope
- Create or update Antigravity runtime skills only under .agent/skills/*
- Follow the 3-layer + 9-layer structure for each generated skill
- Use template-first flow via .stackmoss/skill-kit before researching external sources

## Workflow
1. Resolve target role and runtime boundary.
2. Read BRD (NORTH_STAR.md) to identify project stack, constraints, and deployment target.
3. Score template using .stackmoss/skill-kit/shared/insufficiency-gate.md.
4. If score >= 4, adapt local templates from .stackmoss/skill-kit/roles/* + shared/*.
5. Use Frontend package as template-depth benchmark: .stackmoss/skill-kit/roles/frontend.template.md + frontend.skill-pack.md + frontend.DESIGN.template.md.
6. If score <= 3, research sources from .stackmoss/skill-kit/sources-registry.md and log adoption to data/source-adoption-log.md.
7. Mode selection — read the skill-pack for the target role and score each mode against BRD:
   - Required: mode matches project stack or BRD constraints. Include in output.
   - Skip: mode is irrelevant to project (e.g. Kubernetes mode when project deploys to Vercel). Exclude entirely.
   - For each included mode, prune stack references and patterns to only project-relevant items.
8. Generate multi-file output under .agent/skills/<role>/... following the Output Structure below.
9. Run validation command and one negative-path command, then write result to data/validation-log.ndjson.
10. If validation cannot run, ask owner questions and keep blocked status.

## Output Structure (3/9 Layer — Multi-File)
Generated skill MUST be multi-file. Agent reads selectively per task, not all at once.

### Layer 1 — SKILL.md (agent reads this for EVERY task)
Keep under 400 tokens. Contains only:
- Frontmatter (name, description)
- Mission (1 line)
- Iron Law (1 line)
- Activation trigger rules (when to use / when not to use)
- Mode index: list each generated mode with its file path and 1-line trigger description
- The mode index tells the agent WHICH file to read next based on the current task

### Layer 2 — modes/*.md (agent reads ONLY the mode matching current task)
- One file per active mode selected in step 7
- Each mode file is self-contained: workflow steps, patterns, anti-patterns, checklist
- Agent reads only the relevant mode file, never all modes at once

### Layer 3-9 — Supporting files (agent reads on demand)
- references/: stack tables, external URLs, layer-map — read when researching
- examples/: session examples, code snippets — read when learning patterns
- scripts/: executable validation scripts — run during validation step
- assets/templates/: deliverable templates — read when generating outputs
- contracts/: output contracts, quality gates — read when finalizing deliverables
- governance/: runtime boundary rules — read when checking constraints
- data/: validation logs, research cutoff, source adoption — written during execution

## Validation
- Command(s): node scripts/validate-and-log.mjs "<command>" data/validation-log.ndjson
- Required evidence: command result + negative-path result + pass/fail record.

## Fallback
- If validation cannot run, ask owner questions and keep status blocked.

## Quality Gate
- Generated skill must follow multi-file structure: thin SKILL.md + modes/*.md + supporting layers.
- Generated skill must include Iron Law and >=3 workflow phases.
- Generated skill must include rationalization defenses and blocked-state logic.
- Mode selection must reference BRD — no mode included without BRD justification.
- Runtime boundary must remain inside .agent/skills/*.
`,
        },
    ];

    // Role-level skills (not per-capability) for equalized output
    for (const role of canonicalUniqueRoles(roles, autoAddedRoles)) {
        const baseId = extractRoleId(role);
        const def = ROLE_CAPABILITIES[baseId];
        const slug = (ROLE_RUNTIME_NAMES as Record<string, string>)[baseId] ?? baseId.toLowerCase();
        const roleRoot = `.agent/skills/${slug}`;

        if (!def) {
            files.push({
                path: `${roleRoot}/SKILL.md`,
                content: `---
name: ${slug}
description: ${role} role for ${projectName}.
---

# ${role} - ${projectName}

## Instructions
- Read team.md before acting.
`,
            });
            files.push(...renderThreeNineSupportFiles(roleRoot, slug));
            continue;
        }

        const allowedCapabilities = new Set(getCapabilitiesForRole(role));
        const caps = def.capabilities.filter(
            (item) => allowedCapabilities.size === 0 || allowedCapabilities.has(item.id),
        );

        const capLines = caps.map((cap) =>
            `### ${cap.id}: ${cap.name}
- Budget: ${cap.budget} words
- Trigger: ${cap.trigger}
- Do not use: ${cap.doNotUse}`,
        ).join('\n\n');

        const deepContent = renderDeepSkillContent(baseId);

        files.push({
            path: `${roleRoot}/SKILL.md`,
            content: `---
name: ${slug}
description: ${def.name} role for ${projectName}.
---

# ${def.name} - ${projectName}

${deepContent}${renderRoleOverrideGuidance(baseId)}## Capabilities

${capLines}

## Instructions
- Read \`ROLE_SKILL_OVERRIDES.md\` before acting.
- Read team.md before acting.
- Respect replace-only config rules.
- Follow shared methodology rules and workflows.
- Never persist secrets or credentials into generated files or patch artifacts.
`,
        });

        if (baseId === 'TL') {
            files.push({
                path: `${roleRoot}/calibrate.md`,
                content: `# TL Calibrate

1. Ensure BRD lock is complete with Product Manager.
2. Re-check repo constraints and execution lanes.
3. Update role bundles with replace-only edits.
4. Ask owner before applying shared config changes.
`,
            });
        }

        if (baseId === 'PM') {
            files.push({
                path: `${roleRoot}/brd-lock.md`,
                content: `# PM BRD Lock Protocol

1. Capture BRD summary, domain, audience, and success signal.
2. Define non-goals and hard constraints.
3. Mark BRD status as locked before implementation handoff.
`,
            });
        }

        if (baseId === 'PM' || baseId === 'TL') {
            files.push(...renderThreeNineSupportFiles(roleRoot, slug));
        }
    }

    files.push(...renderThreeNineSupportFiles('.agent/skills/skill-creator', 'skill-creator'));

    return files;
}
