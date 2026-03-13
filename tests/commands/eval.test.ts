import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execute, parseArgs } from '../../src/commands/eval.js';

const originalCwd = process.cwd();
const TEST_DIR = join(originalCwd, '__test_eval__');

function cleanup(): void {
    if (existsSync(TEST_DIR)) {
        rmSync(TEST_DIR, { recursive: true, force: true });
    }
}

function writeConfig(language: 'en' | 'vi' = 'vi'): void {
    mkdirSync(TEST_DIR, { recursive: true });
    writeFileSync(join(TEST_DIR, 'stackmoss.config.json'), JSON.stringify({
        schemaVersion: '1.0',
        state: 'OPERATIONAL',
        projectName: 'demo',
        language,
        userType: 'BizLed',
        projectType: 'MVP',
        targets: ['ClaudeCodeV2'],
        mode: 'suggest_only',
        intakeMode: 'fast',
        budgets: {
            capabilityDefault: 120,
            capabilityMax: 240,
            teamTotalMax: 1800,
            migrationReport: 700,
        },
        thresholds: {
            promoteRequiresZeroQuestions: true,
            promoteRequiresVerifiedAlias: true,
            minHypothesisConfidence: 0.8,
            patchTriggerMinRepeat: 2,
        },
        autoAddRoles: {
            securityLite: false,
            devOpsLite: false,
        },
    }, null, 2), 'utf-8');
}

describe('Command: eval', () => {
    beforeEach(() => {
        process.chdir(originalCwd);
        cleanup();
    });

    afterEach(() => {
        process.chdir(originalCwd);
        cleanup();
    });

    it('parseArgs defaults to smoke profile', () => {
        writeConfig();
        process.chdir(TEST_DIR);

        const args = parseArgs(undefined, {});

        expect(args.profile).toBe('smoke');
        expect(args.grade).toBe(false);
    });

    it('prepare mode creates portable eval artifacts', () => {
        writeConfig('vi');

        const result = execute(TEST_DIR, 'smoke', 'vi', false);
        expect(result.mode).toBe('prepare');
        expect(existsSync(join(TEST_DIR, 'evals', 'current', 'case.md'))).toBe(true);
        expect(existsSync(join(TEST_DIR, 'evals', 'current', 'instructions.md'))).toBe(true);
        expect(existsSync(join(TEST_DIR, 'evals', 'current', 'expected.json'))).toBe(true);
        expect(result.prompt).toContain('Tech Lead');
        expect(readFileSync(join(TEST_DIR, 'evals', 'current', 'instructions.md'), 'utf-8')).toContain('stackmoss eval smoke --grade');
    });

    it('grade mode passes when required markers exist', () => {
        writeConfig('en');
        execute(TEST_DIR, 'smoke', 'en', false);

        writeFileSync(join(TEST_DIR, 'evals', 'current', 'result.md'), `[STACKMOSS_EVAL]
profile: smoke
verdict: PASS
calibration_needed: no
summary: Team is usable.
findings:
- none
next_steps:
- Continue with feature work.
- Re-run full eval later.
[/STACKMOSS_EVAL]
`, 'utf-8');

        const graded = execute(TEST_DIR, 'smoke', 'en', true);
        expect(graded.mode).toBe('grade');
        expect(graded.passed).toBe(true);
        expect(readFileSync(join(TEST_DIR, 'evals', 'current', 'report.md'), 'utf-8')).toContain('status: PASS');
    });

    it('grade mode fails when result markers are missing', () => {
        writeConfig('en');
        execute(TEST_DIR, 'smoke', 'en', false);
        writeFileSync(join(TEST_DIR, 'evals', 'current', 'result.md'), 'bad output', 'utf-8');

        const graded = execute(TEST_DIR, 'smoke', 'en', true);
        expect(graded.mode).toBe('grade');
        expect(graded.passed).toBe(false);
        expect(graded.findings.length).toBeGreaterThan(0);
    });

    it('grade mode fails when calibration is still needed but verdict says PASS', () => {
        writeConfig('en');
        execute(TEST_DIR, 'smoke', 'en', false);

        writeFileSync(join(TEST_DIR, 'evals', 'current', 'result.md'), `[STACKMOSS_EVAL]
profile: smoke
verdict: PASS
calibration_needed: yes
summary: Team still needs Tech Lead calibration.
findings:
- none
next_steps:
- Ask Tech Lead to recalibrate the team.
[/STACKMOSS_EVAL]
`, 'utf-8');

        const graded = execute(TEST_DIR, 'smoke', 'en', true);
        expect(graded.passed).toBe(false);
        expect(graded.findings).toContain('verdict cannot be PASS when calibration_needed is yes.');
    });

    it('grade mode fails when summary or findings are placeholders', () => {
        writeConfig('en');
        execute(TEST_DIR, 'full', 'en', false);

        writeFileSync(join(TEST_DIR, 'evals', 'current', 'result.md'), `[STACKMOSS_EVAL]
profile: full
verdict: FAIL
calibration_needed: no
summary: <one short sentence>
findings:
- none
next_steps:
- Re-run the eval.
[/STACKMOSS_EVAL]
`, 'utf-8');

        const graded = execute(TEST_DIR, 'full', 'en', true);
        expect(graded.passed).toBe(false);
        expect(graded.findings).toContain('summary must contain a concrete sentence, not a placeholder.');
        expect(graded.findings).toContain('verdict FAIL must include at least one concrete finding.');
    });
});
