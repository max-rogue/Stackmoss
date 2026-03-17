import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@inquirer/prompts', () => ({
    select: vi.fn(),
    input: vi.fn(),
    checkbox: vi.fn().mockResolvedValue([]),
}));

import { select, input, checkbox } from '@inquirer/prompts';
import { runInterviewMode } from '../../src/intake/interview-mode.js';

const mockSelect = vi.mocked(select);
const mockInput = vi.mocked(input);
const mockCheckbox = vi.mocked(checkbox);

describe('Interview Mode', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('collects deeper discovery answers', async () => {
        mockSelect
            .mockResolvedValueOnce('BizLed')
            .mockResolvedValueOnce('enterprise')
            .mockResolvedValueOnce('draft')
            .mockResolvedValueOnce('existing_repo')
            .mockResolvedValueOnce('finance')
            .mockResolvedValueOnce('cloud')
            .mockResolvedValueOnce('small_team')
            .mockResolvedValueOnce('partial')
            .mockResolvedValueOnce('Production');

        mockInput
            .mockResolvedValueOnce('AI workflow automation')
            .mockResolvedValueOnce('Developer tooling')
            .mockResolvedValueOnce('Reduce release coordination overhead');

        const result = await runInterviewMode();

        expect(result.answers['Q3']).toBe('draft');
        expect(result.answers['Q4']).toBe('AI workflow automation');
        expect(result.answers['Q5']).toBe('Developer tooling');
        expect(result.answers['Q6']).toBe('existing_repo');
        expect(result.answers['Q7']).toBe('finance');
        expect(result.answers['Q10']).toBe('Reduce release coordination overhead');
        expect(result.answers['Q_PT']).toBe('Production');
    });

    it('runs completeness gate for missing audience', async () => {
        mockSelect
            .mockResolvedValueOnce('DevLed')
            .mockResolvedValueOnce(undefined as any)
            .mockResolvedValueOnce('none')
            .mockResolvedValueOnce('greenfield')
            .mockResolvedValueOnce('none')
            .mockResolvedValueOnce('unknown')
            .mockResolvedValueOnce('solo')
            .mockResolvedValueOnce('unknown')
            .mockResolvedValueOnce('LibraryAPI')
            .mockResolvedValueOnce('sme');

        mockInput
            .mockResolvedValueOnce('API orchestration toolkit')
            .mockResolvedValueOnce('Developer infrastructure')
            .mockResolvedValueOnce('Ship a validated BRD');

        const result = await runInterviewMode();

        expect(result.answers['Q2']).toBe('sme');
        expect(result.skippedQuestions).not.toContain('Q2');
    });

    it('runs completeness gate for missing success signal and stops at 2 follow-ups', async () => {
        mockSelect
            .mockResolvedValueOnce('Newbie')
            .mockResolvedValueOnce('community')
            .mockResolvedValueOnce('none')
            .mockResolvedValueOnce('greenfield')
            .mockResolvedValueOnce('none')
            .mockResolvedValueOnce('local')
            .mockResolvedValueOnce('solo')
            .mockResolvedValueOnce('unknown')
            .mockResolvedValueOnce('MVP');

        mockInput
            .mockResolvedValueOnce('Learning assistant')
            .mockResolvedValueOnce('Education')
            .mockResolvedValueOnce('')
            .mockResolvedValueOnce('First users can complete onboarding end-to-end');

        const result = await runInterviewMode();

        expect(result.answers['Q10']).toBe('First users can complete onboarding end-to-end');
        expect(mockInput).toHaveBeenCalledTimes(4);
    });

    it('preselects the current matrix defaults in Q_ROLES', async () => {
        mockSelect
            .mockResolvedValueOnce('DevLed')
            .mockResolvedValueOnce('enterprise')
            .mockResolvedValueOnce('locked')
            .mockResolvedValueOnce('existing_repo')
            .mockResolvedValueOnce('finance')
            .mockResolvedValueOnce('cloud')
            .mockResolvedValueOnce('small_team')
            .mockResolvedValueOnce('partial')
            .mockResolvedValueOnce('Production');

        mockInput
            .mockResolvedValueOnce('AI workflow automation')
            .mockResolvedValueOnce('Developer tooling')
            .mockResolvedValueOnce('Reduce release coordination overhead');

        await runInterviewMode();

        const qRolesCall = mockCheckbox.mock.calls.at(-1)?.[0];
        const checkedValues = (qRolesCall?.choices ?? [])
            .filter((choice: { checked?: boolean }) => choice.checked)
            .map((choice: { value: string }) => choice.value);

        expect(new Set(checkedValues)).toEqual(new Set(['TL', 'FE', 'BE', 'QA(strong)', 'DEVOPS', 'DOCS']));
    });
});
