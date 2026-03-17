import { select, input, checkbox } from '@inquirer/prompts';
import type { Question, RawAnswers } from './types.js';
import { getFastQuestions } from './questions.js';
import { t } from './i18n.js';
import { detectPersona, getProjectType, selectRoles } from './pack-selector.js';

const BACK = '__BACK__';

function getPreselectedRoles(question: Question, answers: RawAnswers): string[] {
    if (question.id !== 'Q_ROLES') {
        return [];
    }

    try {
        const persona = detectPersona((answers['Q1'] as string | undefined) ?? '');
        const projectType = getProjectType(answers);
        return selectRoles(persona, projectType);
    } catch {
        return [];
    }
}

async function askQuestion(
    question: Question,
    allowBack: boolean,
    preselected: string[] = [],
): Promise<string | string[] | typeof BACK | undefined> {
    if (question.type === 'multiselect' && question.choices) {
        const choices = question.choices
            .filter((c) => !c.value.startsWith('_header_'))
            .map((choice) => ({
                name: choice.label,
                value: choice.value,
                checked: preselected.includes(choice.value),
            }));

        const selected = await checkbox({
            message: question.text,
            choices,
        });

        return selected.length > 0 ? selected : undefined;
    }

    if (question.type === 'select' && question.choices) {
        const choices = question.choices.map((choice) => ({
            name: choice.label,
            value: choice.value,
        }));

        if (allowBack) {
            choices.unshift({ name: t().backLabel, value: BACK });
        }

        return select({
            message: question.text,
            choices,
        });
    }

    if (question.type === 'text') {
        const answer = await input({
            message: question.text,
            validate: (val: string) => val.length > 200 ? 'Max 200 characters' : true,
        });
        const trimmed = answer.trim();
        return trimmed === '' ? undefined : trimmed;
    }

    return undefined;
}

export interface FastModeResult {
    answers: RawAnswers;
    skippedQuestions: string[];
}

export async function runFastMode(): Promise<FastModeResult> {
    const answers: RawAnswers = {};
    const skippedQuestions: string[] = [];
    const questions = getFastQuestions();

    console.log(`\n${t().fastModeHeader}\n`);

    let index = 0;
    while (index < questions.length) {
        const question = questions[index]!;
        const answer = await askQuestion(question, index > 0, getPreselectedRoles(question, answers));

        if (answer === BACK) {
            const prevQuestion = questions[index - 1]!;
            delete answers[prevQuestion.id];
            const skippedIndex = skippedQuestions.indexOf(prevQuestion.id);
            if (skippedIndex !== -1) skippedQuestions.splice(skippedIndex, 1);
            index--;
            continue;
        }

        if (answer !== undefined && answer !== '') {
            answers[question.id] = answer;
        } else {
            skippedQuestions.push(question.id);
        }

        index++;
    }

    return { answers, skippedQuestions };
}
