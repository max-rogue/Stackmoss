import { describe, it, expect } from 'vitest';
import { compileAntigravity } from '../../src/compile/antigravity.js';

describe('Antigravity Compile Target', () => {
    it('creates shared rules/workflows and expanded TL role bundle', () => {
        const files = compileAntigravity(['TL(guide)'], [], 'test-project');
        expect(files.length).toBe(34);
    });

    it('outputs only .agent workspace paths', () => {
        const files = compileAntigravity(['FE'], [], 'test-project');
        expect(files.every((file) => file.path.startsWith('.agent/'))).toBe(true);
    });

    it('generates shared rules and workflows including git-workflow and execution-loop', () => {
        const files = compileAntigravity(['FE'], [], 'test-project');
        const paths = files.map((file) => file.path);

        expect(paths).toContain('.agent/rules/team-bootstrap.md');
        expect(paths).toContain('.agent/rules/methodology.md');
        expect(paths).toContain('.agent/workflows/calibrate-team.md');
        expect(paths).toContain('.agent/workflows/tdd-cycle.md');
        expect(paths).toContain('.agent/workflows/debugging-protocol.md');
        expect(paths).toContain('.agent/workflows/review-reception.md');
        expect(paths).toContain('.agent/workflows/planning-protocol.md');
        expect(paths).toContain('.agent/workflows/git-workflow.md');
        expect(paths).toContain('.agent/workflows/execution-loop.md');
    });

    it('generates role-level skill folder per role', () => {
        const files = compileAntigravity(['TL(guide)'], [], 'test-project');
        const paths = files.map((file) => file.path);

        expect(paths).toContain('.agent/skills/tech-lead/SKILL.md');
        expect(paths).toContain('.agent/skills/tech-lead/calibrate.md');
        expect(paths).toContain('.agent/skills/skill-creator/SKILL.md');
    });

    it('includes yaml frontmatter with name and description', () => {
        const files = compileAntigravity(['FE'], [], 'test-project');
        const feSkill = files.find((file) => file.path === '.agent/skills/frontend/SKILL.md');

        expect(feSkill!.content).toContain('---');
        expect(feSkill!.content).toContain('name: frontend');
        expect(feSkill!.content).toContain('description:');
        expect(feSkill!.content).toContain('ROLE_SKILL_OVERRIDES.md');
    });

    it('keeps QA(light) variant from emitting regression capability', () => {
        const files = compileAntigravity(['QA(light)'], [], 'test-project');
        const qaSkill = files.find((file) => file.path === '.agent/skills/quality-assurance/SKILL.md');

        expect(qaSkill).toBeDefined();
        expect(qaSkill!.content).toContain('QA-TEST');
        expect(qaSkill!.content).not.toContain('QA-REGRESSION');
    });

    it('references shared methodology from role skills', () => {
        const files = compileAntigravity(['FE'], [], 'test-project');
        const feSkill = files.find((file) => file.path === '.agent/skills/frontend/SKILL.md');
        const methodologyRule = files.find((file) => file.path === '.agent/rules/methodology.md');

        expect(feSkill!.content).toContain('shared methodology rules and workflows');
        expect(methodologyRule!.content).toContain('Shared Methodology');
        expect(methodologyRule!.content).toContain('Review Reception');
    });

    it('embeds secret-handling guidance in bootstrap and role skill output', () => {
        const files = compileAntigravity(['FE'], [], 'test-project');
        const bootstrapRule = files.find((file) => file.path === '.agent/rules/team-bootstrap.md');
        const feSkill = files.find((file) => file.path === '.agent/skills/frontend/SKILL.md');

        expect(bootstrapRule!.content).toContain('Never store or push secrets');
        expect(feSkill!.content).toContain('Never persist secrets or credentials');
    });

    it('generates correct file count for Production DevLed team', () => {
        const files = compileAntigravity(
            ['TL', 'FE', 'BE', 'QA(strong)', 'DEVOPS', 'DOCS'], [], 'prod-project',
        );
        expect(files.length).toBe(39);
    });
});
