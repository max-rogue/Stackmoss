/**
 * Centralized Capability Budgets
 * Authority: BRD §12.4
 *
 * Single source of truth for:
 * - default generation budgets
 * - hard max enforcement budgets
 * - role variant → capability mapping
 */

export const CAPABILITY_DEFAULT_BUDGETS: Record<string, number> = {
    'TL-ARCH': 220,
    'TL-REVIEW': 180,
    'TL-CONTEXT': 150,
    'TL-PLAN': 160,
    'BA-REQ': 180,
    'BA-AC': 150,
    // Product Manager
    'PM-ROADMAP': 180,
    'PM-PRIORITIZE': 150,
    'PM-STAKEHOLDER': 150,
    // Frontend Developer
    'FE-UI': 200,
    'FE-STYLE': 160,
    'FE-A11Y': 120,
    'FE-TASTE': 180,
    // Backend Developer
    'BE-API': 200,
    'BE-DB': 180,
    'BE-AUTH': 160,
    'BE-DEBUG': 150,
    // Mobile Developer
    'MOBILE-NATIVE': 200,
    'MOBILE-PERF': 150,
    'MOBILE-DEVICE': 140,
    'MOBILE-DEBUG': 150,
    'MOBILE-OFFLINE': 140,
    // DevOps Engineer
    'DEVOPS-CI': 180,
    'DEVOPS-INFRA': 160,
    'DEVOPS-MONITOR': 140,
    'DEVOPS-DEPLOY': 140,
    // Data Engineer
    'DATA-PIPELINE': 180,
    'DATA-MODEL': 160,
    'DATA-QUALITY': 140,
    // ML Engineer
    'MLE-TRAIN': 220,
    'MLE-DEPLOY': 180,
    'MLE-MONITOR': 150,
    // QA
    'QA-TEST': 150,
    'QA-REGRESSION': 120,
    // Security
    'SEC-SCAN': 140,
    'SEC-SUPPLY': 140,
    // Documentation
    'DOCS-README': 130,
    'DOCS-CHANGELOG': 100,
    'DOCS-API': 130,
};

export const CAPABILITY_MAX_BUDGETS: Record<string, number> = {
    'TL-ARCH': 280,
    'TL-REVIEW': 220,
    'TL-CONTEXT': 180,
    'TL-PLAN': 200,
    'BA-REQ': 220,
    'BA-AC': 180,
    // Product Manager
    'PM-ROADMAP': 220,
    'PM-PRIORITIZE': 180,
    'PM-STAKEHOLDER': 180,
    // Frontend Developer
    'FE-UI': 260,
    'FE-STYLE': 200,
    'FE-A11Y': 160,
    'FE-TASTE': 220,
    // Backend Developer
    'BE-API': 260,
    'BE-DB': 220,
    'BE-AUTH': 200,
    'BE-DEBUG': 180,
    // Mobile Developer
    'MOBILE-NATIVE': 260,
    'MOBILE-PERF': 180,
    'MOBILE-DEVICE': 180,
    'MOBILE-DEBUG': 180,
    'MOBILE-OFFLINE': 180,
    // DevOps Engineer
    'DEVOPS-CI': 220,
    'DEVOPS-INFRA': 200,
    'DEVOPS-MONITOR': 180,
    'DEVOPS-DEPLOY': 180,
    // Data Engineer
    'DATA-PIPELINE': 220,
    'DATA-MODEL': 200,
    'DATA-QUALITY': 180,
    // ML Engineer
    'MLE-TRAIN': 260,
    'MLE-DEPLOY': 200,
    'MLE-MONITOR': 180,
    // QA
    'QA-TEST': 180,
    'QA-REGRESSION': 150,
    // Security
    'SEC-SCAN': 180,
    'SEC-SUPPLY': 180,
    // Documentation
    'DOCS-README': 160,
    'DOCS-CHANGELOG': 130,
    'DOCS-API': 160,
};

// Backward-compatible alias for max budgets, used by enforcement paths.
export const CAPABILITY_BUDGETS = CAPABILITY_MAX_BUDGETS;

export const TEAM_TOTAL_MAX = 1800;

export const ROLE_CAPABILITIES: Record<string, string[]> = {
    TL: ['TL-ARCH', 'TL-REVIEW', 'TL-CONTEXT', 'TL-PLAN'],
    BA: ['BA-REQ', 'BA-AC'],
    PM: ['PM-ROADMAP', 'PM-PRIORITIZE', 'PM-STAKEHOLDER'],
    FE: ['FE-UI', 'FE-STYLE', 'FE-A11Y', 'FE-TASTE'],
    BE: ['BE-API', 'BE-DB', 'BE-AUTH', 'BE-DEBUG'],
    MOBILE: ['MOBILE-NATIVE', 'MOBILE-PERF', 'MOBILE-DEVICE', 'MOBILE-DEBUG', 'MOBILE-OFFLINE'],
    DEVOPS: ['DEVOPS-CI', 'DEVOPS-INFRA', 'DEVOPS-MONITOR', 'DEVOPS-DEPLOY'],
    DATA: ['DATA-PIPELINE', 'DATA-MODEL', 'DATA-QUALITY'],
    MLE: ['MLE-TRAIN', 'MLE-DEPLOY', 'MLE-MONITOR'],
    QA: ['QA-TEST', 'QA-REGRESSION'],
    DOCS: ['DOCS-README', 'DOCS-CHANGELOG', 'DOCS-API'],
    SEC: ['SEC-SCAN', 'SEC-SUPPLY'],
};

export const ROLE_VARIANT_CAPABILITIES: Record<string, string[]> = {
    'TL(guide)': ROLE_CAPABILITIES.TL,
    'QA(light)': ['QA-TEST'],
    'QA(strong)': ROLE_CAPABILITIES.QA,
    'QA(checklist)': ['QA-TEST'],
    'DEVOPS(light)': ['DEVOPS-DEPLOY'],
};

export interface CapabilityBlock {
    id: string;
    content: string;
}

export function getDefaultBudget(capabilityId: string): number | undefined {
    return CAPABILITY_DEFAULT_BUDGETS[capabilityId];
}

export function getMaxBudget(capabilityId: string): number | undefined {
    return CAPABILITY_MAX_BUDGETS[capabilityId];
}

export function getCapabilities(roleId: string): string[] {
    return ROLE_VARIANT_CAPABILITIES[roleId] ?? ROLE_CAPABILITIES[roleId] ?? [];
}

export function getCapabilitiesForRole(roleId: string): string[] {
    const direct = ROLE_VARIANT_CAPABILITIES[roleId] ?? ROLE_CAPABILITIES[roleId];
    if (direct) {
        return [...direct];
    }

    const baseRole = roleId.match(/^([A-Z]+)/)?.[1];
    if (baseRole && ROLE_CAPABILITIES[baseRole]) {
        return [...ROLE_CAPABILITIES[baseRole]];
    }

    return [];
}

export function extractCapabilityBlocks(teamContent: string): CapabilityBlock[] {
    const lines = teamContent.split('\n');
    const blocks: CapabilityBlock[] = [];

    let currentId: string | null = null;
    let currentLines: string[] = [];

    const flush = (): void => {
        if (!currentId) {
            return;
        }

        blocks.push({
            id: currentId,
            content: currentLines.join('\n').trim(),
        });
        currentId = null;
        currentLines = [];
    };

    for (const line of lines) {
        const capabilityStart = line.match(/^- \[([A-Z][A-Z-]+)\]/);
        const sectionBoundary = line.startsWith('## ') || line === '---';

        if (capabilityStart) {
            flush();
            currentId = capabilityStart[1];
            currentLines = [line];
            continue;
        }

        if (currentId && sectionBoundary) {
            flush();
        }

        if (currentId) {
            currentLines.push(line);
        }
    }

    flush();
    return blocks;
}
