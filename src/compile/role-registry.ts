/**
 * Role Registry — Single Source of Truth
 *
 * All layers (template, compile, budget, eval) consume this registry.
 * Legacy role IDs are resolved to canonical IDs via ROLE_ALIASES.
 *
 * Canonical roster: 12 roles (TL, PM, BA, FE, BE, MOBILE, DEVOPS, DATA, MLE, QA, SEC, DOCS)
 */

// ─── Canonical Roles ─────────────────────────────────────────────

export const CANONICAL_ROLES = [
    'TL', 'PM', 'BA',
    'FE', 'BE', 'MOBILE',
    'DEVOPS', 'DATA', 'MLE',
    'QA', 'SEC', 'DOCS',
] as const;

export type CanonicalRoleId = (typeof CANONICAL_ROLES)[number];

// ─── Legacy Alias Map ────────────────────────────────────────────

export const ROLE_ALIASES: Record<string, CanonicalRoleId | CanonicalRoleId[]> = {
    DEV: ['FE', 'BE'],
    FS: ['FE', 'BE'],
    UIUX: 'FE',
    PE: 'MLE',
    BRAND: 'FE',
    OPS: 'DEVOPS',
};

// ─── Role Resolution ─────────────────────────────────────────────

/**
 * Resolves a role ID (potentially legacy or with variant suffix) to canonical IDs.
 * Examples:
 *   resolveRole('TL')      → ['TL']
 *   resolveRole('TL(guide)') → ['TL']
 *   resolveRole('DEV')     → ['FE', 'BE']
 *   resolveRole('OPS')     → ['DEVOPS']
 *   resolveRole('UNKNOWN') → []
 */
export function resolveRole(roleId: string): CanonicalRoleId[] {
    const baseId = roleId.replace(/\(.*\)$/, '').trim();

    if (isCanonical(baseId)) {
        return [baseId];
    }

    const alias = ROLE_ALIASES[baseId];
    if (!alias) {
        return [];
    }
    return Array.isArray(alias) ? alias : [alias];
}

/**
 * Type guard: checks if a string is a canonical role ID.
 */
export function isCanonical(id: string): id is CanonicalRoleId {
    return (CANONICAL_ROLES as readonly string[]).includes(id);
}

/**
 * Resolve an array of role strings to unique canonical IDs.
 * Preserves order, deduplicates.
 */
export function resolveRoles(roleIds: string[]): CanonicalRoleId[] {
    const seen = new Set<CanonicalRoleId>();
    const result: CanonicalRoleId[] = [];
    for (const id of roleIds) {
        for (const resolved of resolveRole(id)) {
            if (!seen.has(resolved)) {
                seen.add(resolved);
                result.push(resolved);
            }
        }
    }
    return result;
}

// ─── Runtime Names (skill folder slugs) ──────────────────────────

export const ROLE_RUNTIME_NAMES: Record<CanonicalRoleId, string> = {
    TL: 'tech-lead',
    PM: 'product-manager',
    BA: 'business-analyst',
    FE: 'frontend',
    BE: 'backend',
    MOBILE: 'mobile',
    DEVOPS: 'devops-engineer',
    DATA: 'data-engineer',
    MLE: 'ml-engineer',
    QA: 'quality-assurance',
    SEC: 'security-auditor',
    DOCS: 'documentation',
};

// ─── Capability IDs per Role ─────────────────────────────────────

export const ROLE_CAPABILITY_IDS: Record<CanonicalRoleId, string[]> = {
    TL: ['TL-ARCH', 'TL-REVIEW', 'TL-CONTEXT', 'TL-PLAN'],
    PM: ['PM-ROADMAP', 'PM-PRIORITIZE', 'PM-STAKEHOLDER'],
    BA: ['BA-REQ', 'BA-AC'],
    FE: ['FE-UI', 'FE-STYLE', 'FE-A11Y', 'FE-TASTE'],
    BE: ['BE-API', 'BE-DB', 'BE-AUTH', 'BE-DEBUG'],
    MOBILE: ['MOBILE-NATIVE', 'MOBILE-PERF', 'MOBILE-DEVICE', 'MOBILE-DEBUG', 'MOBILE-OFFLINE'],
    DEVOPS: ['DEVOPS-CI', 'DEVOPS-INFRA', 'DEVOPS-MONITOR', 'DEVOPS-DEPLOY'],
    DATA: ['DATA-PIPELINE', 'DATA-MODEL', 'DATA-QUALITY'],
    MLE: ['MLE-TRAIN', 'MLE-DEPLOY', 'MLE-MONITOR'],
    QA: ['QA-TEST', 'QA-REGRESSION'],
    SEC: ['SEC-SCAN', 'SEC-SUPPLY'],
    DOCS: ['DOCS-README', 'DOCS-CHANGELOG', 'DOCS-API'],
};

/**
 * Get all capability IDs across all canonical roles.
 */
export function getAllCapabilityIds(): string[] {
    return Object.values(ROLE_CAPABILITY_IDS).flat();
}
