import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { CONFIG_FILENAME } from '../config.js';
import { readState } from '../state-machine.js';
import { getEvalRunPrompt, getNextStepLines, readProjectLanguage, type UiLanguage } from '../user-guidance.js';

type EvalProfile = 'smoke' | 'full';

interface EvalConfigLike {
    language?: string;
    state?: string;
}

interface EvalExpected {
    profile: EvalProfile;
    language: UiLanguage;
    requiredMarkers: string[];
}

interface ParsedEvalResult {
    verdict: 'PASS' | 'FAIL' | null;
    calibrationNeeded: 'yes' | 'no' | null;
    summary: string;
    findings: string[];
    nextSteps: string[];
}

export interface EvalPrepareResult {
    mode: 'prepare';
    projectPath: string;
    language: UiLanguage;
    profile: EvalProfile;
    casePath: string;
    instructionsPath: string;
    expectedPath: string;
    resultPath: string;
    prompt: string;
}

export interface EvalGradeResult {
    mode: 'grade';
    projectPath: string;
    language: UiLanguage;
    profile: EvalProfile;
    resultPath: string;
    reportPath: string;
    passed: boolean;
    findings: string[];
}

export type EvalResult = EvalPrepareResult | EvalGradeResult;

function getEvalDir(projectPath: string): string {
    return join(projectPath, 'evals', 'current');
}

function getCaseBody(profile: EvalProfile, language: UiLanguage): string {
    if (language === 'vi') {
        const depthLine = profile === 'full'
            ? '- Di sau hon vao team shape, calibration, command facts, va handoff.'
            : '- Tap trung vao bootstrap, calibration, va next-step guidance.';
        return `# StackMoss Team Eval - ${profile}

## Muc tieu
- Danh gia xem team agent hien tai co the duoc user su dung ngay hay chua.
${depthLine}

## Rules
- Khong apply patch.
- Chi de xuat thay doi neu can.
- Doc team.md, FEATURES.md, NORTH_STAR.md, README_AGENT_TEAM.md truoc khi ket luan.
- Neu BRD chua lock, phai noi ro F1 can tro thanh lock BRD voi Tech Lead + BA.
- Neu team van con bootstrap marker hoac TBD facts, phai noi ro calibration chua xong.

## Output format bat buoc
[STACKMOSS_EVAL]
profile: ${profile}
verdict: PASS|FAIL
calibration_needed: yes|no
summary: <mot cau ngan>
findings:
- <finding 1>
- <finding 2 hoac "none">
next_steps:
- <step 1>
- <step 2>
[/STACKMOSS_EVAL]
`;
    }

    const depthLine = profile === 'full'
        ? '- Go deeper on team shape, calibration quality, command facts, and handoffs.'
        : '- Focus on bootstrap readiness, calibration, and next-step guidance.';
    return `# StackMoss Team Eval - ${profile}

## Goal
- Evaluate whether the current agent team is ready for user-facing usage.
${depthLine}

## Rules
- Do not apply patches.
- Only propose changes if needed.
- Read team.md, FEATURES.md, NORTH_STAR.md, and README_AGENT_TEAM.md before concluding.
- If the BRD is not locked, say clearly that F1 must become lock-BRD work with Tech Lead + BA.
- If bootstrap markers or TBD facts remain, say clearly that calibration is not finished.

## Required output format
[STACKMOSS_EVAL]
profile: ${profile}
verdict: PASS|FAIL
calibration_needed: yes|no
summary: <one short sentence>
findings:
- <finding 1>
- <finding 2 or "none">
next_steps:
- <step 1>
- <step 2>
[/STACKMOSS_EVAL]
`;
}

function getInstructionsBody(language: UiLanguage, profile: EvalProfile, resultPath: string): string {
    const prompt = getEvalRunPrompt(language, profile, resultPath);

    if (language === 'vi') {
        return `# Cach chay eval

1. Mo runtime ban dang dung.
2. Gui prompt duoi day cho Tech Lead:

${prompt}

3. Dam bao agent ghi ket qua vao \`${resultPath}\`.
4. Sau do chay:
\`stackmoss eval ${profile} --grade\`
`;
    }

    return `# How to run the eval

1. Open the runtime you actually use.
2. Send the prompt below to Tech Lead:

${prompt}

3. Make sure the agent writes the result to \`${resultPath}\`.
4. Then run:
\`stackmoss eval ${profile} --grade\`
`;
}

function writeEvalFiles(projectPath: string, profile: EvalProfile, language: UiLanguage): EvalPrepareResult {
    const evalDir = getEvalDir(projectPath);
    mkdirSync(evalDir, { recursive: true });

    const casePath = join(evalDir, 'case.md');
    const instructionsPath = join(evalDir, 'instructions.md');
    const expectedPath = join(evalDir, 'expected.json');
    const resultPath = join(evalDir, 'result.md');
    const prompt = getEvalRunPrompt(language, profile, 'evals/current/result.md');

    const expected: EvalExpected = {
        profile,
        language,
        requiredMarkers: [
            '[STACKMOSS_EVAL]',
            `profile: ${profile}`,
            'verdict: ',
            'calibration_needed: ',
            'summary: ',
            'findings:',
            'next_steps:',
            '[/STACKMOSS_EVAL]',
        ],
    };

    writeFileSync(casePath, getCaseBody(profile, language), 'utf-8');
    writeFileSync(instructionsPath, getInstructionsBody(language, profile, 'evals/current/result.md'), 'utf-8');
    writeFileSync(expectedPath, JSON.stringify(expected, null, 2) + '\n', 'utf-8');

    return {
        mode: 'prepare',
        projectPath,
        language,
        profile,
        casePath,
        instructionsPath,
        expectedPath,
        resultPath,
        prompt,
    };
}

function gradeEval(projectPath: string, profile: EvalProfile, language: UiLanguage): EvalGradeResult {
    const evalDir = getEvalDir(projectPath);
    const expectedPath = join(evalDir, 'expected.json');
    const resultPath = join(evalDir, 'result.md');
    const reportPath = join(evalDir, 'report.md');
    const findings: string[] = [];

    if (!existsSync(expectedPath)) {
        findings.push('Missing evals/current/expected.json. Run prepare mode first.');
    }

    if (!existsSync(resultPath)) {
        findings.push('Missing evals/current/result.md. Run the eval with your runtime first.');
    }

    if (findings.length === 0) {
        const expected = JSON.parse(readFileSync(expectedPath, 'utf-8')) as EvalExpected;
        const resultContent = readFileSync(resultPath, 'utf-8');

        for (const marker of expected.requiredMarkers) {
            if (!resultContent.includes(marker)) {
                findings.push(`Missing required marker: ${marker}`);
            }
        }

        if (!/verdict:\s*(PASS|FAIL)/.test(resultContent)) {
            findings.push('Verdict must be PASS or FAIL.');
        }

        if (!/calibration_needed:\s*(yes|no)/.test(resultContent)) {
            findings.push('calibration_needed must be yes or no.');
        }

        const parsed = parseResultContent(resultContent);
        findings.push(...validateParsedEval(parsed));
    }

    const passed = findings.length === 0;
    const reportLines = passed
        ? [
            '# StackMoss Eval Report',
            '',
            '- status: PASS',
            `- profile: ${profile}`,
            '- findings: none',
        ]
        : [
            '# StackMoss Eval Report',
            '',
            '- status: FAIL',
            `- profile: ${profile}`,
            ...findings.map((finding) => `- finding: ${finding}`),
        ];
    writeFileSync(reportPath, `${reportLines.join('\n')}\n`, 'utf-8');

    return {
        mode: 'grade',
        projectPath,
        language,
        profile,
        resultPath,
        reportPath,
        passed,
        findings,
    };
}

function collectBullets(text: string, heading: 'findings' | 'next_steps'): string[] {
    const match = text.match(new RegExp(`${heading}:\\s*([\\s\\S]*?)(?:\\n[a-z_]+:\\s|\\n\\[/STACKMOSS_EVAL\\])`, 'i'));
    if (!match) {
        return [];
    }

    return match[1]
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.startsWith('- '))
        .map((line) => line.slice(2).trim())
        .filter(Boolean);
}

function parseResultContent(text: string): ParsedEvalResult {
    const verdictMatch = text.match(/verdict:\s*(PASS|FAIL)/);
    const calibrationMatch = text.match(/calibration_needed:\s*(yes|no)/);
    const summaryMatch = text.match(/summary:\s*(.+)/);

    return {
        verdict: verdictMatch ? verdictMatch[1] as 'PASS' | 'FAIL' : null,
        calibrationNeeded: calibrationMatch ? calibrationMatch[1] as 'yes' | 'no' : null,
        summary: summaryMatch ? summaryMatch[1].trim() : '',
        findings: collectBullets(text, 'findings'),
        nextSteps: collectBullets(text, 'next_steps'),
    };
}

function validateParsedEval(parsed: ParsedEvalResult): string[] {
    const findings: string[] = [];

    if (parsed.summary.length < 10 || /^<.*>$/.test(parsed.summary)) {
        findings.push('summary must contain a concrete sentence, not a placeholder.');
    }

    if (parsed.findings.length === 0) {
        findings.push('findings must include at least one bullet.');
    }

    if (parsed.nextSteps.length === 0) {
        findings.push('next_steps must include at least one bullet.');
    }

    if (parsed.verdict === 'PASS' && parsed.calibrationNeeded === 'yes') {
        findings.push('verdict cannot be PASS when calibration_needed is yes.');
    }

    if (parsed.verdict === 'PASS' && parsed.findings.some((item) => item.toLowerCase() !== 'none')) {
        findings.push('verdict PASS may only use findings: none.');
    }

    if (parsed.verdict === 'FAIL' && parsed.findings.every((item) => item.toLowerCase() === 'none')) {
        findings.push('verdict FAIL must include at least one concrete finding.');
    }

    return findings;
}

export function parseArgs(
    profile: string | undefined,
    options: { grade?: boolean } = {},
): { projectPath: string; configPath: string; profile: EvalProfile; grade: boolean } {
    const projectPath = resolve('.');
    const configPath = join(projectPath, CONFIG_FILENAME);

    if (!existsSync(configPath)) {
        throw new Error(`No ${CONFIG_FILENAME} found in current directory.`);
    }

    const normalizedProfile = (profile?.trim().toLowerCase() || 'smoke') as EvalProfile;
    if (normalizedProfile !== 'smoke' && normalizedProfile !== 'full') {
        throw new Error(`Unsupported eval profile '${profile}'. Use 'smoke' or 'full'.`);
    }

    return {
        projectPath,
        configPath,
        profile: normalizedProfile,
        grade: options.grade === true,
    };
}

export function checkState(configPath: string): UiLanguage {
    const currentState = readState(configPath);
    if (!['GLOBAL', 'MIGRATING', 'OPERATIONAL'].includes(currentState)) {
        throw new Error(`Unsupported state '${currentState}' for eval.`);
    }

    return readProjectLanguage(resolve('.'));
}

export function execute(
    projectPath: string,
    profile: EvalProfile,
    language: UiLanguage,
    grade: boolean,
): EvalResult {
    return grade
        ? gradeEval(projectPath, profile, language)
        : writeEvalFiles(projectPath, profile, language);
}

export function report(result: EvalResult): void {
    if (result.mode === 'prepare') {
        console.log(result.language === 'vi'
            ? `\n✅ Da chuan bi eval profile '${result.profile}'.`
            : `\n✅ Prepared '${result.profile}' eval profile.`);
        console.log(`   - case: ${result.casePath}`);
        console.log(`   - instructions: ${result.instructionsPath}`);
        console.log(`   - expected: ${result.expectedPath}`);
        console.log(`   - result target: ${result.resultPath}`);
        console.log('');
        for (const line of getNextStepLines(result.language, 'eval-prepare')) {
            console.log(line);
        }
        console.log('');
        console.log(result.language === 'vi' ? 'Prompt eval:' : 'Eval prompt:');
        console.log(result.prompt);
        return;
    }

    if (result.passed) {
        console.log(result.language === 'vi'
            ? '\n✅ Eval PASS.'
            : '\n✅ Eval PASS.');
        console.log(`   - report: ${result.reportPath}`);
        for (const line of getNextStepLines(result.language, 'eval-grade-pass')) {
            console.log(line);
        }
        return;
    }

    console.log(result.language === 'vi'
        ? `\n❌ Eval FAIL (${result.findings.length} van de).`
        : `\n❌ Eval FAIL (${result.findings.length} issue(s)).`);
    console.log(`   - report: ${result.reportPath}`);
    for (const finding of result.findings) {
        console.log(`   - ${finding}`);
    }
    for (const line of getNextStepLines(result.language, 'eval-grade-fail')) {
        console.log(line);
    }
}

export function handler(profile: string | undefined, options: { grade?: boolean } = {}): void {
    const args = parseArgs(profile, options);
    const language = checkState(args.configPath);
    const result = execute(args.projectPath, args.profile, language, args.grade);
    report(result);
}
