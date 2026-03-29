/**
 * Compile Layer: Codex target
 * Authority:
 * - OpenAI Codex uses AGENTS.md for repo-scoped instructions
 * - Project skills are loaded from .agents/skills/<skill-name>/SKILL.md
 */

import { extractRoleId } from '../templates/team.js';
import type { GeneratedFile } from '../templates/types.js';
import {
    renderMethodologySection,
} from './methodology.js';
import { ROLE_CAPABILITIES, renderSkillFile, roleToSlug } from './claude-code.js';
import { canonicalUniqueRoles, uniqueRoleIds, uniqueRoles } from './utils.js';

function renderFrontmatter(name: string, description: string): string {
    return ['---', `name: ${name}`, `description: ${description}`, '---'].join('\n');
}

function renderThreeNineSupportFiles(
    skillRoot: string,
    runtimeName: string,
    owner: string,
): GeneratedFile[] {
    const ownerTemplates: GeneratedFile[] = [];

    if (owner === 'tech-lead') {
        ownerTemplates.push(
            {
                path: `${skillRoot}/assets/templates/feature-roadmap.md`,
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
                path: `${skillRoot}/assets/templates/risk-register.md`,
                content: `# Risk Register

| ID | Risk | Severity | Mitigation | Owner | Status |
|:--|:--|:--|:--|:--|:--|
`,
            },
            {
                path: `${skillRoot}/assets/templates/team-topology.md`,
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
                path: `${skillRoot}/assets/templates/brd-lock-checklist.md`,
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
                path: `${skillRoot}/assets/templates/go-no-go.md`,
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
                path: `${skillRoot}/assets/templates/stakeholder-update.md`,
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
            path: `${skillRoot}/assets/templates/research-scorecard.md`,
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
            path: `${skillRoot}/references/layer-map.md`,
            content: `# 3-Layer to 9-Layer Map

- Layer 1: metadata frontmatter in SKILL.md
- Layer 2: core instructions in SKILL.md
- Layer 3: references/ and examples/
- Layer 4: executable scripts/
- Layer 5: assets/templates/
- Layer 6: contracts/
- Layer 7: governance/
- Layer 8: data/research-cutoff.json
- Layer 9: data/validation-log.ndjson
`,
        },
        {
            path: `${skillRoot}/examples/session-example.md`,
            content: `# Example Session

1. Read BRD lock status.
2. Execute validation command.
3. Record pass/fail in data/validation-log.ndjson.
4. Ask owner questions if execution cannot run.
`,
        },
        {
            path: `${skillRoot}/scripts/validate-and-log.mjs`,
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
  runtime: '${runtimeName}',
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
            path: `${skillRoot}/assets/templates/owner-questions.md`,
            content: `# Owner Questions

1. Which command should validate this skill in your runtime?
2. Which negative case command should be used to verify failure handling?
3. Which missing prerequisites must be provided?
4. Which decision remains blocked and who can unblock it?
5. Should this skill remain blocked until validation can run?
`,
        },
        ...ownerTemplates,
        {
            path: `${skillRoot}/contracts/output-contract.md`,
            content: `# Output Contract

- Return concise status.
- Include command and pass/fail outcome.
- Include negative-path result.
- Provide remediation when failed.
`,
        },
        {
            path: `${skillRoot}/governance/evolution.md`,
            content: `# Governance

- Runtime boundary: this skill can modify only ${runtimeName} paths.
- Replace-only updates for generated instructions.
- Validation evidence must stay in local data logs.
`,
        },
        {
            path: `${skillRoot}/data/research-cutoff.json`,
            content: `${JSON.stringify({
                baseline_cutoff: '2026-03-28',
                runtime: runtimeName,
                owner,
            }, null, 2)}
`,
        },
        {
            path: `${skillRoot}/data/source-adoption-log.md`,
            content: '# Source Adoption Log\n\n',
        },
        {
            path: `${skillRoot}/data/validation-log.ndjson`,
            content: '',
        },
    ];
}

export function compileCodex(
    roles: string[],
    autoAddedRoles: string[],
    projectName: string,
): GeneratedFile[] {
    const allRoles = uniqueRoles(roles, autoAddedRoles);
    const roleIds = uniqueRoleIds(roles, autoAddedRoles);
    const roleList = roleIds.map((roleId) => `- ${roleId}`).join('\n');
    const methodologySection = renderMethodologySection(roleIds);
    const skillList = [
        '- skill-creator: Create Codex-only role skills with 3-layer + 9-layer structure',
        ...allRoles.map((role) => {
            const baseId = extractRoleId(role);
            const roleName = ROLE_CAPABILITIES[baseId]?.name ?? role;
            return `- ${roleToSlug(role)}: ${roleName} role behavior for Codex`;
        }),
    ].join('\n');

    const content = `# StackMoss Agent Bootstrap - ${projectName}

Codex should treat this repository as a Tech Lead-first workflow.
This file is \`AGENTS.md\` for Codex and should stay at repo scope.

## First Session Policy

- Start by reading \`team.md\`, \`FEATURES.md\`, \`NORTH_STAR.md\`, and \`NON_GOALS.md\`.
- Read \`ROLE_SKILL_OVERRIDES.md\` before changing role-specific examples, anti-patterns, or checklists.
- Before real feature delivery, confirm the BRD or \`NORTH_STAR.md\` is locked.
- If the BRD is not locked, turn F1 into locking scope, constraints, and success criteria.
- In an existing repo, act as Tech Lead first: scan the repository, ask follow-up questions if facts are missing, and propose bootstrap corrections before implementation.
- Replace stale facts in existing sections. Never append memory logs to config.
- Ask the user before applying any shared config patch.
- Redact secrets from logs, stderr, and copied commands before storing them in repo files.

## Agent Team

${roleList}

## Codex Skills

Codex uses \`AGENTS.md\` as the repo instruction entrypoint and \`.agents/skills/<skill-name>/SKILL.md\` for project skills.
Do not treat \`.agent/*\` as Codex skill folders; that tree remains Antigravity-specific.

Skills live in \`.agents/skills/\` and are auto-discovered by Codex:
${skillList}

Template-first skill generation assets live in:
- \`.stackmoss/skill-kit/ROLE_INDEX.md\`
- \`.stackmoss/skill-kit/roles/*.template.md\`
- \`.stackmoss/skill-kit/shared/*\`
- \`.stackmoss/skill-kit/runtime-adapters/*\`

## Tech Lead Protocol

- Tech Lead is the coordinator and single writer for shared team config.
- Other roles can surface verified signals, but they do not rewrite shared config directly.
- If commands, paths, or stack facts are uncertain, ask focused follow-up questions instead of assuming.
- When calibrating Codex, keep runtime boundaries clean: \`AGENTS.md\` + \`.agents/skills/*\` for Codex, \`.agent/*\` for Antigravity, \`.claude/*\` for Claude.
- When calibration is complete, update \`team.md\` by replacing the bootstrap calibration marker and stale facts.

${methodologySection}

_Generated by StackMoss. Edit team.md to change shared project instructions._
`;

    const files: GeneratedFile[] = [
        { path: 'AGENTS.md', content },
        {
            path: '.agents/skills/skill-creator/SKILL.md',
            content: `${renderFrontmatter(
                'skill-creator',
                'Runtime-specific skill factory for Codex. Generates only .agents/skills/* bundles with 3-layer + 9-layer structure.',
            )}

# Skill Creator - ${projectName}

## Scope
- Create or update Codex runtime skills only under .agents/skills/*
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
8. Generate multi-file output under .agents/skills/<role>/... following the Output Structure below.
9. Run validation command and one negative-path command, then log pass/fail.
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
- Required evidence: command result + negative-path result + pass/fail entries.

## Fallback
- If validation cannot run, ask owner questions and keep status blocked.

## Quality Gate
- Generated skill must follow multi-file structure: thin SKILL.md + modes/*.md + supporting layers.
- Generated skill must include Iron Law and >=3 workflow phases.
- Generated skill must include rationalization defenses and blocked-state logic.
- Mode selection must reference BRD — no mode included without BRD justification.
- Runtime boundary must remain inside .agents/skills/*.
`,
        },
    ];

    for (const role of canonicalUniqueRoles(roles, autoAddedRoles)) {
        const slug = roleToSlug(role);
        const baseId = extractRoleId(role);
        const owner = baseId === 'PM' ? 'product-manager' : baseId === 'TL' ? 'tech-lead' : baseId.toLowerCase();
        const roleRoot = `.agents/skills/${slug}`;
        const roleFile: GeneratedFile = {
            path: `${roleRoot}/SKILL.md`,
            content: renderSkillFile(role, projectName),
        };
        const roleSupport = (baseId === 'PM' || baseId === 'TL')
            ? renderThreeNineSupportFiles(roleRoot, 'Codex', owner)
            : [];
        (files as GeneratedFile[]).push(roleFile, ...roleSupport);
    }

    files.push(...renderThreeNineSupportFiles('.agents/skills/skill-creator', 'Codex', 'skill-creator'));

    return files;
}
