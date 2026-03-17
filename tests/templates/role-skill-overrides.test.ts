import { describe, expect, it } from 'vitest';
import { generateRoleSkillOverrides } from '../../src/templates/role-skill-overrides.js';
import { createSampleInput, createSampleIntake } from './helpers.js';

describe('Template: ROLE_SKILL_OVERRIDES.md', () => {
    it('generates the persistent override source file', () => {
        const result = generateRoleSkillOverrides(createSampleInput());

        expect(result.path).toBe('ROLE_SKILL_OVERRIDES.md');
        expect(result.content).toContain('editable source of truth');
        expect(result.content).toContain('Do not edit generated runtime `SKILL.md` files directly');
    });

    it('lists active roles and variants from the current team', () => {
        const result = generateRoleSkillOverrides(createSampleInput({
            intake: createSampleIntake({
                roles: ['TL(guide)', 'DEV(small)', 'QA(light)'],
                autoAddedRoles: ['SEC-lite'],
            }),
        }));

        expect(result.content).toContain('### [TL] Tech Lead');
        expect(result.content).toContain('variants_in_team: TL(guide)');
        expect(result.content).toContain('### [DEV] Developer');
        expect(result.content).toContain('variants_in_team: DEV(small)');
        expect(result.content).toContain('### [QA] Quality Assurance');
        expect(result.content).toContain('variants_in_team: QA(light)');
        expect(result.content).toContain('### [SEC] Security-lite');
    });
});
