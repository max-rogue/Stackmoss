import type { GeneratedFile } from '../templates/types.js';
import { extractRoleId } from '../templates/team.js';
import { ROLE_CAPABILITIES, ROLE_RUNTIME_NAMES } from './claude-code.js';
import { getCapabilitiesForRole } from '../budgets.js';
import {
    renderAntigravityMethodologyRule,
    renderAntigravityWorkflow,
} from './methodology.js';
import { uniqueRoleIds, uniqueRoles } from './utils.js';

export function capabilityToSlug(capId: string): string {
    const parts = capId.split('-');
    const roleId = parts[0];
    const capSuffix = parts.slice(1).join('-').toLowerCase();
    const roleName = ROLE_RUNTIME_NAMES[roleId] ?? roleId.toLowerCase();

    return `${roleName}--${capSuffix}`;
}

function renderSkillMd(
    capId: string,
    capName: string,
    budget: number,
    trigger: string,
    doNotUse: string,
    projectName: string,
): string {
    const slug = capabilityToSlug(capId);

    return `---
name: ${slug}
description: ${capName}. ${trigger}
---

# ${capName} - ${projectName}

## When to Use
- ${trigger}

## When Not to Use
- ${doNotUse}

## Budget
- ${budget} words max per session

## Instructions
- Read team.md before acting.
- Respect replace-only config rules.
- Send verified repo facts to Tech Lead before proposing shared config changes.
- Follow shared methodology rules and workflows for planning, testing, debugging, verification, and review response.
`;
}

function renderRuleMd(projectName: string): string {
    return `# StackMoss Team Bootstrap - ${projectName}

## Always On
- Start in Tech Lead-first calibration mode after bootstrap.
- Confirm BRD or NORTH_STAR is locked before implementation.
- Replace stale facts inside existing sections instead of appending logs.
- Ask the user before applying any shared config patch.
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
    ];

    for (const role of uniqueRoles(roles, autoAddedRoles)) {
        const baseId = extractRoleId(role);
        const def = ROLE_CAPABILITIES[baseId];

        if (!def) {
            const slug = ROLE_RUNTIME_NAMES[baseId] ?? baseId.toLowerCase();
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
        for (const cap of def.capabilities.filter(
            (item) => allowedCapabilities.size === 0 || allowedCapabilities.has(item.id),
        )) {
            const slug = capabilityToSlug(cap.id);
            files.push({
                path: `.agent/skills/${slug}/SKILL.md`,
                content: renderSkillMd(
                    cap.id,
                    cap.name,
                    cap.budget,
                    cap.trigger,
                    cap.doNotUse,
                    projectName,
                ),
            });
        }
    }

    return files;
}
