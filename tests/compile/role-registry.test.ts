/**
 * Tests: Role Registry — single source of truth for role IDs
 */

import { describe, it, expect } from 'vitest';
import {
    CANONICAL_ROLES,
    ROLE_ALIASES,
    ROLE_RUNTIME_NAMES,
    ROLE_CAPABILITY_IDS,
    resolveRole,
    resolveRoles,
    isCanonical,
    getAllCapabilityIds,
} from '../../src/compile/role-registry.js';

describe('Role Registry', () => {
    describe('CANONICAL_ROLES', () => {
        it('has exactly 12 canonical roles', () => {
            expect(CANONICAL_ROLES).toHaveLength(12);
        });

        it('includes all expected roles', () => {
            const expected = ['TL', 'PM', 'BA', 'FE', 'BE', 'MOBILE', 'DEVOPS', 'DATA', 'MLE', 'QA', 'SEC', 'DOCS'];
            for (const role of expected) {
                expect(CANONICAL_ROLES).toContain(role);
            }
        });

        it('does NOT include legacy roles', () => {
            const legacy = ['DEV', 'FS', 'UIUX', 'PE', 'BRAND', 'OPS'];
            for (const role of legacy) {
                expect(CANONICAL_ROLES).not.toContain(role);
            }
        });
    });

    describe('resolveRole', () => {
        it('passes through canonical roles', () => {
            expect(resolveRole('TL')).toEqual(['TL']);
            expect(resolveRole('FE')).toEqual(['FE']);
            expect(resolveRole('DEVOPS')).toEqual(['DEVOPS']);
        });

        it('strips variant suffix', () => {
            expect(resolveRole('TL(guide)')).toEqual(['TL']);
            expect(resolveRole('QA(light)')).toEqual(['QA']);
        });

        it('resolves DEV → [FE, BE]', () => {
            expect(resolveRole('DEV')).toEqual(['FE', 'BE']);
        });

        it('resolves FS → [FE, BE]', () => {
            expect(resolveRole('FS')).toEqual(['FE', 'BE']);
        });

        it('resolves UIUX → [FE]', () => {
            expect(resolveRole('UIUX')).toEqual(['FE']);
        });

        it('resolves PE → [MLE]', () => {
            expect(resolveRole('PE')).toEqual(['MLE']);
        });

        it('resolves BRAND → [FE]', () => {
            expect(resolveRole('BRAND')).toEqual(['FE']);
        });

        it('resolves OPS → [DEVOPS]', () => {
            expect(resolveRole('OPS')).toEqual(['DEVOPS']);
        });

        it('returns empty for unknown role', () => {
            expect(resolveRole('UNKNOWN')).toEqual([]);
            expect(resolveRole('XYZ')).toEqual([]);
        });
    });

    describe('resolveRoles', () => {
        it('resolves and deduplicates', () => {
            expect(resolveRoles(['DEV', 'FE'])).toEqual(['FE', 'BE']);
        });

        it('preserves order', () => {
            expect(resolveRoles(['QA', 'TL', 'FE'])).toEqual(['QA', 'TL', 'FE']);
        });

        it('handles mixed legacy and canonical', () => {
            expect(resolveRoles(['OPS', 'QA', 'DEV'])).toEqual(['DEVOPS', 'QA', 'FE', 'BE']);
        });
    });

    describe('isCanonical', () => {
        it('returns true for canonical roles', () => {
            expect(isCanonical('TL')).toBe(true);
            expect(isCanonical('FE')).toBe(true);
        });

        it('returns false for legacy roles', () => {
            expect(isCanonical('DEV')).toBe(false);
            expect(isCanonical('OPS')).toBe(false);
        });
    });

    describe('ROLE_RUNTIME_NAMES', () => {
        it('every canonical role has a runtime name', () => {
            for (const role of CANONICAL_ROLES) {
                expect(ROLE_RUNTIME_NAMES[role]).toBeDefined();
                expect(ROLE_RUNTIME_NAMES[role].length).toBeGreaterThan(0);
            }
        });

        it('no legacy role has a runtime name', () => {
            for (const legacy of Object.keys(ROLE_ALIASES)) {
                expect(ROLE_RUNTIME_NAMES).not.toHaveProperty(legacy);
            }
        });
    });

    describe('ROLE_CAPABILITY_IDS', () => {
        it('every canonical role has capabilities', () => {
            for (const role of CANONICAL_ROLES) {
                expect(ROLE_CAPABILITY_IDS[role]).toBeDefined();
                expect(ROLE_CAPABILITY_IDS[role].length).toBeGreaterThan(0);
            }
        });

        it('no legacy role has capabilities', () => {
            for (const legacy of Object.keys(ROLE_ALIASES)) {
                expect(ROLE_CAPABILITY_IDS).not.toHaveProperty(legacy);
            }
        });

        it('capability IDs are prefixed with role ID', () => {
            for (const [role, caps] of Object.entries(ROLE_CAPABILITY_IDS)) {
                for (const cap of caps) {
                    expect(cap.startsWith(role + '-') || cap.startsWith(role.split('-')[0] + '-')).toBe(true);
                }
            }
        });

        it('PM does NOT have PM-BRD', () => {
            expect(ROLE_CAPABILITY_IDS.PM).not.toContain('PM-BRD');
        });

        it('FE does NOT have FE-DESIGN', () => {
            expect(ROLE_CAPABILITY_IDS.FE).not.toContain('FE-DESIGN');
        });
    });

    describe('getAllCapabilityIds', () => {
        it('returns all unique capability IDs', () => {
            const all = getAllCapabilityIds();
            expect(all.length).toBeGreaterThan(30);
            expect(new Set(all).size).toBe(all.length); // no duplicates
        });
    });
});
