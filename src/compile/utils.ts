import { extractRoleId } from '../templates/team.js';
import { resolveRoles, type CanonicalRoleId } from './role-registry.js';

export function uniqueRoles(roles: string[], autoAddedRoles: string[]): string[] {
    const seen = new Set<string>();
    const allRoles: string[] = [];

    for (const role of [...roles, ...autoAddedRoles]) {
        const baseId = extractRoleId(role);
        if (!seen.has(baseId)) {
            seen.add(baseId);
            allRoles.push(role);
        }
    }

    return allRoles;
}

export function uniqueRoleIds(roles: string[], autoAddedRoles: string[]): string[] {
    return Array.from(new Set(uniqueRoles(roles, autoAddedRoles).map(extractRoleId)));
}

/**
 * Resolve all input roles to unique canonical IDs, preventing path collisions.
 * - Known aliases (DEV, FS, OPS, etc.) → resolve to canonical IDs
 * - Unknown/custom roles → pass through as-is (for custom project roles)
 * - Variant qualifiers like (light) are preserved on the canonical ID
 * - Deduplicates by canonical base ID
 */
export function canonicalUniqueRoles(roles: string[], autoAddedRoles: string[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const raw of [...roles, ...autoAddedRoles]) {
        const baseId = extractRoleId(raw);
        const variant = raw.slice(baseId.length); // e.g. '(light)' or ''
        const resolved = resolveRoles([baseId]);
        if (resolved.length > 0) {
            for (const r of resolved) {
                if (!seen.has(r)) {
                    seen.add(r);
                    result.push(r + variant);
                }
            }
        } else {
            // Unknown/custom role — pass through
            if (!seen.has(baseId)) {
                seen.add(baseId);
                result.push(raw);
            }
        }
    }
    return result;
}
