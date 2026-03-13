import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG_FILENAME } from './config.js';

export type UiLanguage = 'en' | 'vi';

interface ProjectConfigLike {
    language?: string;
}

export function normalizeLanguage(language?: string): UiLanguage {
    return language === 'vi' ? 'vi' : 'en';
}

export function readProjectLanguage(projectPath: string): UiLanguage {
    const configPath = join(projectPath, CONFIG_FILENAME);
    if (!existsSync(configPath)) {
        return 'en';
    }

    try {
        const config = JSON.parse(readFileSync(configPath, 'utf-8')) as ProjectConfigLike;
        return normalizeLanguage(config.language);
    } catch {
        return 'en';
    }
}

export function getReadmePath(): string {
    return 'README_AGENT_TEAM.md';
}

export function getTechLeadCalibrationPrompt(language: UiLanguage): string {
    if (language === 'vi') {
        return 'Tech Lead, hay scan repo nay, hoi tiep bat ky cau hoi can thiet, calibrate lai agent team theo BRD hien co, thay thong tin sai hoac TBD bang thong tin dung trong team.md, va de xuat moi thay doi config cho toi review. Khong duoc apply patch khi chua hoi toi.';
    }

    return 'Tech Lead, scan this repo, ask any follow-up questions you need, recalibrate the agent team around the current BRD, replace stale or TBD facts in team.md with verified facts, and propose any config changes for my review. Do not apply shared config patches before asking me.';
}

export function getEvalRunPrompt(language: UiLanguage, profile: string, resultPath: string): string {
    if (language === 'vi') {
        return `Tech Lead, hay chay bai kiem thu StackMoss profile "${profile}". Doc file evals/current/case.md, khong apply patch, va ghi ket qua theo dung format vao ${resultPath}.`;
    }

    return `Tech Lead, run the StackMoss "${profile}" evaluation. Read evals/current/case.md, do not apply patches, and write the result using the exact required format to ${resultPath}.`;
}

export function getNextStepLines(
    language: UiLanguage,
    context: 'bootstrap' | 'resolve-ready' | 'resolve-more' | 'promote-success' | 'check-healthy' | 'check-calibrate' | 'eval-prepare' | 'eval-grade-pass' | 'eval-grade-fail',
): string[] {
    const promptLabel = language === 'vi' ? 'Prompt goi y:' : 'Suggested prompt:';

    switch (context) {
        case 'bootstrap':
            return language === 'vi'
                ? [
                    'Buoc tiep theo:',
                    '1. Mo IDE/CLI agent ban dang dung.',
                    '2. Chat voi Tech Lead bang prompt duoi day.',
                    `3. Doc ${getReadmePath()} de di qua tung buoc setup ban dau.`,
                    promptLabel,
                    getTechLeadCalibrationPrompt(language),
                ]
                : [
                    'Next steps:',
                    '1. Open the IDE or CLI agent you actually use.',
                    '2. Chat with Tech Lead using the prompt below.',
                    `3. Read ${getReadmePath()} and follow the bootstrap checklist step by step.`,
                    promptLabel,
                    getTechLeadCalibrationPrompt(language),
                ];
        case 'resolve-ready':
            return language === 'vi'
                ? ['Buoc tiep theo:', 'Chay `stackmoss promote --confirm`.']
                : ['Next step:', 'Run `stackmoss promote --confirm`.'];
        case 'resolve-more':
            return language === 'vi'
                ? ['Buoc tiep theo:', 'Chay `stackmoss resolve` lan nua de tra loi cac cau hoi con lai.']
                : ['Next step:', 'Run `stackmoss resolve` again to answer the remaining questions.'];
        case 'promote-success':
            return language === 'vi'
                ? [
                    'Buoc tiep theo:',
                    '1. Mo IDE/CLI agent ban dang dung.',
                    '2. Chat voi Tech Lead de calibrate lai team neu van con bootstrap marker.',
                    '3. Sau do chay `stackmoss check` hoac `stackmoss eval smoke`.',
                ]
                : [
                    'Next steps:',
                    '1. Open the IDE or CLI agent you use.',
                    '2. Ask Tech Lead to calibrate the team if bootstrap markers still remain.',
                    '3. Then run `stackmoss check` or `stackmoss eval smoke`.',
                ];
        case 'check-healthy':
            return language === 'vi'
                ? ['Buoc tiep theo:', 'Neu muon kiem thu hanh vi team that, chay `stackmoss eval smoke`.']
                : ['Next step:', 'If you want to test real team behavior, run `stackmoss eval smoke`.'];
        case 'check-calibrate':
            return language === 'vi'
                ? [
                    'Buoc tiep theo:',
                    '1. Chat voi Tech Lead de calibrate lai team.',
                    `2. Doc ${getReadmePath()} neu can checklist setup.`,
                    '3. Sau khi calibrate xong, chay lai `stackmoss check` hoac `stackmoss eval smoke`.',
                ]
                : [
                    'Next steps:',
                    '1. Ask Tech Lead to recalibrate the team.',
                    `2. Read ${getReadmePath()} if you need the setup checklist.`,
                    '3. After calibration, run `stackmoss check` or `stackmoss eval smoke` again.',
                ];
        case 'eval-prepare':
            return language === 'vi'
                ? [
                    'Buoc tiep theo:',
                    '1. Copy prompt eval duoi day va gui cho Tech Lead trong runtime ban dang dung.',
                    '2. Cho agent ghi ket qua vao `evals/current/result.md`.',
                    '3. Chay `stackmoss eval smoke --grade` hoac `stackmoss eval <profile> --grade` de cham ket qua.',
                ]
                : [
                    'Next steps:',
                    '1. Copy the eval prompt below and send it to Tech Lead in your current runtime.',
                    '2. Let the agent write the result to `evals/current/result.md`.',
                    '3. Run `stackmoss eval smoke --grade` or `stackmoss eval <profile> --grade` to grade the result.',
                ];
        case 'eval-grade-pass':
            return language === 'vi'
                ? ['Buoc tiep theo:', 'Neu muon test ky hon, chay `stackmoss eval full`.']
                : ['Next step:', 'If you want a deeper run, execute `stackmoss eval full`.'];
        case 'eval-grade-fail':
            return language === 'vi'
                ? [
                    'Buoc tiep theo:',
                    '1. Review findings trong `evals/current/report.md` hoac output hien tai.',
                    '2. Chat voi Tech Lead de sua team config.',
                    '3. Chay lai `stackmoss eval smoke` sau khi da calibrate.',
                ]
                : [
                    'Next steps:',
                    '1. Review the findings in `evals/current/report.md` or the current output.',
                    '2. Ask Tech Lead to fix the team config.',
                    '3. Re-run `stackmoss eval smoke` after recalibration.',
                ];
    }
}
