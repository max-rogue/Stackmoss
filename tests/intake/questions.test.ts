import { describe, it, expect } from 'vitest';
import {
    getFastQuestions,
    getInterviewQuestions,
    getDataSensitivityQuestionId,
} from '../../src/intake/questions.js';

describe('Intake Questions', () => {
    describe('Fast questions', () => {
        it('has 8 questions', () => {
            expect(getFastQuestions()).toHaveLength(8);
        });

        it('focuses on audience, BRD, idea, domain, and data sensitivity', () => {
            const ids = getFastQuestions().map((question) => question.id);
            expect(ids).toEqual(['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q_PT', 'Q_ROLES']);
        });

        it('does not ask first-feature appetite in fast mode', () => {
            expect(getFastQuestions().some((question) => question.subQuestion)).toBe(false);
        });

        it('exposes the full specialized role catalog in Q_ROLES', () => {
            const qRoles = getFastQuestions().find((question) => question.id === 'Q_ROLES');
            const values = new Set((qRoles?.choices ?? []).map((choice) => choice.value));

            expect(values).toContain('DEV');
            expect(values).toContain('TL(guide)');
            expect(values).toContain('DEV(small)');
            expect(values).toContain('QA(light)');
            expect(values).toContain('QA(strong)');
            expect(values).toContain('QA(checklist)');
            expect(values).toContain('OPS');
            expect(values).toContain('OPS(light)');
            expect(values).toContain('OPS-lite');
            expect(values).toContain('SEC-lite');
            expect(values).toContain('PM');
            expect(values).toContain('MLE');
            expect(values).toContain('BRAND');
        });
    });

    describe('Interview questions', () => {
        it('has 13 questions', () => {
            expect(getInterviewQuestions()).toHaveLength(13);
        });

        it('goes deeper into repo and delivery context', () => {
            const ids = getInterviewQuestions().map((question) => question.id);
            expect(ids).toEqual(['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q_PT', 'Q_ROLES']);
        });

        it('does not ask first-feature appetite in interview mode', () => {
            expect(getInterviewQuestions().some((question) => question.subQuestion)).toBe(false);
        });
    });

    it('maps data sensitivity question id per mode', () => {
        expect(getDataSensitivityQuestionId('fast')).toBe('Q6');
        expect(getDataSensitivityQuestionId('interview')).toBe('Q7');
    });
});
