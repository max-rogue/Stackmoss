import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@inquirer/prompts', () => ({
    select: vi.fn(),
    input: vi.fn(),
    checkbox: vi.fn().mockResolvedValue([]),
}));

import { select, input, checkbox } from '@inquirer/prompts';
import { runFastMode } from '../../src/intake/fast-mode.js';

const mockSelect = vi.mocked(select);
const mockInput = vi.mocked(input);
const mockCheckbox = vi.mocked(checkbox);

describe('Fast Mode', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('collects 7 bootstrap answers', async () => {
        mockSelect
            .mockResolvedValueOnce('BizLed')
            .mockResolvedValueOnce('sme')
            .mockResolvedValueOnce('none')
            .mockResolvedValueOnce('pii')
            .mockResolvedValueOnce('MVP');

        mockInput
            .mockResolvedValueOnce('Retail ops copilot')
            .mockResolvedValueOnce('Retail operations');

        const result = await runFastMode();

        expect(result.answers['Q1']).toBe('BizLed');
        expect(result.answers['Q2']).toBe('sme');
        expect(result.answers['Q3']).toBe('none');
        expect(result.answers['Q4']).toBe('Retail ops copilot');
        expect(result.answers['Q5']).toBe('Retail operations');
        expect(result.answers['Q6']).toBe('pii');
        expect(result.answers['Q_PT']).toBe('MVP');
    });

    it('tracks skipped text questions', async () => {
        mockSelect
            .mockResolvedValueOnce('Solo')
            .mockResolvedValueOnce('individual')
            .mockResolvedValueOnce('locked')
            .mockResolvedValueOnce('none')
            .mockResolvedValueOnce('InternalTool');

        mockInput
            .mockResolvedValueOnce('')
            .mockResolvedValueOnce('Internal workflow');

        const result = await runFastMode();

        expect(result.skippedQuestions).toContain('Q4');
        expect(result.answers['Q4']).toBeUndefined();
        expect(result.answers['Q5']).toBe('Internal workflow');
    });

    it('preselects pack-default roles in Q_ROLES', async () => {
        mockSelect
            .mockResolvedValueOnce('Solo')
            .mockResolvedValueOnce('individual')
            .mockResolvedValueOnce('locked')
            .mockResolvedValueOnce('none')
            .mockResolvedValueOnce('MVP');

        mockInput
            .mockResolvedValueOnce('Internal helper')
            .mockResolvedValueOnce('Operations');

        await runFastMode();

        const qRolesCall = mockCheckbox.mock.calls.at(-1)?.[0];
        const checkedValues = (qRolesCall?.choices ?? [])
            .filter((choice: { checked?: boolean }) => choice.checked)
            .map((choice: { value: string }) => choice.value);

        expect(checkedValues).toEqual(['TL(guide)', 'DEV(small)', 'QA(light)']);
    });
});
