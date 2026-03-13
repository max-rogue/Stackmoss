import { extractRoleId } from '../templates/team.js';

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
