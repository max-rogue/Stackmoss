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
 * | BizLed   | MVP          | TL, BA, FS, QA, DOCS                             |
 * | BizLed   | Production   | TL, BA, FE, BE, QA(strong), OPS(light), DOCS, SEC-lite |
 * | DevLed   | MVP          | TL, FS, QA, DOCS                                 |
 * | DevLed   | Production   | TL, FE, BE, QA(strong), DEVOPS, DOCS             |
 * | Solo     | MVP          | TL(guide), DEV(small), QA(light)                 |
 * | Solo     | Production   | TL, FS, QA, DOCS                                 |
 * | Newbie   | any          | TL(guide), DEV(small), QA(checklist)              |
 */
export function selectRoles(persona: Persona, projectType: ProjectType): string[] {
    // Newbie overrides everything
    if (persona === 'Newbie') {
        return ['TL(guide)', 'DEV(small)', 'QA(checklist)'];
    }

    // Legacy fallback: if a caller bypasses validated intake enums,
    // preserve the pre-specialization DEV lane instead of returning FS.
    const legacyFallbackRoles = ['TL', 'DEV', 'QA'];

    const matrix: Record<string, Record<string, string[]>> = {
        BizLed: {
            MVP: ['TL', 'BA', 'FS', 'QA', 'DOCS'],
            Production: ['TL', 'BA', 'FE', 'BE', 'QA(strong)', 'OPS(light)', 'DOCS', 'SEC-lite'],
            InternalTool: ['TL', 'BA', 'FS', 'QA(light)', 'DOCS'],
            LibraryAPI: ['TL', 'BA', 'BE', 'QA(strong)', 'DOCS'],
        },
        DevLed: {
            MVP: ['TL', 'FS', 'QA', 'DOCS'],
            Production: ['TL', 'FE', 'BE', 'QA(strong)', 'DEVOPS', 'DOCS'],
            InternalTool: ['TL', 'FS', 'QA(checklist)', 'DOCS'],
            LibraryAPI: ['TL', 'BE', 'QA(strong)', 'DOCS'],
        },
        Solo: {
            MVP: ['TL(guide)', 'DEV(small)', 'QA(light)'],
            Production: ['TL', 'FS', 'QA', 'DOCS'],
            InternalTool: ['TL', 'FS', 'QA(light)'],
            LibraryAPI: ['TL', 'BE', 'QA', 'DOCS'],
        },
    };

    return matrix[persona]?.[projectType] ?? legacyFallbackRoles;
}

