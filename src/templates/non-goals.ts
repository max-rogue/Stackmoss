/**
 * Template: NON_GOALS.md
 * Authority: BRD §9.4 (adjacent)
 *
 * Pure function, string interpolation only, no LLM.
 * 3 safe default lines — no inference from answers.
 */

import type { GeneratedFile, TemplateInput } from './types.js';

// ─── Generator ───────────────────────────────────────────────────

export function generateNonGoals(input: TemplateInput): GeneratedFile {
    const { projectName } = input;

    const content = `# Non-Goals — ${projectName}
_v1 không làm những điều sau. Cập nhật khi scope thay đổi._

- [TBD — Tech Lead fills during calibration: features explicitly excluded from v1 scope]
- [TBD — boundaries: what adjacent work this project will NOT do]
- [TBD — quality trade-offs: what quality dimensions are acceptable to defer]
`;

    return {
        path: 'NON_GOALS.md',
        content,
    };
}
