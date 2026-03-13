import { describe, it, expect } from 'vitest';
import { compileAntigravity, capabilityToSlug } from '../../src/compile/antigravity.js';

describe('Antigravity Compile Target', () => {
    describe('capabilityToSlug', () => {
        it('converts TL-ARCH to tech-lead--arch', () => {
            expect(capabilityToSlug('TL-ARCH')).toBe('tech-lead--arch');
        });

        it('converts DEV-IMPL to developer--impl', () => {
            expect(capabilityToSlug('DEV-IMPL')).toBe('developer--impl');
        });

        it('converts QA-TEST to quality-assurance--test', () => {
            expect(capabilityToSlug('QA-TEST')).toBe('quality-assurance--test');
        });

        it('converts SEC-SCAN to security-auditor--scan', () => {
            expect(capabilityToSlug('SEC-SCAN')).toBe('security-auditor--scan');
        });
    });

    describe('compileAntigravity', () => {
        it('creates one SKILL.md per capability plus shared rule/workflow files', () => {
            const files = compileAntigravity(['TL(guide)'], [], 'test-project');

            expect(files.length).toBe(12);
        });

        it('outputs native and compatibility skill files', () => {
            const files = compileAntigravity(['DEV'], [], 'test-project');

            expect(files.some((file) => file.path.startsWith('.agents/skills/'))).toBe(true);
            expect(files.some((file) => file.path.startsWith('.agent/skills/'))).toBe(true);
        });

        it('generates shared rules and workflows for both .agents and .agent', () => {
            const files = compileAntigravity(['DEV'], [], 'test-project');
            const paths = files.map((file) => file.path);

            expect(paths).toContain('.agents/rules/team-bootstrap.md');
            expect(paths).toContain('.agents/workflows/calibrate-team.md');
            expect(paths).toContain('.agent/rules/team-bootstrap.md');
            expect(paths).toContain('.agent/workflows/calibrate-team.md');
        });

        it('generates correct folder names per capability', () => {
            const files = compileAntigravity(['TL(guide)'], [], 'test-project');
            const paths = files.map((file) => file.path);

            expect(paths).toContain('.agents/skills/tech-lead--arch/SKILL.md');
            expect(paths).toContain('.agents/skills/tech-lead--review/SKILL.md');
            expect(paths).toContain('.agent/skills/tech-lead--context/SKILL.md');
            expect(paths).toContain('.agent/skills/tech-lead--plan/SKILL.md');
        });

        it('includes YAML frontmatter with name and description', () => {
            const files = compileAntigravity(['DEV'], [], 'test-project');
            const implSkill = files.find((file) => file.path === '.agents/skills/developer--impl/SKILL.md');

            expect(implSkill!.content).toContain('---');
            expect(implSkill!.content).toContain('name: developer--impl');
            expect(implSkill!.content).toContain('description:');
        });

        it('includes budget in skill content', () => {
            const files = compileAntigravity(['TL(guide)'], [], 'test-project');
            const archSkill = files.find((file) => file.path === '.agents/skills/tech-lead--arch/SKILL.md');

            expect(archSkill!.content).toContain('280 words');
        });

        it('deduplicates roles', () => {
            const files = compileAntigravity(['DEV', 'DEV'], ['DEV'], 'test-project');
            const nativeSkills = files.filter((file) => file.path.startsWith('.agents/skills/'));
            expect(nativeSkills).toHaveLength(3);
        });

        it('keeps QA(light) variant from emitting regression skill', () => {
            const files = compileAntigravity(['QA(light)'], [], 'test-project');
            const paths = files.map((file) => file.path);

            expect(paths).toContain('.agents/skills/quality-assurance--test/SKILL.md');
            expect(paths).not.toContain('.agents/skills/quality-assurance--regression/SKILL.md');
        });

        it('handles unknown roles with fallback', () => {
            const files = compileAntigravity(['CUSTOM'], [], 'test-project');
            expect(files.some((file) => file.path === '.agents/skills/custom/SKILL.md')).toBe(true);
            expect(files.some((file) => file.path === '.agent/skills/custom/SKILL.md')).toBe(true);
        });
    });
});
