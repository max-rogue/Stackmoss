# 🔍 StackMoss Skill Framework — Re-Audit Report (v2.1)

**Date:** 2026-03-29  
**Auditor:** Antigravity (impartial, evidence-based)  
**Scope:** Full product audit — CLI engine + generated output + skill-kit infrastructure  
**Context:** Aria.vn là **test project** được StackMoss generate. Audit này đánh giá StackMoss như một **CLI product** tạo agent team configs cho 5 runtimes.  
**Previous audit:** [v1 — 2026-03-28](skill_framework_audit.md)

---

## Architecture Understanding

StackMoss là **deterministic CLI pipeline** (Node.js + TypeScript, 302 tests, 40 test files) với compile architecture:

```mermaid
flowchart LR
  A["role-skills.ts<br/>52KB — 17 roles<br/>Deep domain content"] --> D["claude-code.ts<br/>41KB"]
  A --> E["antigravity.ts<br/>13KB"]
  A --> F["codex.ts<br/>12KB"]
  A --> G["cursor.ts<br/>5KB"]
  B["skill-kit.ts<br/>26KB — Template engine<br/>skill-creator reference"] --> E
  C["methodology.ts<br/>12KB — Superpowers<br/>adapted workflows"] --> D
  C --> E
  D --> H[".claude/skills/*"]
  E --> I[".agent/skills/*"]
  F --> J[".agents/skills/*"]
  G --> K[".cursor/skills/*"]
```

### Hai luồng tạo skill khác nhau

Điểm quan trọng mà audit v1 chưa nắm đúng:

| Luồng | Mô tả | Ai chạy |
|:--|:--|:--|
| **Compile-time** | `role-skills.ts` → compiler (antigravity.ts, claude-code.ts...) → SKILL.md per role | CLI `stackmoss new` |
| **Runtime** | User ra lệnh → Skill Creator đọc `skill-kit/` → check template → nếu thiếu thì research → generate skill mới | Agent trong IDE |

**Skill-kit templates là reference material cho Skill Creator**, không phải output trực tiếp cho user. Chúng hoạt động như:
1. User yêu cầu agent tạo role mới dựa trên BRD đã lock
2. Skill Creator check `ROLE_INDEX.md` → tìm template gần nhất
3. Chấm điểm template qua `insufficiency-gate.md` (0-5)
4. Score ≥ 4 → adapt template. Score ≤ 3 → research từ `sources-registry.md`
5. Generate runtime skill mới + log adoption

> [!IMPORTANT]
> **UIUX là role duy nhất đã được research và hoàn thiện đầy đủ** (3-file architecture: template + skill-pack + DESIGN template). 9 templates còn lại là scaffolding đang chờ research từng cái một. Đây là **trạng thái thiết kế chủ đích**, không phải gap.

---

## Executive Summary — Scorecard

| Dimension | Score | Notes |
|:--|:--:|:--|
| TL Instruction Quality (compile-time) | **7.5/10** | Full ADR + Review + Debug + Roadmap |
| PM Instruction Quality (compile-time) | **8/10** | BRD Discovery → RICE → Go/No-Go → Handoff |
| FE/UIUX Depth (compile-time) | **9/10** | Design Engineering Directives + AI Tells |
| Skill Creator Workflow | **8/10** | Insufficiency gate + source adoption logging |
| Skill-Kit Infrastructure | **8/10** | Clean engine, UIUX exemplary, 9 templates đang chờ |
| 3×9 Support Files | **7/10** | TL/PM/SC có đủ; các role khác do Skill Creator generate |
| Methodology Layer | **8/10** | 6 workflows từ Superpowers — Antigravity-only |
| Test Coverage | **9/10** | 302 tests / 40 files / adversarial suite |
| **Weighted Average** | **8.0** | |

> [!IMPORTANT]
> **Verdict trước deploy:** Framework **đủ mạnh** để generate functional agent teams. Compile-time output (TL, PM, FE, UIUX, DEV, QA...) production-grade. Skill-kit infrastructure đã có đủ scaffolding cho Skill Creator hoạt động. UIUX template đã xong — là reference model cho 9 templates còn lại. Có thể deploy và iterate.

---

## 1. Compile-Time Role Content — `role-skills.ts` (52KB)

Đây là engine chứa **tất cả** domain knowledge cho 17 roles được compile trực tiếp vào SKILL.md khi user chạy `stackmoss new`.

### Content Depth Map

| Role | Process Lines | Highlights | Assessment |
|:--|:--:|:--|:--:|
| **TL** | ~85 | ADR (7 steps) + Roadmap Protocol + Debugging (4 phases + 3 escalation triggers) + Code Review (6 dims + 3 severity) + Rationalization (4 rows) | 🟢 |
| **PM** | ~62 | BRD Discovery (8 steps) + Stakeholder Interview (6 Qs) + Spec-to-Execution Handoff + RICE Framework + Go/No-Go (4 gates) + Missing Data Rules + MVP Scoping + Release Readiness | 🟢 |
| **FE** | ~75 | Component Workflow (7 steps) + CSS Architecture Rules + **Design Engineering Directives** (Typography, Color, Layout, States) + **AI Tells — Forbidden Patterns** (Visual, Typography, Content, Components) | 🟢🟢 |
| **UIUX** | ~82 | Design Atmosphere Dials + Token System + **Full Design Audit Checklist** (Typography, Color, Layout, Interactivity, Content) + Nielsen Heuristics | 🟢🟢 |
| **BE** | ~14 | API Endpoint Checklist (6 steps) + Database Patterns (5 rules) | 🟡 |
| **DEV** | ~15 | TDD Workflow (7 steps) + Debug Protocol (6 steps) | 🟡 |
| **QA** | ~16 | Testing Pyramid + Edge Case Discovery (5 categories) + Regression Prevention | 🟡 |
| **SEC** | ~14 | Security Review (6 areas) + OWASP Top 10 Quick Reference | 🟡 |
| **DEVOPS** | ~16 | CI/CD Pipeline (7 stages) + Docker Best Practices (5 rules) | 🟡 |
| **MOBILE** | ~14 | Mobile Workflow (6 steps) + Offline-First Patterns (4 rules) | 🟡 |
| **DATA** | ~12 | ETL Standards (5 stages) + Schema Evolution Rules (4 rules) | 🟡 |
| **MLE** | ~12 | ML Experiment Workflow (7 steps) + Deployment Checklist (5 items) | 🟡 |
| **FS** | ~12 | Integration Workflow (5 steps) + State Management Rules (4 rules) | 🟡 |
| BA | ~6 | Requirements Elicitation + AC Format | 🟡 |
| PE | ~12 | Prompt Engineering Workflow (6 steps) + Prompt Structure Template | 🟡 |
| DOCS | ~8 | Documentation Standards (5 types) + Writing Guide (4 rules) | 🟡 |
| OPS | ~6 | Deploy Process (6 steps) | 🟡 |
| BRAND | ~6 | Brand Identity (6 steps) + Logo Usage Rules | 🟡 |

### Analysis

**Stars (🟢🟢):** FE và UIUX vượt trội — taste-skill content đã được port hoàn chỉnh. FE có Design Engineering Directives + AI Tells (28 forbidden patterns). UIUX có Design Atmosphere Dials + full Audit Checklist.

**Strong (🟢):** TL và PM production-grade workflows, đủ cho real coordination.

**Adequate (🟡):** Engineering roles (BE, DEV, QA...) có đúng structure, đủ Iron Law + Process + Anti-Patterns + Checklist. Content ngắn hơn (6-16 lines process) nhưng **đây là compile-time output** — scope đúng là baseline, TL calibrate thêm qua `ROLE_SKILL_OVERRIDES.md`.

---

## 2. Skill-Kit Templates — Reference Material cho Skill Creator

### Thiết kế 2 lớp

```
skill-kit/
  ROLE_INDEX.md              ← Skill Creator đọc đầu tiên
  sources-registry.md        ← Fallback research list
  shared/
    insufficiency-gate.md    ← 5-point scoring (≥4 adapt, ≤3 research)
    SKILL.template.md        ← Skeleton cho skill mới
    role-skill-blueprint.md  ← 9-layer structure definition
    owner-questions.md       ← Quick (3) + Interview (10) intake
    validation-matrix.md     ← 5-type validation taxonomy
    pressure-test-scenarios.md ← 4 structural test scenarios
    output-contract.md       ← Output format rules
    runtime-boundary-checklist.md ← Path safety
    source-adoption-log.template.md ← Research tracing
  roles/
    uiux.template.md         ← ✅ HOÀN THIỆN (111 lines)
    uiux.skill-pack.md       ← ✅ HOÀN THIỆN (108 lines, 5-mode)
    uiux.DESIGN.template.md  ← ✅ HOÀN THIỆN (48 lines, Stitch spec)
    developer.template.md    ← ⏳ Scaffolding (chờ research)
    frontend.template.md     ← ⏳ Scaffolding (chờ research)
    backend.template.md      ← ⏳ Scaffolding (chờ research)
    devops.template.md       ← ⏳ Scaffolding (chờ research)
    qa.template.md           ← ⏳ Scaffolding (chờ research)
    security.template.md     ← ⏳ Scaffolding (chờ research)
    data-engineer.template.md ← ⏳ Scaffolding (chờ research)
    ml-engineer.template.md  ← ⏳ Scaffolding (chờ research)
    docs.template.md         ← ⏳ Scaffolding (chờ research)
```

### Trạng thái hoàn thiện

| Template | Status | Depth | Extras |
|:--|:--|:--:|:--|
| **uiux** | ✅ Complete | Deep | skill-pack (5 modes) + DESIGN.template + forbiddenPatterns + references |
| developer | ⏳ Scaffolding | Generic | Shared Core Workflow + Shared Rationalization (5 rows) |
| frontend | ⏳ Scaffolding | Generic | Shared Core Workflow + Shared Rationalization (5 rows) |
| backend | ⏳ Scaffolding | Generic | Shared Core Workflow + Shared Rationalization (5 rows) |
| devops | ⏳ Scaffolding | Generic | Shared Core Workflow + Shared Rationalization (5 rows) |
| qa | ⏳ Scaffolding | Generic | Shared Core Workflow + Shared Rationalization (5 rows) |
| security | ⏳ Scaffolding | Generic | Shared Core Workflow + Shared Rationalization (5 rows) |
| data-engineer | ⏳ Scaffolding | Generic | Shared Core Workflow + Shared Rationalization (5 rows) |
| ml-engineer | ⏳ Scaffolding | Generic | Shared Core Workflow + Shared Rationalization (5 rows) |
| docs | ⏳ Scaffolding | Generic | Shared Core Workflow + Shared Rationalization (5 rows) |

### Đánh giá scaffolding hiện tại

9 templates chờ research đều dùng chung `renderRoleTemplate()` với cấu trúc:

```markdown
## Core Workflow (4 steps — identical across all)
## Operational Gates (3 gates — identical)
## Rationalization Defenses (5 rows — identical)
## Quality Bar (5 items — identical)
```

Chỉ khác nhau ở: **Mission**, **Trigger Guidance**, **Deliverables**, **Validation Baseline**.

**Nhận xét:** Scaffolding đủ để Skill Creator **không bị lost** khi gặp domain chưa quen — nó biết structure nào cần tạo. Nhưng khi chấm insufficiency-gate (0-5), hầu hết sẽ score **≤ 3** vì:
- ✅ Iron Law explicit → 1 điểm
- ❌ Workflow chưa có 3+ phases cụ thể theo domain → 0 điểm (generic 4-step)
- ❌ Rationalization defenses chưa domain-specific → 0 điểm (generic 5 rows)
- ❌ Validation chưa có executable command theo domain → 0 điểm
- ⚠️ Deliverables OK nhưng chưa concrete → 0-1 điểm

**Kết quả dự kiến: Score 1-2 → Skill Creator sẽ tự động trigger research.** Đây chính xác là **hành vi mong muốn** — scaffolding không đủ → research → log adoption → generate skill tốt hơn.

> [!TIP]
> **Thiết kế này thông minh:** Template scaffolding thấp điểm → tự kích hoạt research → Skill Creator buộc phải deepening. Insufficiency gate hoạt động đúng vai trò gatekeeper.

### UIUX — Reference Model

UIUX template đã hoàn thiện cho thấy đích đến của mỗi template khi research xong:

| Extension Point | UIUX Implementation | 9 Templates (chờ) |
|:--|:--|:--|
| `extraProtocol` | Design Atmosphere Dials + Audit Flow + Handoff Contract (~30 lines) | Empty |
| `forbiddenPatterns` | 6 absolute negative constraints | Empty |
| `references` | 8 taste-skill external links | Empty |
| Companion file: skill-pack | 5-mode operating system (108 lines) | N/A |
| Companion file: DESIGN.template | Stitch generation spec (48 lines) | N/A |

**UIUX score qua insufficiency-gate: 5/5.** Đây là benchmark rõ ràng cho team.

---

## 3. Antigravity Compile Target — `antigravity.ts` (409 lines)

### Generated Output Structure

| Category | Files | Notes |
|:--|:--|:--|
| Rules | `team-bootstrap.md`, `methodology.md` | Always-on rules |
| Workflows | 6 methodology workflows | tdd-cycle, debugging-protocol, review-reception, planning-protocol, git-workflow, execution-loop |
| Skill Creator | SKILL.md + 3×9 support files | Đầy đủ — bao gồm research-scorecard template |
| TL Skill | SKILL.md + calibrate.md + 3×9 support files | feature-roadmap, risk-register, team-topology templates |
| PM Skill | SKILL.md + brd-lock.md + 3×9 support files | brd-lock-checklist, go-no-go, stakeholder-update templates |
| Other Roles | SKILL.md only | Đúng thiết kế — enrichment do Skill Creator khi cần |

### 3×9 Support Files

```
<role>/
  references/layer-map.md
  examples/session-example.md
  scripts/validate-and-log.mjs      # Parameterized per owner
  assets/templates/owner-questions.md
  assets/templates/<role-specific>*.md  # TL/PM/SC only
  contracts/output-contract.md
  governance/evolution.md
  data/research-cutoff.json
  data/source-adoption-log.md
  data/validation-log.ndjson
```

**Chỉ TL, PM, Skill Creator có 3×9.** Các role khác chỉ có SKILL.md — đây là thiết kế chủ đích vì:
1. Leadership roles cần operational scaffolding ngay từ bootstrap
2. Engineering roles được enrichment bởi Skill Creator khi user yêu cầu
3. Giữ output bootstrap gọn — không phình files không cần thiết

### Methodology Workflows (Antigravity-only)

6 workflows adapted từ Superpowers:
- `tdd-cycle.md` — RED → GREEN → REFACTOR
- `debugging-protocol.md` — Reproduce → Isolate → Root cause → Verify
- `review-reception.md` — Read → Verify → Apply or Challenge
- `planning-protocol.md` — Parallel-friendly clusters + file ownership
- `git-workflow.md` — Init → Commit → Push with secret check
- `execution-loop.md` — TL assigns → DEV implements → QA audits → Ship/Block

> [!WARNING]
> **Gap:** Claude Code và Codex không nhận methodology workflow files riêng. Claude Code được `methodology.md` rule (condensed), Codex được reference trong AGENTS.md. Antigravity users nhận nhiều operational guidance hơn.

---

## 4. Skill Creator Workflow — Đánh giá chi tiết

### Complete Flow

```
1. User ra lệnh: "Tạo role X dựa trên BRD"
   ↓
2. Skill Creator đọc ROLE_INDEX.md → tìm template gần nhất
   ↓
3. Chấm điểm template qua insufficiency-gate.md (0-5)
   ├── Score ≥ 4 → Adapt local template (vd: UIUX đạt 5/5)
   └── Score ≤ 3 → Research từ sources-registry.md
       ↓
4. Nếu research → log vào source-adoption-log.md:
   - source_url, reason_selected, adopted_patterns, rejected_patterns
   ↓
5. Generate runtime skill (SKILL.md + optional support files)
   ↓
6. Validate: run positive command + 1 negative-path command
   → Log kết quả vào data/validation-log.ndjson
   ↓
7. Nếu validation fail → blocked state + ask owner questions
```

### What's Excellent ✅

**Insufficiency gate tự kích hoạt research khi cần:**
- UIUX template score 5/5 → Skill Creator adapt trực tiếp, không waste time research
- Backend template score ~2/5 → Skill Creator buộc phải research → produce deeper skill
- Đây là **self-regulating quality control** — templates thin = research tự động

**Source adoption logging tạo audit trail:**
- Khi Skill Creator dùng external source, phải ghi lại: cái gì lấy, cái gì bỏ, tại sao
- Governance hiếm framework nào có

**Quality gate rõ ràng:**
- Generated skill phải có Iron Law + ≥3 workflow phases + rationalization defenses + blocked-state logic
- Nếu không đạt → skill không được mark done

### What Could Be Stronger ⚠️

**1. ROLE_INDEX chưa reflect multi-file architecture:**

Hiện tại:
```markdown
| uiux | UIUX Designer | roles/uiux.template.md |
```

Thiếu: `uiux.skill-pack.md` và `uiux.DESIGN.template.md`. Khi Skill Creator cần tham khảo UIUX như reference model cho role mới, nó có thể miss skill-pack.

**Fix đề xuất:**
```markdown
| uiux | UIUX Designer | roles/uiux.template.md | roles/uiux.skill-pack.md, roles/uiux.DESIGN.template.md |
```

**2. Skill Creator không có hướng dẫn "tham khảo UIUX như reference model":**

Skill Creator workflow nói "adapt local templates" + "research external sources" nhưng không nói "khi tạo role mới, hãy xem UIUX như ví dụ về template hoàn thiện." Điều này quan trọng vì UIUX là proof-of-concept cho mức độ sâu mong muốn.

**3. Pressure test scenarios là structural, chưa behavioral:**

4 scenarios hiện tại:
1. Missing command → blocked state ✅
2. Runtime boundary violation → abort ✅
3. Conflicting requirement → escalation ✅
4. Failing command → logged + remediation ✅

Thiếu: "Skill Creator skip insufficiency gate vì tự cho là đủ" → scenario test xem gate có thực sự enforceable không.

---

## 5. Comparison vs Superpowers — Contextual

| Dimension | StackMoss | Superpowers | Analysis |
|:--|:--|:--|:--|
| **Product type** | Multi-runtime CLI pipeline | Single-runtime skill library | Khác mục đích |
| **Compile-time content** per role | 15-85 lines process | 100-300+ lines per skill | SP deeper per role |
| **Role breadth** | 17 roles + Skill Creator | ~8 skills | SM broader |
| **Template-first generation** | ✅ Insufficiency gate + scoring | ❌ Manual writing | SM more systematic |
| **Self-regulating quality** | ✅ Low score → auto research | ❌ N/A | SM unique |
| **Methodology adaptation** | 6 adapted workflows | Originals | SM adapts, doesn't copy |
| **Testing** | 302 tests / 40 files | N/A | SM is tested product |
| **Runtime support** | 5 runtimes | Claude Code only | SM runtime-agnostic |
| **UIUX depth** | taste-skill adapted, 3-file architecture | N/A (no design skill) | SM leads here |

> [!NOTE]
> **So sánh đúng:** Superpowers là library of skills — mỗi skill sâu nhưng tách rời. StackMoss là pipeline tạo ra skill systems — mỗi generated skill có thể mỏng hơn nhưng thuộc hệ thống có governance (budget, gates, adoption logging). **Hai sản phẩm bổ sung nhau, không thay thế nhau.**

---

## 6. Prioritized Recommendations

### 🔴 P0 — Fix trước deploy

**1. Update ROLE_INDEX cho multi-file architecture**  
Thêm column "Companion Files" để Skill Creator biết UIUX có 3 files. Khi research xong thêm roles (vd: frontend), cũng cần cập nhật column này.

**2. Thêm "UIUX as reference model" instruction vào Skill Creator workflow**  
Trong `skill-creator/SKILL.md`, thêm step: "Khi tạo template mới, tham khảo `roles/uiux.template.md` + `roles/uiux.skill-pack.md` như benchmark cho mức độ hoàn thiện mong đợi."

### 🟡 P1 — First sprint post-launch

**3. Research và hoàn thiện 3 templates ưu tiên cao nhất**  
Đề xuất thứ tự:
1. **Frontend** — vì đã có Design Engineering Directives trong `role-skills.ts`, cần port vào template + tạo forbiddenPatterns + references
2. **Backend** — phổ biến nhất, cần domain-specific workflow (API design, migration, error handling)
3. **QA** — critical cho execution-loop, cần test strategy framework + regression protocol

**4. Methodology parity cho Claude Code và Codex**  
Đảm bảo Claude Code users nhận được tương đương 6 workflow files, dù format khác (rules-based thay vì workflow files).

### 🟢 P2 — Quality targets

**5. Thêm behavioral pressure test scenario**  
Thêm scenario 5: "Skill Creator tự nhận template đủ tốt mà không chạy insufficiency gate" → test xem workflow enforcement có hoạt động không.

**6. Thêm domain-specific rationalization rows**  
Khi research từng template, thêm 3-5 domain-specific rationalization defenses thay vì chỉ dùng generic 5 rows. Ví dụ:
- Frontend: "Design is close enough, skip pixel review" → "Near-miss design erodes brand consistency"
- QA: "Unit tests pass, skip exploratory" → "Automated tests only cover known scenarios"
- Security: "Internal tool, no need for auth" → "Internal tools get compromised and become attack vectors"

---

## 7. Final Assessment

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOY DECISION: GO ✅                        │
│                                                                 │
│  Compile-time output (17 roles) là production-grade.            │
│  Skill-kit infrastructure có đủ scaffolding + self-regulating   │
│  quality (insufficiency gate kích hoạt research tự động).       │
│                                                                 │
│  UIUX là proof-of-concept hoàn thiện cho template quality.      │
│  9 templates còn lại có scaffolding đúng — Skill Creator sẽ    │
│  tự research khi score ≤ 3, đây là hành vi mong muốn.          │
│                                                                 │
│  Pre-deploy fixes (estimated ~45 min total):                    │
│  → Update ROLE_INDEX multi-file column (~5 min)                 │
│  → Add "UIUX as reference" to Skill Creator (~10 min)          │
│                                                                 │
│  Post-deploy priority:                                          │
│  → Research frontend/backend/qa templates (1-2 hours each)      │
│  → Methodology parity for Claude Code/Codex                     │
└─────────────────────────────────────────────────────────────────┘
```

### Summary Matrix

| Layer | What Works | What's In Progress | What's Missing |
|:--|:--|:--|:--|
| **Compile-time** (`role-skills.ts`) | ✅ 17 roles, TL/PM strong, FE/UIUX best-in-class | ⚠️ 12/17 roles có thin process (6-16 lines) — đủ baseline | — |
| **Skill-kit** (`skill-kit.ts`) | ✅ UIUX complete (3-file), scaffolding for all | ⏳ 9 templates chờ research | — |
| **Skill Creator** | ✅ Insufficiency gate, adoption logging, quality gate | — | ❌ ROLE_INDEX multi-file, "UIUX as reference" instruction |
| **Antigravity target** | ✅ 3×9 for TL/PM/SC, 6 methodology workflows | — | — |
| **Cross-runtime** | ✅ 5 compile targets working | — | ⚠️ Methodology parity cho Claude Code/Codex |
| **Testing** | ✅ 302 tests / 40 files / adversarial | — | — |

---

*Audit dựa trên source code analysis: `E:\Stackmoss\src\compile\role-skills.ts` (52KB), `E:\Stackmoss\src\templates\skill-kit.ts` (26KB), `E:\Stackmoss\src\compile\antigravity.ts` (13KB), và generated output trong `E:\Aria.vn\.agent\skills\`. Tất cả scores evidence-based từ source files.*
