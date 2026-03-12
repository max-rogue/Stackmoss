/**
 * Centralized Capability Budgets
 * Authority: BRD §12.4
 *
 * Single source of truth for role → capability → word budget.
 * Imported by: check.ts, compile/*, templates/team.ts
 */

// ─── Budget Map ──────────────────────────────────────────────────

export const CAPABILITY_BUDGETS: Record<string, number> = {
    'TL-ARCH': 280,
    'TL-REVIEW': 220,
    'TL-CONTEXT': 180,
    'TL-PLAN': 200,
    'BA-REQ': 220,
    'BA-AC': 180,
    'DEV-IMPL': 260,
    'DEV-ENV': 200,
    'DEV-DEBUG': 180,
    'QA-TEST': 180,
    'QA-REGRESSION': 150,
    'DOCS-README': 160,
    'DOCS-CHANGELOG': 130,
    'SEC-SCAN': 180,
    'OPS-DEPLOY': 180,
};

export const TEAM_TOTAL_MAX = 1800;

// ─── Role → Capabilities Lookup ──────────────────────────────────

export const ROLE_CAPABILITIES: Record<string, string[]> = {
    'TL': ['TL-ARCH', 'TL-REVIEW', 'TL-CONTEXT', 'TL-PLAN'],
    'TL(guide)': ['TL-ARCH', 'TL-REVIEW', 'TL-CONTEXT'],
    'BA': ['BA-REQ', 'BA-AC'],
    'DEV': ['DEV-IMPL', 'DEV-ENV', 'DEV-DEBUG'],
    'QA(light)': ['QA-TEST'],
    'QA(strong)': ['QA-TEST', 'QA-REGRESSION'],
    'DOCS': ['DOCS-README', 'DOCS-CHANGELOG'],
    'SEC-lite': ['SEC-SCAN'],
    'OPS': ['OPS-DEPLOY'],
    'OPS-lite': ['OPS-DEPLOY'],
};

// ─── Helpers ─────────────────────────────────────────────────────

/**
 * Get budget for a specific capability. Returns undefined if not found.
 */
export function getBudget(capabilityId: string): number | undefined {
    return CAPABILITY_BUDGETS[capabilityId];
}

/**
 * Get all capabilities for a role. Returns empty array if not found.
 */
export function getCapabilities(roleId: string): string[] {
    return ROLE_CAPABILITIES[roleId] ?? [];
}
