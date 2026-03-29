import { describe, it, expect } from 'vitest';
import {
    detectPersona,
    getProjectType,
    mergeUserRoles,
    selectRoles,
} from '../../src/intake/pack-selector.js';
import type { Persona, ProjectType, RawAnswers } from '../../src/intake/types.js';

describe('Pack Selector', () => {
    describe('detectPersona', () => {
        it('should map BizLed correctly', () => {
            expect(detectPersona('BizLed')).toBe('BizLed');
        });

        it('should map DevLed correctly', () => {
            expect(detectPersona('DevLed')).toBe('DevLed');
        });

        it('should map Solo correctly', () => {
            expect(detectPersona('Solo')).toBe('Solo');
        });

        it('should map Newbie correctly', () => {
            expect(detectPersona('Newbie')).toBe('Newbie');
        });

        it('should default to Newbie for unknown values', () => {
            expect(detectPersona('unknown')).toBe('Newbie');
            expect(detectPersona('')).toBe('Newbie');
        });
    });

    describe('getProjectType', () => {
        it('should read explicit Q_PT answer for MVP', () => {
            expect(getProjectType({ Q_PT: 'MVP' })).toBe('MVP');
        });

        it('should read explicit Q_PT answer for Production', () => {
            expect(getProjectType({ Q_PT: 'Production' })).toBe('Production');
        });

        it('should read explicit Q_PT answer for InternalTool', () => {
            expect(getProjectType({ Q_PT: 'InternalTool' })).toBe('InternalTool');
        });

        it('should read explicit Q_PT answer for LibraryAPI', () => {
            expect(getProjectType({ Q_PT: 'LibraryAPI' })).toBe('LibraryAPI');
        });

        it('should throw if Q_PT is missing', () => {
            expect(() => getProjectType({})).toThrow('Project type is required');
        });

        it('should throw for invalid Q_PT value', () => {
            expect(() => getProjectType({ Q_PT: 'invalid' })).toThrow('Invalid project type');
        });
    });

    describe('selectRoles — 2D Matrix (BRD §10.2)', () => {
        // ─── BizLed ──────────────────────────────────────────
        it('BizLed × MVP → TL, BA, FE, BE, QA, DOCS', () => {
            const roles = selectRoles('BizLed', 'MVP');
            expect(roles).toEqual(['TL', 'BA', 'FE', 'BE', 'QA', 'DOCS']);
        });

        it('BizLed × Production → TL, BA, FE, BE, QA(strong), DEVOPS(light), DOCS, SEC', () => {
            const roles = selectRoles('BizLed', 'Production');
            expect(roles).toEqual(['TL', 'BA', 'FE', 'BE', 'QA(strong)', 'DEVOPS(light)', 'DOCS', 'SEC']);
        });

        it('BizLed × InternalTool → TL, BA, FE, BE, QA(light), DOCS', () => {
            const roles = selectRoles('BizLed', 'InternalTool');
            expect(roles).toEqual(['TL', 'BA', 'FE', 'BE', 'QA(light)', 'DOCS']);
        });

        it('BizLed × LibraryAPI → TL, BA, BE, QA(strong), DOCS', () => {
            const roles = selectRoles('BizLed', 'LibraryAPI');
            expect(roles).toEqual(['TL', 'BA', 'BE', 'QA(strong)', 'DOCS']);
        });

        // ─── DevLed ──────────────────────────────────────────
        it('DevLed × MVP → TL, FE, BE, QA, DOCS', () => {
            const roles = selectRoles('DevLed', 'MVP');
            expect(roles).toEqual(['TL', 'FE', 'BE', 'QA', 'DOCS']);
        });

        it('DevLed × Production → TL, FE, BE, QA(strong), DEVOPS, DOCS', () => {
            const roles = selectRoles('DevLed', 'Production');
            expect(roles).toEqual(['TL', 'FE', 'BE', 'QA(strong)', 'DEVOPS', 'DOCS']);
        });

        // ─── Solo ────────────────────────────────────────────
        it('Solo × MVP → TL(guide), FE, QA(light)', () => {
            const roles = selectRoles('Solo', 'MVP');
            expect(roles).toEqual(['TL(guide)', 'FE', 'QA(light)']);
        });

        it('Solo × Production → TL, FE, BE, QA, DOCS', () => {
            const roles = selectRoles('Solo', 'Production');
            expect(roles).toEqual(['TL', 'FE', 'BE', 'QA', 'DOCS']);
        });

        // ─── Newbie ──────────────────────────────────────────
        it('Newbie × any → TL(guide), FE, QA(checklist)', () => {
            const projectTypes: ProjectType[] = ['MVP', 'Production', 'InternalTool', 'LibraryAPI'];
            for (const pt of projectTypes) {
                const roles = selectRoles('Newbie', pt);
                expect(roles).toEqual(['TL(guide)', 'FE', 'QA(checklist)']);
            }
        });

        it('falls back to TL, FE, QA when caller bypasses validated enums', () => {
            const roles = selectRoles('UnknownPersona' as Persona, 'UnknownProjectType' as ProjectType);
            expect(roles).toEqual(['TL', 'FE', 'QA']);
        });
    });

    describe('mergeUserRoles', () => {
        it('preserves explicit user overrides instead of forcing the default variant back in', () => {
            const merged = mergeUserRoles(['TL(guide)', 'FE', 'QA(light)'], ['TL', 'FE', 'QA']);
            expect(merged).toEqual(['TL', 'FE', 'QA']);
        });

        it('keeps explicit specialized variants chosen by the user', () => {
            const merged = mergeUserRoles(['TL', 'FE', 'BE', 'QA(strong)', 'DEVOPS', 'DOCS'], ['QA(light)', 'DOCS']);
            expect(merged).toEqual(['QA(light)', 'DOCS', 'TL']);
        });
    });
});
