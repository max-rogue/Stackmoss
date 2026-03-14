import { describe, expect, it } from 'vitest';
import { generateCalibrate, generateCalibrateRule } from '../../src/templates/calibrate.js';
import { createSampleInput } from './helpers.js';

describe('Template: calibration docs', () => {
    it('documents Codex runtime files in CALIBRATE.md', () => {
        const result = generateCalibrate(createSampleInput());

        expect(result.path).toBe('CALIBRATE.md');
        expect(result.content).toContain('`AGENTS.md` + `.agents/skills/*/SKILL.md`');
    });

    it('keeps Codex runtime boundaries in calibrate-rule.md', () => {
        const result = generateCalibrateRule(createSampleInput());

        expect(result.path).toBe('calibrate-rule.md');
        expect(result.content).toContain('`AGENTS.md` + `.agents/skills/*`');
        expect(result.content).toContain('`.agent/*`');
    });
});
