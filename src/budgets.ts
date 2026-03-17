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
    'DEV-IMPL': 200,
    'DEV-ENV': 160,
    'DEV-DEBUG': 150,
    // Frontend Developer
    'FE-UI': 200,
    'FE-STYLE': 160,
    'FE-A11Y': 120,
    // Backend Developer
    'BE-API': 200,
    'BE-DB': 180,
    'BE-AUTH': 160,
    // Fullstack Developer
    'FS-INTEGRATE': 200,
    'FS-SCAFFOLD': 160,
    'FS-OPTIMIZE': 140,
    // Mobile Developer
    'MOBILE-NATIVE': 200,
    'MOBILE-PERF': 150,
    'MOBILE-DEVICE': 140,
    // DevOps Engineer
    'DEVOPS-CI': 180,
    'DEVOPS-INFRA': 160,
    'DEVOPS-MONITOR': 140,
    // Data Engineer
    'DATA-PIPELINE': 180,
    'DATA-MODEL': 160,
    'DATA-QUALITY': 140,
    // Prompt Engineer
    'PE-PROMPT': 180,
    'PE-EVAL': 150,
    'PE-CHAIN': 140,
    // UI/UX Designer
    'UIUX-DESIGN': 180,
    'UIUX-PROTO': 160,
    'UIUX-REVIEW': 140,
    // Product Manager
    'PM-ROADMAP': 180,
    'PM-PRIORITIZE': 150,
    'PM-STAKEHOLDER': 150,
    // ML Engineer
    'MLE-TRAIN': 220,
    'MLE-DEPLOY': 180,
    'MLE-MONITOR': 150,
    // Brand / Graphic
    'BRAND-IDENTITY': 180,
    'BRAND-ASSETS': 160,
    'BRAND-GUIDE': 140,
    // QA, Docs, Sec, Ops
    'QA-TEST': 150,
    'QA-REGRESSION': 120,
    'DOCS-README': 130,
    'DOCS-CHANGELOG': 100,
    'SEC-SCAN': 140,
    'OPS-DEPLOY': 140,
};

export const CAPABILITY_MAX_BUDGETS: Record<string, number> = {
    'TL-ARCH': 280,
    'TL-REVIEW': 220,
    'TL-CONTEXT': 180,
    'TL-PLAN': 200,
    'BA-REQ': 220,
    'BA-AC': 180,
    'DEV-IMPL': 260,
    'DEV-ENV': 200,
    'DEV-DEBUG': 180,
    // Frontend Developer
    'FE-UI': 260,
    'FE-STYLE': 200,
    'FE-A11Y': 160,
    // Backend Developer
    'BE-API': 260,
    'BE-DB': 220,
    'BE-AUTH': 200,
    // Fullstack Developer
    'FS-INTEGRATE': 260,
    'FS-SCAFFOLD': 200,
    'FS-OPTIMIZE': 180,
    // Mobile Developer
    'MOBILE-NATIVE': 260,
    'MOBILE-PERF': 180,
    'MOBILE-DEVICE': 180,
    // DevOps Engineer
    'DEVOPS-CI': 220,
    'DEVOPS-INFRA': 200,
    'DEVOPS-MONITOR': 180,
    // Data Engineer
    'DATA-PIPELINE': 220,
    'DATA-MODEL': 200,
    'DATA-QUALITY': 180,
    // Prompt Engineer
    'PE-PROMPT': 220,
    'PE-EVAL': 180,
    'PE-CHAIN': 180,
    // UI/UX Designer
    'UIUX-DESIGN': 220,
    'UIUX-PROTO': 200,
    'UIUX-REVIEW': 180,
    // Product Manager
    'PM-ROADMAP': 220,
    'PM-PRIORITIZE': 180,
    'PM-STAKEHOLDER': 180,
    // ML Engineer
    'MLE-TRAIN': 260,
    'MLE-DEPLOY': 200,
    'MLE-MONITOR': 180,
    // Brand / Graphic
    'BRAND-IDENTITY': 220,
    'BRAND-ASSETS': 200,
    'BRAND-GUIDE': 180,
    // QA, Docs, Sec, Ops
    'QA-TEST': 180,
    'QA-REGRESSION': 150,
    'DOCS-README': 160,
    'DOCS-CHANGELOG': 130,
    'SEC-SCAN': 180,
    'OPS-DEPLOY': 180,
};

// Backward-compatible alias for max budgets, used by enforcement paths.
export const CAPABILITY_BUDGETS = CAPABILITY_MAX_BUDGETS;

export const TEAM_TOTAL_MAX = 1800;

export const ROLE_CAPABILITIES: Record<string, string[]> = {
    TL: ['TL-ARCH', 'TL-REVIEW', 'TL-CONTEXT', 'TL-PLAN'],
    BA: ['BA-REQ', 'BA-AC'],
    DEV: ['DEV-IMPL', 'DEV-ENV', 'DEV-DEBUG'],
    FE: ['FE-UI', 'FE-STYLE', 'FE-A11Y'],
    BE: ['BE-API', 'BE-DB', 'BE-AUTH'],
    FS: ['FS-INTEGRATE', 'FS-SCAFFOLD', 'FS-OPTIMIZE'],
    MOBILE: ['MOBILE-NATIVE', 'MOBILE-PERF', 'MOBILE-DEVICE'],
    DEVOPS: ['DEVOPS-CI', 'DEVOPS-INFRA', 'DEVOPS-MONITOR'],
    DATA: ['DATA-PIPELINE', 'DATA-MODEL', 'DATA-QUALITY'],
    PE: ['PE-PROMPT', 'PE-EVAL', 'PE-CHAIN'],
    UIUX: ['UIUX-DESIGN', 'UIUX-PROTO', 'UIUX-REVIEW'],
    PM: ['PM-ROADMAP', 'PM-PRIORITIZE', 'PM-STAKEHOLDER'],
    MLE: ['MLE-TRAIN', 'MLE-DEPLOY', 'MLE-MONITOR'],
    BRAND: ['BRAND-IDENTITY', 'BRAND-ASSETS', 'BRAND-GUIDE'],
    QA: ['QA-TEST', 'QA-REGRESSION'],
    DOCS: ['DOCS-README', 'DOCS-CHANGELOG'],
    SEC: ['SEC-SCAN'],
    OPS: ['OPS-DEPLOY'],
};

export const ROLE_VARIANT_CAPABILITIES: Record<string, string[]> = {
    'TL(guide)': ROLE_CAPABILITIES.TL,
    'DEV(small)': ROLE_CAPABILITIES.DEV,
    'QA(light)': ['QA-TEST'],
    'QA(strong)': ROLE_CAPABILITIES.QA,
    'QA(checklist)': ['QA-TEST'],
    'SEC-lite': ROLE_CAPABILITIES.SEC,
    'OPS(light)': ROLE_CAPABILITIES.OPS,
    'OPS-lite': ROLE_CAPABILITIES.OPS,
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
