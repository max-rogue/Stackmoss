/**
 * Tests: Template Engine integration (end-to-end)
 * Authority: template-engine skill, BRD §8.4
 */

import { describe, expect, it } from 'vitest';
import { generateAllFiles } from '../../src/templates/index.js';
import { createSampleInput, createSampleIntake } from './helpers.js';

describe('Template Engine: generateAllFiles', () => {
    it('generates core files + eval harness (no skipped questions)', () => {
        const input = createSampleInput();
        const files = generateAllFiles(input);

        const paths = files.map((file) => file.path);
        expect(paths).toContain('stackmoss.config.json');
        expect(paths).toContain('team.md');
        expect(paths).toContain('FEATURES.md');
        expect(paths).toContain('NORTH_STAR.md');
        expect(paths).toContain('NON_GOALS.md');
        expect(paths).toContain('README_AGENT_TEAM.md');
        expect(paths).toContain('ROLE_SKILL_OVERRIDES.md');
        expect(paths).not.toContain('OPEN_QUESTIONS.md');
        expect(paths).toContain('evals/rubric.md');
        expect(paths.some((path) => path.startsWith('evals/cases/'))).toBe(true);
        expect(paths.some((path) => path.startsWith('evals/expected/'))).toBe(true);
    });

    it('generates extra OPEN_QUESTIONS when there are skipped questions', () => {
        const input = createSampleInput({
            intake: createSampleIntake({
                skippedQuestions: ['Q3'],
            }),
        });
        const files = generateAllFiles(input);

        const paths = files.map((file) => file.path);
        expect(paths).toContain('OPEN_QUESTIONS.md');
        expect(files.length).toBe(62);
    });

    it('all files have non-empty content', () => {
        const files = generateAllFiles(createSampleInput());

        for (const file of files) {
            expect(file.content.length).toBeGreaterThan(0);
        }
    });

    it('generates correct total files including code map and skill kit', () => {
        const files = generateAllFiles(createSampleInput());

        expect(files).toHaveLength(61);
        expect(files.some((file) => file.path === 'CODE_MAP.md')).toBe(true);
        expect(files.some((file) => file.path === '.stackmoss/skill-kit/ROLE_INDEX.md')).toBe(true);
        expect(files.some((file) => file.path === '.stackmoss/skill-kit/shared/git-init.skill.md')).toBe(true);
        expect(files.some((file) => file.path === '.stackmoss/mcp-configs/claude.mcp.json')).toBe(true);
    });

    it('config file contains valid JSON', () => {
        const files = generateAllFiles(createSampleInput());
        const configFile = files.find((file) => file.path === 'stackmoss.config.json')!;

        expect(() => JSON.parse(configFile.content)).not.toThrow();
    });

    it('team.md contains all required sections', () => {
        const files = generateAllFiles(createSampleInput());
        const teamFile = files.find((file) => file.path === 'team.md')!;

        expect(teamFile.content).toContain('CONSTITUTION');
        expect(teamFile.content).toContain('ROLES');
        expect(teamFile.content).toContain('WORKING CONTRACT');
        expect(teamFile.content).toContain('PROJECT_FACTS');
    });

    it('FEATURES.md uses the derived bootstrap F1', () => {
        const files = generateAllFiles(createSampleInput());
        const featuresFile = files.find((file) => file.path === 'FEATURES.md')!;

        expect(featuresFile.content).toContain('appetite: M');
        expect(featuresFile.content).toContain('Lock BRD with Tech Lead and BA');
    });

    it('frontend role template contains design + implementation operating system', () => {
        const files = generateAllFiles(createSampleInput());
        const frontendTemplate = files.find((file) => file.path === '.stackmoss/skill-kit/roles/frontend.template.md');
        const frontendPack = files.find((file) => file.path === '.stackmoss/skill-kit/roles/frontend.skill-pack.md');
        const frontendDesignTemplate = files.find((file) => file.path === '.stackmoss/skill-kit/roles/frontend.DESIGN.template.md');

        expect(frontendTemplate).toBeDefined();
        expect(frontendTemplate!.content).toContain('## Role-Specific Operating System');
        expect(frontendTemplate!.content).toContain('DESIGN_VARIANCE');
        expect(frontendTemplate!.content).toContain('COMPONENT_STRICTNESS');
        expect(frontendTemplate!.content).toContain('## Absolute Negative Constraints');
        expect(frontendTemplate!.content).toContain('taste-skill');
        expect(frontendTemplate!.content).toContain('Popular Stack Reference');
        expect(frontendTemplate!.content).toContain('Frontend Audit Flow');
        expect(frontendPack).toBeDefined();
        expect(frontendPack!.content).toContain('Mode Activation Matrix');
        expect(frontendPack!.content).toContain('web-implementation-core');
        expect(frontendPack!.content).toContain('design-system-audit');
        expect(frontendPack!.content).toContain('stitch-design-taste');
        expect(frontendPack!.content).toContain('output-discipline');
        expect(frontendDesignTemplate).toBeDefined();
        expect(frontendDesignTemplate!.content).toContain('# DESIGN.md Template (Frontend Stitch Mode)');
    });

    it('mobile role template contains platform-native operating system', () => {
        const files = generateAllFiles(createSampleInput());
        const mobileTemplate = files.find((file) => file.path === '.stackmoss/skill-kit/roles/mobile.template.md');
        const mobilePack = files.find((file) => file.path === '.stackmoss/skill-kit/roles/mobile.skill-pack.md');

        expect(mobileTemplate).toBeDefined();
        expect(mobileTemplate!.content).toContain('## Role-Specific Operating System');
        expect(mobileTemplate!.content).toContain('OFFLINE_DEPTH');
        expect(mobileTemplate!.content).toContain('PLATFORM_FIDELITY');
        expect(mobileTemplate!.content).toContain('## Absolute Negative Constraints');
        expect(mobileTemplate!.content).toContain('Mobile Audit Flow');
        expect(mobileTemplate!.content).toContain('React Native');
        expect(mobileTemplate!.content).toContain('Flutter');
        expect(mobilePack).toBeDefined();
        expect(mobilePack!.content).toContain('Mode Activation Matrix');
        expect(mobilePack!.content).toContain('mobile-core');
        expect(mobilePack!.content).toContain('react-native');
        expect(mobilePack!.content).toContain('flutter');
        expect(mobilePack!.content).toContain('native-ios-android');
        expect(mobilePack!.content).toContain('output-discipline');
    });

    it('backend role template contains contract-first operating system', () => {
        const files = generateAllFiles(createSampleInput());
        const backendTemplate = files.find((file) => file.path === '.stackmoss/skill-kit/roles/backend.template.md');
        const backendPack = files.find((file) => file.path === '.stackmoss/skill-kit/roles/backend.skill-pack.md');
        const backendContractTemplate = files.find((file) => file.path === '.stackmoss/skill-kit/roles/backend.API-CONTRACT.template.md');

        expect(backendTemplate).toBeDefined();
        expect(backendTemplate!.content).toContain('## Role-Specific Operating System');
        expect(backendTemplate!.content).toContain('VALIDATION_STRICTNESS');
        expect(backendTemplate!.content).toContain('## Absolute Negative Constraints');
        expect(backendTemplate!.content).toContain('Backend Audit Flow');
        expect(backendPack).toBeDefined();
        expect(backendPack!.content).toContain('Mode Activation Matrix');
        expect(backendPack!.content).toContain('api-contract-core');
        expect(backendPack!.content).toContain('database-evolution');
        expect(backendPack!.content).toContain('output-discipline');
        expect(backendPack!.content).toContain('Error Response Contract');
        expect(backendContractTemplate).toBeDefined();
        expect(backendContractTemplate!.content).toContain('# API-CONTRACT.md Template');
        expect(backendContractTemplate!.content).toContain('Error Catalog');
    });

    it('devops role template contains infrastructure operating system', () => {
        const files = generateAllFiles(createSampleInput());
        const devopsTemplate = files.find((file) => file.path === '.stackmoss/skill-kit/roles/devops.template.md');
        const devopsPack = files.find((file) => file.path === '.stackmoss/skill-kit/roles/devops.skill-pack.md');

        expect(devopsTemplate).toBeDefined();
        expect(devopsTemplate!.content).toContain('## Role-Specific Operating System');
        expect(devopsTemplate!.content).toContain('AUTOMATION_DEPTH');
        expect(devopsTemplate!.content).toContain('RELIABILITY_TARGET');
        expect(devopsTemplate!.content).toContain('SECURITY_POSTURE');
        expect(devopsTemplate!.content).toContain('## Absolute Negative Constraints');
        expect(devopsTemplate!.content).toContain('DevOps Audit Flow');
        expect(devopsTemplate!.content).toContain('Incident Response Protocol');
        expect(devopsTemplate!.content).toContain('Popular Stack Reference');
        expect(devopsTemplate!.content).toContain('GitHub Actions');
        expect(devopsTemplate!.content).toContain('Terraform');
        expect(devopsPack).toBeDefined();
        expect(devopsPack!.content).toContain('Mode Activation Matrix');
        expect(devopsPack!.content).toContain('ci-cd-core');
        expect(devopsPack!.content).toContain('container-orchestration');
        expect(devopsPack!.content).toContain('infrastructure-as-code');
        expect(devopsPack!.content).toContain('observability-ops');
        expect(devopsPack!.content).toContain('output-discipline');
        expect(devopsPack!.content).toContain('Deploy Strategy Matrix');
        expect(devopsPack!.content).toContain('Kubernetes Patterns');
    });

    it('data-engineer role template contains pipeline-first operating system', () => {
        const files = generateAllFiles(createSampleInput());
        const deTemplate = files.find((file) => file.path === '.stackmoss/skill-kit/roles/data-engineer.template.md');
        const dePack = files.find((file) => file.path === '.stackmoss/skill-kit/roles/data-engineer.skill-pack.md');
        const deContract = files.find((file) => file.path === '.stackmoss/skill-kit/roles/data-engineer.DATA-CONTRACT.template.md');

        expect(deTemplate).toBeDefined();
        expect(deTemplate!.content).toContain('## Role-Specific Operating System');
        expect(deTemplate!.content).toContain('VALIDATION_RIGOR');
        expect(deTemplate!.content).toContain('Popular Stack Reference');
        expect(deTemplate!.content).toContain('Power BI');
        expect(deTemplate!.content).toContain('Apache Airflow');
        expect(deTemplate!.content).toContain('## Absolute Negative Constraints');
        expect(dePack).toBeDefined();
        expect(dePack!.content).toContain('Mode Activation Matrix');
        expect(dePack!.content).toContain('pipeline-core');
        expect(dePack!.content).toContain('bi-analytics');
        expect(dePack!.content).toContain('dbt Patterns');
        expect(dePack!.content).toContain('Apache Spark Patterns');
        expect(dePack!.content).toContain('output-discipline');
        expect(deContract).toBeDefined();
        expect(deContract!.content).toContain('# DATA-CONTRACT.md Template');
        expect(deContract!.content).toContain('Quality Rules');
        expect(deContract!.content).toContain('Downstream Consumers');
    });

    it('qa role template contains test-focused operating system', () => {
        const files = generateAllFiles(createSampleInput());
        const qaTemplate = files.find((file) => file.path === '.stackmoss/skill-kit/roles/qa.template.md');
        const qaPack = files.find((file) => file.path === '.stackmoss/skill-kit/roles/qa.skill-pack.md');

        expect(qaTemplate).toBeDefined();
        expect(qaTemplate!.content).toContain('## Role-Specific Operating System');
        expect(qaTemplate!.content).toContain('TEST_DEPTH');
        expect(qaTemplate!.content).toContain('AUTOMATION_COVERAGE');
        expect(qaTemplate!.content).toContain('RISK_FOCUS');
        expect(qaTemplate!.content).toContain('QA Audit Flow');
        expect(qaTemplate!.content).toContain('Popular Stack Reference');
        expect(qaTemplate!.content).toContain('Playwright');
        expect(qaPack).toBeDefined();
        expect(qaPack!.content).toContain('test-strategy-core');
        expect(qaPack!.content).toContain('e2e-automation');
        expect(qaPack!.content).toContain('performance-testing');
        expect(qaPack!.content).toContain('api-contract-testing');
        expect(qaPack!.content).toContain('output-discipline');
        expect(qaPack!.content).toContain('Edge Case Discovery Framework');
        expect(qaPack!.content).toContain('Testing Pyramid');
    });

    it('security role template contains threat-focused operating system', () => {
        const files = generateAllFiles(createSampleInput());
        const secTemplate = files.find((file) => file.path === '.stackmoss/skill-kit/roles/security.template.md');
        const secPack = files.find((file) => file.path === '.stackmoss/skill-kit/roles/security.skill-pack.md');

        expect(secTemplate).toBeDefined();
        expect(secTemplate!.content).toContain('## Role-Specific Operating System');
        expect(secTemplate!.content).toContain('THREAT_DEPTH');
        expect(secTemplate!.content).toContain('COMPLIANCE_RIGOR');
        expect(secTemplate!.content).toContain('SUPPLY_CHAIN_FOCUS');
        expect(secTemplate!.content).toContain('Security Audit Flow');
        expect(secTemplate!.content).toContain('Popular Stack Reference');
        expect(secTemplate!.content).toContain('OWASP');
        expect(secPack).toBeDefined();
        expect(secPack!.content).toContain('security-review-core');
        expect(secPack!.content).toContain('compliance-audit');
        expect(secPack!.content).toContain('supply-chain-security');
        expect(secPack!.content).toContain('penetration-testing');
        expect(secPack!.content).toContain('output-discipline');
        expect(secPack!.content).toContain('OWASP Top 10');
        expect(secPack!.content).toContain('HTTP Security Headers');
    });

    it('ml-engineer role template contains experiment-focused operating system', () => {
        const files = generateAllFiles(createSampleInput());
        const mleTemplate = files.find((file) => file.path === '.stackmoss/skill-kit/roles/ml-engineer.template.md');
        const mlePack = files.find((file) => file.path === '.stackmoss/skill-kit/roles/ml-engineer.skill-pack.md');

        expect(mleTemplate).toBeDefined();
        expect(mleTemplate!.content).toContain('## Role-Specific Operating System');
        expect(mleTemplate!.content).toContain('EXPERIMENT_RIGOR');
        expect(mleTemplate!.content).toContain('SERVING_RELIABILITY');
        expect(mleTemplate!.content).toContain('MONITORING_DEPTH');
        expect(mleTemplate!.content).toContain('ML Audit Flow');
        expect(mleTemplate!.content).toContain('Popular Stack Reference');
        expect(mleTemplate!.content).toContain('PyTorch');
        expect(mlePack).toBeDefined();
        expect(mlePack!.content).toContain('experiment-core');
        expect(mlePack!.content).toContain('model-serving');
        expect(mlePack!.content).toContain('model-monitoring');
        expect(mlePack!.content).toContain('feature-engineering');
        expect(mlePack!.content).toContain('output-discipline');
        expect(mlePack!.content).toContain('Reproducibility Checklist');
        expect(mlePack!.content).toContain('Drift Detection');
    });

    it('docs role template contains documentation-focused operating system', () => {
        const files = generateAllFiles(createSampleInput());
        const docsTemplate = files.find((file) => file.path === '.stackmoss/skill-kit/roles/docs.template.md');
        const docsPack = files.find((file) => file.path === '.stackmoss/skill-kit/roles/docs.skill-pack.md');

        expect(docsTemplate).toBeDefined();
        expect(docsTemplate!.content).toContain('## Role-Specific Operating System');
        expect(docsTemplate!.content).toContain('TECHNICAL_DEPTH');
        expect(docsTemplate!.content).toContain('AUDIENCE_BREADTH');
        expect(docsTemplate!.content).toContain('MAINTENANCE_RIGOR');
        expect(docsTemplate!.content).toContain('Documentation Audit Flow');
        expect(docsTemplate!.content).toContain('Popular Stack Reference');
        expect(docsTemplate!.content).toContain('Docusaurus');
        expect(docsPack).toBeDefined();
        expect(docsPack!.content).toContain('readme-runbook-core');
        expect(docsPack!.content).toContain('api-docs');
        expect(docsPack!.content).toContain('developer-portal');
        expect(docsPack!.content).toContain('changelog-release-notes');
        expect(docsPack!.content).toContain('output-discipline');
        expect(docsPack!.content).toContain('README Template');
        expect(docsPack!.content).toContain('Runbook Template');
    });
});
