/**
 * Pack Selector — 2D Matrix overlay compose (UserType × ProjectType)
 * Authority: BRD §10, intake-engine skill
 *
 * Deterministic logic, no LLM.
 */

import type { Persona, ProjectType, RawAnswers } from './types.js';

// ─── Persona Detection ───────────────────────────────────────────

/**
 * Map Q1 answer → Persona.
 * Direct mapping, no inference.
 */
export function detectPersona(q1Answer: string): Persona {
    const map: Record<string, Persona> = {
        BizLed: 'BizLed',
        DevLed: 'DevLed',
        Solo: 'Solo',
        Newbie: 'Newbie',
    };

    return map[q1Answer] ?? 'Newbie';
}

// ─── Project Type ────────────────────────────────────────────────

/**
 * Read explicit project type from Q_PT answer.
 * Owner-approved: explicit question, no inference.
 */
export function getProjectType(answers: RawAnswers): ProjectType {
    const raw = answers['Q_PT'] as string | undefined;
    const valid: ProjectType[] = ['MVP', 'Production', 'InternalTool', 'LibraryAPI'];

    if (raw && valid.includes(raw as ProjectType)) {
        return raw as ProjectType;
    }

    if (!raw) {
        throw new Error('Project type is required (Q_PT).');
    }

    throw new Error(`Invalid project type: '${raw}'. Valid: ${valid.join(', ')}`);
}

// ─── 2D Matrix: Role Selection ───────────────────────────────────

/**
 * BRD §10.2 Role Mapping Table (v2 — specialized roles).
 *
 * | UserType | ProjectType  | Roles                                            |
 * |----------|--------------|--------------------------------------------------|
 * | BizLed   | MVP          | TL, BA, FE, BE, QA, DOCS                         |
 * | BizLed   | Production   | TL, BA, FE, BE, QA(strong), DEVOPS(light), DOCS, SEC |
 * | DevLed   | MVP          | TL, FE, BE, QA, DOCS                             |
 * | DevLed   | Production   | TL, FE, BE, QA(strong), DEVOPS, DOCS             |
 * | Solo     | MVP          | TL(guide), FE, QA(light)                         |
 * | Solo     | Production   | TL, FE, BE, QA, DOCS                             |
 * | Newbie   | any          | TL(guide), FE, QA(checklist)                     |
 */
export function selectRoles(persona: Persona, projectType: ProjectType): string[] {
    // Newbie overrides everything
    if (persona === 'Newbie') {
        return ['TL(guide)', 'FE', 'QA(checklist)'];
    }

    const legacyFallbackRoles = ['TL', 'FE', 'QA'];

    const matrix: Record<string, Record<string, string[]>> = {
        BizLed: {
            MVP: ['TL', 'BA', 'FE', 'BE', 'QA', 'DOCS'],
            Production: ['TL', 'BA', 'FE', 'BE', 'QA(strong)', 'DEVOPS(light)', 'DOCS', 'SEC'],
            InternalTool: ['TL', 'BA', 'FE', 'BE', 'QA(light)', 'DOCS'],
            LibraryAPI: ['TL', 'BA', 'BE', 'QA(strong)', 'DOCS'],
        },
        DevLed: {
            MVP: ['TL', 'FE', 'BE', 'QA', 'DOCS'],
            Production: ['TL', 'FE', 'BE', 'QA(strong)', 'DEVOPS', 'DOCS'],
            InternalTool: ['TL', 'FE', 'BE', 'QA(checklist)', 'DOCS'],
            LibraryAPI: ['TL', 'BE', 'QA(strong)', 'DOCS'],
        },
        Solo: {
            MVP: ['TL(guide)', 'FE', 'QA(light)'],
            Production: ['TL', 'FE', 'BE', 'QA', 'DOCS'],
            InternalTool: ['TL', 'FE', 'QA(light)'],
            LibraryAPI: ['TL', 'BE', 'QA', 'DOCS'],
        },
    };

    return matrix[persona]?.[projectType] ?? legacyFallbackRoles;
}

// ─── Role Merge (user picks × defaults) ──────────────────────────

/** Core roles that are always included regardless of user selection. */
const ALWAYS_ON_ROLES = ['TL', 'QA'];

/**
 * Merge user-selected roles with pack defaults.
 * - If userPicked is empty/undefined, returns defaults unchanged.
 * - Otherwise, starts from userPicked, ensures ALWAYS_ON_ROLES present.
 * - Preserves explicit user-picked variants.
 * - Falls back to the pack's variant only when an always-on role was not selected.
 */
export function mergeUserRoles(defaults: string[], userPicked?: string[]): string[] {
    if (!userPicked || userPicked.length === 0) {
        return defaults;
    }

    // Filter out header entries (e.g. _header_leadership)
    const picked = userPicked.filter((r) => !r.startsWith('_'));

    // Extract base IDs for comparison
    const baseId = (role: string): string => role.match(/^([A-Z]+)/)?.[1] ?? role;

    // Start with user picks, but use qualified variant from defaults if available
    const result: string[] = [];
    const seen = new Set<string>();

    for (const role of picked) {
        const base = baseId(role);
        if (seen.has(base)) continue;
        seen.add(base);
        result.push(role);
    }

    // Ensure always-on roles are present
    for (const core of ALWAYS_ON_ROLES) {
        if (!seen.has(core)) {
            const defaultVariant = defaults.find((d) => baseId(d) === core);
            result.push(defaultVariant ?? core);
            seen.add(core);
        }
    }

    return result;
}
