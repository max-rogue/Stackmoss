/**
 * Template: team.md
 * Authority: BRD §9.2 (full schema)
 *
 * The most complex template — contains CONSTITUTION, ROLES,
 * WORKING CONTRACT, and PROJECT_FACTS sections.
 *
 * Pure function, string interpolation only, no LLM.
 */

import type { GeneratedFile, TemplateInput } from './types.js';
import { getCapabilitiesForRole, getDefaultBudget } from '../budgets.js';

// ─── Role Definitions (from BRD §9.2) ───────────────────────────

interface Capability {
    id: string;
    name: string;
    budget: number;
    priority: 'high' | 'medium' | 'low';
    trigger: string;
    doNotUse: string;
    note?: string;
}

interface RoleDefinition {
    id: string;
    name: string;
    lead: boolean;
    ceremony: 'high' | 'medium' | 'low';
    description: string;
    condition?: string;
    capabilities: Capability[];
}

const ROLE_DEFINITIONS: Record<string, RoleDefinition> = {
    TL: {
        id: 'TL',
        name: 'Tech Lead',
        lead: true,
        ceremony: 'medium',
        description:
            'Quản lý kiến trúc, review code, maintain CONTEXT.md và FEATURES.md,\n  break down task từ feature sang subtasks, resolve conflict giữa agents.',
        capabilities: [
            {
                id: 'TL-ARCH',
                name: 'Architecture decisions & ADR',
                budget: getDefaultBudget('TL-ARCH') ?? 220,
                priority: 'high',
                trigger: 'Use when architecture decision or design pattern needed',
                doNotUse: 'Do not use for routine implementation tasks',
            },
            {
                id: 'TL-REVIEW',
                name: 'Code review & merge gates',
                budget: getDefaultBudget('TL-REVIEW') ?? 180,
                priority: 'high',
                trigger: 'Use when code needs review before merge/deploy',
                doNotUse: 'Do not use for first-draft implementation',
            },
            {
                id: 'TL-CONTEXT',
                name: 'Maintain CONTEXT.md & FEATURES.md',
                budget: getDefaultBudget('TL-CONTEXT') ?? 150,
                priority: 'medium',
                trigger: 'Use after completing a feature or major decision',
                doNotUse: 'Do not use mid-task',
            },
            {
                id: 'TL-PLAN',
                name: 'Break down features & assign subtasks',
                budget: getDefaultBudget('TL-PLAN') ?? 160,
                priority: 'high',
                trigger: 'Use at start of each feature cycle',
                doNotUse: 'Do not use during implementation',
            },
        ],
    },
    BA: {
        id: 'BA',
        name: 'Business Analyst',
        lead: false,
        ceremony: 'medium',
        condition: 'Chỉ có ở BizLed pack',
        description: '',
        capabilities: [
            {
                id: 'BA-REQ',
                name: 'Requirements elicitation & clarification',
                budget: getDefaultBudget('BA-REQ') ?? 180,
                priority: 'high',
                trigger: 'Use when requirements are unclear or conflicting',
                doNotUse: 'Do not use for technical decisions',
            },
            {
                id: 'BA-AC',
                name: 'Acceptance criteria writing',
                budget: getDefaultBudget('BA-AC') ?? 150,
                priority: 'high',
                trigger: 'Use at start of feature to define pass/fail',
                doNotUse: 'Do not use during implementation',
            },
        ],
    },
    DEV: {
        id: 'DEV',
        name: 'Developer',
        lead: false,
        ceremony: 'low',
        description: '',
        capabilities: [
            {
                id: 'DEV-IMPL',
                name: 'Feature implementation',
                budget: getDefaultBudget('DEV-IMPL') ?? 200,
                priority: 'high',
                trigger: 'Use when implementing code for a feature',
                doNotUse: 'Do not use for architecture decisions',
            },
            {
                id: 'DEV-ENV',
                name: 'Environment & command knowledge',
                budget: getDefaultBudget('DEV-ENV') ?? 160,
                priority: 'high',
                trigger: 'Use when running commands, checking paths, managing env',
                doNotUse: 'Do not use for business logic decisions',
                note: 'Phần này được patch nhiều nhất — giữ commands đúng cho env này',
            },
            {
                id: 'DEV-DEBUG',
                name: 'Debug & error resolution',
                budget: getDefaultBudget('DEV-DEBUG') ?? 150,
                priority: 'medium',
                trigger: 'Use when encountering errors or unexpected behavior',
                doNotUse: 'Do not use for new feature planning',
            },
        ],
    },
    QA: {
        id: 'QA',
        name: 'Quality Assurance',
        lead: false,
        ceremony: 'low',
        description: '',
        capabilities: [
            {
                id: 'QA-TEST',
                name: 'Test & verify acceptance criteria',
                budget: getDefaultBudget('QA-TEST') ?? 150,
                priority: 'high',
                trigger: 'Use after implementation to verify feature works',
                doNotUse: 'Do not use during planning',
            },
            {
                id: 'QA-REGRESSION',
                name: 'Regression checklist',
                budget: getDefaultBudget('QA-REGRESSION') ?? 120,
                priority: 'medium',
                trigger: 'Use before marking feature DONE',
                doNotUse: 'Do not use for new feature development',
            },
        ],
    },
    DOCS: {
        id: 'DOCS',
        name: 'Documentation',
        lead: false,
        ceremony: 'low',
        description: '',
        capabilities: [
            {
                id: 'DOCS-README',
                name: 'README & runbook updates',
                budget: getDefaultBudget('DOCS-README') ?? 130,
                priority: 'low',
                trigger: 'Use after feature is DONE',
                doNotUse: 'Do not use during implementation',
            },
            {
                id: 'DOCS-CHANGELOG',
                name: 'Changelog',
                budget: getDefaultBudget('DOCS-CHANGELOG') ?? 100,
                priority: 'low',
                trigger: 'Use at end of feature cycle',
                doNotUse: 'Do not use mid-feature',
            },
        ],
    },
    SEC: {
        id: 'SEC',
        name: 'Security-lite',
        lead: false,
        ceremony: 'low',
        condition: 'Auto-add khi Q5/Q6 = PII | Finance | Compliance',
        description: '',
        capabilities: [
            {
                id: 'SEC-SCAN',
                name: 'Basic security check',
                budget: getDefaultBudget('SEC-SCAN') ?? 140,
                priority: 'high',
                trigger: 'Use before any feature touching auth, PII, or financial data',
                doNotUse: 'Do not use for non-sensitive features',
            },
        ],
    },
    OPS: {
        id: 'OPS',
        name: 'DevOps-lite',
        lead: false,
        ceremony: 'low',
        condition: 'Auto-add khi deploy target = VPS | Cloud AND audience = SME | Enterprise',
        description: '',
        capabilities: [
            {
                id: 'OPS-DEPLOY',
                name: 'Deploy & infra checks',
                budget: getDefaultBudget('OPS-DEPLOY') ?? 140,
                priority: 'medium',
                trigger: 'Use before deploy or infra changes',
                doNotUse: 'Do not use for feature development',
            },
        ],
    },
    FE: {
        id: 'FE',
        name: 'Frontend Developer',
        lead: false,
        ceremony: 'low',
        description: 'Builds UI components, layouts, styling, and ensures accessibility/responsiveness.',
        capabilities: [
            {
                id: 'FE-UI',
                name: 'Component & layout implementation',
                budget: getDefaultBudget('FE-UI') ?? 200,
                priority: 'high',
                trigger: 'Use when building UI components, pages, or interactive elements',
                doNotUse: 'Do not use for API endpoints or database work',
            },
            {
                id: 'FE-STYLE',
                name: 'CSS, design system & theming',
                budget: getDefaultBudget('FE-STYLE') ?? 160,
                priority: 'medium',
                trigger: 'Use when implementing design tokens, CSS architecture, or responsive layouts',
                doNotUse: 'Do not use for backend logic',
            },
            {
                id: 'FE-A11Y',
                name: 'Accessibility & responsive design',
                budget: getDefaultBudget('FE-A11Y') ?? 120,
                priority: 'medium',
                trigger: 'Use when auditing or fixing a11y, ARIA, keyboard nav, or mobile responsiveness',
                doNotUse: 'Do not use for first-draft implementation',
            },
        ],
    },
    BE: {
        id: 'BE',
        name: 'Backend Developer',
        lead: false,
        ceremony: 'low',
        description: 'Builds REST/GraphQL APIs, database schemas, migrations, auth flows.',
        capabilities: [
            {
                id: 'BE-API',
                name: 'API endpoints & business logic',
                budget: getDefaultBudget('BE-API') ?? 200,
                priority: 'high',
                trigger: 'Use when implementing REST/GraphQL endpoints, DTOs, or service logic',
                doNotUse: 'Do not use for UI components or styling',
            },
            {
                id: 'BE-DB',
                name: 'Database schema, migrations & queries',
                budget: getDefaultBudget('BE-DB') ?? 180,
                priority: 'high',
                trigger: 'Use when designing schemas, writing migrations, or optimizing queries',
                doNotUse: 'Do not use for frontend work',
            },
            {
                id: 'BE-AUTH',
                name: 'Authentication & authorization',
                budget: getDefaultBudget('BE-AUTH') ?? 160,
                priority: 'high',
                trigger: 'Use when implementing auth flows, session management, RBAC, or token handling',
                doNotUse: 'Do not use for non-auth features',
            },
        ],
    },
    FS: {
        id: 'FS',
        name: 'Fullstack Developer',
        lead: false,
        ceremony: 'low',
        description: 'Bridges frontend and backend — API wiring, project scaffolding, performance optimization.',
        capabilities: [
            {
                id: 'FS-INTEGRATE',
                name: 'API-to-UI integration & data flow',
                budget: getDefaultBudget('FS-INTEGRATE') ?? 200,
                priority: 'high',
                trigger: 'Use when wiring API calls to UI, handling state management, or data fetching',
                doNotUse: 'Do not use for architecture decisions',
            },
            {
                id: 'FS-SCAFFOLD',
                name: 'Project setup & boilerplate',
                budget: getDefaultBudget('FS-SCAFFOLD') ?? 160,
                priority: 'medium',
                trigger: 'Use when scaffolding new modules, setting up routing, or configuring build tools',
                doNotUse: 'Do not use mid-feature',
            },
            {
                id: 'FS-OPTIMIZE',
                name: 'Performance & caching',
                budget: getDefaultBudget('FS-OPTIMIZE') ?? 140,
                priority: 'medium',
                trigger: 'Use when optimizing load times, bundle size, caching strategies, or SSR/SSG',
                doNotUse: 'Do not use for first-pass implementation',
            },
        ],
    },
    MOBILE: {
        id: 'MOBILE',
        name: 'Mobile Developer',
        lead: false,
        ceremony: 'low',
        description: 'Native and cross-platform mobile development — React Native, Flutter, Swift, Kotlin.',
        capabilities: [
            {
                id: 'MOBILE-NATIVE',
                name: 'Platform UI & navigation',
                budget: getDefaultBudget('MOBILE-NATIVE') ?? 200,
                priority: 'high',
                trigger: 'Use when building native screens, navigation flows, or platform-specific UI',
                doNotUse: 'Do not use for web-only features',
            },
            {
                id: 'MOBILE-PERF',
                name: 'Bundle size, memory & battery',
                budget: getDefaultBudget('MOBILE-PERF') ?? 150,
                priority: 'medium',
                trigger: 'Use when optimizing app size, reducing memory leaks, or improving battery usage',
                doNotUse: 'Do not use for feature implementation',
            },
            {
                id: 'MOBILE-DEVICE',
                name: 'Sensors, storage & permissions',
                budget: getDefaultBudget('MOBILE-DEVICE') ?? 140,
                priority: 'medium',
                trigger: 'Use when integrating camera, GPS, local storage, push notifications, or permission flows',
                doNotUse: 'Do not use for UI layout work',
            },
        ],
    },
    DEVOPS: {
        id: 'DEVOPS',
        name: 'DevOps Engineer',
        lead: false,
        ceremony: 'low',
        description: 'CI/CD pipelines, infrastructure as code, containerization, monitoring.',
        capabilities: [
            {
                id: 'DEVOPS-CI',
                name: 'CI/CD pipeline & build automation',
                budget: getDefaultBudget('DEVOPS-CI') ?? 180,
                priority: 'high',
                trigger: 'Use when setting up GitHub Actions, build pipelines, or automated deployments',
                doNotUse: 'Do not use for feature code',
            },
            {
                id: 'DEVOPS-INFRA',
                name: 'Docker, K8s & cloud infrastructure',
                budget: getDefaultBudget('DEVOPS-INFRA') ?? 160,
                priority: 'high',
                trigger: 'Use when writing Dockerfiles, Compose configs, Terraform, or cloud service setup',
                doNotUse: 'Do not use for application logic',
            },
            {
                id: 'DEVOPS-MONITOR',
                name: 'Logging, alerting & observability',
                budget: getDefaultBudget('DEVOPS-MONITOR') ?? 140,
                priority: 'medium',
                trigger: 'Use when setting up log aggregation, health checks, alerting, or APM',
                doNotUse: 'Do not use for feature development',
            },
        ],
    },
    DATA: {
        id: 'DATA',
        name: 'Data Engineer',
        lead: false,
        ceremony: 'low',
        description: 'Data pipelines, ETL, schema design, data quality, ML/AI data workflows.',
        capabilities: [
            {
                id: 'DATA-PIPELINE',
                name: 'ETL, ingestion & transformation',
                budget: getDefaultBudget('DATA-PIPELINE') ?? 180,
                priority: 'high',
                trigger: 'Use when building data ingestion pipelines, transformations, or batch jobs',
                doNotUse: 'Do not use for UI or API work',
            },
            {
                id: 'DATA-MODEL',
                name: 'Schema design & normalization',
                budget: getDefaultBudget('DATA-MODEL') ?? 160,
                priority: 'high',
                trigger: 'Use when designing data models, warehouse schemas, or analytics tables',
                doNotUse: 'Do not use for OLTP application schemas (use BE-DB)',
            },
            {
                id: 'DATA-QUALITY',
                name: 'Data validation & monitoring',
                budget: getDefaultBudget('DATA-QUALITY') ?? 140,
                priority: 'medium',
                trigger: 'Use when implementing data quality checks, anomaly detection, or data testing',
                doNotUse: 'Do not use for application-level testing (use QA)',
            },
        ],
    },
    PE: {
        id: 'PE',
        name: 'Prompt Engineer',
        lead: false,
        ceremony: 'low',
        description: 'System prompt design, eval harness, LLM chain orchestration.',
        capabilities: [
            {
                id: 'PE-PROMPT',
                name: 'System prompt design & iteration',
                budget: getDefaultBudget('PE-PROMPT') ?? 180,
                priority: 'high',
                trigger: 'Use when writing or refining system prompts, few-shot examples, or instruction tuning',
                doNotUse: 'Do not use for non-LLM features',
            },
            {
                id: 'PE-EVAL',
                name: 'Eval harness & benchmarking',
                budget: getDefaultBudget('PE-EVAL') ?? 150,
                priority: 'high',
                trigger: 'Use when building eval cases, grading rubrics, or benchmark suites for LLM outputs',
                doNotUse: 'Do not use for application testing (use QA)',
            },
            {
                id: 'PE-CHAIN',
                name: 'Chain & agent orchestration',
                budget: getDefaultBudget('PE-CHAIN') ?? 140,
                priority: 'medium',
                trigger: 'Use when building multi-step LLM chains, tool-use flows, or agent routing logic',
                doNotUse: 'Do not use for simple API calls',
            },
        ],
    },
    UIUX: {
        id: 'UIUX',
        name: 'UI/UX Designer',
        lead: false,
        ceremony: 'low',
        description: 'Design systems, wireframes, prototyping, usability audits.',
        capabilities: [
            {
                id: 'UIUX-DESIGN',
                name: 'Design system tokens & wireframes',
                budget: getDefaultBudget('UIUX-DESIGN') ?? 180,
                priority: 'high',
                trigger: 'Use when defining color palettes, typography scales, spacing tokens, or page wireframes',
                doNotUse: 'Do not use for implementation code',
            },
            {
                id: 'UIUX-PROTO',
                name: 'Interactive prototype & animation',
                budget: getDefaultBudget('UIUX-PROTO') ?? 160,
                priority: 'medium',
                trigger: 'Use when building click-through prototypes, micro-animations, or interaction specs',
                doNotUse: 'Do not use for production code',
            },
            {
                id: 'UIUX-REVIEW',
                name: 'Usability audit & heuristic review',
                budget: getDefaultBudget('UIUX-REVIEW') ?? 140,
                priority: 'medium',
                trigger: 'Use when reviewing implemented UI against design specs, heuristics, or user flows',
                doNotUse: 'Do not use for functional testing (use QA)',
            },
        ],
    },
    PM: {
        id: 'PM',
        name: 'Product Manager',
        lead: false,
        ceremony: 'high',
        description: 'Owns the product roadmap, prioritizes features, and aligns stakeholders.',
        capabilities: [
            {
                id: 'PM-ROADMAP',
                name: 'Roadmap & feature prioritization',
                budget: getDefaultBudget('PM-ROADMAP') ?? 180,
                priority: 'high',
                trigger: 'Use when defining product roadmap, prioritizing backlog, or scoping feature releases',
                doNotUse: 'Do not use for technical architecture decisions (use TL)',
            },
            {
                id: 'PM-PRIORITIZE',
                name: 'Impact analysis & trade-off decisions',
                budget: getDefaultBudget('PM-PRIORITIZE') ?? 150,
                priority: 'high',
                trigger: 'Use when evaluating feature trade-offs, cost-benefit, or go/no-go decisions',
                doNotUse: 'Do not use for implementation planning',
            },
            {
                id: 'PM-STAKEHOLDER',
                name: 'Stakeholder communication & alignment',
                budget: getDefaultBudget('PM-STAKEHOLDER') ?? 150,
                priority: 'medium',
                trigger: 'Use when preparing status reports, demo scripts, or stakeholder presentations',
                doNotUse: 'Do not use for technical documentation (use DOCS)',
            },
        ],
    },
    MLE: {
        id: 'MLE',
        name: 'ML Engineer',
        lead: false,
        ceremony: 'low',
        description: 'Trains, deploys, and monitors machine learning models in production.',
        capabilities: [
            {
                id: 'MLE-TRAIN',
                name: 'Model training & experiment tracking',
                budget: getDefaultBudget('MLE-TRAIN') ?? 220,
                priority: 'high',
                trigger: 'Use when training models, running experiments, or tuning hyperparameters',
                doNotUse: 'Do not use for prompt engineering (use PE)',
            },
            {
                id: 'MLE-DEPLOY',
                name: 'Model serving & inference pipeline',
                budget: getDefaultBudget('MLE-DEPLOY') ?? 180,
                priority: 'high',
                trigger: 'Use when deploying models to production, building inference APIs, or optimizing latency',
                doNotUse: 'Do not use for general API development (use BE)',
            },
            {
                id: 'MLE-MONITOR',
                name: 'Model monitoring & drift detection',
                budget: getDefaultBudget('MLE-MONITOR') ?? 150,
                priority: 'medium',
                trigger: 'Use when building monitoring dashboards, drift detectors, or retraining triggers',
                doNotUse: 'Do not use for infrastructure monitoring (use DEVOPS)',
            },
        ],
    },
    BRAND: {
        id: 'BRAND',
        name: 'Brand / Graphic Designer',
        lead: false,
        ceremony: 'low',
        description: 'Defines brand identity, creates visual assets, and maintains brand guidelines.',
        capabilities: [
            {
                id: 'BRAND-IDENTITY',
                name: 'Brand identity & style guide',
                budget: getDefaultBudget('BRAND-IDENTITY') ?? 180,
                priority: 'high',
                trigger: 'Use when defining brand colors, typography, logo usage, or tone of voice',
                doNotUse: 'Do not use for UI component design (use UIUX)',
            },
            {
                id: 'BRAND-ASSETS',
                name: 'Visual asset creation',
                budget: getDefaultBudget('BRAND-ASSETS') ?? 160,
                priority: 'medium',
                trigger: 'Use when creating illustrations, icons, social media graphics, or marketing visuals',
                doNotUse: 'Do not use for wireframes or prototypes (use UIUX)',
            },
            {
                id: 'BRAND-GUIDE',
                name: 'Brand guideline documentation',
                budget: getDefaultBudget('BRAND-GUIDE') ?? 140,
                priority: 'medium',
                trigger: 'Use when documenting brand standards, asset usage rules, or brand voice guidelines',
                doNotUse: 'Do not use for technical documentation (use DOCS)',
            },
        ],
    },
};

// ─── Helpers ─────────────────────────────────────────────────────

/**
 * Extract base role ID from a role string that may have qualifiers.
 * e.g. "QA(light)" → "QA", "TL(guide)" → "TL", "DEVOPS" → "DEVOPS"
 */
export function extractRoleId(role: string): string {
    const match = role.match(/^([A-Z]+)/);
    return match ? match[1] : role;
}

/**
 * Get qualifier from role string (if any).
 * e.g. "QA(light)" → "light", "TL" → undefined
 */
function getQualifier(role: string): string | undefined {
    const match = role.match(/\(([^)]+)\)/);
    return match ? match[1] : undefined;
}

function renderCapability(cap: Capability): string {
    let result = `- [${cap.id}] ${cap.name}\n`;
    result += `  budget: ${cap.budget}\n`;
    result += `  priority: ${cap.priority}\n`;
    result += `  trigger: "${cap.trigger}"\n`;
    result += `  do_not_use: "${cap.doNotUse}"`;
    if (cap.note) {
        result += `\n  _note: "${cap.note}"_`;
    }
    return result;
}

function renderRole(roleStr: string): string {
    const baseId = extractRoleId(roleStr);
    const qualifier = getQualifier(roleStr);
    const def = ROLE_DEFINITIONS[baseId];
    const allowedCapabilities = new Set(getCapabilitiesForRole(roleStr));

    if (!def) {
        return `### [${baseId}] ${roleStr}\nlead: false\nceremony: low\n`;
    }

    let result = `### [${def.id}] ${def.name}\n`;
    if (def.condition) {
        result += `_${def.condition}_\n`;
    }
    if (qualifier) {
        result += `_Variant: ${qualifier}_\n`;
    }
    result += `lead: ${def.lead}\n`;
    result += `ceremony: ${def.ceremony}\n`;
    if (def.description) {
        result += `description: >\n  ${def.description}\n`;
    }
    result += '\n#### Capabilities\n';
    result += def.capabilities
        .filter((cap) => allowedCapabilities.size === 0 || allowedCapabilities.has(cap.id))
        .map(renderCapability)
        .join('\n\n');

    return result;
}

// ─── Generator ───────────────────────────────────────────────────

export function generateTeam(input: TemplateInput): GeneratedFile {
    const { projectName, version, intake } = input;

    // Combine roles + autoAddedRoles, deduplicate by base ID
    const allRoles = [...intake.roles];
    for (const autoRole of intake.autoAddedRoles) {
        const baseId = extractRoleId(autoRole);
        if (!allRoles.some((r) => extractRoleId(r) === baseId)) {
            allRoles.push(autoRole);
        }
    }

    const rolesSection = allRoles.map(renderRole).join('\n\n---\n\n');

    const content = `# Team Config — ${projectName}
_Generated by StackMoss v${version} | State: GLOBAL | Target: ClaudeCode_

---

## CONSTITUTION
> Phần này là "luật chung" — stackmoss upgrade chỉ merge section này.
> Không được xóa hoặc rename section header.

### Governance Rules
- replace-only: true (không append vào config)
- budget-enforcement: hard (vượt budget → trim trước khi ghi)
- suggest-only: true (đề xuất hành động, không tự thực hiện)
- no-destructive-tools: true (không rm -rf, không drop table, không force push)
- no-secret-persistence: true (không ghi token/password/API key/credential vào config, patch proposal, hoặc docs generated)

### Update Triggers (khi nào được phép patch)
- Command trong config fail với exit code ≠ 0 VÀ đã tìm được command đúng
- Path trong config không tồn tại VÀ đã resolve được path đúng
- Cùng lỗi lặp lại ≥ 2 lần trong session với cùng nguyên nhân gốc
- Tech Lead explicit ra lệnh "ghi nhớ điều này"

### Patch Rules
- Tìm section/capability chứa thông tin cũ → rewrite section đó
- Content length sau patch phải ≤ content length trước patch
- Không được tạo section mới để lưu note/log
- Sau khi patch → verify lại command/path đó hoạt động
- Nếu stderr/log chứa secret → redact trước khi lưu vào proposal/report

---

## ROLES

${rolesSection}

---

## WORKING CONTRACT

### Definition of Done (per feature)
- [ ] Acceptance criteria trong FEATURES.md pass
- [ ] QA regression checklist pass
- [ ] TL review approved
- [ ] FEATURES.md status updated → DONE
- [ ] CHANGELOG cập nhật

### Escalation Rules
- Nếu agent bị stuck > 3 lần với cùng vấn đề → báo cáo lên TL
- Nếu TL không resolve → ghi vào OPEN_QUESTIONS.md, chờ human input
- Không tự expand scope của feature đang làm

### Review Gates
- Trước merge: implementation role → QA → TL
- Trước deploy: TL + hàng deploy/infrastructure (OPS-lite hoặc DEVOPS nếu có)
- Trước feature start: TL break down → BA confirm AC (nếu BizLed)

### Config Maintenance
- Trước khi ship feature thật: TL phải xác nhận BRD/NORTH_STAR đã khóa; nếu chưa khóa thì F1 trở thành "lock BRD + constraints"
- Sau khi BRD đã khóa và repo đã được scan: TL phải điều chỉnh lại agent team theo stack, topology, và số lane thực tế của dự án
- Calibration status: bootstrap pending TL recalibration after BRD lock + repo scan
- TL là writer duy nhất của team config; các role khác chỉ được đề xuất signal đã verify, không tự sửa config chung
- Mọi update config phải replace thông tin sai bằng thông tin đúng trong section hiện có; không append lịch sử, không tạo memory log mới
- Mọi patch config phải hỏi user trước khi apply; không agent nào được tự update liên tục không kiểm soát

---

## PROJECT_FACTS
> Section này được inject và update bởi stackmoss inject/patch.
> stackmoss upgrade KHÔNG được touch section này.

### Environment (populated by inject)
- Package manager: TBD
- Run command: TBD
- Build command: TBD
- Test command: TBD
- Known paths: TBD

### Tech Stack (populated by inject)
- Framework: TBD
- Database: TBD
- Deploy target: TBD

### Known Issues (populated by patch)
_(trống khi init, được update dần)_
`;

    return {
        path: 'team.md',
        content,
    };
}
