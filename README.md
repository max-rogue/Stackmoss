<div align="center">

# StackMoss

**Bootstrap AI coding-agent teams that know the repo, the rules, and how to work.**

Generate runtime-native agent team configs for **Claude Code**, **Cursor**, **VS Code / Copilot**, **Codex**, and **Antigravity** from one deterministic source of truth.

[![npm version](https://img.shields.io/npm/v/stackmoss?style=flat-square&color=2ea043)](https://www.npmjs.com/package/stackmoss)
[![license](https://img.shields.io/npm/l/stackmoss?style=flat-square&color=0969da)](LICENSE)
[![tests](https://img.shields.io/badge/tests-304%20passed-brightgreen?style=flat-square)]()
[![node](https://img.shields.io/node/v/stackmoss?style=flat-square)](package.json)

</div>

StackMoss is a CLI that scaffolds and maintains **agent team governance** for coding assistants. Instead of writing one-off prompts per IDE, you define a compact team model once and StackMoss emits the right runtime structure for each tool.

## Why StackMoss

- **One source of truth:** `team.md` drives team roles, governance, and project facts.
- **Runtime-native output:** each target gets the layout it actually expects.
- **Deterministic pipeline:** no LLM routing or prompt magic inside the CLI.
- **Calibration-first workflow:** bootstrap first, then let Tech Lead adapt the team to the real repo.
- **Safe config evolution:** replace-only patches, budget limits, and explicit user confirmation.

## What It Generates

Run `stackmoss init` in an existing repo or `stackmoss new <name>` for a fresh workspace.

```text
my-project/
|-- team.md
|-- FEATURES.md
|-- NORTH_STAR.md
|-- NON_GOALS.md
|-- README_AGENT_TEAM.md
|-- AGENTS.md
|-- CLAUDE.md
|-- .agents/
|-- .claude/
|-- .cursor/
|-- .agent/
|-- .github/
|-- stackmoss.config.json
`-- evals/
```

Every runtime also gets a shared methodology layer adapted from selected Superpowers ideas:

- Evidence before claims
- Planning protocol
- Review reception
- TDD cycle
- Systematic debugging

## Quick Start

Install:

```bash
npm install -g stackmoss
```

Existing repo:

```bash
cd /path/to/existing-repo
stackmoss init
```

New workspace:

```bash
stackmoss new my-project
cd my-project
```

Recommended flow after bootstrap:

1. Answer the intake around BRD status, idea, domain, and repo context.
2. Open the runtime you actually use and start with **Tech Lead**.
3. Let Tech Lead scan the repo and recalibrate the bootstrap team to the real stack.
4. Review the proposed config patch before any apply.
5. Run `stackmoss check`.
6. Run `stackmoss eval smoke`.
7. Start feature delivery only after calibration is healthy.

Full walkthrough: [QUICK_START.md](QUICK_START.md)

## Runtime Targets

| Target | Output | Use with |
|:---|:---|:---|
| `ClaudeCodeV2` | `CLAUDE.md` + `.claude/skills/<skill>/SKILL.md` | Claude Code |
| `Cursor` | `.cursor/skills/<skill>/SKILL.md` | Cursor |
| `VSCode` | `.github/copilot-instructions.md` | VS Code / Copilot |
| `Codex` | `AGENTS.md` + `.agents/skills/<skill>/SKILL.md` | OpenAI Codex |
| `Antigravity` | `.agent/{skills,rules,workflows}` | Antigravity |
| `ClaudeCode` | `.claude/skills/*.skill.md` | Claude Code legacy |

## How It Works

```text
GLOBAL ----------> MIGRATING ----------> OPERATIONAL
  new                inject                run
                     resolve               check
                     promote               patch
                                           upgrade
```

- `new` creates a clean StackMoss workspace.
- `init` bootstraps StackMoss in the current repo and auto-runs `inject` when real repo content exists.
- `resolve` and `promote` help move an existing repo from migration state to operational state.
- `run`, `check`, `patch`, and `eval` support day-2 operation and verification.

## Command Reference

| Command | Description |
|:---|:---|
| `stackmoss new <name>` | Create a new StackMoss project |
| `stackmoss init [name]` | Initialize StackMoss in the current repo and generate all bootstrap targets |
| `stackmoss inject` | Scan an existing repo and sync migration facts |
| `stackmoss resolve` | Answer unresolved migration questions |
| `stackmoss promote --confirm` | Transition from `MIGRATING` to `OPERATIONAL` |
| `stackmoss run <alias>` | Run a command alias with patch proposal on failure |
| `stackmoss check` | Validate config, budgets, and calibration readiness |
| `stackmoss eval [profile] [--grade]` | Prepare or grade a portable live team evaluation |
| `stackmoss patch list/apply/reject` | Manage patch proposals |
| `stackmoss upgrade` | Merge `CONSTITUTION` only |

## Development

```bash
git clone https://github.com/max-rogue/Stackmoss.git
cd Stackmoss
npm install
npm test
npm run build
```

Current local verification:

- `304` passing tests
- `41` test files
- TypeScript build passes

## License

MIT Copyright StackMoss
