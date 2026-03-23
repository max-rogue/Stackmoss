import { describe, expect, it } from 'vitest';
import {
    countWords,
    getMethodologyModulesForRole,
    getSharedMethodologyModules,
} from '../../src/compile/methodology.js';

describe('Methodology adapters', () => {
    it('assigns DEV to tdd, debugging, evidence, git-workflow, execution-loop, review reception', () => {
        const modules = getMethodologyModulesForRole('DEV').map((module) => module.id);

        expect(modules).toEqual([
            'tdd-cycle',
            'debugging-protocol',
            'evidence-gate',
            'git-workflow',
            'execution-loop',
            'review-reception',
            'repo-map-maintenance',
        ]);
    });

    it('assigns TL to planning, evidence, git-workflow, execution-loop, review reception', () => {
        const modules = getMethodologyModulesForRole('TL').map((module) => module.id);

        expect(modules).toEqual([
            'evidence-gate',
            'planning-protocol',
            'git-workflow',
            'execution-loop',
            'review-reception',
            'repo-map-maintenance',
        ]);
    });

    it('assigns QA(light) to tdd, evidence, git-workflow, execution-loop, review reception', () => {
        const modules = getMethodologyModulesForRole('QA(light)').map((module) => module.id);

        expect(modules).toEqual([
            'tdd-cycle',
            'evidence-gate',
            'git-workflow',
            'execution-loop',
            'review-reception',
            'repo-map-maintenance',
        ]);
    });

    it('deduplicates shared modules across multiple roles', () => {
        const modules = getSharedMethodologyModules(['DEV', 'DEV', 'TL']).map((module) => module.id);

        expect(modules).toEqual([
            'tdd-cycle',
            'debugging-protocol',
            'evidence-gate',
            'git-workflow',
            'execution-loop',
            'review-reception',
            'repo-map-maintenance',
            'planning-protocol',
        ]);
    });

    it('keeps adapted module bodies concise', () => {
        const modules = getSharedMethodologyModules(['TL', 'DEV', 'QA']);

        for (const module of modules) {
            expect(countWords(module.body)).toBeLessThanOrEqual(120);
        }
    });
});
