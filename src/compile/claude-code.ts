/**
 * Compile Layer: Claude Code Targets
 * Authority:
 * - Claude Code skills docs (.claude/skills/<skill-name>/SKILL.md)
 * - CLAUDE.md repo guidance
 */

import type { GeneratedFile } from '../templates/types.js';
import { extractRoleId } from '../templates/team.js';
import { getCapabilitiesForRole, getDefaultBudget } from '../budgets.js';
import {
    renderMethodologyReference,
    renderSharedMethodologySkill,
} from './methodology.js';
import { uniqueRoleIds, uniqueRoles } from './utils.js';

interface SkillCapability {
    id: string;
    name: string;
    budget: number;
    trigger: string;
    doNotUse: string;
}

export const ROLE_RUNTIME_NAMES: Record<string, string> = {
    TL: 'tech-lead',
    BA: 'business-analyst',
    DEV: 'developer',
    FE: 'frontend',
    BE: 'backend',
    FS: 'fullstack',
    MOBILE: 'mobile',
    DEVOPS: 'devops-engineer',
    DATA: 'data-engineer',
    PE: 'prompt-engineer',
    UIUX: 'ui-ux',
    QA: 'quality-assurance',
    DOCS: 'documentation',
    SEC: 'security-auditor',
    OPS: 'devops',
};

function getRoleMaintenance(roleStr: string): string[] {
    const baseId = extractRoleId(roleStr);

    if (baseId === 'TL') {
        return [
            'Confirm BRD or NORTH_STAR is locked before implementation; if not, turn F1 into locking scope and constraints.',
            'Scan the repo, ask focused follow-up questions, and recalibrate the team to the real stack, topology, and delivery lanes.',
            'Act as the single writer for shared team config and prepare replace-only patches when facts change.',
            'Ask the user before applying any shared config patch.',
        ];
    }

    return [
        'Do not edit shared team config directly.',
        'When you verify a command, path, test flow, or deploy fact, send that verified signal to Tech Lead.',
        'Never append memory logs to shared config.',
    ];
}

export const ROLE_CAPABILITIES: Record<string, { name: string; capabilities: SkillCapability[] }> = {
    TL: {
        name: 'Tech Lead',
        capabilities: [
            { id: 'TL-ARCH', name: 'Architecture decisions & ADR', budget: getDefaultBudget('TL-ARCH') ?? 220, trigger: 'Use when architecture decisions, repo calibration, or team topology changes are needed.', doNotUse: 'Do not use for routine implementation tasks.' },
            { id: 'TL-REVIEW', name: 'Code review & merge gates', budget: getDefaultBudget('TL-REVIEW') ?? 180, trigger: 'Use when code needs review before merge or deploy.', doNotUse: 'Do not use for first-draft implementation.' },
            { id: 'TL-CONTEXT', name: 'Maintain CONTEXT.md & FEATURES.md', budget: getDefaultBudget('TL-CONTEXT') ?? 150, trigger: 'Use after completing a feature or major decision.', doNotUse: 'Do not use mid-task.' },
            { id: 'TL-PLAN', name: 'Break down features & assign subtasks', budget: getDefaultBudget('TL-PLAN') ?? 160, trigger: 'Use at the start of each feature cycle or when reshaping delivery lanes.', doNotUse: 'Do not use during isolated coding work.' },
        ],
    },
    BA: {
        name: 'Business Analyst',
        capabilities: [
            { id: 'BA-REQ', name: 'Requirements elicitation & clarification', budget: getDefaultBudget('BA-REQ') ?? 180, trigger: 'Use when requirements are unclear or conflicting.', doNotUse: 'Do not use for technical decisions.' },
            { id: 'BA-AC', name: 'Acceptance criteria writing', budget: getDefaultBudget('BA-AC') ?? 150, trigger: 'Use at feature start to define pass/fail criteria.', doNotUse: 'Do not use during implementation.' },
        ],
    },
    DEV: {
        name: 'Developer',
        capabilities: [
            { id: 'DEV-IMPL', name: 'Feature implementation', budget: getDefaultBudget('DEV-IMPL') ?? 200, trigger: 'Use when implementing code for a feature.', doNotUse: 'Do not use for architecture decisions.' },
            { id: 'DEV-ENV', name: 'Environment & command knowledge', budget: getDefaultBudget('DEV-ENV') ?? 160, trigger: 'Use when running commands, checking paths, or managing the local environment.', doNotUse: 'Do not use for business logic decisions.' },
            { id: 'DEV-DEBUG', name: 'Debug & error resolution', budget: getDefaultBudget('DEV-DEBUG') ?? 150, trigger: 'Use when debugging errors or unexpected behavior.', doNotUse: 'Do not use for new feature planning.' },
        ],
    },
    QA: {
        name: 'Quality Assurance',
        capabilities: [
            { id: 'QA-TEST', name: 'Test & verify acceptance criteria', budget: getDefaultBudget('QA-TEST') ?? 150, trigger: 'Use after implementation to verify that a feature works.', doNotUse: 'Do not use during planning.' },
            { id: 'QA-REGRESSION', name: 'Regression checklist', budget: getDefaultBudget('QA-REGRESSION') ?? 120, trigger: 'Use before marking a feature done.', doNotUse: 'Do not use for new feature development.' },
        ],
    },
    DOCS: {
        name: 'Documentation',
        capabilities: [
            { id: 'DOCS-README', name: 'README & runbook updates', budget: getDefaultBudget('DOCS-README') ?? 130, trigger: 'Use after a feature is done.', doNotUse: 'Do not use during implementation.' },
            { id: 'DOCS-CHANGELOG', name: 'Changelog', budget: getDefaultBudget('DOCS-CHANGELOG') ?? 100, trigger: 'Use at the end of a feature cycle.', doNotUse: 'Do not use mid-feature.' },
        ],
    },
    SEC: {
        name: 'Security-lite',
        capabilities: [
            { id: 'SEC-SCAN', name: 'Basic security check', budget: getDefaultBudget('SEC-SCAN') ?? 140, trigger: 'Use before any feature touching auth, PII, or financial data.', doNotUse: 'Do not use for non-sensitive features.' },
        ],
    },
    OPS: {
        name: 'DevOps-lite',
        capabilities: [
            { id: 'OPS-DEPLOY', name: 'Deploy & infra checks', budget: getDefaultBudget('OPS-DEPLOY') ?? 140, trigger: 'Use before deploy or infrastructure changes.', doNotUse: 'Do not use for feature development.' },
        ],
    },
    FE: {
        name: 'Frontend Developer',
        capabilities: [
            { id: 'FE-UI', name: 'Component & layout implementation', budget: getDefaultBudget('FE-UI') ?? 200, trigger: 'Use when building UI components, pages, or interactive elements.', doNotUse: 'Do not use for API endpoints or database work.' },
            { id: 'FE-STYLE', name: 'CSS, design system & theming', budget: getDefaultBudget('FE-STYLE') ?? 160, trigger: 'Use when implementing design tokens, CSS architecture, or responsive layouts.', doNotUse: 'Do not use for backend logic.' },
            { id: 'FE-A11Y', name: 'Accessibility & responsive design', budget: getDefaultBudget('FE-A11Y') ?? 120, trigger: 'Use when auditing or fixing a11y, ARIA, keyboard nav, or mobile responsiveness.', doNotUse: 'Do not use for first-draft implementation.' },
        ],
    },
    BE: {
        name: 'Backend Developer',
        capabilities: [
            { id: 'BE-API', name: 'API endpoints & business logic', budget: getDefaultBudget('BE-API') ?? 200, trigger: 'Use when implementing REST/GraphQL endpoints, DTOs, or service logic.', doNotUse: 'Do not use for UI components or styling.' },
            { id: 'BE-DB', name: 'Database schema, migrations & queries', budget: getDefaultBudget('BE-DB') ?? 180, trigger: 'Use when designing schemas, writing migrations, or optimizing queries.', doNotUse: 'Do not use for frontend work.' },
            { id: 'BE-AUTH', name: 'Authentication & authorization', budget: getDefaultBudget('BE-AUTH') ?? 160, trigger: 'Use when implementing auth flows, session management, RBAC, or token handling.', doNotUse: 'Do not use for non-auth features.' },
        ],
    },
    FS: {
        name: 'Fullstack Developer',
        capabilities: [
            { id: 'FS-INTEGRATE', name: 'API-to-UI integration & data flow', budget: getDefaultBudget('FS-INTEGRATE') ?? 200, trigger: 'Use when wiring API calls to UI, handling state management, or data fetching.', doNotUse: 'Do not use for architecture decisions.' },
            { id: 'FS-SCAFFOLD', name: 'Project setup & boilerplate', budget: getDefaultBudget('FS-SCAFFOLD') ?? 160, trigger: 'Use when scaffolding new modules, setting up routing, or configuring build tools.', doNotUse: 'Do not use mid-feature.' },
            { id: 'FS-OPTIMIZE', name: 'Performance & caching', budget: getDefaultBudget('FS-OPTIMIZE') ?? 140, trigger: 'Use when optimizing load times, bundle size, caching strategies, or SSR/SSG.', doNotUse: 'Do not use for first-pass implementation.' },
        ],
    },
    MOBILE: {
        name: 'Mobile Developer',
        capabilities: [
            { id: 'MOBILE-NATIVE', name: 'Platform UI & navigation', budget: getDefaultBudget('MOBILE-NATIVE') ?? 200, trigger: 'Use when building native screens, navigation flows, or platform-specific UI.', doNotUse: 'Do not use for web-only features.' },
            { id: 'MOBILE-PERF', name: 'Bundle size, memory & battery', budget: getDefaultBudget('MOBILE-PERF') ?? 150, trigger: 'Use when optimizing app size, reducing memory leaks, or improving battery usage.', doNotUse: 'Do not use for feature implementation.' },
            { id: 'MOBILE-DEVICE', name: 'Sensors, storage & permissions', budget: getDefaultBudget('MOBILE-DEVICE') ?? 140, trigger: 'Use when integrating camera, GPS, local storage, push notifications, or permission flows.', doNotUse: 'Do not use for UI layout work.' },
        ],
    },
    DEVOPS: {
        name: 'DevOps Engineer',
        capabilities: [
            { id: 'DEVOPS-CI', name: 'CI/CD pipeline & build automation', budget: getDefaultBudget('DEVOPS-CI') ?? 180, trigger: 'Use when setting up GitHub Actions, build pipelines, or automated deployments.', doNotUse: 'Do not use for feature code.' },
            { id: 'DEVOPS-INFRA', name: 'Docker, K8s & cloud infrastructure', budget: getDefaultBudget('DEVOPS-INFRA') ?? 160, trigger: 'Use when writing Dockerfiles, Compose configs, Terraform, or cloud service setup.', doNotUse: 'Do not use for application logic.' },
            { id: 'DEVOPS-MONITOR', name: 'Logging, alerting & observability', budget: getDefaultBudget('DEVOPS-MONITOR') ?? 140, trigger: 'Use when setting up log aggregation, health checks, alerting, or APM.', doNotUse: 'Do not use for feature development.' },
        ],
    },
    DATA: {
        name: 'Data Engineer',
        capabilities: [
            { id: 'DATA-PIPELINE', name: 'ETL, ingestion & transformation', budget: getDefaultBudget('DATA-PIPELINE') ?? 180, trigger: 'Use when building data ingestion pipelines, transformations, or batch jobs.', doNotUse: 'Do not use for UI or API work.' },
            { id: 'DATA-MODEL', name: 'Schema design & normalization', budget: getDefaultBudget('DATA-MODEL') ?? 160, trigger: 'Use when designing data models, warehouse schemas, or analytics tables.', doNotUse: 'Do not use for OLTP application schemas (use BE-DB).' },
            { id: 'DATA-QUALITY', name: 'Data validation & monitoring', budget: getDefaultBudget('DATA-QUALITY') ?? 140, trigger: 'Use when implementing data quality checks, anomaly detection, or data testing.', doNotUse: 'Do not use for application-level testing (use QA).' },
        ],
    },
    PE: {
        name: 'Prompt Engineer',
        capabilities: [
            { id: 'PE-PROMPT', name: 'System prompt design & iteration', budget: getDefaultBudget('PE-PROMPT') ?? 180, trigger: 'Use when writing or refining system prompts, few-shot examples, or instruction tuning.', doNotUse: 'Do not use for non-LLM features.' },
            { id: 'PE-EVAL', name: 'Eval harness & benchmarking', budget: getDefaultBudget('PE-EVAL') ?? 150, trigger: 'Use when building eval cases, grading rubrics, or benchmark suites for LLM outputs.', doNotUse: 'Do not use for application testing (use QA).' },
            { id: 'PE-CHAIN', name: 'Chain & agent orchestration', budget: getDefaultBudget('PE-CHAIN') ?? 140, trigger: 'Use when building multi-step LLM chains, tool-use flows, or agent routing logic.', doNotUse: 'Do not use for simple API calls.' },
        ],
    },
    UIUX: {
        name: 'UI/UX Designer',
        capabilities: [
            { id: 'UIUX-DESIGN', name: 'Design system tokens & wireframes', budget: getDefaultBudget('UIUX-DESIGN') ?? 180, trigger: 'Use when defining color palettes, typography scales, spacing tokens, or page wireframes.', doNotUse: 'Do not use for implementation code.' },
            { id: 'UIUX-PROTO', name: 'Interactive prototype & animation', budget: getDefaultBudget('UIUX-PROTO') ?? 160, trigger: 'Use when building click-through prototypes, micro-animations, or interaction specs.', doNotUse: 'Do not use for production code.' },
            { id: 'UIUX-REVIEW', name: 'Usability audit & heuristic review', budget: getDefaultBudget('UIUX-REVIEW') ?? 140, trigger: 'Use when reviewing implemented UI against design specs, heuristics, or user flows.', doNotUse: 'Do not use for functional testing (use QA).' },
        ],
    },
};

export function roleToSlug(role: string): string {
    const baseId = extractRoleId(role);
    return ROLE_RUNTIME_NAMES[baseId] ?? baseId.toLowerCase();
}

function getRoleDefinition(roleStr: string): { name: string; capabilities: SkillCapability[] } | undefined {
    const baseId = extractRoleId(roleStr);
    const def = ROLE_CAPABILITIES[baseId];

    if (!def) {
        return undefined;
    }

    const allowedCapabilities = new Set(getCapabilitiesForRole(roleStr));
    return {
        name: def.name,
        capabilities: def.capabilities.filter(
            (cap) => allowedCapabilities.size === 0 || allowedCapabilities.has(cap.id),
        ),
    };
}

function renderSkillBody(roleStr: string, projectName: string): string {
    const def = getRoleDefinition(roleStr);

    if (!def) {
        return `# ${roleStr} - ${projectName}

## When to Use
- Use when tasks for this role are explicitly requested.

## Instructions
- Read team.md before acting.
`;
    }

    const capLines = def.capabilities.map((cap) =>
        `### ${cap.id}: ${cap.name}
- Budget: ${cap.budget} words
- Trigger: ${cap.trigger}
- Do not use: ${cap.doNotUse}`,
    ).join('\n\n');

    return `# ${def.name} - ${projectName}

## When to Use
${def.capabilities.map((cap) => `- ${cap.trigger}`).join('\n')}

## Capabilities

${capLines}

## Config Maintenance
${getRoleMaintenance(roleStr).map((line) => `- ${line}`).join('\n')}

## Shared Methodology
- ${renderMethodologyReference()}

`;
}

export function renderSkillFile(roleStr: string, projectName: string): string {
    const slug = roleToSlug(roleStr);
    const def = getRoleDefinition(roleStr);
    const description = def
        ? `${def.name} role for ${projectName}. Use when ${def.name.toLowerCase()} work is needed.`
        : `${roleStr} role for ${projectName}.`;

    return `---
name: ${slug}
description: ${description}
---

${renderSkillBody(roleStr, projectName)}`;
}

function renderClaudeMd(roles: string[], projectName: string): string {
    const lines = [
        `# ${projectName}`,
        '_Agent team bootstrap generated by StackMoss._',
        '',
        '## First Session Policy',
        '- Read team.md, FEATURES.md, NORTH_STAR.md, and NON_GOALS.md before acting.',
        '- Confirm BRD or NORTH_STAR is locked before real feature delivery.',
        '- If the BRD is not locked, turn F1 into locking scope, constraints, and success criteria.',
        '- Begin in Tech Lead mode: scan the repo, ask follow-up questions, and calibrate the team before implementation.',
        '- Shared config changes are replace-only and require user confirmation before apply.',
        '- Never persist secrets, tokens, passwords, or private keys in generated skill files or repo guidance.',
        '',
        '## Claude Code Skill Layout',
        '- Project skills live in .claude/skills/<skill-name>/SKILL.md.',
        '- Keep CLAUDE.md for repo-wide guidance and use skill folders for role behavior.',
        '',
        '## Team Skills',
    ];

    lines.push('- Shared methodology: .claude/skills/stackmoss-methodology/SKILL.md');

    for (const role of roles) {
        const baseId = extractRoleId(role);
        const roleName = ROLE_CAPABILITIES[baseId]?.name ?? role;
        lines.push(`- ${roleName}: .claude/skills/${roleToSlug(role)}/SKILL.md`);
    }

    lines.push('');

    return `${lines.join('\n')}\n`;
}

/**
 * Legacy Claude Code target preserved for compatibility.
 */
export function compileClaudeCode(
    roles: string[],
    autoAddedRoles: string[],
    projectName: string,
): GeneratedFile[] {
    return uniqueRoles(roles, autoAddedRoles).map((role) => ({
        path: `.claude/skills/${roleToSlug(role)}.skill.md`,
        content: renderSkillBody(role, projectName),
    }));
}

/**
 * Official Claude Code bootstrap:
 * - CLAUDE.md at repo root
 * - .claude/skills/<skill-name>/SKILL.md
 */
export function compileClaudeCodeV2(
    roles: string[],
    autoAddedRoles: string[],
    projectName: string,
): GeneratedFile[] {
    const allRoles = uniqueRoles(roles, autoAddedRoles);
    const roleIds = uniqueRoleIds(roles, autoAddedRoles);
    const files: GeneratedFile[] = [
        {
            path: 'CLAUDE.md',
            content: renderClaudeMd(allRoles, projectName),
        },
        {
            path: '.claude/skills/stackmoss-methodology/SKILL.md',
            content: renderSharedMethodologySkill(projectName, roleIds, 'Claude Code'),
        },
    ];

    for (const role of allRoles) {
        files.push({
            path: `.claude/skills/${roleToSlug(role)}/SKILL.md`,
            content: renderSkillFile(role, projectName),
        });
    }

    return files;
}
