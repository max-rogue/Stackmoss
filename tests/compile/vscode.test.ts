import { describe, it, expect } from 'vitest';
import { compileVSCode } from '../../src/compile/vscode.js';

describe('VSCode Compile Target', () => {
    it('generates copilot instructions and a repository-wide instructions file', () => {
        const files = compileVSCode(['TL', 'DEV'], [], 'demo');
        const root = files.find((file) => file.path === '.github/copilot-instructions.md');
        const team = files.find((file) => file.path === '.github/instructions/team-bootstrap.instructions.md');

        expect(root).toBeDefined();
        expect(root!.content).toContain('Tech Lead');
        expect(root!.content).toContain('AGENTS.md');
        expect(root!.content).toContain('## Methodology');
        expect(root!.content).toContain('Evidence Before Claims');
        expect(root!.content).toContain('Adapted from selected Superpowers ideas');

        expect(team).toBeDefined();
        expect(team!.content).toContain('applyTo: "**"');
        expect(team!.content).toContain('single writer');
    });
});
