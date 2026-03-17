/**
 * Template: stackmoss.config.json
 * Authority: BRD §9.1
 *
 * Pure function, string interpolation only, no LLM.
 */

import type { GeneratedFile, TemplateInput } from './types.js';
import {
    DEFAULT_CONFIG_BUDGETS,
    DEFAULT_CONFIG_TARGETS,
    DEFAULT_CONFIG_THRESHOLDS,
    type StackMossConfig,
} from '../config.js';

// ─── Full Config Schema (BRD §9.1) ──────────────────────────────

export interface FullStackMossConfig extends StackMossConfig { }

// ─── Generator ───────────────────────────────────────────────────

export function generateConfig(input: TemplateInput): GeneratedFile {
    const { intake } = input;

    const config: FullStackMossConfig = {
        schemaVersion: '1.0',
        state: 'GLOBAL',
        userType: intake.persona,
        projectType: intake.projectType,
        language: intake.language ?? 'en',
        targets: [...DEFAULT_CONFIG_TARGETS],
        mode: 'suggest_only',
        intakeMode: intake.mode,
        budgets: { ...DEFAULT_CONFIG_BUDGETS },
        thresholds: { ...DEFAULT_CONFIG_THRESHOLDS },
        autoAddRoles: {
            securityLite: [...intake.roles, ...intake.autoAddedRoles]
                .some((r) => r === 'SEC-lite' || r.startsWith('SEC')),
            devOpsLite: [...intake.roles, ...intake.autoAddedRoles]
                .some((r) => r === 'OPS-lite' || r === 'OPS(light)' || r === 'DEVOPS' || r.startsWith('OPS')),
        },
    };

    return {
        path: 'stackmoss.config.json',
        content: JSON.stringify(config, null, 2) + '\n',
    };
}
