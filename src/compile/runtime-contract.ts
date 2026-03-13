/**
 * Runtime structure contract shared across compile targets and docs.
 * Authority:
 * - Claude Code skills docs
 * - Cursor skills docs
 * - OpenAI Codex AGENTS.md guide
 * - Antigravity skills + rules/workflows docs
 */

export interface RuntimeStructure {
    runtime: string;
    paths: string[];
    note: string;
}

export const RUNTIME_STRUCTURES: RuntimeStructure[] = [
    {
        runtime: 'Claude Code',
        paths: ['CLAUDE.md', '.claude/skills/<skill-name>/SKILL.md'],
        note: 'Use CLAUDE.md for repo-wide guidance and .claude/skills for runtime-native role skills.',
    },
    {
        runtime: 'Cursor',
        paths: ['.cursor/skills/<skill-name>/SKILL.md'],
        note: 'Use Cursor-native skills folders, not legacy rule files, for bootstrap role behavior.',
    },
    {
        runtime: 'VS Code / Copilot',
        paths: ['.github/copilot-instructions.md', '.github/instructions/*.instructions.md'],
        note: 'Keep repository instructions concise and repo-scoped.',
    },
    {
        runtime: 'Codex',
        paths: ['AGENTS.md'],
        note: 'Keep AGENTS.md at repo scope and preserve the runtime-specific bootstrap contract there.',
    },
    {
        runtime: 'Antigravity',
        paths: [
            '.agents/skills/<skill-name>/SKILL.md',
            '.agents/rules/*.md',
            '.agents/workflows/*.md',
            '.agent/skills/<skill-name>/SKILL.md',
            '.agent/rules/*.md',
            '.agent/workflows/*.md',
        ],
        note: 'Prefer native .agents paths and emit .agent compatibility mirrors for installs that still load the older singular directory.',
    },
];

export function renderRuntimeStructureBullets(): string[] {
    return RUNTIME_STRUCTURES.map(
        (entry) => `${entry.runtime}: ${entry.paths.join(', ')}.`,
    );
}

export function renderRuntimeStructureTableRows(): string[] {
    return RUNTIME_STRUCTURES.map(
        (entry) => `| ${entry.runtime} | ${entry.paths.join('<br>')} | ${entry.note} |`,
    );
}
