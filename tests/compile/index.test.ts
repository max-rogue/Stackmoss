import { describe, it, expect } from 'vitest';
import { compileBootstrapTargets, compileTarget } from '../../src/compile/index.js';

describe('Compile Target Dispatcher', () => {
    it('supports Roo target output', () => {
        const files = compileTarget('Roo', ['DEV'], [], 'demo');

        expect(files.length).toBeGreaterThan(0);
        expect(files[0].path).toMatch(/^\.roo\/skills\//);
        expect(files.some((file) => file.path === '.roo/skills/stackmoss-methodology/SKILL.md')).toBe(true);
    });

    it('generates all happy-path bootstrap targets except Roo', () => {
        const files = compileBootstrapTargets(['TL', 'DEV'], [], 'demo');
        const paths = files.map((file) => file.path);
        const uniquePaths = new Set(paths);

        expect(paths).toContain('CLAUDE.md');
        expect(paths).toContain('AGENTS.md');
        expect(paths).toContain('.github/copilot-instructions.md');
        expect(paths).toContain('.agents/skills/stackmoss-bootstrap/SKILL.md');
        expect(paths).toContain('.agents/skills/methodology/SKILL.md');
        expect(paths).toContain('.claude/skills/stackmoss-methodology/SKILL.md');
        expect(paths).toContain('.cursor/skills/stackmoss-methodology/SKILL.md');
        expect(paths).toContain('.agent/rules/methodology.md');
        expect(paths.some((path) => path.startsWith('.agents/skills/'))).toBe(true);
        expect(paths.some((path) => path.startsWith('.claude/skills/'))).toBe(true);
        expect(paths.some((path) => path.startsWith('.cursor/skills/'))).toBe(true);
        expect(paths.some((path) => path.startsWith('.agent/skills/'))).toBe(true);
        expect(paths.some((path) => path.startsWith('.agent/rules/'))).toBe(true);
        expect(paths.some((path) => path.startsWith('.agent/workflows/'))).toBe(true);
        expect(paths.some((path) => path.startsWith('.roo/'))).toBe(false);
        expect(uniquePaths.size).toBe(paths.length);
        expect(paths).toHaveLength(26);
    });
});
