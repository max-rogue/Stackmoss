/**
 * Tests: Git + MCP template output
 *
 * Verified against:
 * - npm registry (package existence)
 * - golfy/.claude/settings.json (real project reference)
 * - golfy/.roo/mcp.json (real project reference)
 */

import { describe, it, expect } from 'vitest';
import { generateGitAndMcp, renderGitInitSkill, renderClaudeMcpConfig, renderCodexMcpConfig, renderAntigravityMcpConfig } from '../../src/templates/git-and-mcp.js';
import { createSampleInput } from './helpers.js';

describe('Template: Git + MCP Config', () => {
    describe('generateGitAndMcp', () => {
        it('generates 4 files', () => {
            const files = generateGitAndMcp(createSampleInput());
            expect(files.length).toBe(4);
        });

        it('generates correct file paths', () => {
            const files = generateGitAndMcp(createSampleInput());
            const paths = files.map(f => f.path);
            expect(paths).toContain('.stackmoss/skill-kit/shared/git-init.skill.md');
            expect(paths).toContain('.stackmoss/mcp-configs/claude.mcp.json');
            expect(paths).toContain('.stackmoss/mcp-configs/codex.config.toml');
            expect(paths).toContain('.stackmoss/mcp-configs/antigravity.mcp_config.json');
        });
    });

    describe('renderGitInitSkill', () => {
        it('includes git init workflow', () => {
            const content = renderGitInitSkill();
            expect(content).toContain('git init');
            expect(content).toContain('git remote add origin');
            expect(content).toContain('conventional commits');
        });

        it('includes TL responsibility', () => {
            const content = renderGitInitSkill();
            expect(content).toContain('Tech Lead');
            expect(content).toContain('guiding');
        });

        it('includes secret check', () => {
            const content = renderGitInitSkill();
            expect(content).toContain('API keys');
            expect(content).toContain('credentials');
        });

        it('lists runtime skill paths', () => {
            const content = renderGitInitSkill();
            expect(content).toContain('.agent/workflows/git-workflow.md');
            expect(content).toContain('.claude/skills/git-init/SKILL.md');
            expect(content).toContain('.agents/skills/git-init/SKILL.md');
        });
    });

    describe('MCP Configs — Package Correctness (verified against npm + golfy real config)', () => {
        it('Claude config uses correct npm packages', () => {
            const content = renderClaudeMcpConfig('test-project');
            expect(content).toContain('@upstash/context7-mcp');
            expect(content).toContain('@modelcontextprotocol/server-sequential-thinking');
            expect(content).toContain('@modelcontextprotocol/server-postgres');
            expect(content).toContain('@notionhq/notion-mcp-server');
            expect(content).toContain('ghcr.io/github/github-mcp-server');
            expect(content).toContain('"prisma", "mcp"');
        });

        it('Context7 uses DEFAULT_MINIMUM_TOKENS env', () => {
            const claude = renderClaudeMcpConfig('x');
            const parsed = JSON.parse(claude);
            expect(parsed.mcpServers.context7.env.DEFAULT_MINIMUM_TOKENS).toBe('10000');
        });

        it('Notion uses NOTION_TOKEN (not OPENAPI_MCP_HEADERS)', () => {
            const claude = renderClaudeMcpConfig('x');
            expect(claude).toContain('NOTION_TOKEN');
            expect(claude).not.toContain('OPENAPI_MCP_HEADERS');
        });

        it('Postgres has timeoutMs in JSON configs', () => {
            const claude = JSON.parse(renderClaudeMcpConfig('x'));
            expect(claude.mcpServers.postgres.timeoutMs).toBe(60000);

            const ag = JSON.parse(renderAntigravityMcpConfig('x'));
            expect(ag.mcpServers.postgres.timeoutMs).toBe(60000);
        });
    });

    describe('MCP Configs — Structural Validity', () => {
        it('Claude config is valid JSON with all servers', () => {
            const content = renderClaudeMcpConfig('test-project');
            const parsed = JSON.parse(content);
            expect(parsed.mcpServers).toBeDefined();
            const keys = Object.keys(parsed.mcpServers);
            expect(keys).toContain('context7');
            expect(keys).toContain('sequentialthinking');
            expect(keys).toContain('postgres');
            expect(keys).toContain('github');
            expect(keys).toContain('notion');
            expect(keys).toContain('prisma');
        });

        it('Antigravity config is valid JSON with all servers', () => {
            const content = renderAntigravityMcpConfig('test-project');
            const parsed = JSON.parse(content);
            expect(parsed.mcpServers).toBeDefined();
            const keys = Object.keys(parsed.mcpServers);
            expect(keys).toContain('context7');
            expect(keys).toContain('sequentialthinking');
            expect(keys).toContain('postgres');
            expect(keys).toContain('github');
            expect(keys).toContain('notion');
            expect(keys).toContain('prisma');
        });

        it('Codex config has valid TOML structure', () => {
            const content = renderCodexMcpConfig('test-project');
            expect(content).toContain('[mcp_servers.context7]');
            expect(content).toContain('[mcp_servers.sequentialthinking]');
            expect(content).toContain('[mcp_servers.postgres]');
            expect(content).toContain('[mcp_servers.github]');
            expect(content).toContain('[mcp_servers.notion]');
            expect(content).toContain('[mcp_servers.prisma]');
            expect(content).toMatch(/command\s*=\s*"/);
            expect(content).toMatch(/args\s*=\s*\[/);
        });
    });

    describe('MCP Configs — Cross-Runtime Consistency', () => {
        it('all configs mark credentials with [REQUIRED]', () => {
            expect(renderClaudeMcpConfig('x')).toContain('[REQUIRED]');
            expect(renderCodexMcpConfig('x')).toContain('[REQUIRED]');
            expect(renderAntigravityMcpConfig('x')).toContain('[REQUIRED]');
        });

        it('includes project name in comments', () => {
            expect(renderClaudeMcpConfig('my-app')).toContain('my-app');
            expect(renderCodexMcpConfig('my-app')).toContain('my-app');
            expect(renderAntigravityMcpConfig('my-app')).toContain('my-app');
        });

        it('Claude and Antigravity have identical server key sets', () => {
            const claudeKeys = Object.keys(JSON.parse(renderClaudeMcpConfig('x')).mcpServers).sort();
            const agKeys = Object.keys(JSON.parse(renderAntigravityMcpConfig('x')).mcpServers).sort();
            expect(claudeKeys).toEqual(agKeys);
        });

        it('all configs use args pattern for postgres (not env)', () => {
            const claude = JSON.parse(renderClaudeMcpConfig('x'));
            expect(claude.mcpServers.postgres.args).toContain('[REQUIRED] postgresql://user:password@localhost:5432/dbname');
            expect(claude.mcpServers.postgres.env).toBeUndefined();

            const ag = JSON.parse(renderAntigravityMcpConfig('x'));
            expect(ag.mcpServers.postgres.args).toContain('[REQUIRED] postgresql://user:password@localhost:5432/dbname');
            expect(ag.mcpServers.postgres.env).toBeUndefined();
        });

        it('no configs reference non-existent npm packages', () => {
            const all = renderClaudeMcpConfig('x') + renderCodexMcpConfig('x') + renderAntigravityMcpConfig('x');
            expect(all).not.toContain('@anthropic-ai/');
            expect(all).not.toContain('@context7/mcp-server');
            expect(all).not.toContain('@nicepkg/');
            expect(all).not.toContain('prisma-mcp-server');
        });

        it('sequential thinking key is consistent: sequentialthinking (no hyphen)', () => {
            const claude = JSON.parse(renderClaudeMcpConfig('x'));
            expect(claude.mcpServers.sequentialthinking).toBeDefined();
            expect(claude.mcpServers['sequential-thinking']).toBeUndefined();

            const ag = JSON.parse(renderAntigravityMcpConfig('x'));
            expect(ag.mcpServers.sequentialthinking).toBeDefined();

            const codex = renderCodexMcpConfig('x');
            expect(codex).toContain('[mcp_servers.sequentialthinking]');
            expect(codex).not.toContain('[mcp_servers.sequential-thinking]');
        });
    });
});
