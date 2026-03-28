import type { GeneratedFile, TemplateInput } from './types.js';

interface RoleTemplate {
    slug: string;
    title: string;
    mission: string;
    trigger: string;
    deliverables: string[];
    mustTest: string[];
    extraProtocol?: string;
    forbiddenPatterns?: string[];
    references?: string[];
}

const ROLE_TEMPLATES: RoleTemplate[] = [
    {
        slug: 'developer',
        title: 'Developer',
        mission: 'Implement feature slices with deterministic verification and minimal blast radius.',
        trigger: 'Use for application code implementation, refactor, and bug fixes inside one module boundary.',
        deliverables: ['implementation plan', 'code diff summary', 'verification evidence'],
        mustTest: ['targeted unit tests', 'feature acceptance path'],
    },
    {
        slug: 'frontend',
        title: 'Frontend',
        mission: 'Ship UI behavior, state handling, and user-facing reliability across device sizes.',
        trigger: 'Use for component/page implementation, interaction logic, styling integration, and accessibility fixes.',
        deliverables: ['UI scope checklist', 'component changeset summary', 'responsive and a11y verification notes'],
        mustTest: ['component-level tests', 'critical interaction smoke tests'],
    },
    {
        slug: 'backend',
        title: 'Backend',
        mission: 'Deliver API and service logic that is correct, observable, and safe to evolve.',
        trigger: 'Use for endpoint changes, domain service logic, persistence access, and contract updates.',
        deliverables: ['API contract delta', 'data impact notes', 'rollback and migration notes'],
        mustTest: ['service or integration tests', 'contract or schema compatibility checks'],
    },
    {
        slug: 'devops',
        title: 'DevOps',
        mission: 'Keep build, deploy, and runtime operations stable while improving delivery speed.',
        trigger: 'Use for CI/CD pipelines, infra config, deployment automation, and runtime diagnostics.',
        deliverables: ['pipeline or infra change plan', 'operational risk list', 'deploy verification checklist'],
        mustTest: ['pipeline smoke checks', 'deployment and rollback validation'],
    },
    {
        slug: 'qa',
        title: 'Quality Assurance',
        mission: 'Protect release quality with acceptance checks, regression coverage, and risk-focused testing.',
        trigger: 'Use for acceptance verification, regression strategy, exploratory checks, and release gates.',
        deliverables: ['test scope matrix', 'defect evidence and severity', 'ship or block verdict'],
        mustTest: ['acceptance criteria checks', 'high-risk regression suite'],
    },
    {
        slug: 'uiux',
        title: 'UIUX Designer',
        mission: 'Improve product clarity and usability through structured UX decisions and design quality reviews.',
        trigger: 'Use for flow design, information architecture, interaction design, and visual quality audit.',
        deliverables: [
            'design audit report (typography, color, layout, interaction, content)',
            'token proposal (color, typography, spacing, radius, motion)',
            'state matrix (loading, empty, error, success, disabled)',
            'handoff package for FE with implementation-ready acceptance checks',
        ],
        mustTest: [
            'critical user journey walkthrough',
            'accessibility and readability audit',
            'responsive behavior check (mobile/tablet/desktop)',
            'anti-generic quality gate review against banned patterns',
        ],
        extraProtocol: `### Design Atmosphere Dials
- Before adapting this role, load .stackmoss/skill-kit/roles/uiux.skill-pack.md and select active modes.
- Mandatory modes: design-taste-core and output-discipline.
- Optional modes by BRD: redesign-existing-projects, high-end-visual-design, stitch-design-taste.

- DESIGN_VARIANCE (1-10): controls layout asymmetry and structural experimentation.
- MOTION_INTENSITY (1-10): controls animation complexity and choreography density.
- VISUAL_DENSITY (1-10): controls information density and whitespace appetite.

Set baseline by product type:
- Marketing or brand pages: variance 7-8, motion 5-6, density 3-4.
- SaaS dashboards: variance 3-4, motion 3-4, density 6-8.
- Internal tools: variance 2-3, motion 2-3, density 7-8.

### UIUX Audit Flow (Before New Design)
1. Typography audit:
- hierarchy clarity, line length, line height, numeric readability, font personality.
2. Color and surface audit:
- accent discipline, grayscale consistency, contrast, depth cues, background atmosphere.
3. Layout and rhythm audit:
- section structure, alignment rhythm, breakpoints, optical corrections.
4. Interaction and state audit:
- hover/active/focus behavior, loading/empty/error states, transition quality.
5. Content realism audit:
- avoid placeholder names and fake round metrics, enforce contextual copy.

### Handoff Contract to Engineering
- Provide explicit component inventory and state matrix per screen.
- Provide token decisions with semantic naming and fallback values.
- Provide interaction specs with timing and easing.
- Provide acceptance checks that QA can run without design interpretation.`,
        forbiddenPatterns: [
            'Defaulting to generic typography stacks for premium or creative UI without justification.',
            'Using purple-neon gradient aesthetics as a default visual identity.',
            'Using a generic 3-equal-card feature row when layout variance is expected.',
            'Using h-screen for hero or full-height sections instead of mobile-safe viewport units.',
            'Shipping screens without loading, empty, and error states.',
            'Using placeholder content patterns (Acme, John Doe, Lorem Ipsum, fake round metrics) in final UX.',
        ],
        references: [
            'https://github.com/Leonxlnx/taste-skill',
            'https://github.com/Leonxlnx/taste-skill/tree/main/skills/taste-skill',
            'https://github.com/Leonxlnx/taste-skill/tree/main/skills/redesign-skill',
            'https://github.com/Leonxlnx/taste-skill/tree/main/skills/minimalist-skill',
            'https://github.com/Leonxlnx/taste-skill/tree/main/skills/soft-skill',
            'https://github.com/Leonxlnx/taste-skill/tree/main/skills/stitch-skill',
            'https://github.com/Leonxlnx/taste-skill/tree/main/skills/stitch-skill/DESIGN.md',
            'https://github.com/Leonxlnx/taste-skill/tree/main/skills/output-skill',
        ],
    },
    {
        slug: 'security',
        title: 'Security',
        mission: 'Reduce exploit surface and protect sensitive flows with pragmatic controls.',
        trigger: 'Use for auth, permission boundaries, secret handling, dependency risk, and abuse-path checks.',
        deliverables: ['threat and abuse notes', 'security control checklist', 'residual risk statement'],
        mustTest: ['auth and permission boundary checks', 'secret exposure and dependency scan'],
    },
    {
        slug: 'data-engineer',
        title: 'Data Engineer',
        mission: 'Maintain trustworthy data flow from ingestion to transformation and downstream consumption.',
        trigger: 'Use for ETL or ELT pipelines, data contracts, warehouse models, and data quality checks.',
        deliverables: ['pipeline contract notes', 'schema evolution plan', 'data quality evidence'],
        mustTest: ['pipeline run validation', 'freshness and quality assertions'],
    },
    {
        slug: 'ml-engineer',
        title: 'ML Engineer',
        mission: 'Ship reliable model training and inference workflows with measurable behavior.',
        trigger: 'Use for model training loops, evaluation harnesses, inference APIs, and monitoring setup.',
        deliverables: ['experiment or model change summary', 'evaluation metrics report', 'serving risk notes'],
        mustTest: ['model metric regression checks', 'inference path smoke tests'],
    },
    {
        slug: 'docs',
        title: 'Documentation',
        mission: 'Keep operational and product documentation accurate, concise, and shippable.',
        trigger: 'Use for README, runbooks, release notes, onboarding docs, and API usage guides.',
        deliverables: ['doc scope update', 'audience-targeted deliverable', 'fact verification checklist'],
        mustTest: ['command or path validity checks', 'cross-link and consistency review'],
    },
];

function renderRoleTemplate(role: RoleTemplate): string {
    const roleSpecificSection = role.extraProtocol
        ? `\n## Role-Specific Operating System\n${role.extraProtocol}\n`
        : '';

    const forbiddenSection = role.forbiddenPatterns && role.forbiddenPatterns.length > 0
        ? `\n## Absolute Negative Constraints\n${role.forbiddenPatterns.map((item) => `- ${item}`).join('\n')}\n`
        : '';

    const referencesSection = role.references && role.references.length > 0
        ? `\n## Reference Sources\n${role.references.map((item) => `- ${item}`).join('\n')}\n`
        : '';

    return `# Role Template: ${role.title}

## Mission
- ${role.mission}

## Trigger Guidance
- ${role.trigger}
- Avoid use when scope is better handled by Product Manager, Tech Lead, or Skill Creator.

## Core Workflow
1. Confirm scope, boundaries, and acceptance criteria.
2. Plan minimal change with explicit dependencies.
3. Execute with evidence-first reporting.
4. Validate outcomes and summarize residual risks.

## Operational Gates
1. Preflight gate:
- Confirm BRD context and runtime boundary.
- Confirm measurable acceptance command exists.
2. Delivery gate:
- Produce artifacts before claiming done.
- Run positive and negative validation paths.
3. Decision gate:
- If evidence is weak or contradictory, stop and ask owner questions.
- Keep status blocked until validation can run.

## Deliverables
${role.deliverables.map((item) => `- ${item}`).join('\n')}

## Validation Baseline
${role.mustTest.map((item) => `- ${item}`).join('\n')}
${roleSpecificSection}${forbiddenSection}${referencesSection}

## Rationalization Defenses
| Excuse | Reality |
|:--|:--|
| "This is simple, skip process." | Simple tasks still fail without explicit checks. |
| "I can patch first and validate later." | Unverified patches create hidden regressions. |
| "No command available, I will mark done." | Missing validation means blocked, not done. |
| "Template is enough for every domain." | Domain gaps require explicit scoring and research. |
| "Research takes too long, I will improvise." | Improvisation increases drift and runtime mismatch. |

## Runtime Adaptation Notes
- Claude: generate under .claude/skills/<role>/...
- Codex: generate under .agents/skills/<role>/...
- Antigravity: generate under .agent/skills/<role>/...

## Quality Bar
- Include a clear Iron Law and at least 3 workflow phases.
- Include role-specific decisions, anti-patterns, and owner escalation rules.
- Include executable validation command and a negative test path.
- Include blocked-state behavior when validation cannot run.
- Keep logs free of secrets and sensitive payloads.
`;
}

function renderRoleIndex(): string {
    const rows = ROLE_TEMPLATES.map((role) => `| ${role.slug} | ${role.title} | roles/${role.slug}.template.md |`);
    return `# Skill Kit Role Index

This folder is the template-first source for skill-creator.

Use order:
1. Pick the closest role template from this index.
2. Adapt to BRD and runtime boundary.
3. Research open-source sources only if template coverage is insufficient.

| Role Key | Role Name | Template |
|:--|:--|:--|
${rows.join('\n')}
`;
}

function renderSharedSkillTemplate(): string {
    return `---
name: <skill-name>
description: <what this skill does + when to trigger + boundaries>
---

# <Skill Title>

## Mission
- <role mission>

## Activation Rules
- Use when: <high-signal triggers>
- Do not use when: <out-of-scope conditions>

## Operating Workflow
1. <step one>
2. <step two>
3. <step three>

## Rationalization Defenses
| Excuse | Reality |
|:--|:--|
| <excuse> | <reality> |

## Deliverables
- <artifact>
- <artifact>

## Validation
- Command(s): <cmd>
- Evidence: command output and pass or fail summary.

## Blocked State
- If validation cannot run, ask owner questions and return blocked status.
`;
}

function renderRoleBlueprint(): string {
    return `# Role Skill Blueprint

## Header
- role_name:
- runtime_root:
- owner:
- version:

## Layer 1: Trigger Metadata
- trigger_description:
- trigger_examples:
- non_trigger_examples:

## Layer 2: Core Instruction
- mission:
- decision_mandate:
- operating_model:
- playbooks:
- anti_patterns:
- deliverables:
- validation_logic:
- blocked_logic:

## Layer 3 to 9: Supporting Layers
- references:
- examples:
- scripts:
- assets_templates:
- contracts_qc:
- governance:
- research_cutoff:
- validation_evidence:
- source_adoption_log:
`;
}

function renderOwnerQuestions(): string {
    return `# Owner Questions

## Quick Intake (3)
1. Which role should be generated?
2. Which runtime root is target?
3. What one acceptance command proves this iteration is usable?

## Interview Intake (8-10)
1. What outcome should this role own?
2. What are top trigger scenarios?
3. What is explicitly out of scope?
4. Which decisions are autonomous?
5. Which decisions require owner approval?
6. Which artifacts must always be produced?
7. Which command validates behavior?
8. What fallback is acceptable when validation fails?
9. What sensitive data must never be logged?
10. What quality bar defines ready vs blocked?
`;
}

function renderValidationMatrix(): string {
    return `# Validation Matrix

| Check | Type | Command or Method | Evidence |
|:--|:--|:--|:--|
| Structure | Static | verify required files exist | file list |
| Trigger Quality | Static | review metadata trigger scope | trigger notes |
| Behavior | Executable | run smoke command | stdout/stderr and exit code |
| Failure Handling | Executable | run negative case | logged failure with remediation |
| Boundary | Static | runtime path check | path validation note |
`;
}

function renderInsufficiencyGate(): string {
    return `# Template Insufficiency Gate

Score the selected role template before generation. Use 1 point for each satisfied check.

## Scoring Checklist (0-5)
- [ ] Iron Law is explicit and role-specific.
- [ ] Workflow has at least 3 phases with concrete gates.
- [ ] Rationalization defense table exists and is actionable.
- [ ] Validation includes executable command and negative path.
- [ ] Deliverables and escalation are concrete for the target domain.

## Decision Rule
- Score >= 4: adapt local template first, then generate.
- Score <= 3: research is mandatory before generation.

## Research Trace Requirement
When research is used, record:
- source URL
- reason selected
- adopted pattern
- rejected pattern
- owner and date
`;
}

function renderSourceAdoptionLogTemplate(): string {
    return `# Source Adoption Log Template

Use one block per source consulted.

## Entry
- date:
- runtime:
- role:
- source_url:
- source_type: (repo/docs/article)
- reason_selected:
- adopted_patterns:
- rejected_patterns:
- notes:
`;
}

function renderPressureTestScenarios(): string {
    return `# Pressure Test Scenarios

Run these scenarios after generating a role skill.

1. Missing command scenario:
- Validation command intentionally unavailable.
- Expected result: skill returns blocked state and owner questions.

2. Runtime boundary scenario:
- Attempt path outside target runtime root.
- Expected result: generation aborts with boundary error.

3. Conflicting requirement scenario:
- BRD scope conflicts with runtime limitation.
- Expected result: explicit risk statement and escalation to owner.

4. Negative execution scenario:
- Use failing command once.
- Expected result: failure is logged and remediation is proposed.
`;
}

function renderOutputContract(): string {
    return `# Output Contract

- Return concise status summary.
- Include validation command and pass or fail outcome.
- If failed, include remediation proposal and blocked reason.
- Include unresolved risks and owner follow-up questions when needed.
`;
}

function renderRuntimeBoundaryChecklist(): string {
    return `# Runtime Boundary Checklist

- [ ] Target runtime confirmed (.claude, .agents, or .agent)
- [ ] No files generated outside selected runtime root
- [ ] Output paths validated before write
- [ ] Cross-runtime references are informational only
`;
}

function renderSourcesRegistry(): string {
    return `# Sources Registry (Research Fallback)

Use this list only when local templates are insufficient for the requested domain.

## Preferred Sources
- https://github.com/obra/superpowers
- https://github.com/obra/superpowers/tree/main/skills/writing-skills
- https://github.com/anthropics/skills/tree/main/skills/skill-creator
- https://github.com/VRSEN/agency-swarm
- https://platform.openai.com/docs/guides/agents
- https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/
- https://github.com/modelcontextprotocol

## Optional Domain Sources
- https://github.com/microsoft/autogen
- https://github.com/langchain-ai/langgraph
- https://github.com/crewAIInc/crewAI

## Policy
- Template-first, research-second.
- Apply insufficiency gate before deciding to research.
- Keep runtime boundary strict while adapting external ideas.
- Record updated cutoff date in runtime skill data when sources are used.
`;
}

function renderUiuxSkillPack(): string {
    return `# UIUX Skill Pack (Taste-Driven, StackMoss Adaptation)

This pack is the primary operating reference for role \`uiux\`.
Use this file before adapting \`roles/uiux.template.md\`.

## Pack Intent
- Preserve the strongest operational patterns from taste-skill.
- Adapt to StackMoss constraints: BRD-first, runtime isolation, validation evidence, blocked-state handling.
- Avoid blind copying. Keep only high-value instructions for production delivery.

## Mode Activation Matrix
| Mode | Trigger | Required Outputs |
|:--|:--|:--|
| design-taste-core | Any UIUX task | atmosphere dials, token decisions, anti-pattern gate |
| redesign-existing-projects | Existing product UI is already live | design audit report, prioritized remediation plan |
| high-end-visual-design (soft) | Premium marketing or flagship surfaces | high-fidelity visual system, interaction choreography |
| stitch-design-taste | Team needs DESIGN.md for Stitch generation | DESIGN.md semantic spec, component behavior spec |
| output-discipline | Always on | complete artifacts, no placeholder outputs |

## Mode 1: design-taste-core (Mandatory)
### Baseline Dials
- DESIGN_VARIANCE: 8 (1=symmetric, 10=asymmetric experimental)
- MOTION_INTENSITY: 6 (1=static, 10=cinematic)
- VISUAL_DENSITY: 4 (1=airy, 10=dense dashboard)

### Core Architecture Rules
- Verify dependencies before imports (motion, icons, state libs).
- Prefer CSS Grid for structure and avoid percentage calc hacks.
- For full-height sections use \`min-h-[100dvh]\`, never \`h-screen\`.
- Keep one accent color and a consistent gray family per project.
- Ban emojis, fake placeholder identities, and AI filler copy.

### Design Engineering Directives
- Typography:
- display layers use tight tracking and purposeful hierarchy.
- body text should stay readable (max ~65ch where applicable).
- Color:
- avoid purple-neon defaults and oversaturated accents.
- use off-black/dark charcoal rather than pure \`#000000\`.
- Layout:
- avoid generic centered hero and 3-equal-card feature rows by default.
- prefer asymmetric structures when variance >= 5.
- States:
- loading, empty, error, and success states are mandatory.

## Mode 2: redesign-existing-projects
### Audit Sequence
1. Scan stack and existing design system constraints.
2. Diagnose weaknesses across typography, color/surface, layout, interaction, and content realism.
3. Build remediation plan with impact-first ordering.
4. Apply targeted upgrades without rewriting the whole product.

### Redesign Checklist
- Replace generic font defaults with intentional type pairing.
- Fix hierarchy, spacing rhythm, and readability.
- Normalize surface depth, border logic, and shadow strategy.
- Replace generic component patterns with product-specific compositions.
- Validate keyboard focus, error handling, loading/empty states.

## Mode 3: high-end-visual-design (soft)
### Creative Variance Engine
- Pick one visual archetype per screen direction:
- Ethereal Glass (tech), Editorial Luxury (brand), or Soft Structuralism (consumer).
- Pick one layout archetype:
- Asymmetrical Bento, Z-axis Cascade, or Editorial Split.
- Mobile fallback is mandatory for every high-variance choice.

### Premium Interaction Patterns
- Double-bezel card architecture for elevated modules.
- Button-in-button trailing icon islands for CTA polish.
- Staggered reveal choreography for lists and sections.
- Spring dynamics for hover/active states.

### Performance Guardrails
- Animate only \`transform\` and \`opacity\`.
- Keep heavy blur/noise on fixed non-interactive layers.
- Avoid perpetual animations in parent containers.

## Mode 4: stitch-design-taste
### DESIGN.md Contract
When Stitch mode is active, produce:
1. Visual atmosphere narrative.
2. Color roles with semantic names and hex.
3. Typography rules by role (display/body/mono).
4. Component behavior specs (buttons/cards/inputs/states).
5. Layout principles and responsive constraints.
6. Motion philosophy and anti-pattern bans.

Use starter template:
- \`.stackmoss/skill-kit/roles/uiux.DESIGN.template.md\`

## Mode 5: output-discipline (Mandatory)
### Completion Rules
- Do not leave placeholders like TODO, "...", or "same as above".
- Do not stop at skeleton outlines when full artifacts are requested.
- If output is long, split with explicit continuation marker and resume exactly where paused.

### Quality Gate
- Every requested artifact must be complete.
- Every claim must reference validation evidence.
- Missing context must produce owner questions, not assumptions.

## StackMoss Adaptation Rules
- Always align with BRD lock status before execution.
- Keep runtime boundary clear during generated skill output.
- Log validation evidence and failure-handling behavior.
- Surface blocked-state explicitly when prerequisites are missing.
`;
}

function renderUiuxDesignTemplate(): string {
    return `# DESIGN.md Template (UIUX Stitch Mode)

## 1. Visual Theme & Atmosphere
- mood:
- variance:
- motion_intensity:
- visual_density:

## 2. Color Palette & Roles
- canvas:
- surface:
- primary_text:
- secondary_text:
- border:
- accent:
- banned_color_patterns:

## 3. Typography Rules
- display_font:
- body_font:
- mono_font:
- hierarchy_rules:
- banned_fonts:

## 4. Component Stylings
- buttons:
- cards_and_containers:
- inputs_and_forms:
- loading_empty_error_states:

## 5. Layout Principles
- hero_structure:
- section_composition:
- grid_system:
- responsive_collapse_rules:

## 6. Motion & Interaction
- default_motion_profile:
- transition_specs:
- stagger_and_reveal_rules:
- performance_constraints:

## 7. Anti-Patterns (Banned)
- no_emoji:
- no_generic_ai_layout:
- no_placeholder_content:
- no_neon_defaults:
`;
}

function renderRuntimeAdapter(runtime: 'claude' | 'codex' | 'antigravity'): string {
    const runtimeRoot = runtime === 'claude'
        ? '.claude/skills/*'
        : runtime === 'codex'
            ? '.agents/skills/*'
            : '.agent/skills/*';

    return `# Runtime Adapter: ${runtime}

## Target Root
- ${runtimeRoot}

## Required Mapping
- role template -> runtime skill folder
- shared templates -> assets/templates
- contracts -> contracts/*
- governance -> governance/*
- evidence -> data/*

## Guardrails
- never generate skills outside ${runtimeRoot}
- keep instructions runtime-agnostic except path and config conventions
`;
}

export function generateSkillKit(_input: TemplateInput): GeneratedFile[] {
    const files: GeneratedFile[] = [
        { path: '.stackmoss/skill-kit/ROLE_INDEX.md', content: renderRoleIndex() },
        { path: '.stackmoss/skill-kit/shared/SKILL.template.md', content: renderSharedSkillTemplate() },
        { path: '.stackmoss/skill-kit/shared/role-skill-blueprint.md', content: renderRoleBlueprint() },
        { path: '.stackmoss/skill-kit/shared/owner-questions.md', content: renderOwnerQuestions() },
        { path: '.stackmoss/skill-kit/shared/validation-matrix.md', content: renderValidationMatrix() },
        { path: '.stackmoss/skill-kit/shared/insufficiency-gate.md', content: renderInsufficiencyGate() },
        { path: '.stackmoss/skill-kit/shared/source-adoption-log.template.md', content: renderSourceAdoptionLogTemplate() },
        { path: '.stackmoss/skill-kit/shared/pressure-test-scenarios.md', content: renderPressureTestScenarios() },
        { path: '.stackmoss/skill-kit/shared/output-contract.md', content: renderOutputContract() },
        { path: '.stackmoss/skill-kit/shared/runtime-boundary-checklist.md', content: renderRuntimeBoundaryChecklist() },
        { path: '.stackmoss/skill-kit/sources-registry.md', content: renderSourcesRegistry() },
        { path: '.stackmoss/skill-kit/runtime-adapters/claude.md', content: renderRuntimeAdapter('claude') },
        { path: '.stackmoss/skill-kit/runtime-adapters/codex.md', content: renderRuntimeAdapter('codex') },
        { path: '.stackmoss/skill-kit/runtime-adapters/antigravity.md', content: renderRuntimeAdapter('antigravity') },
    ];

    for (const role of ROLE_TEMPLATES) {
        files.push({
            path: `.stackmoss/skill-kit/roles/${role.slug}.template.md`,
            content: renderRoleTemplate(role),
        });
    }

    files.push(
        { path: '.stackmoss/skill-kit/roles/uiux.skill-pack.md', content: renderUiuxSkillPack() },
        { path: '.stackmoss/skill-kit/roles/uiux.DESIGN.template.md', content: renderUiuxDesignTemplate() },
    );

    return files;
}
