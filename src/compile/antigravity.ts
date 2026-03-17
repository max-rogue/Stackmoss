import type { GeneratedFile } from '../templates/types.js';
import { extractRoleId } from '../templates/team.js';
import { ROLE_CAPABILITIES, ROLE_RUNTIME_NAMES } from './claude-code.js';
import { getCapabilitiesForRole } from '../budgets.js';
import {
    renderAntigravityMethodologyRule,
    renderAntigravityWorkflow,
} from './methodology.js';
import { uniqueRoleIds, uniqueRoles } from './utils.js';

function renderRuleMd(projectName: string): string {
    return `# StackMoss Team Bootstrap - ${projectName}

## Always On
- Start in Tech Lead-first calibration mode after bootstrap.
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
1. Read team.md, FEATURES.md, NORTH_STAR.md, and NON_GOALS.md.
2. Confirm BRD or NORTH_STAR is locked. If not, stop and convert F1 into locking scope and constraints.
3. Scan the repository for stack, commands, paths, tests, and deployment facts.
4. Ask focused follow-up questions when facts are missing or conflicting.
5. Prepare replace-only config changes for Tech Lead review.
6. Ask the user before applying any shared config patch.
`;
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
    ];

    // Role-level skills (not per-capability) for equalized output
    for (const role of uniqueRoles(roles, autoAddedRoles)) {
        const baseId = extractRoleId(role);
        const def = ROLE_CAPABILITIES[baseId];
        const slug = ROLE_RUNTIME_NAMES[baseId] ?? baseId.toLowerCase();

        if (!def) {
            files.push({
                path: `.agent/skills/${slug}/SKILL.md`,
                content: `---
name: ${slug}
description: ${role} role for ${projectName}.
---

# ${role} - ${projectName}

## Instructions
- Read team.md before acting.
`,
            });
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

        files.push({
            path: `.agent/skills/${slug}/SKILL.md`,
            content: `---
name: ${slug}
description: ${def.name} role for ${projectName}.
---

# ${def.name} - ${projectName}

## When to Use
${caps.map((cap) => `- ${cap.trigger}`).join('\n')}

## Capabilities

${capLines}

## Instructions
- Read team.md before acting.
- Respect replace-only config rules.
- Follow shared methodology rules and workflows.
- Never persist secrets or credentials into generated files or patch artifacts.
`,
        });
    }

    return files;
}
