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
} from './methodology.js';
import { uniqueRoles, canonicalUniqueRoles } from './utils.js';
import { renderDeepSkillContent, renderRoleOverrideGuidance } from './role-skills.js';
import { ROLE_RUNTIME_NAMES, resolveRole } from './role-registry.js';

interface SkillCapability {
    id: string;
    name: string;
    budget: number;
    trigger: string;
    doNotUse: string;
}

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

/**
 * Shared capability definitions used by all compile targets (Codex, Cursor, Antigravity).
 * This is the content layer — rich trigger/doNotUse text for each capability.
 * Identity layer (canonical roster, aliases) → role-registry.ts
 * Budget layer (budget numbers, capability ID lists) → budgets.ts
 */
export const ROLE_CAPABILITIES: Record<string, { name: string; capabilities: SkillCapability[] }> = {
    TL: {
        name: 'Tech Lead',
        capabilities: [
            { id: 'TL-ARCH', name: 'Architecture decisions & ADR', budget: getDefaultBudget('TL-ARCH') ?? 220, trigger: 'Use when architecture decisions, repo calibration, tech stack evaluation, dependency trade-offs, or team topology changes are needed â€” even when the user does not explicitly say "architecture." Also activate for ADR writing, cross-module design reviews, and any decision affecting more than one module or service boundary.', doNotUse: 'Do not use for isolated single-file implementation or debugging within one module.' },
            { id: 'TL-REVIEW', name: 'Code review framework & merge gates', budget: getDefaultBudget('TL-REVIEW') ?? 180, trigger: 'Use when code needs review before merge, deploy, or release. Activate whenever a PR is submitted, a diff is shared, or the user asks for feedback on code quality, test coverage, or security posture of a changeset. Apply severity categories (Critical, Important, Suggestion) with explicit rationale.', doNotUse: 'Do not use for first-draft implementation or initial feature coding.' },
            { id: 'TL-CONTEXT', name: 'Maintain CONTEXT.md & FEATURES.md', budget: getDefaultBudget('TL-CONTEXT') ?? 150, trigger: 'Use after completing a feature, closing a milestone, resolving a major bug, or making an architecture decision. Also activate when the user asks to update project status, track progress, or reflect completed work in documentation.', doNotUse: 'Do not use mid-task when implementation is still in progress.' },
            { id: 'TL-PLAN', name: 'Feature roadmap & execution slices', budget: getDefaultBudget('TL-PLAN') ?? 160, trigger: 'Use at the start of each feature cycle, when reshaping delivery lanes, when the user says "plan", "break down", "decompose", or "what should we build next." Also activate for roadmap sequencing, dependency mapping, and role assignment across PM, engineering, QA, and ops.', doNotUse: 'Do not use during isolated coding work within a single task.' },
        ],
    },
    BA: {
        name: 'Business Analyst',
        capabilities: [
            { id: 'BA-REQ', name: 'Requirements elicitation & clarification', budget: getDefaultBudget('BA-REQ') ?? 180, trigger: 'Use when requirements are unclear, conflicting, incomplete, or when the user is unsure what to build. Also activate when stakeholder needs differ, when translating business goals into technical requirements, or when performing gap analysis between what exists and what is needed.', doNotUse: 'Do not use for technical architecture decisions or code implementation.' },
            { id: 'BA-AC', name: 'Acceptance criteria writing', budget: getDefaultBudget('BA-AC') ?? 150, trigger: 'Use at feature start to define pass/fail criteria, when the user says "how do we know it works", "what does done look like", or when writing Given/When/Then scenarios. Also activate when reviewing feature completeness or verifying that implementation matches business intent.', doNotUse: 'Do not use during active code implementation.' },
        ],
    },
    PM: {
        name: 'Product Manager',
        capabilities: [
            { id: 'PM-ROADMAP', name: 'Roadmap & feature prioritization', budget: getDefaultBudget('PM-ROADMAP') ?? 180, trigger: 'Use when defining the product roadmap, prioritizing the backlog, scoping feature releases, or deciding what to build next. Activate when the user asks about product strategy, feature sequencing, MVP scope, or quarterly planning â€” even if they do not explicitly say "roadmap."', doNotUse: 'Do not use for technical architecture decisions â€” use TL-ARCH instead.' },
            { id: 'PM-PRIORITIZE', name: 'Impact analysis, trade-offs & go/no-go gates', budget: getDefaultBudget('PM-PRIORITIZE') ?? 150, trigger: 'Use when evaluating feature trade-offs, cost-benefit analysis, RICE scoring, go/no-go decisions, or comparing competing priorities. Activate when the user asks "should we build this", "is this worth it", or weighs effort against impact. Require explicit gate results and ownership when deciding GO vs NO-GO.', doNotUse: 'Do not use for implementation planning or code-level task breakdown.' },
            { id: 'PM-STAKEHOLDER', name: 'Stakeholder communication & alignment', budget: getDefaultBudget('PM-STAKEHOLDER') ?? 150, trigger: 'Use when preparing status reports, demo scripts, stakeholder presentations, release communications, or alignment documents. Activate when the user needs to communicate progress, decisions, or plans to non-technical stakeholders.', doNotUse: 'Do not use for technical documentation â€” use DOCS instead.' },
        ],
    },
    FE: {
        name: 'Frontend Developer',
        capabilities: [
            { id: 'FE-UI', name: 'Component & layout implementation', budget: getDefaultBudget('FE-UI') ?? 200, trigger: 'Use when building UI components, pages, interactive elements, forms, modals, or navigation. Activate when the user asks to create or modify anything visual â€” buttons, cards, lists, tables, layouts, or page structure â€” even if they do not say "frontend" explicitly.', doNotUse: 'Do not use for API endpoints, database work, or backend service logic.' },
            { id: 'FE-STYLE', name: 'CSS, design system & theming', budget: getDefaultBudget('FE-STYLE') ?? 160, trigger: 'Use when implementing design tokens, CSS architecture, responsive layouts, theming, dark mode, or visual polish. Activate when the user mentions styling, colors, fonts, spacing, breakpoints, or asks to make something "look better" or match a design spec. Also activate for design system token definition, typography scales, and spacing systems.', doNotUse: 'Do not use for backend logic or API design.' },
            { id: 'FE-A11Y', name: 'Accessibility & responsive design', budget: getDefaultBudget('FE-A11Y') ?? 120, trigger: 'Use when auditing or fixing accessibility (a11y), ARIA labels, keyboard navigation, screen reader support, color contrast, focus management, or mobile responsiveness. Activate when the user mentions WCAG compliance, touch targets, or asks if the UI works on different screen sizes.', doNotUse: 'Do not use for first-draft implementation when accessibility is not the primary focus.' },
            { id: 'FE-TASTE', name: 'Design quality & anti-slop enforcement', budget: getDefaultBudget('FE-TASTE') ?? 180, trigger: 'Use when the UI should look premium, polished, or professional â€” not like generic AI-generated output. Activate when the user says "make it look better", "it looks too generic", "feels AI-generated", "needs more polish", or asks for design quality review. Also activate proactively when building marketing pages, landing pages, or user-facing dashboards to prevent AI tells (purple neon gradients, 3-equal-card layouts, Inter font, generic shadows, round placeholder numbers).', doNotUse: 'Do not use for internal tools, admin panels, or prototypes where visual polish is explicitly deprioritized.' },
        ],
    },
    BE: {
        name: 'Backend Developer',
        capabilities: [
            { id: 'BE-API', name: 'API endpoints & business logic', budget: getDefaultBudget('BE-API') ?? 200, trigger: 'Use when implementing REST or GraphQL endpoints, DTOs, service logic, middleware, or server-side business rules. Activate when the user asks to create a route, handle a request, build an API, or write server-side validation â€” even if they just say "backend" or "API."', doNotUse: 'Do not use for UI components, CSS styling, or client-side interactivity.' },
            { id: 'BE-DB', name: 'Database schema, migrations & queries', budget: getDefaultBudget('BE-DB') ?? 180, trigger: 'Use when designing database schemas, writing migrations, optimizing queries, setting up indexes, or working with ORMs like Prisma, TypeORM, or Sequelize. Activate when the user mentions tables, columns, relations, SQL, or asks about data modeling and persistence.', doNotUse: 'Do not use for frontend work or UI data binding.' },
            { id: 'BE-AUTH', name: 'Authentication & authorization', budget: getDefaultBudget('BE-AUTH') ?? 160, trigger: 'Use when implementing auth flows, login, signup, session management, JWT handling, RBAC, OAuth, SSO, or token refresh logic. Activate when the user mentions permissions, roles, access control, or asks "who can access this" â€” even in non-auth-specific contexts where access control is a side concern.', doNotUse: 'Do not use for features with no authentication or authorization implications.' },
            { id: 'BE-DEBUG', name: 'Debug & error resolution', budget: getDefaultBudget('BE-DEBUG') ?? 150, trigger: 'Use when debugging errors, stack traces, unexpected behavior, test failures, or runtime exceptions. Activate when the user shares an error message, asks "why is this broken", or when something that previously worked has stopped working. Also activate for performance issues and memory leak investigation.', doNotUse: 'Do not use for new feature planning or architecture design.' },
        ],
    },
    MOBILE: {
        name: 'Mobile Developer',
        capabilities: [
            { id: 'MOBILE-NATIVE', name: 'Platform UI & navigation', budget: getDefaultBudget('MOBILE-NATIVE') ?? 200, trigger: 'Use when building native mobile screens, navigation flows, tab bars, drawers, or platform-specific UI for iOS or Android. Activate when the user works in React Native, Expo, Swift, Kotlin, or Flutter â€” or mentions mobile app screens, gestures, deep linking, or platform-specific behavior.', doNotUse: 'Do not use for web-only features or browser-based UI.' },
            { id: 'MOBILE-PERF', name: 'Bundle size, memory & battery', budget: getDefaultBudget('MOBILE-PERF') ?? 150, trigger: 'Use when optimizing mobile app size, reducing memory leaks, improving battery consumption, or profiling frame rate drops. Activate when the user reports slow app startup, jank during scrolling, or when app store size limits are a concern.', doNotUse: 'Do not use for initial feature implementation where performance is not the focus.' },
            { id: 'MOBILE-DEVICE', name: 'Sensors, storage & permissions', budget: getDefaultBudget('MOBILE-DEVICE') ?? 140, trigger: 'Use when integrating device capabilities â€” camera, GPS, accelerometer, local storage, push notifications, biometric auth, or permission request flows. Activate when the user needs to access hardware features or manage OS-level permissions on iOS or Android.', doNotUse: 'Do not use for UI layout work that does not involve device hardware.' },
            { id: 'MOBILE-DEBUG', name: 'Mobile crash & platform debugging', budget: getDefaultBudget('MOBILE-DEBUG') ?? 150, trigger: 'Use when debugging mobile-specific crashes, platform-specific behavior differences, screen rotation issues, or native module errors. Activate when the user reports crashes on specific devices, OS versions, or platform-specific edge cases.', doNotUse: 'Do not use for web frontend debugging â€” use BE-DEBUG instead.' },
            { id: 'MOBILE-OFFLINE', name: 'Offline sync & local-first data', budget: getDefaultBudget('MOBILE-OFFLINE') ?? 140, trigger: 'Use when implementing offline data sync, local-first storage, conflict resolution, or background sync strategies. Activate when the user asks about offline support, data persistence without network, or sync queues.', doNotUse: 'Do not use for server-side caching or CDN setup â€” use DEVOPS instead.' },
        ],
    },
    DEVOPS: {
        name: 'DevOps Engineer',
        capabilities: [
            { id: 'DEVOPS-CI', name: 'CI/CD pipeline & build automation', budget: getDefaultBudget('DEVOPS-CI') ?? 180, trigger: 'Use when setting up GitHub Actions, GitLab CI, build pipelines, automated testing workflows, or deployment automation. Activate when the user mentions CI/CD, pipeline failures, build caching, artifact publishing, or automated quality gates.', doNotUse: 'Do not use for application feature code or business logic.' },
            { id: 'DEVOPS-INFRA', name: 'Docker, K8s & cloud infrastructure', budget: getDefaultBudget('DEVOPS-INFRA') ?? 160, trigger: 'Use when writing Dockerfiles, Docker Compose configs, Kubernetes manifests, Terraform, Pulumi, or cloud service setup (AWS, GCP, Azure, Vercel, Railway). Activate when the user asks about containerization, orchestration, infrastructure as code, or cloud resource provisioning.', doNotUse: 'Do not use for application business logic or feature implementation.' },
            { id: 'DEVOPS-MONITOR', name: 'Logging, alerting & observability', budget: getDefaultBudget('DEVOPS-MONITOR') ?? 140, trigger: 'Use when setting up log aggregation, structured logging, health checks, alerting rules, APM, or dashboards. Activate when the user asks about monitoring, error tracking (Sentry, Datadog), uptime checks, or wants to understand production behavior through observability tooling.', doNotUse: 'Do not use for application feature development or UI work.' },
            { id: 'DEVOPS-DEPLOY', name: 'Deploy & infra checks', budget: getDefaultBudget('DEVOPS-DEPLOY') ?? 140, trigger: 'Use before deploy, infrastructure changes, server configuration, or environment provisioning. Activate when the user mentions deployment, hosting, DNS, SSL, load balancing, scaling, or asks "how do I ship this." Also trigger for health check setup, monitoring configuration, and rollback planning.', doNotUse: 'Do not use for application feature development or business logic.' },
        ],
    },
    DATA: {
        name: 'Data Engineer',
        capabilities: [
            { id: 'DATA-PIPELINE', name: 'ETL, ingestion & transformation', budget: getDefaultBudget('DATA-PIPELINE') ?? 180, trigger: 'Use when building data ingestion pipelines, ETL/ELT jobs, data transformations, batch processing, or streaming data flows. Activate when the user mentions data import, CSV/JSON processing, scheduled data jobs, or asks to move data between systems.', doNotUse: 'Do not use for UI or REST API endpoint work.' },
            { id: 'DATA-MODEL', name: 'Schema design & normalization', budget: getDefaultBudget('DATA-MODEL') ?? 160, trigger: 'Use when designing data warehouse schemas, analytics tables, dimensional models, or data lake organization. Activate when the user works on reporting databases, star/snowflake schemas, or asks about normalization for analytical workloads.', doNotUse: 'Do not use for OLTP application schemas â€” use BE-DB instead.' },
            { id: 'DATA-QUALITY', name: 'Data validation & monitoring', budget: getDefaultBudget('DATA-QUALITY') ?? 140, trigger: 'Use when implementing data quality checks, anomaly detection, data freshness monitoring, row count validation, or schema drift detection. Activate when the user asks about data reliability, missing values, stale data, or data pipeline health.', doNotUse: 'Do not use for application-level unit or integration testing â€” use QA instead.' },
        ],
    },
    MLE: {
        name: 'ML Engineer',
        capabilities: [
            { id: 'MLE-TRAIN', name: 'Model training & experiment tracking', budget: getDefaultBudget('MLE-TRAIN') ?? 220, trigger: 'Use when training ML models, running experiments, tuning hyperparameters, managing datasets, or tracking experiment results with MLflow/W&B. Activate when the user works on model development, data preprocessing for training, cross-validation, or feature engineering.', doNotUse: 'Do not use for prompt engineering or LLM instruction tuning.' },
            { id: 'MLE-DEPLOY', name: 'Model serving & inference pipeline', budget: getDefaultBudget('MLE-DEPLOY') ?? 180, trigger: 'Use when deploying trained models to production, building inference APIs, optimizing model latency, setting up model versioning, or configuring A/B testing for model variants. Activate when the user asks about serving models, batch inference, or real-time prediction endpoints.', doNotUse: 'Do not use for general REST API development â€” use BE instead.' },
            { id: 'MLE-MONITOR', name: 'Model monitoring & drift detection', budget: getDefaultBudget('MLE-MONITOR') ?? 150, trigger: 'Use when building model monitoring dashboards, drift detectors, prediction distribution tracking, or automated retraining triggers. Activate when the user asks about model performance degradation, data drift, concept drift, or model freshness.', doNotUse: 'Do not use for infrastructure monitoring â€” use DEVOPS-MONITOR instead.' },
        ],
    },
    QA: {
        name: 'Quality Assurance',
        capabilities: [
            { id: 'QA-TEST', name: 'Test & verify acceptance criteria', budget: getDefaultBudget('QA-TEST') ?? 150, trigger: 'Use after implementation to verify that a feature works against its acceptance criteria. Activate when the user asks to "test", "verify", "check if it works", or when validating edge cases, input boundaries, error handling, and cross-browser/cross-device behavior.', doNotUse: 'Do not use during feature planning or initial implementation.' },
            { id: 'QA-REGRESSION', name: 'Regression checklist', budget: getDefaultBudget('QA-REGRESSION') ?? 120, trigger: 'Use before marking a feature as done, before release, or after any significant refactor. Activate when the user asks "did we break anything", "is it safe to ship", or when running the full test suite to detect side effects from recent changes.', doNotUse: 'Do not use for new feature development or design.' },
        ],
    },
    SEC: {
        name: 'Security Auditor',
        capabilities: [
            { id: 'SEC-SCAN', name: 'Basic security check', budget: getDefaultBudget('SEC-SCAN') ?? 140, trigger: 'Use before any feature touching authentication, authorization, PII, financial data, payments, or user credentials. Also activate when the user mentions security concerns, dependency vulnerabilities, secret management, CORS, CSRF, XSS, SQL injection, or asks "is this secure." Trigger proactively when code handles passwords, tokens, API keys, or sensitive user data.', doNotUse: 'Do not use for features with no security-sensitive data or access control implications.' },
            { id: 'SEC-SUPPLY', name: 'Supply chain & dependency audit', budget: getDefaultBudget('SEC-SUPPLY') ?? 140, trigger: 'Use when auditing npm/pip/cargo dependencies for known vulnerabilities, verifying lockfile integrity, or generating SBOMs. Activate when the user mentions dependency security, npm audit, or supply chain attacks.', doNotUse: 'Do not use for application-level functional testing.' },
        ],
    },
    DOCS: {
        name: 'Documentation',
        capabilities: [
            { id: 'DOCS-README', name: 'README & runbook updates', budget: getDefaultBudget('DOCS-README') ?? 130, trigger: 'Use after a feature is done or when the user asks to update documentation, write a README, maintain runbooks, or document API usage. Also activate when onboarding instructions, quick-start guides, or deployment runbooks need updating after infrastructure or feature changes.', doNotUse: 'Do not use during active implementation while code is still changing.' },
            { id: 'DOCS-CHANGELOG', name: 'Changelog', budget: getDefaultBudget('DOCS-CHANGELOG') ?? 100, trigger: 'Use at the end of a feature cycle, before a release, or when the user asks to log what changed. Activate for generating release notes, summarizing shipped work, or maintaining CHANGELOG.md.', doNotUse: 'Do not use mid-feature when implementation is ongoing.' },
            { id: 'DOCS-API', name: 'API documentation', budget: getDefaultBudget('DOCS-API') ?? 130, trigger: 'Use when writing API reference docs, endpoint documentation, request/response examples, or SDK usage guides. Activate when the user asks to document API endpoints or create developer-facing integration guides.', doNotUse: 'Do not use for end-user help articles or marketing copy.' },
        ],
    },
};

export function roleToSlug(role: string): string {
    const baseId = extractRoleId(role);
    const resolved = resolveRole(baseId);
    if (resolved.length > 0) {
        return ROLE_RUNTIME_NAMES[resolved[0]];
    }
    return baseId.toLowerCase();
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
    const baseId = extractRoleId(roleStr);
    const def = getRoleDefinition(roleStr);

    if (!def) {
        return `# ${roleStr} - ${projectName}

## When to Use
- Use when tasks for this role are explicitly requested.

## Instructions
- Read team.md before acting.
`;
    }

    const deepContent = renderDeepSkillContent(baseId);
    const capLines = def.capabilities.map((cap) =>
        `### ${cap.id}: ${cap.name}
- Budget: ${cap.budget} words
- Trigger: ${cap.trigger}
- Do not use: ${cap.doNotUse}`,
    ).join('\n\n');

    return `# ${def.name} - ${projectName}

${deepContent}${renderRoleOverrideGuidance(baseId)}## Capabilities

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
        '- Read ROLE_SKILL_OVERRIDES.md for persistent project-specific role calibration before changing role behavior.',
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

    lines.push('- Skill creator: .claude/skills/skill-creator/SKILL.md');

    for (const role of roles) {
        const baseId = extractRoleId(role);
        const roleName = ROLE_CAPABILITIES[baseId]?.name ?? role;
        lines.push(`- ${roleName}: .claude/skills/${roleToSlug(role)}/SKILL.md`);
    }

    lines.push('');
    lines.push('## Skill Kit');
    lines.push('- Template-first role generation assets are under .stackmoss/skill-kit/');
    lines.push('- skill-creator must adapt local templates before external research.');
    lines.push('');

    return `${lines.join('\n')}\n`;
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

1. Read BRD and lock status.
2. Run validation command.
3. Write pass/fail evidence to data/validation-log.ndjson.
4. Ask owner questions if validation cannot run.
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

1. Validation command cannot run in this environment. Which command should be used?
2. Which negative case command should be used to validate failure handling?
3. Missing credentials or secrets block execution. Which secure source should be used?
4. Which decision remains blocked and who can unblock it?
5. If runtime constraints remain unresolved, should this skill stay in blocked status?
`,
        },
        ...ownerTemplates,
        {
            path: `${skillRoot}/contracts/output-contract.md`,
            content: `# Output Contract

- Always return a concise status summary.
- Include executed command and pass/fail outcome.
- Include negative-path result.
- If failed, include remediation proposal and blocking reason.
`,
        },
        {
            path: `${skillRoot}/governance/evolution.md`,
            content: `# Governance

- Runtime boundary: this skill can modify only ${runtimeName} skill paths.
- Replace-only policy for generated instructions.
- Track validation evidence in the local data layer.
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

export function compileClaudeCodeV2(
    roles: string[],
    autoAddedRoles: string[],
    projectName: string,
): GeneratedFile[] {
    return compileClaudeCode(roles, autoAddedRoles, projectName);
}

export function compileClaudeCode(
    roles: string[],
    autoAddedRoles: string[],
    projectName: string,
): GeneratedFile[] {
    const allRoles = uniqueRoles(roles, autoAddedRoles);
    const files: GeneratedFile[] = [
        {
            path: 'CLAUDE.md',
            content: renderClaudeMd(allRoles, projectName),
        },
        {
            path: '.claude/skills/skill-creator/SKILL.md',
            content: `---
name: skill-creator
description: Runtime-specific skill factory for Claude. Generates only .claude/skills/* bundles using the 3-layer + 9-layer structure.
---

# Skill Creator - ${projectName}

## Scope
- Create or update Claude runtime skills only under .claude/skills/*
- Follow the 3-layer + 9-layer structure for each generated skill
- Use template-first flow via .stackmoss/skill-kit before researching external sources

## Workflow
1. Resolve target role and runtime boundary.
2. Read BRD (NORTH_STAR.md) to identify project stack, constraints, and deployment target.
3. Score template using .stackmoss/skill-kit/shared/insufficiency-gate.md.
4. If score >= 4, adapt local templates from .stackmoss/skill-kit/roles/* + shared/*.
5. Use Frontend package as template-depth benchmark: .stackmoss/skill-kit/roles/frontend.template.md + frontend.skill-pack.md + frontend.DESIGN.template.md.
6. If score <= 3, research sources from .stackmoss/skill-kit/sources-registry.md and log adoption to data/source-adoption-log.md.
7. Mode selection â€” read the skill-pack for the target role and score each mode against BRD:
   - Required: mode matches project stack or BRD constraints. Include in output.
   - Skip: mode is irrelevant to project (e.g. Kubernetes mode when project deploys to Vercel). Exclude entirely.
   - For each included mode, prune stack references and patterns to only project-relevant items.
8. Generate multi-file output under .claude/skills/<role>/... following the Output Structure below.
9. Run validation command and one negative-path command, then write result to data/validation-log.ndjson.
10. If validation cannot run, ask owner questions and keep blocked status.

## Output Structure (3/9 Layer â€” Multi-File)
Generated skill MUST be multi-file. Agent reads selectively per task, not all at once.

### Layer 1 â€” SKILL.md (agent reads this for EVERY task)
Keep under 400 tokens. Contains only:
- Frontmatter (name, description)
- Mission (1 line)
- Iron Law (1 line)
- Activation trigger rules (when to use / when not to use)
- Mode index: list each generated mode with its file path and 1-line trigger description
- The mode index tells the agent WHICH file to read next based on the current task

### Layer 2 â€” modes/*.md (agent reads ONLY the mode matching current task)
- One file per active mode selected in step 7
- Each mode file is self-contained: workflow steps, patterns, anti-patterns, checklist
- Agent reads only the relevant mode file, never all modes at once

### Layer 3-9 â€” Supporting files (agent reads on demand)
- references/: stack tables, external URLs, layer-map â€” read when researching
- examples/: session examples, code snippets â€” read when learning patterns
- scripts/: executable validation scripts â€” run during validation step
- assets/templates/: deliverable templates â€” read when generating outputs
- contracts/: output contracts, quality gates â€” read when finalizing deliverables
- governance/: runtime boundary rules â€” read when checking constraints
- data/: validation logs, research cutoff, source adoption â€” written during execution

## Validation
- Command(s): node scripts/validate-and-log.mjs "<command>" data/validation-log.ndjson
- Required evidence: command result + negative-path result + pass/fail record.

## Fallback
- If validation cannot run, ask owner questions and keep status blocked.

## Quality Gate
- Generated skill must follow multi-file structure: thin SKILL.md + modes/*.md + supporting layers.
- Generated skill must include Iron Law and >=3 workflow phases.
- Generated skill must include rationalization defenses and blocked-state logic.
- Mode selection must reference BRD â€” no mode included without BRD justification.
- Runtime boundary must remain inside .claude/skills/*.
`,
        },
    ];

    for (const role of canonicalUniqueRoles(roles, autoAddedRoles)) {
        const slug = roleToSlug(role);
        files.push({
            path: `.claude/skills/${slug}/SKILL.md`,
            content: renderSkillFile(role, projectName),
        });
        const baseId = extractRoleId(role);
        if (baseId === 'PM' || baseId === 'TL') {
            files.push(
                ...renderThreeNineSupportFiles(
                    `.claude/skills/${slug}`,
                    'ClaudeCode',
                    baseId === 'PM' ? 'product-manager' : 'tech-lead',
                ),
            );
        }
    }

    files.push(
        ...renderThreeNineSupportFiles(
            '.claude/skills/skill-creator',
            'ClaudeCode',
            'skill-creator',
        ),
    );

    return files;
}
