import type { GeneratedFile, TemplateInput } from './types.js';
import { extractRoleId } from './team.js';

const ROLE_NAMES: Record<string, string> = {
    TL: 'Tech Lead',
    BA: 'Business Analyst',
    DEV: 'Developer',
    FE: 'Frontend Developer',
    BE: 'Backend Developer',
    FS: 'Fullstack Developer',
    MOBILE: 'Mobile Developer',
    DEVOPS: 'DevOps Engineer',
    DATA: 'Data Engineer',
    PE: 'Prompt Engineer',
    UIUX: 'UI/UX Designer',
    PM: 'Product Manager',
    MLE: 'ML Engineer',
    BRAND: 'Brand / Graphic Designer',
    QA: 'Quality Assurance',
    DOCS: 'Documentation',
    SEC: 'Security-lite',
    OPS: 'DevOps-lite',
};

function uniqueRoleVariants(roles: string[], autoAddedRoles: string[]): Map<string, string[]> {
    const map = new Map<string, string[]>();

    for (const role of [...roles, ...autoAddedRoles]) {
        const baseId = extractRoleId(role);
        const variants = map.get(baseId) ?? [];
        if (!variants.includes(role)) {
            variants.push(role);
        }
        map.set(baseId, variants);
    }

    return map;
}

function renderRoleSection(roleId: string, variants: string[]): string {
    const roleName = ROLE_NAMES[roleId] ?? roleId;

    return `### [${roleId}] ${roleName}
variants_in_team: ${variants.join(', ')}
status: bootstrap

#### Project Patterns
- Replace this line with concrete stack or domain constraints from BRD and repo facts.

#### Example Rewrites
- Replace generic examples with project-specific examples only when they are verified.

#### Anti-Pattern Additions
- Add failure modes that are specific to this project, codebase, or domain.

#### Checklist Additions
- Add measurable project gates that this role must verify before sign-off.
`;
}

export function generateRoleSkillOverrides(input: TemplateInput): GeneratedFile {
    const roleMap = uniqueRoleVariants(input.intake.roles, input.intake.autoAddedRoles);
    const roleSections = Array.from(roleMap.entries())
        .map(([roleId, variants]) => renderRoleSection(roleId, variants))
        .join('\n');

    return {
        path: 'ROLE_SKILL_OVERRIDES.md',
        content: `# Role Skill Overrides - ${input.projectName}

This file is the editable source of truth for project-specific role calibration.
Do not edit generated runtime \`SKILL.md\` files directly. Keep persistent role enrichments here instead.

## Editing Rules

- Tech Lead is the single writer for shared role-skill overrides.
- Replace stale bullets instead of appending diary-style logs.
- Only record project-specific deltas that are verified from the BRD, NORTH_STAR, NON_GOALS, or repo facts.
- Keep base Iron Laws in generated skills unless the project has a stronger explicit constraint.

## Active Role Overrides

${roleSections}
`,
    };
}
