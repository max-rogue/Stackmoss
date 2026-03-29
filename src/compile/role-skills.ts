/**
 * Deep Role Skill Content
 * Authority: superpowers vendor format (Iron Law â†’ Process â†’ Examples â†’ Anti-patterns â†’ Checklist)
 *
 * Each role gets real technical depth beyond governance.
 * TL calibration can enrich these with project-specific stack patterns.
 */

// â”€â”€â”€ Skill Content Registry â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface RoleSkillContent {
    ironLaw: string;
    whenToUse: string[];
    process: string;
    goodBad?: string;
    antiPatterns: string[];
    checklist: string[];
}

const SKILL_CONTENT: Record<string, RoleSkillContent> = {

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // LEADERSHIP
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

    TL: {
        ironLaw: 'NO ARCHITECTURE DECISION WITHOUT A WRITTEN ADR FIRST',
        whenToUse: [
            'Architecture decisions affecting >1 module',
            'Code review before merge to main',
            'Team topology changes or role reassignment',
            'Sprint planning and feature decomposition',
            'Repo calibration after BRD changes',
        ],
        process: `### Architecture Decision Process
1. **Identify the decision** - what are we deciding and why now?
2. **List constraints** - budget, timeline, team skills, existing tech debt
3. **Enumerate options** - at least 2 alternatives, never just "the obvious one"
4. **Evaluate trade-offs** - latency, cost, complexity, maintainability
5. **Write ADR** - status, context, decision, consequences
6. **Review with team** - get at least one dissenting opinion before finalizing
7. **Communicate** - update CONTEXT.md, notify affected roles

### Feature Roadmap Protocol (AI-speed delivery)
1. Define feature slices by user outcome, not by sprint ceremony.
2. For each slice, state owner, dependency, validation command, and rollback path.
3. Sequence slices so each one can ship independently.
4. Keep backlog ordered by value and technical risk, not by document order.

### Debugging Escalation Protocol
Phase 1: Reproduce
- Create a stable repro with command, input, expected, actual.
Phase 2: Isolate
- Narrow to component/module boundary and gather logs or traces.
Phase 3: Root cause
- Explain why the failure happens, not just where.
Phase 4: Patch and verify
- Apply smallest fix, rerun repro, then targeted regression checks.

Stop and escalate when:
- root cause is still unknown after two focused hypotheses,
- reproduction is not stable,
- fix requires cross-module architectural change without ADR.

### Code Review Framework
Review in this order:
1. Plan alignment - does diff match approved scope?
2. Correctness and failure handling - happy path plus edge and error paths.
3. Architecture fit - aligns with ADRs and module boundaries.
4. Test evidence - meaningful tests and commands, not coverage theater.
5. Security and data safety - secrets, auth boundaries, data exposure.
6. Operability - rollback, observability, and runbook impact.

Severity categories:
- Critical: blocks merge now.
- Important: fix before release branch.
- Suggestion: optional improvement with rationale.

### Rationalization Defenses
| Excuse | Reality |
|:--|:--|
| "Quick fix first, root cause later." | This creates recurring incidents and hidden debt. |
| "No time for ADR, decision is obvious." | Obvious decisions still need traceability and trade-offs. |
| "Tests are green in CI, review can be light." | CI green does not prove architecture or risk correctness. |
| "We can plan while building." | Unclear sequencing increases coordination thrash. |`,
        goodBad: `**Good ADR:**
\`\`\`markdown
## ADR-003: Use PostgreSQL over MongoDB
Status: Accepted
Context: Our data is relational (users â†’ orders â†’ items). We need ACID transactions for payments.
Decision: PostgreSQL 16 with Prisma ORM.
Consequences: Team needs Prisma knowledge. Migration tooling required.
\`\`\`

**Bad ADR:**
\`\`\`markdown
## ADR-003: Database
We'll use Postgres because it's better.
\`\`\``,
        antiPatterns: [
            'Decision by committee - one person owns each ADR, others review',
            'Architecture astronaut - designing for problems that do not exist yet',
            'Big bang rewrites - prefer incremental migration with feature flags',
            'Reviewing code you did not understand - ask questions first',
            'Approving PRs without running tests locally',
            'Treating roadmap as sprint ritual instead of feature outcome sequencing',
            'Merging while root cause is still uncertain',
            'Calling work done without explicit ship or block verdict',
        ],
        checklist: [
            'Every architecture decision has a written ADR',
            'ADR includes at least 2 alternatives considered',
            'Roadmap slices include owner, dependency, and validation command',
            'Code review covers six dimensions with severity labels',
            'Debugging follows reproduce -> isolate -> root cause -> verify',
            'CONTEXT.md is current after every feature',
            'No merge without passing CI + QA sign-off',
        ],
    },

    PM: {
        ironLaw: 'NO FEATURE SHIPS WITHOUT A CLEAR SUCCESS METRIC',
        whenToUse: [
            'Product scope is unclear â€” user needs help defining what to build',
            'BRD does not exist yet and needs to be created from scratch',
            'BRD is a draft and needs finalization before development begins',
            'Defining or updating the product roadmap',
            'Prioritizing backlog items using impact-driven frameworks',
            'Evaluating feature trade-offs and cost-benefit',
            'Preparing stakeholder demos or status reports',
            'Go/no-go decisions for feature releases',
        ],
        process: `### BRD Discovery Process (Pre-BRD)
Use this when the user has no BRD or only a rough idea:
1. **Problem framing** - what pain point does this solve? Who feels the pain?
2. **Solution hypothesis** - how do we believe this solves the problem?
3. **Target user** - who specifically uses this? (persona, not "everyone")
4. **Scope boundaries** - what is IN scope for v1, what is explicitly OUT?
5. **Success metric** - what single metric proves this worked? (activation rate, revenue, time saved)
6. **Constraints** - budget, timeline, regulatory, team skill limitations
7. **Write BRD** - compile into structured doc: Problem, Solution, Scope, Non-Goals, Success Criteria, Constraints
8. **Review and lock** - walk through with stakeholders, adjust, then mark as LOCKED

### Stakeholder Interview Template
When the user is unsure about scope, ask these in order:
- "What problem are you trying to solve?"
- "Who is the primary user and what do they need?"
- "What would make you consider v1 successful?"
- "What are you explicitly NOT building in this phase?"
- "What is the deadline or budget constraint?"
- "Are there regulatory or compliance requirements?"

### Spec-to-Execution Handoff (for TL)
After BRD lock, deliver handoff packet:
1. Feature slices written as outcome-driven tasks.
2. Each task includes explicit paths, commands, and acceptance checks.
3. No placeholders allowed ("TBD", "TODO later", "add validation").
4. Open assumptions listed with owner and due date.

### Feature Prioritization (RICE Framework)
1. **Reach** - how many users does this affect per quarter?
2. **Impact** - how much does this move the needle? (3=massive, 2=high, 1=medium, 0.5=low)
3. **Confidence** - how sure are we about reach/impact? (100%/80%/50%)
4. **Effort** - how many person-weeks? (smaller = better)
5. **Score** = (Reach x Impact x Confidence) / Effort
6. **Stack rank** - highest RICE score wins, with strategic overrides documented

### Go/No-Go Framework
Evaluate before release:
1. Acceptance gate - QA pass rate and unresolved critical defects.
2. Impact gate - metric instrumentation is live for target success signal.
3. Risk gate - rollback plan tested and on-call owner assigned.
4. Stakeholder gate - decision maker sign-off with documented rationale.

If any gate fails: verdict is NO-GO with explicit remediation owner and date.

### Missing Data Rules
- If confidence < 0.6, mark assumption and request data before commitment.
- Use proxy metrics only when primary metric is unavailable, and label as proxy.
- Never use vanity metrics as ship criteria.

### MVP Scoping Checklist
- [ ] Core user flow identified (max 3 flows for v1)
- [ ] Each flow has measurable success criteria
- [ ] Non-goals are explicit and documented
- [ ] Technical feasibility confirmed by Tech Lead
- [ ] Timeline estimated with appetite sizing (XS/S/M/L/XL)

### Release Readiness Checklist
- Feature meets acceptance criteria (verified by QA)
- Success metric is instrumented and dashboarded
- Rollback plan documented
- Stakeholder demo completed
- Release notes drafted`,
        goodBad: `**Good BRD scope:**
\`\`\`markdown
## Problem
Small merchants cannot accept online vouchers because existing platforms charge 15-30% commissions.

## Solution
A self-service voucher platform where merchants set their own pricing (0-5% fee).

## v1 Scope
- Merchant signup and store creation
- Voucher creation with QR codes
- Customer purchase and redemption

## Non-Goals (v1)
- Analytics dashboard (v2)
- Multi-currency support (v3)
- Affiliate program (future)

## Success Metric
10 active merchants with â‰¥50 vouchers sold in first month.
\`\`\`

**Bad BRD scope:**
\`\`\`markdown
Build a voucher platform. It should be easy to use and have lots of features.
\`\`\``,
        antiPatterns: [
            'Starting development without a locked BRD - scope will drift',
            'HiPPO decisions - highest paid person opinion overriding evidence',
            'Feature factory - shipping outputs without measuring outcomes',
            'Scope creep - adding new asks without timeline reset',
            'Vanity metrics - tracking signups instead of activation or retention',
            'Skipping non-goals - everything is in scope until you say it is not',
            'Proxy metrics without labeling proxy confidence',
            'Declaring GO without rollback owner and tested rollback path',
            'Handoff packet contains placeholders instead of executable checks',
        ],
        checklist: [
            'BRD exists and is marked LOCKED before any development begins',
            'Every feature has a measurable success metric',
            'Non-goals are explicit and reviewed with Tech Lead',
            'Backlog is prioritized with documented rationale',
            'Go/no-go decision includes gate results and owner',
            'Handoff packet has explicit paths, commands, and acceptance checks',
            'Stakeholders are aligned before development starts',
            'Release has a rollback plan',
            'Post-launch review is scheduled',
        ],
    },

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // BUSINESS
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

    BA: {
        ironLaw: 'NO DEVELOPMENT WITHOUT TESTABLE ACCEPTANCE CRITERIA',
        whenToUse: [
            'Requirements are unclear or conflicting',
            'New feature needs formal acceptance criteria',
            'Stakeholder interviews to elicit hidden requirements',
            'Gap analysis between BRD and implementation',
        ],
        process: `### Requirements Elicitation
1. **Stakeholder map** â€” who has input, who has authority, who is affected?
2. **As-is analysis** â€” what exists today? What are the pain points?
3. **To-be definition** â€” what should the future state look like?
4. **Gap identification** â€” delta between as-is and to-be
5. **Acceptance criteria** â€” Given/When/Then for every user story
6. **Edge cases** â€” what happens when input is invalid, empty, huge, concurrent?

### Acceptance Criteria Format (Given/When/Then)
\`\`\`
Given: [precondition â€” system state before action]
When:  [action â€” what the user does]
Then:  [outcome â€” observable result]
\`\`\``,
        antiPatterns: [
            'Vague acceptance criteria â€” "it should work well" is not testable',
            'Gold plating â€” adding requirements nobody asked for',
            'Assumption-driven development â€” assuming you know what users want',
            'Missing edge cases â€” only writing happy path criteria',
        ],
        checklist: [
            'Every user story has Given/When/Then acceptance criteria',
            'Edge cases and error scenarios are documented',
            'Stakeholders have reviewed and signed off on requirements',
            'Requirements trace back to BRD objectives',
        ],
    },

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // ENGINEERING
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    FE: {
        ironLaw: 'NO UI COMPONENT WITHOUT A STORYBOOK/TEST CASE FIRST',
        whenToUse: [
            'Building UI components, pages, or interactive elements',
            'Implementing design tokens, CSS architecture, or responsive layouts',
            'Accessibility audits â€” ARIA, keyboard nav, screen readers',
            'Performance optimization â€” bundle size, LCP, CLS',
            'Design quality enforcement â€” catching AI tells, anti-slop, visual polish',
        ],
        process: `### Component Development Workflow
1. **Design review** â€” understand the spec from UIUX, identify tokens and variants
2. **Write component test** â€” test renders, accepts props, handles interactions
3. **Build component** â€” semantic HTML first, then style, then interactivity
4. **Accessibility pass** â€” keyboard nav, ARIA labels, focus management, color contrast
5. **Responsive pass** â€” mobile-first, breakpoints, touch targets (min 44Ã—44px)
6. **Performance check** â€” no layout shifts, lazy-load below fold, minimize re-renders
7. **Design quality pass** â€” check AI Tells list, verify anti-slop, test all states

### CSS Architecture Rules
- Use design tokens (not magic numbers): \`var(--spacing-md)\` not \`16px\`
- Component-scoped styles (CSS modules, scoped, or BEM)
- No \`!important\` â€” fix specificity at the source
- Mobile-first media queries: min-width, not max-width

### Design Engineering Directives (Bias Correction)
LLMs have statistical biases toward generic UI patterns. Proactively counter them:

**Typography:**
- Display/headlines: tighten letter-spacing, reduce line-height. Hierarchy through weight and color, not just massive size
- Body: relaxed leading, max 65 characters per line (\`max-w-[65ch]\` or equivalent)
- Use at least 3 font weights (400, 500, 600) â€” not just Regular + Bold
- Numbers in data-heavy UIs should use tabular figures (monospace alignment)

**Color calibration:**
- Max 1 accent color. Keep saturation below 80%
- The "AI purple/blue neon gradient" aesthetic is BANNED â€” it screams "AI generated"
- Stick to one gray family (warm OR cool, never both in the same project)
- Never use pure \`#000000\` â€” use off-black, dark charcoal, or tinted dark

**Layout diversification:**
- Centered hero sections are BANNED for creative/marketing pages â€” use split screen, left-aligned, or asymmetric layouts
- The generic "3 equal cards in a row" feature section is BANNED â€” use 2-column zig-zag, asymmetric grid, or horizontal scroll
- CSS Grid over flexbox percentage math â€” never use \`calc()\` percentage hacks for grid layouts
- Full-height sections must use \`min-h-[100dvh]\` â€” never \`h-screen\` (iOS Safari viewport jump)

**Interactive states (mandatory):**
- Loading: skeletal loaders matching layout dimensions â€” no generic circular spinners
- Empty states: composed layouts showing how to populate data
- Error states: clear inline error reporting, not just toast notifications
- Tactile feedback on press: subtle scale/translate for physical push feel

### AI Tells â€” Forbidden Patterns
These visual signatures make UI look "AI-generated". Avoid unless explicitly requested:

**Visual:**
- No neon outer glows â€” use inner borders or tinted shadows instead
- No oversaturated accent colors â€” desaturate to blend with neutrals
- No sudden dark sections in an otherwise light page (or vice versa)
- No flat sections with zero texture â€” add subtle noise, grain, or depth

**Typography:**
- No browser default fonts â€” choose intentional typefaces with character
- No oversized H1 that "screams" â€” control hierarchy with weight and color
- No orphaned single words on last line â€” use \`text-wrap: balance\`

**Content/Data:**
- No generic placeholder names (John Doe, Jane Smith) â€” use creative, realistic names
- No predictable round numbers (99.99%, $50.00) â€” use organic data (47.2%, $38.50)
- No filler words (Elevate, Seamless, Unleash, Next-Gen) â€” use concrete verbs
- No broken image placeholder URLs â€” use reliable placeholder services

**Components:**
- No generic shadcn/MUI defaults â€” always customize radii, colors, shadows to match project aesthetic
- No emoji as UI elements â€” use proper icon libraries (Phosphor, Radix, Lucide)`,
        goodBad: `**Good UI (anti-slop):**
\`\`\`
- Tinted shadows matching background hue
- Single accent color, desaturated, consistent
- Asymmetric hero with intentional whitespace
- Skeletal loaders sized to match actual content
- Realistic data: "Dr. Rebecca Asante â€” 47.2% conversion rate"
\`\`\`

**Bad UI (AI slop):**
\`\`\`
- Purple neon gradient buttons with outer glow
- 3 perfectly equal feature cards in a row
- Inter font, centered everything, generic shadows
- "John Doe â€” 99.99% satisfaction rate"
- Loading spinner â†’ content pops in with layout shift
\`\`\``,
        antiPatterns: [
            'Div soup â€” use semantic HTML (nav, main, section, article, aside)',
            'Inline styles â€” use design tokens via CSS variables or theme',
            'Missing alt text â€” every img needs descriptive alt or role="presentation"',
            'Click-only interactions â€” all interactive elements must work with keyboard',
            'Testing implementation details â€” test behavior, not DOM structure',
            'AI Tell: purple/blue neon gradient aesthetic â€” the #1 marker of AI-generated UI',
            'AI Tell: 3 equal cards in a row â€” the most generic layout pattern',
            'AI Tell: generic placeholder data (John Doe, 99.99%, Acme Corp)',
            'AI Tell: using Inter/system font for "premium" designs â€” choose a distinctive typeface',
            'Missing interactive states â€” loading, empty, error states are not optional',
        ],
        checklist: [
            'Component has unit test covering render + interactions',
            'All interactive elements are keyboard accessible',
            'ARIA labels are present where semantic HTML is insufficient',
            'Design tokens used (no hardcoded colors/sizes)',
            'Responsive from 320px to 1920px verified',
            'No layout shifts (CLS < 0.1)',
            'AI Tells checklist reviewed â€” no forbidden patterns present',
            'All 4 interactive states implemented (loading, empty, error, success)',
            'Color palette uses max 1 accent color with saturation < 80%',
            'No pure #000000 â€” off-black or tinted dark used instead',
        ],
    },

    BE: {
        ironLaw: 'NO ENDPOINT WITHOUT INPUT VALIDATION AND ERROR HANDLING',
        whenToUse: [
            'Implementing REST/GraphQL endpoints, DTOs, or service logic',
            'Designing database schemas, writing migrations, or optimizing queries',
            'Implementing auth flows, session management, RBAC, or tokens',
        ],
        process: `### API Endpoint Checklist
1. **Input validation** â€” validate all inputs at the boundary (DTO/schema)
2. **Authorization** â€” check permissions before business logic
3. **Business logic** â€” pure functions where possible, side effects at edges
4. **Error handling** â€” consistent error format, proper HTTP status codes
5. **Logging** â€” structured logs with correlation IDs, no PII in logs
6. **Response shape** â€” consistent envelope, pagination, HATEOAS links if REST

### Database Patterns
- Migrations are additive â€” never drop columns in production
- Use transactions for multi-table writes
- Index columns used in WHERE, JOIN, ORDER BY
- N+1 query detection â€” use eager loading or dataloaders
- Soft deletes for user-facing data (deletedAt timestamp)`,
        antiPatterns: [
            'Fat controllers â€” business logic belongs in services, not route handlers',
            'Trusting client input â€” validate everything server-side',
            'Catch-all error handlers â€” handle specific errors, log unexpected ones',
            'Raw SQL in controllers â€” use query builders or ORM',
            'Leaking internal errors â€” return generic message, log full detail',
        ],
        checklist: [
            'All inputs validated with DTO/schema before processing',
            'Error responses use consistent format with proper status codes',
            'Database queries are N+1 free',
            'Migrations are reversible and additive',
            'Auth middleware protects all non-public endpoints',
            'Structured logging with correlation IDs',
        ],
    },
    MOBILE: {
        ironLaw: 'NO RELEASE WITHOUT TESTING ON REAL DEVICE',
        whenToUse: [
            'Building native screens, navigation flows, or platform-specific UI',
            'Optimizing app size, memory usage, or battery consumption',
            'Integrating camera, GPS, storage, push notifications, or permissions',
        ],
        process: `### Mobile Development Workflow
1. **Platform check** â€” which platforms? iOS, Android, or both?
2. **Offline-first** â€” design data layer assuming no network
3. **Permission flow** â€” request permissions contextually, explain why
4. **Performance budget** â€” app size < 50MB, cold start < 2s, 60fps scrolling
5. **Deep linking** â€” universal links (iOS) / app links (Android) from day 1
6. **App store review** â€” follow Apple/Google guidelines proactively

### Offline-First Patterns
- Local DB (SQLite/Realm) as source of truth
- Sync queue for pending mutations
- Conflict resolution strategy (last-write-wins or manual merge)
- UI shows sync status (synced, pending, conflict)`,
        antiPatterns: [
            'Emulator-only testing â€” real devices have different performance',
            'Requesting all permissions at launch â€” ask contextually when needed',
            'Blocking UI on network â€” assume offline, sync in background',
            'Ignoring memory leaks â€” profile with Instruments/Android Profiler',
            'Hardcoding dimensions â€” use responsive layout (flexbox, constraints)',
        ],
        checklist: [
            'Tested on real devices (not just emulator)',
            'Offline mode works â€” data persists, UI is usable',
            'Permissions requested contextually with explanation',
            'App size within budget, cold start < 2s',
            'Deep links configured and tested',
        ],
    },

    DEVOPS: {
        ironLaw: 'NO DEPLOY WITHOUT ROLLBACK PLAN',
        whenToUse: [
            'Setting up CI/CD pipelines, GitHub Actions, or build automation',
            'Writing Dockerfiles, Compose configs, Terraform, or cloud infra',
            'Setting up logging, alerting, health checks, or APM',
        ],
        process: `### CI/CD Pipeline Standards
1. **Build** â€” deterministic builds (lock files, pinned versions)
2. **Test** â€” unit + integration tests gate every PR
3. **Lint** â€” code quality checks (ESLint, Prettier, type check)
4. **Security** â€” dependency audit, secret scanning
5. **Deploy staging** â€” auto-deploy to staging on merge to main
6. **Deploy production** â€” manual approval or canary rollout
7. **Monitor** â€” health checks, error rate alerts, rollback triggers

### Docker Best Practices
- Multi-stage builds â€” separate build and runtime stages
- Non-root user â€” never run as root in production
- .dockerignore â€” exclude node_modules, .git, .env
- Health check â€” HEALTHCHECK instruction in Dockerfile
- Pin base image versions â€” \`node:20.11-alpine\`, not \`node:latest\``,
        antiPatterns: [
            'YOLO deploys â€” deploying directly to production without staging',
            'Secret in code â€” use environment variables or secret managers',
            'Snowflake servers â€” everything must be reproducible from config',
            'Alert fatigue â€” too many alerts = no alerts. Be selective.',
            'No rollback plan â€” every deploy must have a documented undo path',
        ],
        checklist: [
            'CI runs tests, lint, and security audit on every PR',
            'Staging environment mirrors production',
            'Rollback procedure documented and tested',
            'Secrets are in vault/env vars, never in code or images',
            'Health checks configured for all services',
            'Monitoring dashboards show error rate, latency, throughput',
        ],
    },

    DATA: {
        ironLaw: 'NO PIPELINE WITHOUT DATA VALIDATION AT EVERY BOUNDARY',
        whenToUse: [
            'Building data ingestion pipelines, transformations, or batch jobs',
            'Designing data models, warehouse schemas, or analytics tables',
            'Implementing data quality checks, anomaly detection, or testing',
        ],
        process: `### ETL Pipeline Standards
1. **Extract** â€” idempotent reads, handle partial failures, log source metadata
2. **Validate** â€” schema validation at ingestion boundary (reject bad data early)
3. **Transform** â€” pure functions, no side effects, reproducible from inputs
4. **Load** â€” atomic writes, upsert patterns, partition by date/source
5. **Monitor** â€” row counts, null rates, freshness SLAs, anomaly detection

### Schema Evolution Rules
- Additive changes only â€” new columns with defaults, never remove
- Version your schemas â€” schema registry or migration table
- Backward compatibility â€” old consumers must work with new schema
- Document every field â€” what it means, units, allowed values, nullability`,
        antiPatterns: [
            'Schema-on-read â€” validate at ingestion, not at query time',
            'Silent data corruption â€” validate row counts, checksums, nulls',
            'Pipeline without monitoring â€” if you can\'t see it fail, it\'s failing',
            'Hardcoded credentials â€” use IAM roles or secret managers',
        ],
        checklist: [
            'Schema validation at every pipeline boundary',
            'Row count and null rate monitoring in place',
            'Pipeline is idempotent (re-running produces same result)',
            'Schema changes are backward compatible',
            'Data freshness SLA defined and alerted',
        ],
    },

    MLE: {
        ironLaw: 'NO MODEL DEPLOYMENT WITHOUT AN EVAL HARNESS',
        whenToUse: [
            'Training models, running experiments, or tuning hyperparameters',
            'Deploying models to production, building inference APIs',
            'Building monitoring dashboards, drift detectors, or retraining triggers',
        ],
        process: `### ML Experiment Workflow
1. **Hypothesis** â€” what are we testing and what metric will improve?
2. **Data prep** â€” reproducible splits (train/val/test), version datasets
3. **Baseline** â€” establish baseline performance before experimenting
4. **Train** â€” log all hyperparams, metrics, artifacts (MLflow/W&B)
5. **Evaluate** â€” eval harness with held-out test set, multiple metrics
6. **Compare** â€” is improvement statistically significant?
7. **Ship or discard** â€” only deploy if eval passes threshold

### Model Deployment Checklist
- Inference latency SLA defined and tested
- Input validation (reject malformed inputs before inference)
- A/B testing or shadow mode before full rollout
- Monitoring: prediction distribution, latency, error rate
- Rollback: ability to revert to previous model version in < 5 min`,
        antiPatterns: [
            'Training on test data â€” strict train/val/test separation',
            'Metric gaming â€” optimizing proxy metrics instead of business outcome',
            'No versioning â€” every experiment must be reproducible',
            'Deploy and forget â€” models decay, monitor and retrain regularly',
        ],
        checklist: [
            'Experiment is logged with hyperparams and metrics',
            'Eval harness runs on held-out test set',
            'Model passes latency SLA before deployment',
            'Monitoring tracks prediction distribution and drift',
            'Rollback to previous model is tested and documented',
        ],
    },
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // QUALITY
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

    QA: {
        ironLaw: 'NO FEATURE MARKED DONE WITHOUT QA SIGN-OFF',
        whenToUse: [
            'After implementation â€” verifying acceptance criteria are met',
            'Before release â€” regression testing across affected areas',
            'Edge case discovery â€” what breaks when inputs are unexpected?',
        ],
        process: `### Test Strategy (Testing Pyramid)
1. **Unit tests** (70%) â€” fast, isolated, test one function/module
2. **Integration tests** (20%) â€” test module boundaries (API + DB, UI + API)
3. **E2E tests** (10%) â€” critical user journeys only (login â†’ purchase â†’ receipt)

### Edge Case Discovery
- **Boundaries**: 0, 1, max, max+1, negative
- **Types**: null, undefined, empty string, empty array, wrong type
- **Timing**: concurrent requests, rapid clicks, timeout
- **Size**: very long strings, large file uploads, many items
- **State**: logged out, expired session, mid-migration, offline

### Regression Prevention
- Every bug fix needs a regression test
- Regression suite runs on every PR
- Track test coverage trends (not absolute numbers)`,
        antiPatterns: [
            'Testing only happy path â€” edge cases is where bugs live',
            'Flaky tests â€” fix immediately, don\'t skip or retry',
            'Testing implementation â€” test behavior, not how it works',
            'Manual-only testing â€” automate everything repeatable',
        ],
        checklist: [
            'Acceptance criteria verified with automated tests',
            'Edge cases tested (boundaries, nulls, concurrency)',
            'Regression suite passes on PR',
            'No flaky tests in CI',
            'Bug fixes have regression tests',
        ],
    },
    DOCS: {
        ironLaw: 'NO FEATURE SHIPS WITHOUT UPDATED DOCUMENTATION',
        whenToUse: [
            'After a feature is complete â€” update README, API docs, changelog',
            'At the end of a feature cycle â€” generate changelog entry',
            'When onboarding new team members â€” keep runbooks current',
        ],
        process: `### Documentation Standards
1. **README** â€” project purpose, quick start (< 5 min to run), architecture overview
2. **API docs** â€” every endpoint documented (method, path, params, response, errors)
3. **Changelog** â€” [Keep a Changelog](https://keepachangelog.com) format
4. **Runbooks** â€” step-by-step for deployment, rollback, incident response
5. **ADRs** â€” architecture decision records (maintained by TL)

### Writing Guide
- Lead with the most important information
- Use code examples, not just descriptions
- Show the command, show the output
- Link to related docs, don't duplicate`,
        antiPatterns: [
            'Documentation as afterthought â€” write docs alongside code',
            'Stale docs â€” outdated docs are worse than no docs',
            'Wall of text â€” use headers, code blocks, tables, diagrams',
            'Documenting implementation â€” document behavior and usage',
        ],
        checklist: [
            'README has working quick start instructions',
            'API endpoints are documented with examples',
            'Changelog is updated with every release',
            'Runbooks are tested (someone else can follow them)',
        ],
    },

    SEC: {
        ironLaw: 'NO DEPLOY TOUCHING AUTH OR PII WITHOUT SECURITY REVIEW',
        whenToUse: [
            'Before any feature touching auth, PII, or financial data',
            'Dependency audit â€” checking for known vulnerabilities',
            'Access control review â€” RBAC, permissions, token scopes',
        ],
        process: `### Security Review Checklist
1. **Auth** â€” tokens expire, refresh tokens rotate, sessions invalidate on password change
2. **Input** â€” all user input sanitized (XSS, SQL injection, path traversal)
3. **Secrets** â€” no secrets in code, env vars, or logs. Use secret managers.
4. **Dependencies** â€” \`npm audit\`, Snyk, or Dependabot. Fix critical/high immediately.
5. **Access** â€” principle of least privilege. No admin-by-default.
6. **Data** â€” PII encrypted at rest and in transit. Retention policies defined.

### OWASP Top 10 Quick Reference
- Injection â€” parameterized queries, never string concatenation
- Broken auth â€” MFA, rate limiting, secure session management
- Sensitive data exposure â€” TLS everywhere, encrypt at rest
- XSS â€” output encoding, CSP headers
- CSRF â€” SameSite cookies, CSRF tokens for state-changing operations`,
        antiPatterns: [
            'Security through obscurity â€” assume attackers know your code',
            'Hardcoded secrets â€” use environment variables or vault',
            'Trusting client-side validation â€” always validate server-side',
            'Ignoring npm audit â€” fix or document suppressions',
        ],
        checklist: [
            'No secrets in source code or logs',
            'All user input validated and sanitized server-side',
            'npm audit shows no critical/high vulnerabilities',
            'Auth tokens expire and are rotated properly',
            'PII encrypted at rest and in transit',
        ],
    },
};

// â”€â”€â”€ Public API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Get deep skill content for a role.
 * Returns undefined for unknown roles (falls back to governance-only).
 */
export function getSkillContent(roleId: string): RoleSkillContent | undefined {
    return SKILL_CONTENT[roleId];
}

/**
 * Render deep skill content as markdown for inclusion in SKILL.md.
 * This is prepended to the governance section (capabilities, budgets, doNotUse).
 */
export function renderDeepSkillContent(roleId: string): string {
    const content = getSkillContent(roleId);
    if (!content) return '';

    let md = '';

    md += `## Iron Law\n\n\`\`\`\n${content.ironLaw}\n\`\`\`\n\n`;

    md += `## When to Use\n\n`;
    md += content.whenToUse.map((w) => `- ${w}`).join('\n');
    md += '\n\n';

    md += content.process;
    md += '\n\n';

    if (content.goodBad) {
        md += content.goodBad;
        md += '\n\n';
    }

    md += `## Anti-Patterns\n\n`;
    md += content.antiPatterns.map((a) => `- ${a}`).join('\n');
    md += '\n\n';

    md += `## Verification Checklist\n\n`;
    md += content.checklist.map((c) => `- [ ] ${c}`).join('\n');
    md += '\n';

    return md;
}

export function renderRoleOverrideGuidance(roleId: string): string {
    return `## Project-Specific Overrides

- Read \`ROLE_SKILL_OVERRIDES.md\` before acting.
- Apply the \`[${roleId}]\` section as the persistent project-specific delta for this role.
- If the override file conflicts with stale generated examples, prefer the verified override file and report the drift to Tech Lead.

`;
}

