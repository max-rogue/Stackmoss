# Context - StackMoss

_Current repository context for agent sessions. Update when architecture or shipped scope changes materially._

## Status
- Phase: F18 complete
- State: Multi-runtime bootstrap + calibration + eval + adapted methodology layer
- Last updated: 2026-03-13
- Verification baseline: 302 tests / 40 test files / TypeScript build clean

## What StackMoss does
- Bootstraps agent-team config for real repositories and new workspaces
- Treats `team.md` as the shared source of truth
- Compiles runtime-native outputs for:
  - Claude Code
  - Cursor
  - VS Code / Copilot
  - Codex
  - Antigravity
- Guides a Tech Lead-first calibration flow after bootstrap
- Provides static checks and a portable eval prepare/grade loop

## Current product model
- `stackmoss init` is the primary entry point for an existing repo
- `stackmoss new` creates a fresh workspace
- After intake, the next happy-path step is:
  - chat with Tech Lead in the runtime the user actually uses
  - calibrate the team to the real repo and locked BRD
  - run `stackmoss check`
  - run `stackmoss eval smoke`

## Core constraints
- Deterministic CLI logic only
- Replace-only config updates
- User confirmation before applying shared config patches
- Tech Lead is the single writer for shared team config
- Runtime isolation: each runtime should only read its own generated structure

## Important runtime outputs
- Claude Code: `CLAUDE.md` + `.claude/skills/<skill>/SKILL.md`
- Cursor: `.cursor/skills/<skill>/SKILL.md`
- VS Code / Copilot: `.github/copilot-instructions.md`
- Codex: `AGENTS.md` + `.agents/skills/<skill>/SKILL.md`
- Antigravity: `.agent/{skills,rules,workflows}`

## Methodology layer
- Adapted from selected ideas in `obra/superpowers`
- Included disciplines:
  - TDD cycle
  - systematic debugging
  - evidence before claims
  - planning protocol
  - review reception
- Upstream snapshots live under `src/vendor/superpowers/`
- Runtime outputs use adapted summaries, not raw upstream skill bodies

## Key source areas
- `src/commands/` - CLI command handlers
- `src/intake/` - BRD-first intake flow
- `src/templates/` - source-of-truth file generation
- `src/compile/` - runtime-native output generation
- `src/scanner/` - migration scan and report logic
- `src/patch/` - patch proposal engine
- `tests/` - command, compile, template, scanner, and adversarial coverage

## Current priorities
- Keep bootstrap flow simple and explicit for end users
- Preserve config correctness across all runtimes
- Tighten health-check and eval quality signals
- Keep generated config concise
