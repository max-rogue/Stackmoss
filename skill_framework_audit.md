# 🔍 StackMoss Skill Framework — Critical Audit Report

**Date:** 2026-03-28  
**Auditor:** Antigravity (impartial, evidence-based)  
**Scope:** PM/TL skill quality, Skill Creator workflow, comparison vs. industry benchmarks  
**Verdict: 🟡 Structurally Sound, Operationally Insufficient**

---

## Executive Summary

| Dimension | Score | Verdict |
|:--|:--:|:--|
| TL Instruction Quality | **5/10** | Generic textbook, not operational |
| PM Instruction Quality | **6/10** | Better structured, still lacks teeth |
| Skill Creator Workflow | **6/10** | Correct architecture, weak enforcement |
| Framework vs. Superpowers | **4/10** | Skeleton vs. operational toolkit |
| Framework vs. taste-skill | **7/10** | Different scope, comparable structure |

> [!CAUTION]
> **Bottom Line:** The current skills read like a college syllabus — they tell the agent *what topics exist* but don't equip it to *survive real pressure scenarios*. Superpowers' skills are written by someone who has watched agents fail repeatedly and patched every rationalization hole. Ours haven't been through that crucible.

---

## 1. Tech Lead — Instruction Quality

### What It Has (✅ Good Bones)
- Iron Law: `NO ARCHITECTURE DECISION WITHOUT A WRITTEN ADR FIRST`
- ADR process with 7 clear steps
- Good/Bad examples for ADR writing
- Anti-patterns list
- Verification checklist
- 4 capability blocks with triggers

### What It's Missing (❌ Critical Gaps)

#### 1.1 No Debugging Protocol
> [!WARNING]
> **The TL has ZERO instructions for debugging.** Compare with Superpowers:

```markdown
# Superpowers: systematic-debugging (284 lines)
## The Iron Law: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
## The Four Phases: Root Cause → Pattern Analysis → Hypothesis → Implementation
## Red Flags: 15 specific "STOP" triggers
## Common Rationalizations: 8-row excuse-busting table
## Real-World Impact: 15-30min (systematic) vs 2-3hrs (random)
```

```markdown
# Our TL: debugging guidance
(none)
```

**Impact:** When a TL agent encounters a production bug, it has no systematic process. It will default to pure LLM intuition — the exact behavior the Iron Law pattern exists to prevent.

#### 1.2 No Plan Execution Protocol
Superpowers has a dedicated `executing-plans` skill (77 lines) that defines:
- How to load and review a plan critically
- When to STOP and ask for help (5 specific conditions)
- When to revisit earlier steps
- Integration with git worktrees and branch finishing

Our TL's `TL-PLAN` capability says "Break down features & assign subtasks" in 160 words or less. It doesn't say **how** to execute a plan once it exists.

#### 1.3 No Code Review Methodology
Superpowers' `code-reviewer.md` (55 lines) defines:
- 6 structured review dimensions (Plan Alignment, Code Quality, Architecture, Documentation, Issue Identification, Communication Protocol)
- Issue severity categories: Critical / Important / Suggestions
- When to escalate vs. when to approve

Our TL says:
```markdown
### Code Review Protocol
- Review for correctness first, style second
- Check: does this change respect capability budgets?
- Verify: are tests present and meaningful?
- Confirm: does the change align with current ADR decisions?
- Block merges that bypass QA or skip required checks
```

**5 bullet points vs. 6 structured dimensions with explicit action patterns.** Ours is a reminder note; theirs is a review framework.

#### 1.4 No Rationalization Defenses
Superpowers skills include explicit **"Red Flags"** and **"Common Rationalizations"** tables that plug loopholes an LLM might exploit. Example from `systematic-debugging`:

```markdown
| Excuse | Reality |
|--------|---------|
| "Issue is simple, don't need process" | Simple issues have root causes too. |
| "Emergency, no time" | Systematic is FASTER than guess-and-check. |
| "Just try this first" | First fix sets the pattern. Do it right. |
```

Our TL has an **Anti-Patterns** section, but it lists architecture anti-patterns (committee decisions, big bang rewrites), not **agent rationalization** anti-patterns. There's a fundamental difference:
- Architecture anti-patterns = what bad teams do
- Agent rationalization anti-patterns = what THIS agent will try to skip

#### 1.5 Word Budgets Are Arbitrary
```markdown
### TL-ARCH: Architecture decisions & ADR
- Budget: 220 words
```

Why 220? Not 200, not 250? There's no calibration evidence. Compare with Superpowers' approach: they don't use word budgets at all — they use **phase gates** (you MUST complete Phase 1 before Phase 2).

### TL Score Breakdown

| Criterion | Score | Notes |
|:--|:--:|:--|
| Iron Law clarity | 8/10 | Clear and enforced |
| Workflow completeness | 4/10 | ADR only, no debug/plan/review |
| Anti-rationalization | 2/10 | Lists team anti-patterns, not agent traps |
| Operational tools | 1/10 | No scripts, no templates, no examples |
| Context-awareness (2026) | 3/10 | Generic, not calibrated to project |
| **Overall** | **5/10** | |

---

## 2. Product Manager — Instruction Quality

### What It Has (✅ Stronger Than TL)
- Iron Law: `NO FEATURE SHIPS WITHOUT A CLEAR SUCCESS METRIC`
- Complete BRD Discovery Process (8 steps)
- Stakeholder Interview Template (6 questions)
- RICE Framework with formula
- MVP Scoping Checklist
- Release Readiness Checklist
- Good/Bad BRD examples
- 7 anti-patterns

### What It's Missing (❌ Gaps)

#### 2.1 No User Story / Spec Writing Protocol
Superpowers' `writing-plans` skill (147 lines) defines:
- Bite-sized task granularity (2-5 minutes each)
- Mandatory plan document header format
- `### Task N` structure with exact file paths, code, and test commands
- **"No Placeholders"** iron law — forbids "TBD", "TODO", "add validation"
- Self-review checklist (spec coverage, placeholder scan, type consistency)
- Execution handoff protocol

Our PM writes BRDs and prioritizes features. But there's no bridge between "BRD is locked" → "development plan exists with actionable tasks." The TL's `TL-PLAN` is supposed to handle this, but it's a 4-line capability description.

#### 2.2 No Go/No-Go Decision Framework
The PM lists "Go/no-go decisions for feature releases" but doesn't define the framework. What criteria? What thresholds? What happens on "No-Go"?

#### 2.3 No Stakeholder Communication Templates
`PM-STAKEHOLDER` says "preparing status reports, demo scripts" but provides zero templates. A real PM agent needs:
- Sprint review template
- Status report format
- Escalation email format
- Decision log format

#### 2.4 No Data-Driven Decision Patterns
The PM mentions RICE but doesn't mention:
- How to handle missing data (Confidence = 50%? Use proxy metrics?)
- How to detect vanity metrics vs. real metrics
- When to override RICE with strategic priorities

### PM Score Breakdown

| Criterion | Score | Notes |
|:--|:--:|:--|
| Iron Law clarity | 8/10 | Clear and specific |
| Workflow completeness | 6/10 | BRD discovery is good, gaps in execution |
| Anti-rationalization | 4/10 | Better anti-patterns, still team-focused |
| Operational tools | 3/10 | RICE formula exists, no templates |
| Context-awareness (2026) | 3/10 | Generic, not project-calibrated |
| **Overall** | **6/10** | |

---

## 3. Skill Creator — Workflow Assessment

### Question: Does it follow template-first → research-fallback?

**Answer: YES, architecturally. NO, operationally.**

#### What's Correct (✅)

The workflow is properly ordered:
```
1. Resolve target role and runtime boundary.
2. Load closest role template from .stackmoss/skill-kit/roles/*.template.md.
3. Adapt with .stackmoss/skill-kit/shared/* and runtime adapter.
4. Generate runtime-specific files for one role skill.
5. Research external sources only if template coverage is insufficient.
6. Run validation command.
```

The `sources-registry.md` exists and lists proper fallback sources:
- obra/superpowers (primary)
- VRSEN/agency-swarm
- OpenAI Agent docs
- MCP protocol

#### What's Missing (❌)

##### 3.1 No Definition of "Insufficient"
Step 5 says "Research external sources only if template coverage is insufficient." But **what does "insufficient" mean?** There's no criteria:
- Missing capability count threshold?
- Domain coverage percentage?
- User feedback signal?

Compare with Superpowers' approach: they define explicit **phase gates** — you cannot proceed to Phase 2 without completing Phase 1's evidence requirements.

##### 3.2 No Proactive Research Trigger
The current flow is passive: "if template is insufficient, research." It should be **proactive**: 

```markdown
# Current (Passive)
5. Research external sources only if template coverage is insufficient.

# Should Be (Proactive)
5a. Score template against target domain (checklist):
    - [ ] Iron Law defined?
    - [ ] ≥3 workflow phases?
    - [ ] Anti-rationalization table present?
    - [ ] Operational examples (not just theory)?
    - [ ] Verification procedure defined?
5b. If score < 4/5: MUST query sources-registry.md
5c. Document which sources were consulted + what was adopted
```

##### 3.3 No Quality Bar for Generated Skills
The Skill Creator generates skills but doesn't define what a **good** skill looks like. Compare with Superpowers' `writing-skills` (615 lines!) which defines:
- TDD for skill creation (RED → GREEN → REFACTOR)
- Mandatory testing with subagents
- Claude Search Optimization (CSO) for discoverability
- Token efficiency targets (< 200 words for frequently-loaded)
- Flowchart usage rules
- 8-item rationalization busting table
- Full deployment checklist

Our Skill Creator's quality bar is:
```markdown
## Quality Bar (from developer.template.md)
- Avoid generic instructions; include role-specific decisions and anti-patterns.
- Include explicit blocked-state behavior when validation cannot run.
- Keep logs free of secrets and sensitive payloads.
```

**3 bullet points vs. 615 lines of methodology.** This is the widest gap in the entire framework.

##### 3.4 All Templates Are Identical Skeletons
Every role template (~34 lines each, ~1100 bytes) follows the exact same structure:
```
Mission → Trigger Guidance → Core Workflow → Deliverables → 
Validation Baseline → Runtime Adaptation Notes → Quality Bar
```

They differ only in the mission statement. The `developer.template.md` and `frontend.template.md` have near-identical content with different topic words swapped in. These templates provide **structure** but not **substance**.

##### 3.5 No Skill Testing Protocol
Superpowers requires skills to be tested with **pressure scenarios using subagents** before deployment. Our Skill Creator has:
```markdown
## Validation
- Command(s): node scripts/validate-and-log.mjs "<command>" data/validation-log.ndjson
```

This validates that the skill file is structurally correct (syntax check), not that it's **operationally effective** (behavior check).

### Skill Creator Score Breakdown

| Criterion | Score | Notes |
|:--|:--:|:--|
| Workflow order (template-first) | 8/10 | Correctly prioritized |
| Research fallback mechanism | 5/10 | Exists but passive |
| Quality bar definition | 2/10 | 3 bullets vs 615-line methodology |
| Insufficiency criteria | 1/10 | Undefined |
| Generated skill testing | 2/10 | Syntax check only, no behavior test |
| **Overall** | **6/10** | |

---

## 4. Framework Comparison: StackMoss vs. Superpowers

### Philosophy Comparison

| Aspect | StackMoss | Superpowers |
|:--|:--|:--|
| **Design principle** | Template-first generation | Battle-tested from real failures |
| **Skill authoring** | Fill in template slots | TDD: fail first, then write |
| **Anti-rationalization** | Team anti-patterns | Agent rationalization defenses |
| **Operational tooling** | None (scripts/ dirs are empty) | find-polluter.sh, render-graphs.js, server.cjs |
| **Skill testing** | Syntax validation | Subagent pressure scenarios |
| **Cross-referencing** | Read team.md, overrides | `REQUIRED SUB-SKILL: Use superpowers:X` |
| **Token awareness** | Word budgets per capability | Token efficiency targets per skill category |

### Direct Skill Comparison

#### "How to Debug" 

| | StackMoss | Superpowers |
|:--|:--|:--|
| **Exists?** | ❌ No | ✅ Yes (284 lines) |
| **Iron Law** | — | `NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST` |
| **Phases** | — | 4 phases with gates |
| **Red Flags** | — | 15 specific stop triggers |
| **Evidence** | — | Multi-component diagnostic template |
| **Rationalizations** | — | 8-row excuse table |

#### "How to Write Plans"

| | StackMoss TL-PLAN | Superpowers writing-plans |
|:--|:--|:--|
| **Length** | 4 lines | 147 lines |
| **Granularity** | "Break down features" | 2-5 minute bite-sized steps |
| **File mapping** | Not mentioned | Required before any task definition |
| **No Placeholders** | Not mentioned | Iron Law: forbidden patterns listed |
| **Self-review** | Not mentioned | 3-point checklist |

#### "How to Create Skills"

| | StackMoss skill-creator | Superpowers writing-skills |
|:--|:--|:--|
| **Length** | 27 lines | 615 lines |
| **Methodology** | Template fill | TDD (RED → GREEN → REFACTOR) |
| **Testing** | Syntax validation | Subagent pressure scenarios |
| **Quality criteria** | 3 bullet points | Full deployment checklist |
| **Discovery optimization** | Not mentioned | CSO (Claude Search Optimization) |
| **Token awareness** | Not mentioned | Word count targets by category |

### What taste-skill Does Differently

The `taste-skill` (minimalist-skill, 89 lines) takes a completely different approach:
- **Absolute Negative Constraints**: Explicitly bans generic defaults (Inter font, Lucide icons, heavy shadows)
- **Pixel-level specifications**: `border: 1px solid #EAEAEA`, exact hex colors, exact border-radius values
- **AI copywriting bans**: Forbids words like "Elevate", "Seamless", "Unleash"

This is relevant because it demonstrates a **constraint-first** design philosophy: tell the agent what NOT to do with the same specificity as what TO do. Our skills have anti-patterns, but they're at the conceptual level ("architecture astronaut"), not the operational level.

---

## 5. The Core Problem: "Theory vs. Operations"

```
StackMoss tells agents WHAT to know.
Superpowers tells agents HOW to survive.
```

### Evidence Table

| Signal | StackMoss | Superpowers |
|:--|:--|:--|
| "Agent tried to skip debugging" | No defense | 15 Red Flags + rationalization table |
| "Agent wrote code before tests" | No defense | `Write code before test? Delete it. Start over.` |
| "Agent proposed fix without root cause" | No defense | `NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST` |
| "Agent created skill without testing it" | Syntax check only | `NO SKILL WITHOUT A FAILING TEST FIRST` |
| "Agent wrote vague plan" | No defense | `No Placeholders` iron law + banned phrase list |
| "Agent summarized workflow in description" | No guidance | CSO section with explicit bad/good examples |

> [!IMPORTANT]
> **The fundamental gap:** Superpowers has been through dozens of real agent failure cycles. Each failure became a defense mechanism. Our framework hasn't been battle-tested — it's a clean-room design that hasn't met reality yet.

---

## 6. Prioritized Action Plan

### 🔴 P0 — Do Immediately

1. **Add a debugging skill to TL** — Port the systematic-debugging methodology (4 phases, red flags, rationalization table). This is the single highest-value addition because debugging is 40-60% of real agent work.

2. **Define "insufficient" in Skill Creator** — Add a 5-point quality checklist that determines when research fallback is triggered.

3. **Add rationalization defenses to PM and TL** — Convert team anti-patterns to **agent** rationalization tables with the format: `| Excuse | Reality |`.

### 🟡 P1 — Do This Sprint

4. **Upgrade TL-PLAN from 4 lines to a proper planning skill** — Adopt Superpowers' `writing-plans` structure: file mapping → bite-sized tasks → no placeholders → self-review.

5. **Upgrade TL-REVIEW to a proper review protocol** — Adopt Superpowers' `code-reviewer` 6-dimension structure with severity categories.

6. **Add operational scripts to roles** — At minimum:
   - `scripts/validate-and-log.mjs` (already referenced but needs to exist)
   - `scripts/adr-template.md` (for TL)
   - `scripts/brd-template.md` (for PM)

### 🟢 P2 — Do Next Sprint

7. **Add skill testing protocol to Skill Creator** — Adopt TDD-for-skills from Superpowers' `writing-skills`: RED (baseline) → GREEN (write skill) → REFACTOR (close loopholes).

8. **Calibrate roles to project** — Populate `PROJECT_FACTS` in `team.md` with actual tech stack (NestJS, Prisma, Next.js, Expo, PostgreSQL).

9. **Add CSO (Claude Search Optimization) principles** — Ensure all skill descriptions start with "Use when..." and avoid workflow summaries.

10. **Port taste-skill constraint philosophy** — Add "Absolute Negative Constraints" to key skills: what the agent must NOT do, with the same specificity as what it should do.

---

## 7. Final Verdict

| | Current State | Target State |
|:--|:--|:--|
| **Metaphor** | University lecture notes | Field operations manual |
| **Agent autonomy** | Low (needs human for every edge case) | High (handles pressure independently) |
| **Failure resilience** | None (no defense against rationalization) | Battle-tested (every loophole plugged) |
| **Operational tooling** | Empty `scripts/` directories | Working scripts, templates, validators |
| **Project awareness** | Generic placeholder | Calibrated to Aria.vn tech stack |

> [!NOTE]
> **To be clear:** The *architecture* of StackMoss (3-layer + 9-layer structure, runtime isolation, template-first workflow, sources-registry, ROLE_INDEX) is **excellent infrastructure**. The problem isn't the scaffolding — it's that the buildings inside the scaffolding are empty. The framework is ready for operational content; it just needs to be filled with the hard-won, battle-tested knowledge that makes agents reliable under pressure.

---

*This audit is based on direct comparison of source files from:*
- *Local: `.agent/skills/`, `.stackmoss/skill-kit/`, `team.md`, `ROLE_SKILL_OVERRIDES.md`*
- *External: [obra/superpowers](https://github.com/obra/superpowers) (skills/, agents/)*
- *External: [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (skills/minimalist-skill/)*
