/**
 * Compile Layer: Codex target
 * Authority:
 * - OpenAI Codex uses AGENTS.md for repo-scoped instructions
 * - Project skills are loaded from .agents/skills/<skill-name>/SKILL.md
 */

import { extractRoleId } from '../templates/team.js';
import type { GeneratedFile } from '../templates/types.js';
import {
    getSharedMethodologyModules,
    renderMethodologySection,
} from './methodology.js';
import { ROLE_CAPABILITIES, renderSkillFile, roleToSlug } from './claude-code.js';
import { uniqueRoleIds, uniqueRoles } from './utils.js';

function renderFrontmatter(name: string, description: string): string {
    return ['---', `name: ${name}`, `description: ${description}`, '---'].join('\n');
}

function renderBootstrapSkill(projectName: string): string {
    return `${renderFrontmatter(
        'stackmoss-bootstrap',
        `Bootstrap and recalibrate the ${projectName} Codex team. Use when initializing, calibrating, or reshaping the team for this repository.`,
    )}

# StackMoss Bootstrap - ${projectName}

## When to Use
- Use when the repository has just been bootstrapped with StackMoss.
- Use when the user asks to calibrate or reshape the Codex agent team.

## Instructions
- Start by reading \`team.md\`, \`FEATURES.md\`, \`NORTH_STAR.md\`, and \`NON_GOALS.md\`.
- Confirm BRD or \`NORTH_STAR.md\` is locked before implementation. If not, turn F1 into locking scope and constraints.
- Scan the repo before changing delivery lanes. If the repo is still bootstrap-only, report that state instead of inventing implementation facts.
- Treat \`AGENTS.md\` as the repo-level Codex instruction file and \`.agents/skills/*\` as the Codex skill tree.
- Keep \`.agent/*\` reserved for Antigravity and do not mirror Antigravity-only layouts into Codex instructions.
- Tech Lead is the single writer for shared config and must ask the user before applying shared-config patches.
`;
}

function renderMethodologySkill(projectName: string, roleIds: string[]): string {
    const modules = getSharedMethodologyModules(roleIds);
    const moduleList = modules.map((module) => `- ${module.title}: ${module.summary}`).join('\n');
    const moduleBodies = modules
        .map((module) => `## ${module.title}\n- Upstream basis: ${module.upstreamSources.join(', ')}\n${module.body}`)
        .join('\n\n');

    return `${renderFrontmatter(
        'methodology',
        `Shared working methodology for ${projectName}. Use for planning, testing, debugging, verification, and review discipline.`,
    )}

# StackMoss Methodology - ${projectName}

This is the shared methodology layer for Codex. Keep role files small and use this skill for working discipline.

## Included Modules
${moduleList}

${moduleBodies}
`;
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
        '- stackmoss-bootstrap: Bootstrap and recalibrate the Codex team for this repository',
        ...allRoles.map((role) => {
            const baseId = extractRoleId(role);
            const roleName = ROLE_CAPABILITIES[baseId]?.name ?? role;
            return `- ${roleToSlug(role)}: ${roleName} role behavior for Codex`;
        }),
        '- methodology: Evidence, TDD, debugging, planning, and review discipline',
    ].join('\n');

    const content = `# StackMoss Agent Bootstrap - ${projectName}

Codex should treat this repository as a Tech Lead-first workflow.
This file is \`AGENTS.md\` for Codex and should stay at repo scope.

## First Session Policy

- Start by reading \`team.md\`, \`FEATURES.md\`, \`NORTH_STAR.md\`, and \`NON_GOALS.md\`.
- Before real feature delivery, confirm the BRD or \`NORTH_STAR.md\` is locked.
- If the BRD is not locked, turn F1 into locking scope, constraints, and success criteria.
- In an existing repo, act as Tech Lead first: scan the repository, ask follow-up questions if facts are missing, and propose bootstrap corrections before implementation.
- Replace stale facts in existing sections. Never append memory logs to config.
- Ask the user before applying any shared config patch.

## Agent Team

${roleList}

## Codex Skills

Codex uses \`AGENTS.md\` as the repo instruction entrypoint and \`.agents/skills/<skill-name>/SKILL.md\` for project skills.
Do not treat \`.agent/*\` as Codex skill folders; that tree remains Antigravity-specific.

Skills live in \`.agents/skills/\` and are auto-discovered by Codex:
${skillList}

## Tech Lead Protocol

- Tech Lead is the coordinator and single writer for shared team config.
- Other roles can surface verified signals, but they do not rewrite shared config directly.
- If commands, paths, or stack facts are uncertain, ask focused follow-up questions instead of assuming.
- When calibrating Codex, keep runtime boundaries clean: \`AGENTS.md\` + \`.agents/skills/*\` for Codex, \`.agent/*\` for Antigravity, \`.claude/*\` for Claude, \`.cursor/*\` for Cursor.
- When calibration is complete, update \`team.md\` by replacing the bootstrap calibration marker and stale facts.

${methodologySection}

_Generated by StackMoss. Edit team.md to change shared project instructions._
`;

    return [
        { path: 'AGENTS.md', content },
        {
            path: '.agents/skills/stackmoss-bootstrap/SKILL.md',
            content: renderBootstrapSkill(projectName),
        },
        {
            path: '.agents/skills/methodology/SKILL.md',
            content: renderMethodologySkill(projectName, roleIds),
        },
        ...allRoles.map((role) => ({
            path: `.agents/skills/${roleToSlug(role)}/SKILL.md`,
            content: renderSkillFile(role, projectName),
        })),
    ];
}
