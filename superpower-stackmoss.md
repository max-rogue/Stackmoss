# F18: Integrate Superpowers Methodology into StackMoss

## Review Summary

The original idea is directionally correct: StackMoss already bootstraps role and governance, but it is still weak on "how to work" methodology. Superpowers fills that gap well.

However, the first draft plan has 5 problems that should be corrected before implementation:

1. It emits the wrong runtime structures for current StackMoss.
   - Current StackMoss uses `.claude/skills/<skill>/SKILL.md` for Claude, `.cursor/skills/<skill>/SKILL.md` for Cursor, `.agent/{skills,rules,workflows}` for Antigravity, and `AGENTS.md` for Codex.
   - The draft plan still targets `.claude/rules` and `.cursor/rules`, which is stale.

2. It vendors raw skill bodies that are too large to inject directly into generated runtime outputs.
   - Current upstream sizes are approximately:
     - `test-driven-development`: 1496 words
     - `systematic-debugging`: 1504 words
     - `verification-before-completion`: 668 words
     - `writing-plans`: 807 words
   - Copying these raw into every runtime would bloat prompts and fight StackMoss's "keep config tight" direction.

3. Some selected Superpowers skills are not standalone.
   - `systematic-debugging` explicitly references `superpowers:test-driven-development`
   - `writing-plans` references dedicated worktrees, brainstorming, subagent-driven development, and `docs/superpowers/plans/...`
   - These assumptions do not map cleanly to StackMoss's runtime-agnostic bootstrap.

4. The draft duplicates methodology per role instead of centralizing it.
   - If a repo has multiple DEV lanes, duplicating the same long methodology text across skills wastes tokens.
   - Methodology should be emitted once per runtime, then lightly referenced from role files.

5. It does not define a StackMoss adaptation layer.
   - StackMoss should not ship raw upstream doctrine unchanged.
   - It should ship a distilled, runtime-safe adapter that preserves the core method but removes upstream runtime assumptions.

## Decision

Do integrate selected Superpowers ideas, but do not inject raw upstream skills directly into runtime outputs.

Use this architecture instead:

1. Vendor source snapshots for attribution and traceability.
2. Distill them into StackMoss-native methodology modules.
3. Emit one shared methodology artifact per runtime.
4. Keep role files small and only reference the shared methodology artifact.

This keeps the integration useful without turning StackMoss outputs into a copy of the Superpowers repo.

---

## Selected Source Skills

After checking the full upstream skills library, the best fit for StackMoss is 5 source skills, not 4:

| Upstream skill | Why keep it | StackMoss adaptation |
|:---|:---|:---|
| `test-driven-development` | Strong default implementation discipline | Distill into `TDD cycle` method for DEV and QA |
| `systematic-debugging` | Strong root-cause protocol | Distill into `debugging protocol` for DEV |
| `verification-before-completion` | Best fit for anti-hallucination and evidence discipline | Distill into shared `evidence gate` for all roles |
| `writing-plans` | Good planning discipline | Distill into `planning protocol` for TL only, remove worktree/subagent assumptions |
| `receiving-code-review` | Strong review-response discipline without requiring subagents | Distill into `review reception` method for TL, DEV, and QA |

## Explicitly Not Imported

Do not integrate these upstream assumptions into StackMoss:

- dedicated worktrees
- brainstorming skill dependency
- subagent-driven development dependency
- `docs/superpowers/plans/...` save-path convention
- runtime-specific slash/invoke assumptions
- direct references to other upstream Superpowers skill names

Explicitly reject these upstream skills for v1:

- `brainstorming`: overlaps with StackMoss intake + BRD-first calibration
- `executing-plans`: still assumes subagent-oriented Superpowers workflow
- `requesting-code-review`: relies on git-SHA and reviewer-subagent dispatch flow
- `dispatching-parallel-agents`: too runtime-specific
- `subagent-driven-development`: too runtime-specific
- `using-git-worktrees`: outside StackMoss governance scope
- `finishing-a-development-branch`: outside bootstrap/runtime-config scope
- `using-superpowers`: onboarding for Superpowers itself, not StackMoss
- `writing-skills`: meta-skill, not agent-team methodology

---

## Architecture Plan

### Component 1: Vendor Source Snapshots

Purpose:
- preserve attribution
- preserve traceability to upstream
- make it easy to diff later upstream changes

Add:

- `src/vendor/superpowers/README.md`
- `src/vendor/superpowers/tdd.source.md`
- `src/vendor/superpowers/systematic-debugging.source.md`
- `src/vendor/superpowers/verification.source.md`
- `src/vendor/superpowers/writing-plans.source.md`

Rules:
- keep upstream text as source snapshot only
- do not compile these files directly into runtime outputs
- include upstream URL + snapshot date + license note

### Component 2: StackMoss Methodology Adapters

Add:

- `src/compile/methodology.ts`

Responsibilities:
- define distilled methodology modules
- map modules to roles
- provide small runtime-safe bodies

Suggested shape:

```ts
export interface MethodologyModule {
  id: 'tdd-cycle' | 'debugging-protocol' | 'evidence-gate' | 'planning-protocol' | 'review-reception';
  title: string;
  source: 'superpowers-adapted';
  upstreamSources: string[];
  roles: string[];
  summary: string;
  body: string;
}

export function getMethodologyModulesForRole(roleId: string): MethodologyModule[];
export function getSharedMethodologyModules(roleIds: string[]): MethodologyModule[];
```

Adapter constraints:
- each module should stay concise
- target roughly 120-220 words per module
- remove upstream tooling assumptions
- rewrite into StackMoss language:
  - replace-only config updates
  - user-confirm-before-apply
  - BRD-first workflow
  - Tech Lead as single writer for shared config

### Component 3: Runtime-Native Emission

Do not emit methodology as duplicated per-role files by default.

Emit one shared methodology artifact per runtime, plus lightweight references from role files.

#### Claude Code

Modify:
- `src/compile/claude-code.ts`

Emit:
- `.claude/skills/stackmoss-methodology/SKILL.md`

Role files:
- keep current role skills small
- add one short line such as:
  - "Use the shared stackmoss-methodology skill for TDD, debugging, planning, and verification discipline."

Do not use:
- `.claude/rules`

#### Cursor

Modify:
- `src/compile/cursor.ts`

Emit:
- `.cursor/skills/stackmoss-methodology/SKILL.md`

Role files:
- keep small references only

Do not use:
- `.cursor/rules`

#### Antigravity

Modify:
- `src/compile/antigravity.ts`

Emit:
- `.agent/rules/methodology.md`
- `.agent/workflows/tdd-cycle.md`
- `.agent/workflows/debugging-protocol.md`
- `.agent/workflows/review-reception.md`
- `.agent/workflows/planning-protocol.md`

Reason:
- Antigravity already separates always-on rules from workflows
- methodology fits better as shared rules/workflows than duplicated skills per capability

Keep current role/capability skills focused on role behavior only.

#### Codex

Modify:
- `src/compile/codex.ts`

Emit:
- no extra file
- append a concise `Methodology` section into `AGENTS.md`

Constraint:
- keep this section short
- do not dump long adapted copies into `AGENTS.md`

#### VS Code / Copilot

Modify:
- `src/compile/vscode.ts`

Emit:
- append a short `Methodology` section into `.github/copilot-instructions.md`

---

## Content Strategy

### What should be adapted

#### TDD cycle
- write failing test first
- confirm failure is real
- write minimum code to pass
- rerun targeted verification
- only then widen verification

#### Debugging protocol
- reproduce
- isolate
- identify root cause
- only then patch
- re-verify with focused and regression checks

#### Evidence gate
- do not claim "done", "fixed", or "passing" without fresh verification evidence
- cite command and observed result
- if verification fails, report actual state

#### Planning protocol
- break work into bounded steps
- identify files and tests up front
- prefer small, independently verifiable steps
- follow BRD-first and Tech Lead-first calibration rules

#### Review reception
- read review feedback without performative agreement
- restate or clarify before changing code
- verify feedback against the actual codebase
- implement one item at a time and re-test
- push back when feedback is technically wrong for this repo

### What must be removed during adaptation

- references to specific Superpowers skill names
- references to worktrees
- references to brainstorming dependency
- references to subagent dependency
- references to `docs/superpowers/...`
- statements that conflict with StackMoss governance

---

## Config Surface

Do not add a new config flag in v1 of this feature.

Rationale:
- methodology is a core quality layer, not an optional decoration
- adding a toggle now increases surface area before usage data exists
- if users later ask for control, add a narrow mode switch such as:
  - `"methodologyProfile": "core" | "minimal"`

For now, ship a single default profile:
- `core`

---

## Implementation Order

1. Add vendor snapshots and attribution docs.
2. Add `src/compile/methodology.ts` with adapted modules.
3. Wire shared methodology emission into Claude, Cursor, Antigravity, Codex, and VS Code.
4. Update compile tests for all targets.
5. Update README / QUICK_START to mention methodology layer as part of bootstrap.

---

## Verification Plan

### Automated

1. Unit test adapted module registry
- `getMethodologyModulesForRole('DEV')` includes:
  - `tdd-cycle`
  - `debugging-protocol`
  - `evidence-gate`
  - `review-reception`
- `getMethodologyModulesForRole('TL')` includes:
  - `planning-protocol`
  - `evidence-gate`
  - `review-reception`
- `getMethodologyModulesForRole('QA')` includes:
  - `tdd-cycle`
  - `evidence-gate`
  - `review-reception`

2. Compile target tests
- Claude emits `.claude/skills/stackmoss-methodology/SKILL.md`
- Cursor emits `.cursor/skills/stackmoss-methodology/SKILL.md`
- Antigravity emits:
  - `.agent/rules/methodology.md`
  - `.agent/workflows/tdd-cycle.md`
  - `.agent/workflows/debugging-protocol.md`
  - `.agent/workflows/review-reception.md`
  - `.agent/workflows/planning-protocol.md`
- Codex appends a short methodology section to `AGENTS.md`
- VS Code appends a short methodology section to `.github/copilot-instructions.md`

3. Duplication guard
- multiple DEV lanes should not duplicate shared methodology files

4. Size guard
- methodology adapters stay within target word ranges
- generated outputs remain concise

5. Regression
- `npm test`
- `npm run build`

### Manual review

Review generated runtime outputs and confirm:
- each runtime only sees its own native structure
- role files remain concise
- methodology is shared, not duplicated
- no upstream runtime-specific assumptions leaked into StackMoss outputs

---

## Recommendation

Proceed with integration, but revise the implementation approach to:

- vendor upstream as source snapshots only
- adapt, do not copy raw
- emit shared methodology artifacts per runtime
- keep role files lightweight
- preserve StackMoss runtime isolation

Do not clone the full Superpowers repo into StackMoss unless we later need upstream sync automation. For the first implementation, vendored snapshots are enough.
