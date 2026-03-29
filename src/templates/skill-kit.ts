import type { GeneratedFile, TemplateInput } from './types.js';

interface RoleTemplate {
    slug: string;
    title: string;
    mission: string;
    trigger: string;
    deliverables: string[];
    mustTest: string[];
    companionFiles?: string[];
    extraProtocol?: string;
    forbiddenPatterns?: string[];
    references?: string[];
}

const ROLE_TEMPLATES: RoleTemplate[] = [
    {
        slug: 'frontend',
        title: 'Frontend',
        mission: 'Ship production-quality web UI that is visually excellent, interactive, accessible, and state-complete.',
        trigger: 'Use for component/page implementation, design system work, visual quality audit, interaction logic, and accessibility fixes.',
        deliverables: [
            'UI scope checklist (components, pages, states per screen)',
            'component changeset summary with responsive and a11y verification',
            'design token decisions (color, typography, spacing, radius, motion)',
            'state matrix (loading, empty, error, success, disabled) per screen',
        ],
        mustTest: [
            'component-level tests with positive and negative paths',
            'responsive behavior check (mobile / tablet / desktop)',
            'accessibility audit (ARIA, keyboard nav, contrast)',
            'anti-generic quality gate review against banned patterns',
        ],
        companionFiles: ['roles/frontend.skill-pack.md', 'roles/frontend.DESIGN.template.md'],
        extraProtocol: `### Frontend Dials
- Before adapting this role, load .stackmoss/skill-kit/roles/frontend.skill-pack.md and select active modes.
- Mandatory modes: web-implementation-core and output-discipline.
- Optional modes by BRD: design-system-audit, high-end-visual, stitch-design.

- DESIGN_VARIANCE (1-10): controls layout asymmetry and structural experimentation.
- MOTION_INTENSITY (1-10): controls animation complexity and choreography density.
- VISUAL_DENSITY (1-10): controls information density and whitespace appetite.
- COMPONENT_STRICTNESS (1-10): controls reusability enforcement and prop typing rigor.

Set baseline by product type:
- Marketing or brand pages: variance 7-8, motion 5-6, density 3-4, strictness 4-5.
- SaaS dashboards: variance 3-4, motion 3-4, density 6-8, strictness 8-9.
- Internal tools: variance 2-3, motion 2-3, density 7-8, strictness 6-7.

### Popular Stack Reference
| Layer | Primary Tools | When to Use |
|:--|:--|:--|
| Framework | React, Next.js, Vue, Nuxt, Svelte | SPA, SSR/SSG, hybrid rendering |
| Styling | Tailwind CSS, CSS Modules, Vanilla Extract, styled-components | Utility-first, scoped, type-safe, CSS-in-JS |
| State | React Query/TanStack, Zustand, Jotai, Pinia | Server state, client state, atomic state |
| Animation | Framer Motion, GSAP, CSS transitions | Micro-interactions, page transitions, scroll-driven |
| Testing | Vitest, Playwright, Testing Library | Unit, E2E, component testing |
| Design Tokens | Style Dictionary, Figma Variables, CSS custom properties | Design system tokens, theme switching |
| Build | Vite, Turbopack, webpack | Dev server, bundling, HMR |

### Frontend Audit Flow (Before New Page/Component)
1. Design audit:
  - typography hierarchy clear (h1 > h2 > body), font personality matches brand.
  - color palette uses max 1 accent, consistent gray family, no pure #000.
  - layout uses intentional structure, not generic centered hero + 3-card row.
2. Component audit:
  - props are typed and documented, defaults are sensible.
  - all interaction states implemented (hover, active, focus, disabled).
  - all data states implemented (loading, empty, error, success).
3. Accessibility audit:
  - semantic HTML used (button not div, nav not div, etc.).
  - ARIA labels on interactive elements, keyboard navigation works.
  - color contrast meets WCAG AA (4.5:1 text, 3:1 large text).
4. Responsive audit:
  - mobile-first approach, tested at 320px / 768px / 1024px / 1440px.
  - touch targets >= 44px, no horizontal scroll on mobile.
5. Performance audit:
  - bundle size reviewed, unused imports removed.
  - images optimized (WebP, srcset, lazy loading).
  - LCP < 2.5s, CLS < 0.1, FID < 100ms.

### Handoff Contract from Design to Code
- Component inventory with state matrix per screen.
- Token decisions with semantic naming and fallback values.
- Interaction specs with timing and easing.
- Acceptance checks that QA can run without design interpretation.`,
        forbiddenPatterns: [
            'Defaulting to generic typography stacks for premium UI without justification.',
            'Using purple-neon gradient aesthetics as a default visual identity.',
            'Using a generic 3-equal-card feature row when layout variance is expected.',
            'Using h-screen for hero sections instead of mobile-safe viewport units (100dvh).',
            'Shipping screens without loading, empty, and error states.',
            'Using placeholder content (Acme, John Doe, Lorem Ipsum, fake round metrics) in final UX.',
            'Catch-all try/catch in data fetching without user-facing error states.',
            'Prop drilling 5+ levels instead of context or state management.',
        ],
        references: [
            'https://github.com/Leonxlnx/taste-skill',
            'https://github.com/Leonxlnx/taste-skill/tree/main/skills/taste-skill',
            'https://github.com/Leonxlnx/taste-skill/tree/main/skills/redesign-skill',
            'https://github.com/Leonxlnx/taste-skill/tree/main/skills/stitch-skill',
            'https://github.com/Leonxlnx/taste-skill/tree/main/skills/output-skill',
            'https://web.dev/performance/',
            'https://www.w3.org/WAI/WCAG21/quickref/',
        ],
    },
    {
        slug: 'backend',
        title: 'Backend',
        mission: 'Deliver API and service logic that is correct, observable, and safe to evolve.',
        trigger: 'Use for endpoint changes, domain service logic, persistence access, and contract updates.',
        deliverables: [
            'API contract delta (endpoint spec with request/response/error shapes)',
            'data impact notes (migration plan, schema diff, rollback strategy)',
            'observability checklist (structured logs, correlation IDs, health endpoints)',
            'handoff package for frontend with typed contract and error catalog',
        ],
        mustTest: [
            'service or integration tests with positive and negative paths',
            'contract or schema compatibility checks (backward compat)',
            'N+1 query detection and query plan review',
            'auth boundary verification (public vs protected vs admin)',
        ],
        companionFiles: ['roles/backend.skill-pack.md', 'roles/backend.API-CONTRACT.template.md'],
        extraProtocol: `### API Design Dials
- Before adapting this role, load .stackmoss/skill-kit/roles/backend.skill-pack.md and select active modes.
- Mandatory modes: api-contract-core and output-discipline.
- Optional modes by BRD: database-evolution, service-architecture, api-contract-template.

- VALIDATION_STRICTNESS (1-10): controls input validation rigor and type safety enforcement.
- OBSERVABILITY_DEPTH (1-10): controls logging verbosity, tracing granularity, and metric coverage.
- EVOLUTION_SAFETY (1-10): controls migration caution, backward compatibility enforcement, and deprecation discipline.

Set baseline by product type:
- Public API or platform: strictness 9-10, observability 7-8, evolution 9-10.
- Internal microservice: strictness 6-7, observability 8-9, evolution 5-6.
- Prototype or MVP: strictness 4-5, observability 4-5, evolution 3-4.

### Backend Audit Flow (Before New Endpoint)
1. Contract audit:
  - request shape defined with required/optional fields, validation rules, and max sizes.
  - response shape defined with envelope, pagination, and error format.
  - error catalog: every expected error has a code, message, and HTTP status.
2. Authorization audit:
  - endpoint protection level (public / authenticated / role-based / admin).
  - permission checks happen before business logic, not inside it.
3. Data flow audit:
  - query plan reviewed for N+1, missing indexes, and unnecessary joins.
  - transactions used for multi-table writes with explicit rollback.
4. Observability audit:
  - structured logs with correlation ID at entry and exit of each endpoint.
  - error logs include context but never PII, secrets, or stack traces to client.
5. Evolution audit:
  - migration is additive (no column drops in production).
  - breaking changes use versioning (header or URI path).

### Contract to Frontend / Consumer
- Provide typed API contract (OpenAPI, tRPC, or shared TypeScript types).
- Provide error catalog with codes, messages, and recovery hints.
- Provide auth requirements per endpoint (token type, scopes, headers).
- Provide pagination contract (cursor vs offset, page size limits, sort fields).`,
        forbiddenPatterns: [
            'Fat controllers â€” business logic in route handlers instead of service layer.',
            'Catch-all try/catch that swallows errors without logging or re-throwing.',
            'N+1 queries in production code without eager loading or dataloader.',
            'Leaking internal stack traces or system details in API error responses.',
            'Raw SQL string concatenation instead of parameterized queries or ORM.',
            'Shipping endpoints without input validation at the boundary (DTO/schema).',
        ],
        references: [
            'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design',
            'https://google.aip.dev/',
            'https://www.prisma.io/docs/orm/prisma-migrate',
            'https://opentelemetry.io/docs/',
            'https://owasp.org/www-project-api-security/',
            'https://spec.openapis.org/oas/latest.html',
        ],
    },
    {
        slug: 'mobile',
        title: 'Mobile',
        mission: 'Ship performant, offline-capable mobile apps with platform-native quality and real-device verification.',
        trigger: 'Use for native or cross-platform mobile development, platform-specific UI, permissions, offline logic, and app store submission.',
        deliverables: [
            'platform scope (iOS / Android / both, framework choice)',
            'offline-first data strategy (local DB, sync queue, conflict resolution)',
            'permission flow spec (contextual requests with user-facing rationale)',
            'performance budget compliance (app size, cold start, scroll FPS)',
        ],
        mustTest: [
            'real device testing (not emulator-only) on target OS versions',
            'offline mode works â€” data persists, UI is usable without network',
            'permission flows tested (grant, deny, revoke, re-request)',
            'deep link / universal link navigation verified',
        ],
        companionFiles: ['roles/mobile.skill-pack.md'],
        extraProtocol: `### Mobile Development Dials
- Before adapting this role, load .stackmoss/skill-kit/roles/mobile.skill-pack.md and select active modes.
- Mandatory modes: mobile-core and output-discipline.
- Optional modes by BRD: react-native, flutter, native-ios-android.

- OFFLINE_DEPTH (1-10): controls local persistence rigor, sync complexity, and conflict resolution.
- PLATFORM_FIDELITY (1-10): controls native look-and-feel vs cross-platform uniformity.
- PERFORMANCE_BUDGET (1-10): controls app size, startup speed, and animation FPS strictness.

Set baseline by app type:
- Consumer app (social, commerce): offline 7-8, fidelity 8-9, performance 8-9.
- Enterprise / internal tool: offline 5-6, fidelity 4-5, performance 5-6.
- Utility / single-purpose: offline 3-4, fidelity 6-7, performance 7-8.

### Popular Stack Reference
| Layer | Primary Tools | When to Use |
|:--|:--|:--|
| Cross-platform | React Native, Flutter, Expo | Shared codebase for iOS + Android |
| Native iOS | Swift, SwiftUI, UIKit | Platform-fidelity, Apple ecosystem integration |
| Native Android | Kotlin, Jetpack Compose, XML layouts | Platform-fidelity, Google ecosystem integration |
| Navigation | React Navigation, GoRouter, NavigationStack | Screen routing, deep links, tab/stack patterns |
| Local DB | SQLite, Realm, WatermelonDB, Hive | Offline-first data persistence |
| State | Zustand, Riverpod, Provider, MobX | Client and sync state management |
| Testing | Detox, Maestro, XCTest, Espresso | E2E, UI automation, platform-specific testing |
| Distribution | App Store Connect, Google Play Console, EAS | Build, submit, OTA updates |

### Mobile Audit Flow (Before New Screen)
1. Platform audit:
  - target platforms and minimum OS versions defined.
  - platform-specific UI guidelines reviewed (HIG for iOS, Material for Android).
2. Offline audit:
  - data available offline? Local DB schema defined.
  - sync strategy: optimistic update with queue, or wait-for-network.
  - conflict resolution: last-write-wins, manual merge, or server-wins.
3. Permission audit:
  - permissions requested contextually (not at launch).
  - user-facing rationale provided before system dialog.
  - graceful degradation when permission is denied.
4. Performance audit:
  - app size target (< 50MB for consumer apps).
  - cold start < 2s, 60fps scrolling, no jank during transitions.
  - memory leaks profiled (Instruments / Android Profiler).
5. Distribution audit:
  - app store guidelines compliance checked before submission.
  - deep links configured (universal links iOS, app links Android).
  - OTA update strategy defined (CodePush, EAS Update, or store-only).`,
        forbiddenPatterns: [
            'Emulator-only testing â€” real devices have different performance and behavior.',
            'Requesting all permissions at app launch â€” ask contextually when needed.',
            'Blocking UI thread on network requests â€” assume offline, sync in background.',
            'Hardcoding pixel dimensions â€” use responsive layout (flexbox, constraints, SafeArea).',
            'Ignoring memory leaks â€” profile with Instruments/Android Profiler regularly.',
            'Shipping without deep link / universal link support.',
        ],
        references: [
            'https://reactnative.dev/docs/getting-started',
            'https://docs.flutter.dev/',
            'https://developer.apple.com/design/human-interface-guidelines/',
            'https://developer.android.com/develop/ui/compose',
            'https://docs.expo.dev/',
            'https://maestro.mobile.dev/',
        ],
    },
    {
        slug: 'devops',
        title: 'DevOps',
        mission: 'Keep build, deploy, and runtime operations stable, reproducible, and fast to iterate.',
        trigger: 'Use for CI/CD pipelines, container config, infrastructure-as-code, deployment automation, monitoring setup, and incident response.',
        deliverables: [
            'pipeline or infra change plan (what changes, what could break, rollback path)',
            'environment parity report (staging mirrors production)',
            'deploy verification checklist (health checks, smoke tests, canary metrics)',
            'operational risk statement (blast radius, failure modes, recovery time)',
        ],
        mustTest: [
            'pipeline smoke checks (build → test → deploy cycle completes)',
            'rollback procedure tested (can revert to previous version in < 5 min)',
            'health check endpoints return correct status under load',
            'secret rotation verified (no hardcoded secrets in code, images, or logs)',
        ],
        companionFiles: ['roles/devops.skill-pack.md'],
        extraProtocol: `### DevOps Dials
- Before adapting this role, load .stackmoss/skill-kit/roles/devops.skill-pack.md and select active modes.
- Mandatory modes: ci-cd-core and output-discipline.
- Optional modes by BRD: container-orchestration, infrastructure-as-code, observability-ops.

- AUTOMATION_DEPTH (1-10): controls CI/CD sophistication, auto-deploy gates, and self-healing.
- RELIABILITY_TARGET (1-10): controls redundancy, failover, and recovery time objectives.
- SECURITY_POSTURE (1-10): controls secret management, scanning rigor, and compliance enforcement.

Set baseline by environment type:
- Production SaaS: automation 8-9, reliability 8-9, security 8-9.
- Internal tooling: automation 6-7, reliability 5-6, security 6-7.
- Prototype or MVP: automation 4-5, reliability 3-4, security 5-6.
- Open source project: automation 7-8, reliability 4-5, security 6-7.

### Popular Stack Reference
| Layer | Primary Tools | When to Use |
|:--|:--|:--|
| CI/CD | GitHub Actions, GitLab CI, CircleCI, Jenkins | Build automation, test gates, deploy pipelines |
| Containers | Docker, Podman, Docker Compose | Application packaging, local dev parity, multi-service |
| Orchestration | Kubernetes, Docker Swarm, ECS, Cloud Run | Container scheduling, scaling, service mesh |
| IaC | Terraform, Pulumi, CloudFormation, Ansible | Infrastructure provisioning, drift detection, state management |
| Cloud | AWS, GCP, Azure, DigitalOcean, Hetzner | Compute, storage, networking, managed services |
| Monitoring | Prometheus, Grafana, Datadog, New Relic | Metrics collection, dashboards, alerting |
| Logging | ELK Stack, Loki, CloudWatch Logs | Centralized logging, log aggregation, search |
| Secrets | Vault, AWS Secrets Manager, Doppler, SOPS | Secret storage, rotation, encrypted config |

### DevOps Audit Flow (Before Infrastructure Change)
1. Change audit:
  - what is changing? Document exact scope (files, services, infra resources).
  - blast radius: what breaks if this fails? List affected services and users.
  - rollback plan: how to revert within 5 minutes (re-deploy, feature flag, DNS switch).
2. Pipeline audit:
  - CI pipeline runs: lint, type-check, unit test, integration test, security scan.
  - build is deterministic: lock files committed, base images pinned, no floating tags.
  - artifacts are immutable: same image hash from build to staging to production.
3. Environment audit:
  - staging mirrors production (same OS, runtime, env vars, resource limits).
  - environment-specific config uses env vars or secret manager, never code branching.
  - database migrations tested on staging copy before production.
4. Deploy audit:
  - deploy to staging first, run smoke tests, verify health checks.
  - canary or blue-green for production (not big-bang cutover).
  - monitor error rate, latency, and resource usage for 15 min post-deploy.
5. Security audit:
  - no secrets in source code, CI logs, Docker images, or environment files.
  - dependency audit passes (npm audit, Snyk, Trivy) with no critical/high.
  - containers run as non-root user with minimal filesystem permissions.
6. Observability audit:
  - health check endpoints exist for every service (/healthz, /readyz).
  - alerting configured: error rate > X%, latency p99 > Yms, disk > 80%.
  - runbook exists for every alert (what to check, who to notify, how to fix).

### Incident Response Protocol
- Detect: automated alerting catches the issue before users report it.
- Triage: severity level assigned (S1-S4), on-call responder identified.
- Mitigate: rollback, feature flag, or hotfix within SLA (S1: 15min, S2: 1hr).
- Communicate: status page updated, stakeholders notified.
- Postmortem: blameless review within 48 hours, action items tracked to completion.`,
        forbiddenPatterns: [
            'YOLO deploys — deploying directly to production without staging verification.',
            'Friday deploys — deploy early in the week when the team is available to respond.',
            'Secrets in code — use environment variables, secret managers, or encrypted config.',
            'Snowflake servers — every environment must be reproducible from config (IaC or Docker).',
            'Alert fatigue — too many alerts equals no alerts. Be selective and actionable.',
            'No rollback plan — every deploy must have a documented undo path tested before execution.',
            'Manual repeatable processes — automate everything you do more than twice.',
            'Floating tags in production — pin all base images, dependencies, and tool versions.',
        ],
        references: [
            'https://docs.github.com/en/actions',
            'https://docs.docker.com/build/building/best-practices/',
            'https://kubernetes.io/docs/home/',
            'https://developer.hashicorp.com/terraform/docs',
            'https://prometheus.io/docs/introduction/overview/',
            'https://grafana.com/docs/',
            'https://sre.google/sre-book/table-of-contents/',
        ],
    },
    {
        slug: 'qa',
        title: 'Quality Assurance',
        mission: 'Protect release quality with acceptance checks, regression coverage, and risk-focused testing.',
        trigger: 'Use for acceptance verification, regression strategy, exploratory checks, release gates, and test infrastructure.',
        deliverables: [
            'test scope matrix (what is tested, test type, coverage level, risk tier)',
            'defect evidence and severity (reproduction steps, expected vs actual, severity, fix priority)',
            'ship or block verdict (evidence-based pass/fail with residual risk statement)',
            'regression suite health report (pass rate, flaky test count, coverage trend)',
        ],
        mustTest: [
            'acceptance criteria checks (every AC has at least one automated test)',
            'edge case coverage (boundaries, nulls, concurrency, state transitions)',
            'high-risk regression suite (critical flows pass on every PR)',
            'cross-environment verification (staging mirrors production behavior)',
        ],
        companionFiles: ['roles/qa.skill-pack.md'],
        extraProtocol: `### QA Dials
- Before adapting this role, load .stackmoss/skill-kit/roles/qa.skill-pack.md and select active modes.
- Mandatory modes: test-strategy-core and output-discipline.
- Optional modes by BRD: e2e-automation, performance-testing, api-contract-testing.

- TEST_DEPTH (1-10): controls test pyramid ratio and edge case rigor.
- AUTOMATION_COVERAGE (1-10): controls CI integration, automated gate enforcement.
- RISK_FOCUS (1-10): controls exploratory testing depth and abuse-path coverage.

Set baseline by project type:
- Production SaaS: test 8-9, automation 8-9, risk 7-8.
- Internal tooling: test 5-6, automation 6-7, risk 4-5.
- Prototype or MVP: test 3-4, automation 3-4, risk 5-6.
- Open source library: test 8-9, automation 9-10, risk 5-6.

### Popular Stack Reference
| Layer | Primary Tools | When to Use |
|:--|:--|:--|
| Unit | Vitest, Jest, pytest, JUnit, Go testing | Isolated function/module tests, fast feedback loop |
| Integration | Supertest, TestContainers, Prisma test utils | API + DB boundary tests, service interaction |
| E2E | Playwright, Cypress, Maestro, Detox | Critical user journeys, cross-browser, mobile |
| API Contract | Pact, Dredd, Schemathesis | Provider-consumer contract verification |
| Performance | k6, Locust, Lighthouse, Artillery | Load testing, stress testing, web vitals |
| Visual | Chromatic, Percy, BackstopJS | Screenshot diff, visual regression |
| Coverage | Istanbul/nyc, c8, coverage.py | Line/branch coverage tracking and thresholds |
| CI Gate | GitHub Actions, GitLab CI check suites | Automated pass/fail gates on PRs |

### QA Audit Flow (Before Ship-or-Block Verdict)
1. Scope audit:
  - all acceptance criteria have corresponding automated tests.
  - test types mapped: unit, integration, e2e, manual exploratory.
  - risk tiers assigned: critical (blocks ship), high (needs fix), medium (acceptable with tracking).
2. Edge case audit:
  - boundary values tested (0, 1, max, max+1, negative).
  - null/undefined/empty inputs handled gracefully.
  - concurrent access and race conditions covered for shared state.
  - invalid state transitions tested (expired session, offline, mid-migration).
3. Regression audit:
  - full regression suite passes on current branch.
  - no flaky tests in CI (fix or quarantine immediately).
  - every bug fix has a corresponding regression test.
  - coverage trend is stable or improving (no coverage drops allowed).
4. Environment audit:
  - tests run in CI environment matching production (same runtime, same DB engine).
  - test data is isolated (no shared state between test runs).
  - external service calls are mocked or stubbed (no network dependency in CI).
5. Verdict:
  - SHIP: all critical and high-risk tests pass, residual risks documented and accepted.
  - BLOCK: any critical test fails, or high-risk failure without documented acceptance.
  - verdict must include evidence (test run URL, coverage report, known issues list).`,
        forbiddenPatterns: [
            'Happy-path-only testing — edge cases are where bugs live, test boundaries and error states.',
            'Flaky tests tolerated — fix or quarantine immediately, never skip or auto-retry silently.',
            'Testing implementation details — test observable behavior, not internal structure.',
            'Manual-only regression — automate every repeatable check, keep manual for exploratory only.',
            'Coverage theater — high coverage numbers without meaningful assertions are worse than low coverage.',
            'Testing in production only — catch failures in CI, not after deploy.',
            'Skipping negative tests — verify error handling, not just success paths.',
        ],
        references: [
            'https://playwright.dev/docs/intro',
            'https://vitest.dev/guide/',
            'https://martinfowler.com/articles/practical-test-pyramid.html',
            'https://testing-library.com/docs/',
            'https://pact.io/documentation',
            'https://k6.io/docs/',
            'https://docs.github.com/en/actions/automating-builds-and-tests',
        ],
    },
    {
        slug: 'security',
        title: 'Security',
        mission: 'Reduce exploit surface and protect sensitive flows with pragmatic, evidence-based controls.',
        trigger: 'Use for auth, permission boundaries, secret handling, dependency risk, abuse-path checks, compliance audits, and supply-chain security.',
        deliverables: [
            'threat model notes (attack surface, abuse paths, trust boundaries)',
            'security control checklist (auth, input validation, secrets, headers, dependencies)',
            'residual risk statement (accepted risks with mitigation plan and owner)',
            'dependency audit report (critical/high CVEs, fix timeline, suppression justification)',
        ],
        mustTest: [
            'auth and permission boundary checks (token expiry, RBAC enforcement, privilege escalation)',
            'secret exposure scan (no secrets in code, logs, or client bundles)',
            'input validation at every boundary (XSS, injection, path traversal)',
            'dependency vulnerability scan (npm audit, Snyk, or Dependabot with zero critical/high tolerance)',
        ],
        companionFiles: ['roles/security.skill-pack.md'],
        extraProtocol: `### Security Dials
- Before adapting this role, load .stackmoss/skill-kit/roles/security.skill-pack.md and select active modes.
- Mandatory modes: security-review-core and output-discipline.
- Optional modes by BRD: compliance-audit, supply-chain-security, penetration-testing.

- THREAT_DEPTH (1-10): controls threat modeling rigor and abuse-path coverage.
- COMPLIANCE_RIGOR (1-10): controls regulatory checklist depth (OWASP, SOC2, GDPR, HIPAA).
- SUPPLY_CHAIN_FOCUS (1-10): controls dependency audit depth and SCA tooling enforcement.

Set baseline by project type:
- Production SaaS with PII: threat 8-9, compliance 8-9, supply-chain 7-8.
- Internal tooling: threat 4-5, compliance 3-4, supply-chain 5-6.
- Financial or healthcare: threat 9-10, compliance 9-10, supply-chain 8-9.
- Open source library: threat 5-6, compliance 3-4, supply-chain 8-9.

### Popular Stack Reference
| Domain | Primary Tools | When to Use |
|:--|:--|:--|
| Secret scanning | GitLeaks, TruffleHog, GitHub secret scanning | Pre-commit and CI secret detection |
| Dependency audit | npm audit, Snyk, Dependabot, Socket.dev | CVE scanning, supply-chain risk |
| SAST | Semgrep, CodeQL, SonarQube | Static code analysis for injection, XSS, logic flaws |
| DAST | OWASP ZAP, Burp Suite, Nuclei | Runtime vulnerability scanning against deployed app |
| Headers & CSP | Helmet.js, CSP Evaluator, SecurityHeaders.com | HTTP security headers verification |
| Auth testing | jwt.io, Postman, oauth2-proxy | Token validation, session expiry, RBAC testing |
| Infrastructure | Trivy, Checkov, tfsec | Container image and IaC security scanning |
| Compliance | OWASP Top 10, CIS Benchmarks, SOC2 controls | Regulatory and industry standard checklists |

### Security Audit Flow (Before Sign-Off)
1. Auth and access audit:
  - tokens expire within defined TTL, refresh tokens rotate on use.
  - session invalidates on password change and explicit logout.
  - RBAC enforced at API layer, not just UI (verify with direct API calls).
  - privilege escalation paths tested (regular user cannot access admin endpoints).
  - rate limiting active on auth endpoints (login, signup, password reset).
2. Input and output audit:
  - all user input validated and sanitized server-side (never trust client).
  - parameterized queries for all database operations (no string concatenation).
  - output encoding applied to prevent XSS (HTML, JS, URL contexts).
  - file upload restricted by type, size, and content validation.
  - error messages do not leak internal details (stack traces, DB schema, file paths).
3. Secret and data audit:
  - no secrets in source code, environment config files, or client-side bundles.
  - secrets loaded from vault or secure env vars at runtime only.
  - PII encrypted at rest (database) and in transit (TLS).
  - logging does not capture passwords, tokens, PII, or credit card numbers.
  - data retention policies defined and enforced.
4. Dependency and supply-chain audit:
  - npm audit (or equivalent) shows zero critical/high vulnerabilities.
  - all suppressed vulnerabilities documented with justification and review date.
  - lockfile integrity verified (no unexpected dependency changes).
  - build pipeline uses pinned dependency versions (no floating ranges for critical deps).
5. Headers and transport audit:
  - HTTPS enforced everywhere (HSTS enabled with appropriate max-age).
  - CSP header configured and tested (no unsafe-inline, no unsafe-eval unless justified).
  - CORS restricted to known origins (no wildcard in production).
  - cookies use Secure, HttpOnly, SameSite attributes.
  - X-Frame-Options, X-Content-Type-Options, Referrer-Policy headers set.`,
        forbiddenPatterns: [
            'Security through obscurity — assume attackers have full access to source code.',
            'Hardcoded secrets — use vault or secure environment variables, never commit secrets.',
            'Client-side-only validation — always validate and authorize server-side.',
            'Ignoring npm audit — fix critical/high immediately, document suppressions with review dates.',
            'Admin-by-default — principle of least privilege, no unnecessary permissions.',
            'Logging sensitive data — never log passwords, tokens, PII, or financial data.',
            'CORS wildcard in production — restrict origins to known, trusted domains.',
        ],
        references: [
            'https://owasp.org/www-project-top-ten/',
            'https://cheatsheetseries.owasp.org/',
            'https://cwe.mitre.org/top25/',
            'https://helmetjs.github.io/',
            'https://semgrep.dev/docs/',
            'https://docs.github.com/en/code-security',
            'https://socket.dev/docs',
        ],
    },
    {
        slug: 'data-engineer',
        title: 'Data Engineer',
        mission: 'Maintain trustworthy data flow from ingestion to transformation and downstream consumption.',
        trigger: 'Use for ETL or ELT pipelines, data contracts, warehouse models, data quality checks, and BI reporting setup.',
        deliverables: [
            'pipeline contract notes (source, schema, SLA, ownership)',
            'schema evolution plan (additive changes, backward compat, migration script)',
            'data quality evidence (row counts, null rates, freshness, anomaly alerts)',
            'downstream handoff (semantic layer definitions, BI dashboard specs, consumer SLAs)',
        ],
        mustTest: [
            'pipeline idempotency (re-run produces identical output)',
            'schema validation at every boundary (ingestion, transform, load)',
            'freshness and quality assertions against defined SLAs',
            'data lineage trace from source to downstream consumer',
        ],
        companionFiles: ['roles/data-engineer.skill-pack.md', 'roles/data-engineer.DATA-CONTRACT.template.md'],
        extraProtocol: `### Pipeline Design Dials
- Before adapting this role, load .stackmoss/skill-kit/roles/data-engineer.skill-pack.md and select active modes.
- Mandatory modes: pipeline-core and output-discipline.
- Optional modes by BRD: warehouse-modeling, data-quality-ops, bi-analytics, data-contract-template.

- VALIDATION_RIGOR (1-10): controls schema enforcement, data type checking, and constraint strictness.
- PIPELINE_RESILIENCE (1-10): controls retry logic, dead-letter handling, and self-healing behavior.
- FRESHNESS_PRESSURE (1-10): controls SLA tightness, near-real-time vs batch tolerance.

Set baseline by pipeline type:
- Analytics warehouse (batch): validation 7-8, resilience 5-6, freshness 4-5.
- Operational data store (near-real-time): validation 8-9, resilience 8-9, freshness 8-9.
- ML feature pipeline: validation 9-10, resilience 7-8, freshness 6-7.
- Ad-hoc reporting pipeline: validation 5-6, resilience 3-4, freshness 3-4.

### Popular Stack Reference
The role should be proficient across the modern data stack:
| Layer | Primary Tools | When to Use |
|:--|:--|:--|
| Orchestration | Apache Airflow, Dagster, Prefect | Pipeline scheduling, dependency management, retries |
| Transformation | dbt (data build tool), Spark SQL | SQL-first modeling, testing, documentation, version control |
| Processing | Apache Spark, Apache Flink, Polars | Large-scale batch or streaming data processing |
| Warehouse | Snowflake, Databricks, BigQuery, Redshift | Analytical storage, query optimization, partitioning |
| Visualization | Power BI, Tableau, Looker, Metabase | Business intelligence, dashboards, self-service analytics |
| Quality | Great Expectations, Monte Carlo, Soda | Schema checks, anomaly detection, data observability |
| Streaming | Apache Kafka, Kinesis, Pub/Sub | Event-driven pipelines, CDC, real-time ingestion |
| Storage | S3/GCS/ADLS, Delta Lake, Iceberg | Raw data lake, time-travel, ACID on object storage |

### Data Engineering Audit Flow (Before New Pipeline)
1. Source audit:
  - source schema documented with field types, nullability, and update frequency.
  - ingestion method defined (full load, incremental, CDC, streaming).
  - data contract agreed with source owner (breaking change notification).
2. Transform audit:
  - transformation logic is pure SQL or pure function (no side effects).
  - intermediate tables have schema tests (not null, unique, accepted values).
  - business logic is documented and traceable to requirements.
3. Load audit:
  - target schema versioned with additive-only evolution.
  - write pattern defined (append, upsert, SCD Type 1/2).
  - partition strategy and retention policy documented.
4. Quality audit:
  - freshness SLA defined and monitored.
  - row count, null rate, and distribution checks at exit boundary.
  - anomaly detection for sudden volume changes (\u00b1 30% threshold).
5. Consumption audit:
  - downstream consumers identified with their SLAs.
  - semantic layer or metric definitions provided for BI tools.
  - access control and PII masking verified.

### Contract to Downstream Consumers
- Provide data catalog entry (table, description, owner, refresh schedule).
- Provide schema contract with column names, types, and business definitions.
- Provide freshness SLA (e.g., data available by 06:00 UTC daily).
- Provide quality guarantees (null rate < X%, unique key enforced, no duplicates).
- Provide lineage documentation from source to final table.`,
        forbiddenPatterns: [
            'Schema-on-read without validation \u2014 validate at ingestion, not at query time.',
            'Silent data corruption \u2014 pipelines without row count, null rate, or freshness monitoring.',
            'Hardcoded credentials in pipeline code \u2014 use IAM roles, secret managers, or env injection.',
            'Non-idempotent pipelines \u2014 re-running must produce the same result without duplicates.',
            'Undocumented transformations \u2014 every business logic step must be traceable to a requirement.',
            'Dropping columns or changing types in production schemas without migration plan.',
        ],
        references: [
            'https://docs.getdbt.com/docs/introduction',
            'https://airflow.apache.org/docs/',
            'https://spark.apache.org/docs/latest/',
            'https://docs.snowflake.com/',
            'https://learn.microsoft.com/en-us/power-bi/',
            'https://greatexpectations.io/expectations/',
            'https://www.databricks.com/glossary/data-lakehouse',
        ],
    },
    {
        slug: 'ml-engineer',
        title: 'ML Engineer',
        mission: 'Ship reliable model training and inference workflows with measurable, reproducible behavior.',
        trigger: 'Use for model training loops, evaluation harnesses, inference APIs, experiment tracking, model monitoring, and automated retraining pipelines.',
        deliverables: [
            'experiment summary (model, dataset, hyperparameters, metrics, comparison to baseline)',
            'evaluation metrics report (train/val/test splits, per-class metrics, confusion matrix)',
            'serving architecture notes (latency budget, scaling strategy, fallback behavior)',
            'monitoring dashboard spec (drift metrics, prediction distribution, retraining triggers)',
        ],
        mustTest: [
            'model metric regression checks (new model must match or beat baseline on held-out set)',
            'inference path smoke tests (prediction endpoint returns valid response within latency budget)',
            'data pipeline reproducibility (same data + same seed = same model)',
            'drift detection alert fires when distribution shift exceeds threshold',
        ],
        companionFiles: ['roles/ml-engineer.skill-pack.md'],
        extraProtocol: `### ML Engineering Dials
- Before adapting this role, load .stackmoss/skill-kit/roles/ml-engineer.skill-pack.md and select active modes.
- Mandatory modes: experiment-core and output-discipline.
- Optional modes by BRD: model-serving, model-monitoring, feature-engineering.

- EXPERIMENT_RIGOR (1-10): controls reproducibility requirements, ablation study depth, statistical significance testing.
- SERVING_RELIABILITY (1-10): controls inference SLA strictness, fallback behavior, A/B testing rigor.
- MONITORING_DEPTH (1-10): controls drift detection sensitivity, retraining automation, alerting granularity.

Set baseline by project type:
- Production ML system: experiment 8-9, serving 8-9, monitoring 8-9.
- Research prototype: experiment 9-10, serving 3-4, monitoring 3-4.
- ML feature in SaaS product: experiment 6-7, serving 7-8, monitoring 7-8.
- Edge/mobile ML: experiment 6-7, serving 9-10, monitoring 5-6.

### Popular Stack Reference
| Layer | Primary Tools | When to Use |
|:--|:--|:--|
| Training | PyTorch, TensorFlow, JAX, scikit-learn | Model development, fine-tuning, custom architectures |
| Experiment tracking | MLflow, Weights & Biases, Neptune, ClearML | Hyperparameter logging, metric comparison, artifact versioning |
| Data processing | Pandas, Polars, DuckDB, Apache Spark | Feature engineering, data cleaning, large-scale transforms |
| Feature store | Feast, Tecton, Hopsworks | Online/offline feature serving, feature versioning |
| Model serving | Triton, BentoML, TorchServe, ONNX Runtime, vLLM | Real-time inference, batch prediction, model optimization |
| Orchestration | Airflow, Prefect, Kubeflow Pipelines, Metaflow | Training pipeline DAGs, scheduled retraining, experiment DAGs |
| Monitoring | Evidently, WhyLabs, Arize, NannyML | Data drift, prediction drift, model performance tracking |
| Optimization | ONNX, TensorRT, quantization, distillation | Latency reduction, model compression, edge deployment |

### ML Audit Flow (Before Model Ship)
1. Data audit:
  - training/validation/test splits are temporally correct (no future leakage).
  - feature distributions documented and compared to production data.
  - data labeling quality verified (inter-annotator agreement, spot-check samples).
  - data versioning in place (DVC, Delta Lake, or artifact store).
2. Experiment audit:
  - experiment is reproducible (fix random seeds, log all hyperparameters).
  - ablation study: each major design choice has comparison evidence.
  - evaluation metrics computed on held-out test set (never on training data).
  - comparison to baseline model documented with statistical significance.
3. Serving audit:
  - inference latency within budget (p50, p95, p99 measured under load).
  - fallback behavior defined (what happens when model is unavailable).
  - model versioning: easy rollback to previous model version.
  - input validation: malformed inputs return clear error, not crash.
4. Monitoring audit:
  - data drift detection configured (feature distribution monitoring).
  - prediction drift detection configured (output distribution monitoring).
  - automated alerts fire when metrics degrade beyond threshold.
  - retraining trigger logic defined (manual approval or automated).
5. Ethics and bias audit:
  - fairness metrics computed across protected groups (if applicable).
  - model card documented (intended use, limitations, ethical considerations).
  - failure modes cataloged with severity and mitigation.`,
        forbiddenPatterns: [
            'Training on test data — evaluate only on held-out data never seen during training.',
            'Vibes-based evaluation — always use quantitative metrics with defined thresholds.',
            'One-off notebooks as production code — production ML code must be version-controlled, tested, and reviewed.',
            'Ignoring data drift — monitor input distributions continuously in production.',
            'Manual model deployment — automate model packaging, validation, and rollout.',
            'Single metric evaluation — use multiple complementary metrics (accuracy + precision + recall + latency).',
            'Shipping without model card — document intended use, limitations, and failure modes.',
        ],
        references: [
            'https://pytorch.org/docs/stable/',
            'https://mlflow.org/docs/latest/',
            'https://docs.wandb.ai/',
            'https://bentoml.com/docs/',
            'https://docs.feast.dev/',
            'https://www.evidentlyai.com/docs',
            'https://huggingface.co/docs',
        ],
    },
    {
        slug: 'docs',
        title: 'Documentation',
        mission: 'Keep operational and product documentation accurate, concise, and shippable.',
        trigger: 'Use for README, runbooks, release notes, onboarding docs, API usage guides, changelog maintenance, and developer portal content.',
        deliverables: [
            'doc scope update (what changed, what docs need updating, audience impact)',
            'audience-targeted deliverable (README for devs, runbook for ops, guide for users)',
            'fact verification checklist (every command tested, every path validated, every link checked)',
            'changelog entry (Keep a Changelog format with categorized changes)',
        ],
        mustTest: [
            'command or path validity checks (every code block runs successfully)',
            'cross-link and consistency review (no broken links, no contradicting info)',
            'onboarding dry run (new developer can follow README to running app in < 15 min)',
            'API doc accuracy (request/response examples match actual API behavior)',
        ],
        companionFiles: ['roles/docs.skill-pack.md'],
        extraProtocol: `### Documentation Dials
- Before adapting this role, load .stackmoss/skill-kit/roles/docs.skill-pack.md and select active modes.
- Mandatory modes: readme-runbook-core and output-discipline.
- Optional modes by BRD: api-docs, developer-portal, changelog-release-notes.

- TECHNICAL_DEPTH (1-10): controls code example density, architecture diagram depth, implementation detail level.
- AUDIENCE_BREADTH (1-10): controls multi-audience coverage (developer, operator, end-user, stakeholder).
- MAINTENANCE_RIGOR (1-10): controls freshness enforcement, broken link detection, staleness alerting.

Set baseline by project type:
- Open source library: technical 9-10, audience 7-8, maintenance 8-9.
- Internal tool: technical 6-7, audience 3-4, maintenance 5-6.
- Developer API product: technical 8-9, audience 8-9, maintenance 9-10.
- Consumer product: technical 4-5, audience 9-10, maintenance 7-8.

### Popular Stack Reference
| Category | Primary Tools | When to Use |
|:--|:--|:--|
| Static site | Docusaurus, VitePress, Nextra, Starlight | Developer docs, guides, API reference sites |
| API docs | Swagger/OpenAPI, Redoc, Stoplight, Mintlify | REST API reference, interactive playground |
| Diagrams | Mermaid, D2, PlantUML, Excalidraw | Architecture diagrams, sequence diagrams, flow charts |
| Versioning | Docusaurus versioning, git-based branching | Multi-version docs for libraries and APIs |
| Search | Algolia DocSearch, Pagefind, Flexsearch | Full-text search across documentation |
| Changelog | Keep a Changelog format, conventional commits | Release notes, version history |
| Linting | Vale, markdownlint, textlint | Style guide enforcement, grammar, readability |
| Link check | linkcheck, dead-link-checker, GitHub Actions | Broken link detection in CI |

### Documentation Audit Flow (Before Ship)
1. Completeness audit:
  - README has: project purpose, quick start (< 5 min to running), architecture overview.
  - every public API endpoint documented with method, path, params, response, error codes.
  - onboarding guide tested by someone who has never set up the project.
  - runbooks cover: deploy, rollback, incident response, common troubleshooting.
2. Accuracy audit:
  - every code example compiles and runs (copy-paste test).
  - every CLI command produces the documented output.
  - every file path referenced exists in the current codebase.
  - API request/response examples match actual behavior (test with curl or Postman).
3. Freshness audit:
  - docs updated in the same PR as the feature change.
  - no references to deprecated features, old API versions, or removed files.
  - changelog updated with every release (additive, not retroactive).
  - stale doc detection: flag pages not updated in > 90 days for review.
4. Structure audit:
  - heading hierarchy correct (single H1, logical H2-H4 nesting).
  - code blocks have language annotation for syntax highlighting.
  - tables used for structured data (not bullet-list matrices).
  - SEO: title tags, meta descriptions, canonical URLs for public docs.
5. Link and media audit:
  - all internal and external links verified (no 404s).
  - images have alt text and are optimized (WebP, compressed).
  - diagrams are in version-controlled format (Mermaid, not screenshots).
  - download links point to current release artifacts.`,
        forbiddenPatterns: [
            'Documentation as afterthought — write docs alongside code in the same PR.',
            'Stale docs — outdated documentation is worse than no documentation.',
            'Wall of text — use headers, code blocks, tables, and diagrams for scannability.',
            'Documenting implementation details — document behavior and usage, not internal structure.',
            'Untested code examples — every code block must compile and produce the shown output.',
            'Copy-paste from LLM without verification — verify every fact, command, and path against the real codebase.',
            'Missing audience context — always specify who the document is for (developer, operator, end-user).',
        ],
        references: [
            'https://keepachangelog.com/',
            'https://www.writethedocs.org/guide/',
            'https://docusaurus.io/docs',
            'https://vitepress.dev/guide/getting-started',
            'https://mintlify.com/docs',
            'https://swagger.io/docs/specification/',
            'https://vale.sh/docs/',
        ],
    },
];

function renderRoleTemplate(role: RoleTemplate): string {
    const roleSpecificSection = role.extraProtocol
        ? `\n## Role-Specific Operating System\n${role.extraProtocol}\n`
        : '';

    const forbiddenSection = role.forbiddenPatterns && role.forbiddenPatterns.length > 0
        ? `\n## Absolute Negative Constraints\n${role.forbiddenPatterns.map((item) => `- ${item}`).join('\n')}\n`
        : '';

    const referencesSection = role.references && role.references.length > 0
        ? `\n## Reference Sources\n${role.references.map((item) => `- ${item}`).join('\n')}\n`
        : '';

    return `# Role Template: ${role.title}

## Mission
- ${role.mission}

## Trigger Guidance
- ${role.trigger}
- Avoid use when scope is better handled by Product Manager, Tech Lead, or Skill Creator.

## Core Workflow
1. Confirm scope, boundaries, and acceptance criteria.
2. Plan minimal change with explicit dependencies.
3. Execute with evidence-first reporting.
4. Validate outcomes and summarize residual risks.

## Operational Gates
1. Preflight gate:
- Confirm BRD context and runtime boundary.
- Confirm measurable acceptance command exists.
2. Delivery gate:
- Produce artifacts before claiming done.
- Run positive and negative validation paths.
3. Decision gate:
- If evidence is weak or contradictory, stop and ask owner questions.
- Keep status blocked until validation can run.

## Deliverables
${role.deliverables.map((item) => `- ${item}`).join('\n')}

## Validation Baseline
${role.mustTest.map((item) => `- ${item}`).join('\n')}
${roleSpecificSection}${forbiddenSection}${referencesSection}

## Rationalization Defenses
| Excuse | Reality |
|:--|:--|
| "This is simple, skip process." | Simple tasks still fail without explicit checks. |
| "I can patch first and validate later." | Unverified patches create hidden regressions. |
| "No command available, I will mark done." | Missing validation means blocked, not done. |
| "Template is enough for every domain." | Domain gaps require explicit scoring and research. |
| "Research takes too long, I will improvise." | Improvisation increases drift and runtime mismatch. |

## Runtime Adaptation Notes
- Claude: generate under .claude/skills/<role>/...
- Codex: generate under .agents/skills/<role>/...
- Antigravity: generate under .agent/skills/<role>/...

## Quality Bar
- Include a clear Iron Law and at least 3 workflow phases.
- Include role-specific decisions, anti-patterns, and owner escalation rules.
- Include executable validation command and a negative test path.
- Include blocked-state behavior when validation cannot run.
- Keep logs free of secrets and sensitive payloads.
`;
}

function renderRoleIndex(): string {
    const rows = ROLE_TEMPLATES.map((role) => {
        const companion = role.companionFiles && role.companionFiles.length > 0
            ? role.companionFiles.join(', ')
            : '-';
        return `| ${role.slug} | ${role.title} | roles/${role.slug}.template.md | ${companion} |`;
    });
    return `# Skill Kit Role Index

This folder is the template-first source for skill-creator.

Use order:
1. Pick the closest role template from this index (check aliases below if no exact match).
2. Read BRD (NORTH_STAR.md) to identify project stack and constraints.
3. Select only BRD-relevant modes from the role's skill-pack.
4. Adapt to runtime boundary and generate multi-file output (see role-skill-blueprint.md).
5. Research open-source sources only if template coverage is insufficient.
6. Use Frontend package as the benchmark model for finished template depth.

| Role Key | Role Name | Template | Companion Files |
|:--|:--|:--|:--|
${rows.join('\n')}

## Role Aliases
If user requests a role not listed above, map to the closest template and activate the relevant modes.

| Request | Maps To | Activate Modes |
|:--|:--|:--|
| uiux, ui/ux, design, designer | frontend | design-system-audit, redesign-existing-projects, high-end-visual-design, stitch-design-taste (skip web-implementation-core unless BRD includes code work) |
| developer, dev, fullstack | frontend OR backend | Select based on BRD: frontend for UI-heavy, backend for API-heavy, both if full-stack |
| ops, sre, infra, platform | devops | All modes, prioritize by BRD deployment target |
| data, analytics, bi, etl | data-engineer | All modes, prioritize by BRD data stack |
| ai, ml, machine-learning | ml-engineer | All modes |

If request does not match any alias, score the template as insufficient and proceed to research step.
`;
}

function renderSharedSkillTemplate(): string {
    return `# Shared Skill Template — Layer 1 (SKILL.md)

This template defines the THIN routing file that agents read for every task.
Keep SKILL.md under 400 tokens. All detailed content goes into modes/*.md and supporting layers.

\`\`\`markdown
---
name: <skill-name>
description: <what this skill does + when to trigger + boundaries>
---

# <Skill Title>

## Mission
- <1-line mission statement>

## Iron Law
- <1-line non-negotiable constraint>

## Activation Rules
- Use when: <high-signal triggers>
- Do not use when: <out-of-scope conditions>

## Mode Index
Read ONLY the mode file matching your current task. Do not read all modes.

| Mode | File | Trigger |
|:--|:--|:--|
| <mode-1-name> | modes/<mode-1>.md | <1-line when to activate> |
| <mode-2-name> | modes/<mode-2>.md | <1-line when to activate> |

## Validation
- Command(s): <cmd>
- Evidence: command output and pass or fail summary.

## Shared Methodology
- Follow the team's shared methodology (TDD, debugging protocol, evidence-before-claims, review reception).
- Read methodology from team.md or the runtime-specific methodology skill.
- These disciplines apply identically across Claude Code, Codex, and Antigravity.

## Post-Task Maintenance
- If this task changed module boundaries, dependencies, entry points, or critical flows: update CODE_MAP.md (patch affected rows only, do not re-scan entire codebase).
- If a validation failure occurred: append to data/failure-log.md with date, failure description, root cause, and fix applied. Check this log before starting similar tasks to avoid repeating known failures.

## Blocked State
- If validation cannot run, ask owner questions and return blocked status.
\`\`\`

# Mode File Template — Layer 2 (modes/*.md)

Each mode file is self-contained. Agent reads only the relevant mode per task.

\`\`\`markdown
# Mode: <mode-name>

## Workflow
1. <step one>
2. <step two>
3. <step three>

## Patterns
- <pattern>

## Anti-Patterns
- <anti-pattern>

## Checklist
- [ ] <check item>

## Rationalization Defenses
| Excuse | Reality |
|:--|:--|
| <excuse> | <reality> |
\`\`\`
`;
}

function renderRoleBlueprint(): string {
    return `# Role Skill Blueprint — Multi-File Structure

Generated skills MUST follow this multi-file layout.
Agent efficiency depends on selective reading — never load all files at once.

## Directory Layout
\`\`\`
<runtime-root>/skills/<role>/
├── SKILL.md                    # Layer 1: thin routing (~400 tokens, always read)
├── modes/                      # Layer 2: one file per mode (read per task)
│   ├── <mode-1>.md
│   ├── <mode-2>.md
│   └── <mode-N>.md
├── references/                 # Layer 3: lookup material (read when researching)
│   └── layer-map.md
├── examples/                   # Layer 3: session examples (read when learning)
│   └── session-example.md
├── scripts/                    # Layer 4: validation scripts (run during checks)
│   └── validate-and-log.mjs
├── assets/templates/           # Layer 5: deliverable templates (read when generating)
│   └── owner-questions.md
├── contracts/                  # Layer 6: output contracts (read when finalizing)
│   └── output-contract.md
├── governance/                 # Layer 7: runtime boundary rules
│   └── evolution.md
└── data/                       # Layer 8-9: logs and metadata (written during execution)
    ├── research-cutoff.json
    ├── source-adoption-log.md
    ├── failure-log.md           # Persistent failure log to avoid repeating mistakes
    └── validation-log.ndjson
\`\`\`

## Layer 1 — SKILL.md
- role_name, runtime_root, owner, version
- mission (1 line), iron_law (1 line)
- activation_rules: trigger_examples + non_trigger_examples
- mode_index: table of mode files with 1-line trigger per mode
- validation_command, blocked_state_behavior

## Layer 2 — modes/*.md
- One self-contained file per BRD-selected mode
- Contains: workflow, patterns, anti-patterns, checklist, rationalization defenses
- Agent reads ONLY the mode matching the current task

## Layer 3-9 — Supporting Files
| Layer | Path | Read When |
|:--|:--|:--|
| 3 | references/, examples/ | Researching patterns or looking up stack info |
| 4 | scripts/ | Running validation commands |
| 5 | assets/templates/ | Generating deliverable outputs |
| 6 | contracts/ | Finalizing output quality gates |
| 7 | governance/ | Checking runtime boundaries |
| 8 | data/research-cutoff.json | Verifying knowledge freshness |
| 9 | data/validation-log.ndjson | Logging execution evidence |
| 9 | data/failure-log.md | Checking known failures before similar tasks, logging new failures |

## Mode Selection Rule
- Read BRD (NORTH_STAR.md) before selecting modes
- Include only modes that match project stack or BRD constraints
- Exclude modes irrelevant to the project
- Prune stack references within included modes to project-relevant items only
`;
}

function renderOwnerQuestions(): string {
    return `# Owner Questions

## Quick Intake (3)
1. Which role should be generated?
2. Which runtime root is target?
3. What one acceptance command proves this iteration is usable?

## Interview Intake (8-10)
1. What outcome should this role own?
2. What are top trigger scenarios?
3. What is explicitly out of scope?
4. Which decisions are autonomous?
5. Which decisions require owner approval?
6. Which artifacts must always be produced?
7. Which command validates behavior?
8. What fallback is acceptable when validation fails?
9. What sensitive data must never be logged?
10. What quality bar defines ready vs blocked?
`;
}

function renderValidationMatrix(): string {
    return `# Validation Matrix

| Check | Type | Command or Method | Evidence |
|:--|:--|:--|:--|
| Structure | Static | verify required files exist | file list |
| Trigger Quality | Static | review metadata trigger scope | trigger notes |
| Behavior | Executable | run smoke command | stdout/stderr and exit code |
| Failure Handling | Executable | run negative case | logged failure with remediation |
| Boundary | Static | runtime path check | path validation note |
`;
}

function renderInsufficiencyGate(): string {
    return `# Template Insufficiency Gate

Score the selected role template before generation. Use 1 point for each satisfied check.

## Scoring Checklist (0-5)
- [ ] Iron Law is explicit and role-specific.
- [ ] Workflow has at least 3 phases with concrete gates.
- [ ] Rationalization defense table exists and is actionable.
- [ ] Validation includes executable command and negative path.
- [ ] Deliverables and escalation are concrete for the target domain.

## Decision Rule
- Score >= 4: adapt local template first, then generate.
- Score <= 3: research is mandatory before generation.

## Research Trace Requirement
When research is used, record:
- source URL
- reason selected
- adopted pattern
- rejected pattern
- owner and date
`;
}

function renderSourceAdoptionLogTemplate(): string {
    return `# Source Adoption Log Template

Use one block per source consulted.

## Entry
- date:
- runtime:
- role:
- source_url:
- source_type: (repo/docs/article)
- reason_selected:
- adopted_patterns:
- rejected_patterns:
- notes:
`;
}

function renderPressureTestScenarios(): string {
    return `# Pressure Test Scenarios

Run these scenarios after generating a role skill.

1. Missing command scenario:
- Validation command intentionally unavailable.
- Expected result: skill returns blocked state and owner questions.

2. Runtime boundary scenario:
- Attempt path outside target runtime root.
- Expected result: generation aborts with boundary error.

3. Conflicting requirement scenario:
- BRD scope conflicts with runtime limitation.
- Expected result: explicit risk statement and escalation to owner.

4. Negative execution scenario:
- Use failing command once.
- Expected result: failure is logged and remediation is proposed.

5. Gate bypass scenario:
- Simulate creator claiming template is sufficient without scoring.
- Expected result: workflow blocks output until insufficiency gate score is recorded.
`;
}

function renderOutputContract(): string {
    return `# Output Contract

- Return concise status summary.
- Include validation command and pass or fail outcome.
- If failed, include remediation proposal and blocked reason.
- Include unresolved risks and owner follow-up questions when needed.
`;
}

function renderRuntimeBoundaryChecklist(): string {
    return `# Runtime Boundary Checklist

- [ ] Target runtime confirmed (.claude, .agents, or .agent)
- [ ] No files generated outside selected runtime root
- [ ] Output paths validated before write
- [ ] Cross-runtime references are informational only
`;
}

function renderSourcesRegistry(): string {
    return `# Sources Registry (Research Fallback)

Use this list only when local templates are insufficient for the requested domain.

## Preferred Sources
- https://github.com/obra/superpowers
- https://github.com/obra/superpowers/tree/main/skills/writing-skills
- https://github.com/anthropics/skills/tree/main/skills/skill-creator
- https://github.com/VRSEN/agency-swarm
- https://platform.openai.com/docs/guides/agents
- https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/
- https://github.com/modelcontextprotocol

## Optional Domain Sources
- https://github.com/microsoft/autogen
- https://github.com/langchain-ai/langgraph
- https://github.com/crewAIInc/crewAI

## Policy
- Template-first, research-second.
- Apply insufficiency gate before deciding to research.
- Keep runtime boundary strict while adapting external ideas.
- Record updated cutoff date in runtime skill data when sources are used.
`;
}

function renderFrontendSkillPack(): string {
    return `# Frontend Skill Pack (Web + Design, StackMoss Adaptation)

This pack is the primary operating reference for role \`frontend\`.
Use this file before adapting \`roles/frontend.template.md\`.

## Pack Intent
- Combine web implementation engineering with design system authority.
- Preserve the strongest operational patterns from taste-skill for visual quality.
- Adapt to StackMoss constraints: BRD-first, runtime isolation, validation evidence, blocked-state handling.
- Avoid blind copying. Keep only high-value instructions for production delivery.

## Mode Activation Matrix
| Mode | Trigger | Required Outputs |
|:--|:--|:--|
| web-implementation-core | Any frontend task | component architecture, state management, a11y, responsive verification |
| design-system-audit | Design system work, visual quality review | atmosphere dials, token decisions, anti-pattern gate, audit report |
| redesign-existing-projects | Existing product UI is already live | design audit report, prioritized remediation plan |
| high-end-visual-design (soft) | Premium marketing or flagship surfaces | high-fidelity visual system, interaction choreography |
| stitch-design-taste | Team needs DESIGN.md for Stitch generation | DESIGN.md semantic spec, component behavior spec |
| output-discipline | Always on | complete artifacts, no placeholder outputs |

## Mode 1: web-implementation-core (Mandatory)
### Component Architecture
- Use framework conventions (React components, Vue SFCs, Svelte components).
- Type all props with TypeScript interfaces or prop validation.
- Keep components focused: one responsibility, < 200 lines.
- Extract shared logic into hooks/composables, not utils.
- Use semantic HTML elements (button, nav, article, section, aside).

### State Management Strategy
- Server state: use React Query / TanStack Query / SWR — not manual useEffect+fetch.
- Client state: use Zustand, Jotai, Pinia — not prop drilling or global singletons.
- Form state: use React Hook Form, Formik, or VeeValidate.
- URL state: Reflect filter/sort/page in URL params for shareable links.

### Accessibility Checklist
- All interactive elements focusable and keyboard-navigable.
- ARIA labels on buttons, links, and form fields without visible text.
- Color contrast: 4.5:1 for normal text, 3:1 for large text.
- Skip-to-content link on pages with navigation.
- Form errors linked to fields via aria-describedby.

### Responsive Engineering
- Mobile-first CSS (min-width breakpoints, not max-width).
- Touch targets >= 44x44px on mobile.
- Test at: 320px, 375px, 768px, 1024px, 1440px.
- Use CSS Grid for layout, Flexbox for alignment.
- No horizontal scroll on any viewport.

### Data Fetching Patterns
- Show loading skeletons (not spinners) for content areas.
- Show meaningful empty states with call-to-action.
- Show error states with retry button and human-readable message.
- Implement optimistic updates for high-frequency interactions.

## Mode 2: design-system-audit (Optional)
### Baseline Dials
- DESIGN_VARIANCE: 8 (1=symmetric, 10=asymmetric experimental)
- MOTION_INTENSITY: 6 (1=static, 10=cinematic)
- VISUAL_DENSITY: 4 (1=airy, 10=dense dashboard)

### Core Architecture Rules
- Verify dependencies before imports (motion, icons, state libs).
- Prefer CSS Grid for structure and avoid percentage calc hacks.
- For full-height sections use \`min-h-[100dvh]\`, never \`h-screen\`.
- Keep one accent color and a consistent gray family per project.
- Ban emojis, fake placeholder identities, and AI filler copy.

### Design Engineering Directives
- Typography:
- display layers use tight tracking and purposeful hierarchy.
- body text should stay readable (max ~65ch where applicable).
- Color:
- avoid purple-neon defaults and oversaturated accents.
- use off-black/dark charcoal rather than pure \`#000000\`.
- Layout:
- avoid generic centered hero and 3-equal-card feature rows by default.
- prefer asymmetric structures when variance >= 5.
- States:
- loading, empty, error, and success states are mandatory.

## Mode 3: redesign-existing-projects
### Audit Sequence
1. Scan stack and existing design system constraints.
2. Diagnose weaknesses across typography, color/surface, layout, interaction, and content realism.
3. Build remediation plan with impact-first ordering.
4. Apply targeted upgrades without rewriting the whole product.

### Redesign Checklist
- Replace generic font defaults with intentional type pairing.
- Fix hierarchy, spacing rhythm, and readability.
- Normalize surface depth, border logic, and shadow strategy.
- Replace generic component patterns with product-specific compositions.
- Validate keyboard focus, error handling, loading/empty states.

## Mode 4: high-end-visual-design (soft)
### Creative Variance Engine
- Pick one visual archetype per screen direction:
- Ethereal Glass (tech), Editorial Luxury (brand), or Soft Structuralism (consumer).
- Pick one layout archetype:
- Asymmetrical Bento, Z-axis Cascade, or Editorial Split.
- Mobile fallback is mandatory for every high-variance choice.

### Premium Interaction Patterns
- Double-bezel card architecture for elevated modules.
- Button-in-button trailing icon islands for CTA polish.
- Staggered reveal choreography for lists and sections.
- Spring dynamics for hover/active states.

### Performance Guardrails
- Animate only \`transform\` and \`opacity\`.
- Keep heavy blur/noise on fixed non-interactive layers.
- Avoid perpetual animations in parent containers.

## Mode 5: stitch-design-taste
### DESIGN.md Contract
When Stitch mode is active, produce:
1. Visual atmosphere narrative.
2. Color roles with semantic names and hex.
3. Typography rules by role (display/body/mono).
4. Component behavior specs (buttons/cards/inputs/states).
5. Layout principles and responsive constraints.
6. Motion philosophy and anti-pattern bans.

Use starter template:
- \`.stackmoss/skill-kit/roles/frontend.DESIGN.template.md\`

## Mode 6: output-discipline (Mandatory)
### Completion Rules
- Do not leave placeholders like TODO, "...", or "same as above".
- Do not stop at skeleton outlines when full artifacts are requested.
- If output is long, split with explicit continuation marker and resume exactly where paused.

### Quality Gate
- Every requested artifact must be complete.
- Every claim must reference validation evidence.
- Missing context must produce owner questions, not assumptions.

## StackMoss Adaptation Rules
- Always align with BRD lock status before execution.
- Keep runtime boundary clear during generated skill output.
- Log validation evidence and failure-handling behavior.
- Surface blocked-state explicitly when prerequisites are missing.
`;
}

function renderFrontendDesignTemplate(): string {
    return `# DESIGN.md Template (Frontend Stitch Mode)

## 1. Visual Theme & Atmosphere
- mood:
- variance:
- motion_intensity:
- visual_density:

## 2. Color Palette & Roles
- canvas:
- surface:
- primary_text:
- secondary_text:
- border:
- accent:
- banned_color_patterns:

## 3. Typography Rules
- display_font:
- body_font:
- mono_font:
- hierarchy_rules:
- banned_fonts:

## 4. Component Stylings
- buttons:
- cards_and_containers:
- inputs_and_forms:
- loading_empty_error_states:

## 5. Layout Principles
- hero_structure:
- section_composition:
- grid_system:
- responsive_collapse_rules:

## 6. Motion & Interaction
- default_motion_profile:
- transition_specs:
- stagger_and_reveal_rules:
- performance_constraints:

## 7. Anti-Patterns (Banned)
- no_emoji:
- no_generic_ai_layout:
- no_placeholder_content:
- no_neon_defaults:
`;
}

function renderBackendSkillPack(): string {
    return `# Backend Skill Pack (Contract-First, StackMoss Adaptation)

This pack is the primary operating reference for role \`backend\`.
Use this file before adapting \`roles/backend.template.md\`.

## Pack Intent
- Enforce contract-first API development with observable, evolvable services.
- Adapt to StackMoss constraints: BRD-first, runtime isolation, validation evidence, blocked-state handling.
- Avoid premature abstraction. Keep only high-value patterns for production delivery.

## Mode Activation Matrix
| Mode | Trigger | Required Outputs |
|:--|:--|:--|
| api-contract-core | Any backend task | contract spec, validation rules, error catalog, observability checklist |
| database-evolution | Schema changes, migrations, query optimization | migration plan, schema diff, rollback strategy, query plan review |
| service-architecture | Multi-service coordination, domain boundaries | service boundary map, integration contract, failure mode analysis |
| api-contract-template | Team needs API-CONTRACT.md for consumer handoff | typed contract spec, error catalog, auth requirements, pagination contract |
| output-discipline | Always on | complete implementations, no stub endpoints, no missing error handlers |

## Mode 1: api-contract-core (Mandatory)
### Baseline Dials
- VALIDATION_STRICTNESS: 7 (1=loose, 10=paranoid)
- OBSERVABILITY_DEPTH: 6 (1=silent, 10=trace-everything)
- EVOLUTION_SAFETY: 7 (1=move-fast, 10=never-break)

### Endpoint Implementation Checklist
1. **Input boundary** â€” DTO/schema validation at the edge. Reject invalid input before it reaches business logic.
2. **Authorization gate** â€” permission check after auth, before logic. Never mix auth into service layer.
3. **Service layer** â€” business logic in dedicated services. Controllers are thin dispatchers.
4. **Error contract** â€” every endpoint documents its error codes. Use consistent envelope: \`{ error: { code, message, details? } }\`.
5. **Structured logging** â€” log entry/exit with correlation ID. Include request context, never PII.
6. **Response shape** â€” consistent envelope with data, pagination metadata, and self-links if REST.

### Error Response Contract
\`\`\`json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Human-readable description",
    "details": [
      { "field": "email", "constraint": "must be valid email format" }
    ],
    "requestId": "correlation-id-here"
  }
}
\`\`\`

HTTP status mapping:
- 400: validation, malformed request
- 401: not authenticated
- 403: not authorized (authenticated but insufficient permission)
- 404: resource not found
- 409: conflict (duplicate, stale update)
- 422: unprocessable entity (valid syntax but semantic error)
- 429: rate limited (include Retry-After header)
- 500: internal error (log full detail, return generic message)

### AI Agent Tells â€” Forbidden Patterns
- Returning raw database errors to client (Prisma error codes, SQL errors).
- Using generic \`try { } catch (e) { res.status(500) }\` without error classification.
- Putting business logic in middleware or route handlers instead of service functions.
- Importing ORM models directly in controllers instead of through repository/service layer.
- Using \`any\` type for request bodies instead of validated DTOs.
- Logging \`JSON.stringify(req.body)\` which may contain passwords or tokens.

## Mode 2: database-evolution
### Migration Strategy
1. **Additive-only in production** â€” add columns, add tables, add indexes. Never drop or rename in-place.
2. **Multi-phase breaking changes** â€” to rename a column: add new â†’ backfill â†’ migrate reads â†’ drop old.
3. **Migration testing** â€” run migration up AND down in CI before merge.
4. **Data backfill** â€” separate from schema change. Backfills are idempotent scripts, not migration steps.

### Query Optimization Rules
- Review query plan (\`EXPLAIN ANALYZE\`) for any query touching > 1000 rows.
- Index columns used in WHERE, JOIN, ORDER BY. Composite indexes for multi-column filters.
- Use cursor-based pagination for large datasets. Offset-based is acceptable for small, admin-only lists.
- Detect N+1: if a loop contains a query, refactor to batch/eager load.
- Connection pool sizing: match to expected concurrent requests, not total users.

### Schema Evolution Checklist
- [ ] Migration is additive (no column drops in production)
- [ ] Migration has both up and down scripts
- [ ] Existing queries are not broken by schema change
- [ ] Backfill script is idempotent (safe to re-run)
- [ ] Indexes added for new query patterns

## Mode 3: service-architecture
### Domain Boundary Rules
- One service owns one aggregate root. Cross-aggregate operations use events or explicit service calls.
- Service-to-service communication: prefer async events for eventual consistency, sync HTTP/gRPC for real-time needs.
- Never share database tables between services. Shared data flows through contracts (API or events).

### Failure Mode Analysis
For each service integration, document:
- What happens if the downstream service is slow (> 5s)?
- What happens if the downstream service is down?
- What happens if the downstream service returns unexpected data?
- What is the retry strategy? (exponential backoff with jitter, circuit breaker threshold)
- What is the fallback? (cached data, degraded mode, explicit error to user)

### Transaction Patterns
- Single-service: use database transactions with explicit rollback.
- Cross-service: use saga pattern with compensation. Document the compensation step for each forward step.
- Idempotency: every mutating endpoint accepts an idempotency key. Replay is safe.

## Mode 4: api-contract-template
### API-CONTRACT.md Generation
When contract mode is active, produce:
1. Service overview and domain context.
2. Authentication and authorization requirements.
3. Endpoint inventory with request/response/error shapes.
4. Pagination and filtering contract.
5. Versioning strategy and deprecation policy.
6. Error catalog with codes and recovery hints.

Use starter template:
- \`.stackmoss/skill-kit/roles/backend.API-CONTRACT.template.md\`

## Mode 5: output-discipline (Mandatory)
### Completion Rules
- Do not leave endpoints without error handling (no empty catch blocks).
- Do not skip input validation because "it's an internal endpoint."
- Do not stub out service methods with \`// TODO: implement later\`.
- If implementation is blocked, document the blocker and return blocked status.

### Quality Gate
- Every endpoint must have input validation + auth check + error handling + structured logging.
- Every database query must have index coverage documented.
- Every claim must reference test evidence (command output, not just "tests pass").
- Missing context must produce owner questions, not assumptions.

## StackMoss Adaptation Rules
- Always align with BRD lock status before execution.
- Keep runtime boundary clear during generated skill output.
- Log validation evidence and failure-handling behavior.
- Surface blocked-state explicitly when prerequisites are missing.
`;
}

function renderBackendApiContractTemplate(): string {
    return `# API-CONTRACT.md Template (Backend Contract Mode)

## 1. Service Overview
- service_name:
- domain:
- owner_team:
- base_url:
- api_version:

## 2. Authentication & Authorization
- auth_type: (Bearer JWT / API Key / Session / OAuth2)
- token_header:
- required_scopes:
- public_endpoints:
- rate_limits:

## 3. Endpoint Inventory
### [GROUP: Resource Name]
| Method | Path | Auth | Request Body | Response | Errors |
|:--|:--|:--|:--|:--|:--|
| GET | /resource | required | - | ResourceList | 401, 403 |
| POST | /resource | required | CreateDTO | Resource | 400, 401, 409 |
| PATCH | /resource/:id | required | UpdateDTO | Resource | 400, 401, 404 |
| DELETE | /resource/:id | admin | - | 204 | 401, 403, 404 |

## 4. Pagination Contract
- strategy: (cursor / offset)
- default_page_size:
- max_page_size:
- sort_fields:
- filter_fields:

## 5. Error Catalog
| Code | HTTP Status | Message | Recovery Hint |
|:--|:--|:--|:--|
| VALIDATION_FAILED | 400 | Field validation failed | Check details array for specific field errors |
| NOT_AUTHENTICATED | 401 | Missing or invalid token | Refresh token or re-authenticate |
| NOT_AUTHORIZED | 403 | Insufficient permissions | Request elevated access from admin |
| RESOURCE_NOT_FOUND | 404 | Resource does not exist | Verify resource ID |
| CONFLICT | 409 | Resource already exists | Use upsert or check existing |
| RATE_LIMITED | 429 | Too many requests | Retry after Retry-After header value |

## 6. Versioning & Deprecation
- versioning_strategy: (URI path / Accept header / Query param)
- current_version:
- deprecated_versions:
- sunset_policy:
- breaking_change_notification:
`;
}

function renderDataEngineerSkillPack(): string {
    return `# Data Engineer Skill Pack (Pipeline-First, StackMoss Adaptation)

This pack is the primary operating reference for role \`data-engineer\`.
Use this file before adapting \`roles/data-engineer.template.md\`.

## Pack Intent
- Enforce validated, idempotent data pipelines with observable data quality at every boundary.
- Adapt to StackMoss constraints: BRD-first, runtime isolation, validation evidence, blocked-state handling.
- Cover the full modern data stack from ingestion to BI consumption.

## Mode Activation Matrix
| Mode | Trigger | Required Outputs |
|:--|:--|:--|
| pipeline-core | Any data engineering task | pipeline spec, schema validation, idempotency proof, quality checks |
| warehouse-modeling | Schema design, dimensional modeling, denormalization | star/snowflake schema, SCD strategy, partition plan |
| data-quality-ops | Quality monitoring, anomaly detection, SLA enforcement | quality rules, freshness SLA, alerting config, lineage map |
| bi-analytics | Dashboard design, semantic layer, Power BI / Tableau setup | metric definitions, DAX/MDX patterns, refresh strategy |
| output-discipline | Always on | complete pipeline code, no placeholder transforms, no missing quality checks |

## Mode 1: pipeline-core (Mandatory)
### Baseline Dials
- VALIDATION_RIGOR: 7 (1=trust-source, 10=paranoid-check-everything)
- PIPELINE_RESILIENCE: 6 (1=fail-fast, 10=self-healing)
- FRESHNESS_PRESSURE: 5 (1=weekly-batch, 10=sub-minute-streaming)

### ETL/ELT Implementation Checklist
1. **Extract** â€” idempotent reads with bookmark/watermark. Handle partial failures and log source metadata (timestamp, row count, schema version).
2. **Validate** â€” schema enforcement at ingestion boundary. Reject or quarantine bad records. Log rejection reasons with sample data (no PII).
3. **Transform** â€” pure SQL or pure functions. No side effects. Document business rules inline. Use dbt tests or Great Expectations at transform boundary.
4. **Load** â€” atomic writes with clear pattern (append / upsert / merge / SCD). Partition by date and source. Track load metadata (job_id, loaded_at, row_count).
5. **Monitor** â€” freshness SLA check, row count delta vs previous run, null rate per critical column, distribution anomaly detection.

### Stack-Specific Patterns

#### Apache Airflow Patterns
- Use DAGs with clear naming: \`<domain>__<pipeline>__<schedule>\` (e.g., \`sales__orders_daily__0600utc\`).
- Set \`catchup=False\` for operational pipelines. Use \`catchup=True\` only for historical backfills.
- Use Airflow Variables and Connections for config â€” never hardcode credentials in DAG files.
- Task granularity: one task per logical step. Avoid monolithic \"do everything\" tasks.
- Set explicit retries and timeouts: \`retries=2, retry_delay=timedelta(minutes=5)\`.
- Use sensors sparingly â€” prefer event-driven triggers or deferrable operators.

#### dbt Patterns
- One model per file. Use \`ref()\` for all inter-model dependencies â€” never hardcode table names.
- Use staging â†’ intermediate â†’ mart layering:
  - \`stg_*\`: 1:1 with source, light renaming and type casting only.
  - \`int_*\`: business logic, joins, deduplication.
  - \`fct_*\` / \`dim_*\`: final consumption tables.
- Every model must have at least: \`unique\`, \`not_null\` on primary key, \`accepted_values\` on enums.
- Use \`dbt test\` in CI â€” pipeline fails if any test fails.
- Document every model with \`description\` in \`schema.yml\`.

#### Apache Spark Patterns
- Prefer DataFrame API over RDD for type safety and optimizer benefits.
- Partition output data by date/source for efficient downstream queries.
- Use \`coalesce\` before write to control file count (avoid small file problem).
- Cache only when reusing a DataFrame multiple times â€” uncache when done.
- Monitor shuffle: if shuffle read > 1GB per task, consider repartitioning or broadcast join.

### AI Agent Tells â€” Forbidden Patterns
- Writing \`SELECT *\` in production transforms instead of explicit column lists.
- Using \`INSERT INTO\` without idempotency guard (upsert or delete-then-insert).
- Hardcoding file paths like \`/tmp/data.csv\` instead of parameterized path with date partition.
- Creating pipelines without any quality check at exit boundary.
- Logging full row data in error handlers (potential PII exposure).
- Using synchronous waits in orchestration instead of event-driven or sensor-based triggers.

## Mode 2: warehouse-modeling
### Dimensional Modeling Rules
- Use star schema as default for analytics. Snowflake schema only when clear normalization benefit exists.
- Fact tables: immutable event records with foreign keys to dimensions. Grain must be explicitly documented.
- Dimension tables: use SCD Type 2 for attributes that need historical tracking (valid_from, valid_to, is_current).
- Denormalization: acceptable for query performance. Document the source of truth for each denormalized field.

### Partition and Clustering Strategy
- Partition by date for time-series data (daily or monthly based on volume).
- Cluster by high-cardinality filter columns (user_id, region, category).
- Set retention policy: archive or delete data older than SLA requirement.

### Schema Evolution Checklist
- [ ] New columns have sensible defaults (never NOT NULL without default on existing table)
- [ ] Data types are chosen for precision (TIMESTAMP vs DATE, NUMERIC vs FLOAT)
- [ ] Primary and foreign key constraints documented (even if not enforced by warehouse)
- [ ] Column naming follows convention: snake_case, no abbreviations, business-meaningful names
- [ ] Migration script tested against staging warehouse before production apply

## Mode 3: data-quality-ops
### Quality Rule Categories
| Category | Rule Examples | Severity |
|:--|:--|:--|
| Completeness | NOT NULL on required fields, row count > 0 | Critical |
| Uniqueness | Primary key unique, no full-row duplicates | Critical |
| Freshness | Data loaded within SLA window (e.g., by 06:00 UTC) | High |
| Validity | Enum values match allowed set, dates in valid range | Medium |
| Distribution | Volume delta < Â±30% vs previous run, no sudden spikes | Medium |
| Consistency | Cross-table referential integrity, metric reconciliation | Low |

### Alerting Strategy
- **Critical**: page on-call (Slack + PagerDuty). Pipeline halts. No downstream propagation.
- **High**: Slack alert to data team channel. Pipeline continues but flags data as provisional.
- **Medium**: Log warning. Continue pipeline. Review in daily standup.
- **Low**: Log metric. Aggregate in weekly quality report.

### Great Expectations Integration
\\\`\\\`\\\`yaml
# Example expectation suite
expectations:
  - expect_column_values_to_not_be_null:
      column: user_id
  - expect_column_values_to_be_unique:
      column: order_id
  - expect_table_row_count_to_be_between:
      min_value: 1000
      max_value: 1000000
  - expect_column_values_to_be_in_set:
      column: status
      value_set: [pending, completed, cancelled, refunded]
\\\`\\\`\\\`

## Mode 4: bi-analytics
### Power BI / Tableau Patterns
- Data model: use import mode for stable datasets < 1GB. Use DirectQuery or Live Connection for large or real-time datasets.
- Semantic layer: define measures and dimensions in a central model (dbt metrics, Power BI composite models, or Looker LookML).
- DAX best practices (Power BI):
  - Use variables (\`VAR\`) to avoid repeated expensive calculations.
  - Prefer \`CALCULATE\` + \`FILTER\` over nested \`IF\` for conditional aggregation.
  - Avoid \`DISTINCTCOUNT\` on high-cardinality columns in large tables â€” pre-aggregate.
- Refresh strategy: schedule incremental refresh where supported. Full refresh only for dimension tables.

### Metric Definition Contract
Every metric exposed to BI must have:
- **Name**: business-meaningful, unique across org.
- **Definition**: exact SQL or DAX expression.
- **Grain**: what one row represents.
- **Owner**: team or person responsible for accuracy.
- **Source table**: which mart table feeds this metric.
- **Caveats**: known limitations, edge cases, or excluded data.

### Dashboard Handoff Checklist
- [ ] All metrics defined with SQL/DAX and documented
- [ ] Filters and slicers spec'd (date range, region, category)
- [ ] Drill-down paths defined (summary â†’ detail â†’ raw)
- [ ] Data refresh schedule and SLA documented
- [ ] Access control: who can view, who can edit
- [ ] Mobile layout verified if applicable

## Mode 5: output-discipline (Mandatory)
### Completion Rules
- Do not leave transform steps as \`-- TODO: add business logic\`.
- Do not skip quality checks because \"source data is trusted.\"
- Do not create DAGs without retry and timeout configuration.
- If pipeline cannot run in current environment, document blocker and return blocked status.

### Quality Gate
- Every pipeline must have schema validation at ingestion + quality checks at exit.
- Every transform must be documented with business rule traceability.
- Every claim must reference validation evidence (row counts, test results, freshness timestamps).
- Missing context must produce owner questions, not assumptions.

## StackMoss Adaptation Rules
- Always align with BRD lock status before execution.
- Keep runtime boundary clear during generated skill output.
- Log validation evidence and failure-handling behavior.
- Surface blocked-state explicitly when prerequisites are missing.
`;
}

function renderDataEngineerContractTemplate(): string {
    return `# DATA-CONTRACT.md Template (Data Engineer Contract Mode)

## 1. Pipeline Overview
- pipeline_name:
- domain:
- owner_team:
- schedule: (cron expression or event trigger)
- ingestion_method: (full load / incremental / CDC / streaming)

## 2. Source Contract
- source_system:
- source_table_or_api:
- schema_version:
- data_format: (Parquet / CSV / JSON / Avro / API response)
- expected_volume: (rows per run)
- breaking_change_notification: (how source owner notifies)

## 3. Schema Definition
### [Table: target_table_name]
| Column | Type | Nullable | Description | Business Rule |
|:--|:--|:--|:--|:--|
| id | BIGINT | No | Primary key | Auto-generated |
| created_at | TIMESTAMP | No | Record creation time | Source system timestamp |
| status | VARCHAR(20) | No | Order status | Enum: pending, completed, cancelled |
| amount | NUMERIC(12,2) | Yes | Transaction amount | Null for cancelled orders |

## 4. Quality Rules
| Rule | Column(s) | Severity | Threshold |
|:--|:--|:--|:--|
| not_null | id, created_at, status | Critical | 0 violations |
| unique | id | Critical | 0 violations |
| freshness | loaded_at | High | < 2 hours since last run |
| row_count_delta | * | Medium | Â± 30% vs previous run |
| accepted_values | status | Medium | Only enum values |

## 5. SLA and Freshness
- freshness_sla: (e.g., data available by 06:00 UTC daily)
- staleness_alert_threshold: (e.g., alert if > 4 hours stale)
- backfill_policy: (manual request / automatic catchup)

## 6. Downstream Consumers
| Consumer | Type | SLA Dependency | Contact |
|:--|:--|:--|:--|
| Analytics Dashboard | Power BI | Refreshes at 07:00 UTC | analytics-team |
| ML Feature Store | Spark Job | Reads at 08:00 UTC | ml-team |
| API Cache | Application | Real-time | backend-team |

## 7. Lineage and Governance
- source_to_target_lineage: (source â†’ staging â†’ intermediate â†’ mart)
- pii_columns: (list columns containing PII)
- masking_strategy: (hash / redact / tokenize)
- retention_policy: (e.g., 2 years in hot storage, 5 years in archive)
- access_control: (roles or teams with read/write access)
`;
}

function renderMobileSkillPack(): string {
    return `# Mobile Skill Pack (Cross-Platform + Native, StackMoss Adaptation)

This pack is the primary operating reference for role \`mobile\`.
Use this file before adapting \`roles/mobile.template.md\`.

## Pack Intent
- Enforce platform-quality mobile engineering with offline-first and performance-budget discipline.
- Support both cross-platform (React Native, Flutter, Expo) and native (Swift, Kotlin) workflows.
- Adapt to StackMoss constraints: BRD-first, runtime isolation, validation evidence, blocked-state handling.

## Mode Activation Matrix
| Mode | Trigger | Required Outputs |
|:--|:--|:--|
| mobile-core | Any mobile task | platform scope, offline strategy, permission flow, performance budget |
| react-native | React Native or Expo project | RN architecture, navigation, native modules, EAS build |
| flutter | Flutter project | widget tree, state management, platform channels, build flavors |
| native-ios-android | Swift/Kotlin native project | platform-specific patterns, lifecycle, system integration |
| output-discipline | Always on | complete implementations, real device verification |

## Mode 1: mobile-core (Mandatory)
### Platform Engineering Rules
- Always define target platforms and minimum OS versions upfront.
- Never rely on emulator-only testing — real devices are mandatory for sign-off.
- Always use SafeArea/SafeAreaView to avoid notch and system UI overlap.
- Use responsive layout (flexbox, constraints) — never hardcode pixel dimensions.

### Offline-First Architecture
- Default assumption: user has no network. UI must be usable offline.
- Local database (SQLite, Realm, WatermelonDB) for persistent data.
- Sync queue with retry logic for pending mutations.
- Conflict resolution strategy defined before implementation (last-write-wins, server-wins, manual merge).
- Network status indicator visible to user when offline.

### Permission Management
- Request permissions contextually when user needs the feature, not at app launch.
- Show user-facing rationale before system dialog.
- Handle denied state gracefully: show what feature is unavailable and how to re-enable.
- Handle "don't ask again" state: direct user to system settings.

### Performance Budget
- App size: < 50MB for consumer apps, < 100MB for enterprise.
- Cold start: < 2 seconds to interactive.
- Scroll: 60fps minimum, profile with Instruments/Android Profiler.
- Memory: no unbounded growth, profile for leaks regularly.
- Network: batch API calls, cache aggressively, compress payloads.

## Mode 2: react-native (Optional)
### Architecture Patterns
- Use Expo for managed workflow unless native modules require bare workflow.
- Navigation: React Navigation v7+ with typed routes.
- State: Zustand for client state, TanStack Query for server state.
- Styling: StyleSheet.create for performance, Nativewind/Tailwind for rapid prototyping.

### Native Module Integration
- Prefer Expo modules and community packages over custom native code.
- When custom native is needed, use Turbo Modules (New Architecture).
- Always provide fallback behavior for platforms where native module is unavailable.

### Build & Distribution
- Use EAS Build for CI/CD (development, preview, production profiles).
- Use EAS Update for OTA updates (non-native changes only).
- Configure app.config.ts for environment-specific builds.
- Test on both iOS and Android before every release.

## Mode 3: flutter (Optional)
### Architecture Patterns
- Use Riverpod or Provider for state management.
- Follow the feature-first folder structure (not layer-first).
- Use GoRouter for declarative routing with deep link support.
- Use Freezed for immutable data classes and union types.

### Platform Integration
- Use platform channels for native API access.
- Use build flavors for environment-specific configuration.
- Test Material (Android) and Cupertino (iOS) widget rendering.

## Mode 4: native-ios-android (Optional)
### iOS (Swift/SwiftUI)
- Use SwiftUI for new screens, UIKit for complex legacy integration.
- Follow MVVM with Combine or async/await for data flow.
- Use NavigationStack for navigation (not deprecated NavigationView).
- Profile with Instruments for memory, energy, and CPU.

### Android (Kotlin/Compose)
- Use Jetpack Compose for new screens.
- Follow MVVM with ViewModel + StateFlow.
- Use Hilt for dependency injection.
- Profile with Android Profiler for memory, CPU, and network.

## Mode 5: output-discipline (Mandatory)
### Completion Rules
- Do not leave navigation stubs ("// TODO: implement screen").
- Do not skip offline handling because "we'll add it later."
- Do not ship without testing on real devices (at least 1 iOS + 1 Android).
- If build cannot complete in current environment, document blocker and return blocked status.

### Quality Gate
- Every screen must handle loading, empty, error, and success states.
- Every permission must have grant, deny, and re-request flows.
- Every claim must reference real device test evidence.
- Missing context must produce owner questions, not assumptions.

## StackMoss Adaptation Rules
- Always align with BRD lock status before execution.
- Keep runtime boundary clear during generated skill output.
- Log validation evidence and failure-handling behavior.
- Surface blocked-state explicitly when prerequisites are missing.
`;
}
function renderDevOpsSkillPack(): string {
    return `# DevOps Skill Pack (Infrastructure + Delivery, StackMoss Adaptation)

This pack is the primary operating reference for role \`devops\`.
Use this file before adapting \`roles/devops.template.md\`.

## Pack Intent
- Enforce reproducible, automated infrastructure and deployment with built-in observability.
- Merge CI/CD pipeline engineering, container management, IaC, and SRE practices into one role.
- Adapt to StackMoss constraints: BRD-first, runtime isolation, validation evidence, blocked-state handling.

## Mode Activation Matrix
| Mode | Trigger | Required Outputs |
|:--|:--|:--|
| ci-cd-core | Any DevOps task | pipeline config, build determinism, test gates, deploy strategy |
| container-orchestration | Docker, K8s, ECS work | Dockerfile, compose config, health checks, resource limits |
| infrastructure-as-code | Terraform, Pulumi, CloudFormation | state management, drift detection, module structure |
| observability-ops | Monitoring, alerting, incident response | metrics, dashboards, alert rules, runbooks |
| output-discipline | Always on | complete configs, no placeholder values, no TODO comments |

## Mode 1: ci-cd-core (Mandatory)
### Pipeline Architecture
- Every PR triggers: lint → type-check → unit test → integration test → security scan.
- Build artifacts are immutable: same image/bundle from CI to staging to production.
- Deploy gates: staging must pass smoke tests before production deploy is allowed.
- Rollback mechanism documented and tested before first production deploy.

### GitHub Actions Patterns
\\\`\\\`\\\`yaml
# Standard PR pipeline structure
on:
  pull_request:
    branches: [main]
jobs:
  quality:
    steps:
      - lint        # ESLint, Prettier, or language-specific linter
      - type-check  # tsc --noEmit, mypy, or equivalent
      - unit-test   # vitest, jest, pytest with coverage threshold
      - audit       # npm audit, pip-audit, or Snyk
  deploy-staging:
    needs: quality
    if: github.event.action == 'closed' && github.event.pull_request.merged
\\\`\\\`\\\`

### Build Determinism Rules
- Lock files (package-lock.json, pnpm-lock.yaml, Pipfile.lock) committed and used in CI.
- Base images pinned to digest or specific tag (\`node:20.11-alpine\`, not \`node:latest\`).
- No floating \`@latest\` in install commands — pin every version.
- Build cache strategy documented (layer caching for Docker, turbo cache for monorepos).

### Deploy Strategy Matrix
| Strategy | Use When | Rollback Speed |
|:--|:--|:--|
| Blue-Green | Zero-downtime required, simple topology | Instant (DNS/LB switch) |
| Canary | Need to validate with real traffic subset | Fast (route 100% to stable) |
| Rolling | K8s default, acceptable brief mixed versions | Medium (rollback deployment) |
| Feature Flags | Decouple deploy from release | Instant (flag toggle) |
| Recreate | Stateful apps, DB migrations | Slow (redeploy previous) |

## Mode 2: container-orchestration (Optional)
### Docker Best Practices
- Multi-stage builds: separate build dependencies from runtime image.
- Non-root user: \`USER node\` or equivalent — never run production as root.
- .dockerignore: exclude node_modules, .git, .env, test files.
- HEALTHCHECK instruction in every Dockerfile.
- Pin base image to specific version with SHA digest for production.
- Layer ordering: least-changing layers first (OS deps → app deps → app code).

### Docker Compose Patterns
- Use \`profiles\` for optional services (e.g., monitoring stack).
- Define resource limits (memory, CPU) for all services.
- Use named volumes for persistent data, tmpfs for ephemeral.
- Health checks with \`test\`, \`interval\`, \`timeout\`, \`retries\` for all services.
- Environment variables via \`.env\` file, never hardcoded in compose.

### Kubernetes Patterns
- Resource requests and limits on every container.
- Liveness and readiness probes with appropriate thresholds.
- Use Deployments (not bare Pods) for application workloads.
- ConfigMaps for non-sensitive config, Secrets for credentials.
- Network Policies to restrict pod-to-pod communication.
- Horizontal Pod Autoscaler with CPU and memory targets.
- Pod Disruption Budgets for availability during maintenance.

## Mode 3: infrastructure-as-code (Optional)
### Terraform Patterns
- Remote state backend (S3, GCS, Terraform Cloud) — never local state in production.
- State locking enabled to prevent concurrent modifications.
- Module structure: reusable modules in \`modules/\`, environment configs in \`envs/\`.
- \`terraform plan\` output reviewed before every \`apply\`.
- Drift detection: scheduled \`plan\` runs to catch manual changes.

### IaC Project Structure
\\\`\\\`\\\`
infra/
├── modules/          # Reusable infrastructure modules
│   ├── networking/   # VPC, subnets, security groups
│   ├── compute/      # EC2, ECS, Cloud Run
│   └── database/     # RDS, Cloud SQL, managed DB
├── envs/
│   ├── production/   # Prod-specific variables and overrides
│   ├── staging/      # Staging config (mirrors production)
│   └── dev/          # Development environment
├── backend.tf        # Remote state configuration
└── versions.tf       # Provider version constraints
\\\`\\\`\\\`

### Cloud Resource Rules
- Tag all resources: environment, team, service, cost-center.
- Use managed services over self-hosted when reliability matters more than cost.
- Enable encryption at rest and in transit for all data stores.
- Configure backup and point-in-time recovery for databases.
- Set budget alerts to catch unexpected cost spikes.

## Mode 4: observability-ops (Optional)
### Metrics Strategy (USE + RED)
- USE Method (for infrastructure): Utilization, Saturation, Errors.
- RED Method (for services): Rate, Errors, Duration.
- Four Golden Signals: Latency, Traffic, Errors, Saturation.

### Prometheus + Grafana Patterns
- Use recording rules for frequently-queried aggregations.
- Alert on symptoms (error rate, latency), not causes (CPU usage).
- Dashboard structure: overview → service detail → debug panels.
- Label cardinality: keep labels bounded, avoid user IDs or request IDs.

### Alerting Rules
| Severity | Response Time | Example |
|:--|:--|:--|
| S1 - Critical | 15 min | Service down, data loss risk, security breach |
| S2 - High | 1 hour | Degraded performance, partial outage |
| S3 - Medium | 4 hours | Non-critical service issue, elevated errors |
| S4 - Low | Next business day | Cosmetic issue, tech debt alert |

### Runbook Template
- Alert name and description.
- Impact: what users experience when this fires.
- Investigation steps: what to check, in what order.
- Remediation: how to fix (restart, scale, rollback, hotfix).
- Escalation: who to contact if remediation fails.
- Prevention: action items to prevent recurrence.

### Logging Standards
- Structured logs (JSON) with: timestamp, level, service, trace_id, message.
- Log levels: ERROR (actionable), WARN (investigate), INFO (audit trail), DEBUG (dev only).
- Never log: passwords, tokens, PII, credit card numbers, full request bodies.
- Centralized log aggregation with retention policy (30 days hot, 1 year cold).

## Mode 5: output-discipline (Mandatory)
### Completion Rules
- Do not leave placeholder values in config files (\`<REPLACE_ME>\`, \`TODO\`, \`xxx\`).
- Do not skip health checks because "it works on my machine."
- Do not create pipelines without failure notification (Slack, email, PagerDuty).
- If infrastructure cannot be provisioned in current environment, document blocker and return blocked status.

### Quality Gate
- Every pipeline must have at least: build, test, security scan, and deploy stages.
- Every deploy must have a verified rollback path.
- Every claim must reference validation evidence (pipeline logs, health check responses).
- Missing context must produce owner questions, not assumptions.

## StackMoss Adaptation Rules
- Always align with BRD lock status before execution.
- Keep runtime boundary clear during generated skill output.
- Log validation evidence and failure-handling behavior.
- Surface blocked-state explicitly when prerequisites are missing.
`;
}

function renderQaSkillPack(): string {
    return `# QA Skill Pack

## How to Use
- skill-creator reads this file during mode selection (workflow step 7).
- Score each mode against BRD to determine which modes to include in the generated skill.
- Mandatory modes must always be included. Optional modes are included only when BRD justifies them.

## Mode Activation Matrix
| Mode | Trigger | Required Outputs |
|:--|:--|:--|
| test-strategy-core | Any QA task | testing pyramid, edge case discovery, naming convention, regression prevention |
| e2e-automation | Product has UI or multi-step flows | E2E test suite, page objects, device matrix coverage |
| performance-testing | Product has load/latency requirements | load profile, web vitals baseline, performance budget |
| api-contract-testing | Product has API consumers | consumer contracts, schema validation, backward compatibility gate |
| output-discipline | Always on | complete test evidence, no unverified claims |

## Mode 1: test-strategy-core (Mandatory)
### Testing Pyramid
- Unit (70%): fast, isolated, test one function or module. Run in <5 seconds.
- Integration (20%): test module boundaries (API + DB, service + cache, UI + API).
- E2E (10%): critical user journeys only. Keep E2E count low — each test is expensive.
- Manual exploratory: risk-based sessions for edge cases automation cannot cover.

### Edge Case Discovery Framework
| Category | Test Inputs |
|:--|:--|
| Boundaries | 0, 1, max, max+1, negative, min-1 |
| Types | null, undefined, empty string, empty array, NaN, wrong type |
| Timing | concurrent requests, rapid clicks, timeout, slow network |
| Size | very long strings (10k chars), large file uploads, many list items (1k+) |
| State | logged out, expired session, mid-migration, offline, stale cache |
| Permissions | unauthorized, wrong role, expired token, cross-tenant access |

### Test Naming Convention
- Describe behavior, not implementation: \`should return 404 when user not found\` not \`test getUserById\`.
- Include context: \`[auth] should reject expired JWT with 401\`.
- Negative tests are required: at least 1 negative test per positive test.

### Regression Prevention
- Every bug fix must include a regression test that reproduces the bug before the fix.
- Regression suite runs on every PR — no exceptions, no manual overrides.
- Track coverage trend: stable or improving. Coverage drops block merge.
- Flaky tests: fix within 24 hours or quarantine with tracking issue.

## Mode 2: e2e-automation (Optional)
### Playwright/Cypress Patterns
- Page Object Model: encapsulate page interactions in reusable classes.
- Test isolation: each test starts from clean state (fresh login, fresh data).
- Locator strategy: prefer \`data-testid\` > \`role\` > \`text\` > CSS selectors.
- Wait strategy: use built-in auto-wait, never \`sleep()\` or fixed delays.
- Screenshot on failure: capture screenshot and trace for every failed test.

### Mobile E2E (Maestro/Detox)
- Device matrix: test on at least 2 screen sizes (phone, tablet).
- Gesture testing: swipe, pinch, long-press covered for critical flows.
- Offline mode: verify behavior when network is unavailable mid-flow.
- Deep linking: verify all deep links resolve to correct screens.

### E2E Test Organization
| Category | Frequency | Count |
|:--|:--|:--|
| Smoke (login, main flow) | Every PR | 3-5 tests |
| Critical journeys | Daily CI | 10-15 tests |
| Full regression | Weekly / Pre-release | All E2E tests |

## Mode 3: performance-testing (Optional)
### Load Testing (k6 / Locust / Artillery)
- Baseline: establish p50, p95, p99 latency before changes.
- Load profile: ramp up gradually (10 → 50 → 100 → peak users) over 5-10 minutes.
- Soak test: sustained load at expected peak for 30+ minutes to find memory leaks.
- Spike test: sudden burst to 3x peak to verify circuit breakers and rate limiting.

### Web Vitals (Lighthouse)
| Metric | Good | Needs Improvement | Poor |
|:--|:--|:--|:--|
| LCP | < 2.5s | 2.5-4.0s | > 4.0s |
| FID/INP | < 100ms | 100-300ms | > 300ms |
| CLS | < 0.1 | 0.1-0.25 | > 0.25 |
| TTFB | < 800ms | 800-1800ms | > 1800ms |

### Performance Budget
- JavaScript bundle: < 200KB gzipped for initial load.
- API response time: < 200ms p95 for reads, < 500ms p95 for writes.
- Database query: no query > 100ms without query plan review.
- Image optimization: WebP/AVIF, lazy loading, responsive srcset.

## Mode 4: api-contract-testing (Optional)
### Consumer-Driven Contract Testing (Pact)
- Consumer writes contract (expected request-response pairs).
- Provider verifies contract in CI (provider build must pass all consumer contracts).
- Contract versioning: semantic version, deployed contracts tracked in broker.
- Breaking change detection: provider cannot deploy if consumer contracts fail.

### Schema Validation
- Request validation: Zod/Joi/AJV schema validates incoming request body and params.
- Response validation: API response conforms to OpenAPI spec or JSON Schema.
- Error response contract: consistent error shape (\`{ error: string, code: string, details?: object }\`).
- Backward compatibility: additive changes only (new optional fields). Removing or renaming fields requires versioned endpoint.

## Mode 5: output-discipline (Mandatory)
### Completion Rules
- Do not mark a feature as \"done\" without running the full test suite and recording results.
- Do not skip edge case testing because \"it probably works.\"
- Do not approve a flaky test — fix it or quarantine it with a tracking issue.
- If test infrastructure is unavailable, document blocker and return blocked status.

### Quality Gate
- Every feature must have: acceptance tests + edge case tests + regression tests.
- Ship-or-block verdict must reference: test run URL, coverage report, known issues list.
- Every claim must reference validation evidence (test output, coverage diff, CI logs).
- Missing context must produce owner questions, not assumptions.

## StackMoss Adaptation Rules
- Always align with BRD lock status before execution.
- Keep runtime boundary clear during generated skill output.
- Log validation evidence and failure-handling behavior.
- Surface blocked-state explicitly when prerequisites are missing.
`;
}

function renderSecuritySkillPack(): string {
    return `# Security Skill Pack

## How to Use
- skill-creator reads this file during mode selection (workflow step 7).
- Score each mode against BRD to determine which modes to include in the generated skill.
- Mandatory modes must always be included. Optional modes are included only when BRD justifies them.

## Mode Activation Matrix
| Mode | Trigger | Required Outputs |
|:--|:--|:--|
| security-review-core | Any security task | auth review, input validation, secrets audit, header hardening |
| compliance-audit | Product handles PII or is regulated | OWASP checklist, compliance evidence, data flow diagram |
| supply-chain-security | Product uses third-party dependencies | dependency audit, lockfile integrity, SBOM generation |
| penetration-testing | Product is user-facing or handles sensitive data | injection tests, privilege escalation tests, CSRF/XSS gate |
| output-discipline | Always on | complete audit evidence, no unverified claims |

## Mode 1: security-review-core (Mandatory)
### Auth and Session Security
- Tokens: JWT with short TTL (15 min access, 7 day refresh). Refresh tokens rotate on each use.
- Session: invalidate on password change, explicit logout, and after inactivity timeout.
- Password: bcrypt or Argon2 hashing (never MD5/SHA-1). Minimum 12 characters.
- MFA: enforce for admin accounts. Support TOTP or WebAuthn.
- Rate limiting: auth endpoints (login, signup, reset) limited to 5-10 attempts per minute per IP.

### Input Validation Checklist
| Attack | Defense | Evidence |
|:--|:--|:--|
| SQL Injection | Parameterized queries (Prisma, prepared statements) | No string concatenation in any DB query |
| XSS (Reflected) | Output encoding, CSP header with nonce | CSP header present, no unsafe-inline |
| XSS (Stored) | Sanitize HTML input (DOMPurify), encode on render | Input sanitization test with script payloads |
| Path Traversal | Validate file paths, reject \`../\` | No user-controlled file system paths |
| SSRF | Allowlist outbound URLs, validate scheme | No arbitrary URL fetch from user input |
| CSRF | SameSite cookies, CSRF tokens for state-changing ops | POST/PUT/DELETE endpoints have CSRF protection |
| File Upload | Validate type (magic bytes), size limit, content scan | Upload endpoint rejects executable files |

### OWASP Top 10 Quick Reference
1. Broken Access Control — enforce RBAC at API layer, test with direct API calls.
2. Cryptographic Failures — TLS everywhere, AES-256 at rest, no custom crypto.
3. Injection — parameterized queries, input validation at every boundary.
4. Insecure Design — threat model before implementation, not after.
5. Security Misconfiguration — no default credentials, no verbose errors in production.
6. Vulnerable Components — dependency scanning in CI, zero tolerance for critical CVEs.
7. Auth Failures — MFA for admin, session rotation, rate limiting on auth endpoints.
8. Data Integrity Failures — verify CI/CD pipeline integrity, sign artifacts.
9. Logging Failures — log auth events, access control failures, input validation failures.
10. SSRF — validate and allowlist all server-side HTTP requests.

### HTTP Security Headers
| Header | Value | Purpose |
|:--|:--|:--|
| Strict-Transport-Security | max-age=31536000; includeSubDomains | Force HTTPS |
| Content-Security-Policy | default-src 'self'; script-src 'nonce-{random}' | Prevent XSS |
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| X-Frame-Options | DENY or SAMEORIGIN | Prevent clickjacking |
| Referrer-Policy | strict-origin-when-cross-origin | Limit referrer leakage |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | Restrict browser features |

## Mode 2: compliance-audit (Optional)
### GDPR Checklist
- Data inventory: document all PII collected, stored, and processed.
- Consent: explicit opt-in for data collection. No pre-checked boxes.
- Right to delete: API endpoint to delete all user PII within 30 days.
- Right to export: API endpoint to export user data in machine-readable format.
- Data minimization: collect only what is necessary for the stated purpose.
- Privacy policy: plain language, accessible, versioned.
- Breach notification: process to notify users within 72 hours.

### SOC2 Controls (Type II Relevant)
- Access control: principle of least privilege, reviewed quarterly.
- Change management: all changes through PR review, no direct production access.
- Availability: SLA defined and monitored. Incident response plan tested.
- Confidentiality: encryption at rest and in transit. Access logs retained 1 year.
- Audit logging: all admin actions logged with actor, timestamp, and action.

## Mode 3: supply-chain-security (Optional)
### Dependency Audit
- Run \`npm audit\` (or equivalent) in CI on every PR. Zero critical/high tolerance.
- Use Socket.dev or Snyk for deep supply-chain analysis (typosquatting, maintainer takeover).
- Review new dependencies before adding: maintenance status, download count, known issues.
- Pin major versions in package.json. Use lockfile for exact versioning.
- Verify lockfile integrity: no unexpected changes in PR diffs.

### Container Image Security
- Base images: use official images, pin to specific digest or version tag.
- Scan with Trivy or Grype before push to registry.
- No secrets in image layers (use runtime env vars or vault).
- Non-root user in Dockerfile (\`USER node\`, \`USER 1001\`).
- Minimal attack surface: use slim/distroless base images.

### CI/CD Pipeline Security
- Workflow permissions: least privilege for GitHub Actions (\`permissions: read-all\` default).
- Third-party actions: pin to commit SHA, not tag (\`uses: actions/checkout@abc123\`).
- Secret management: use GitHub Secrets or vault. Never echo secrets in logs.
- Artifact signing: sign build artifacts for deployment verification.

## Mode 4: penetration-testing (Optional)
### Automated Security Testing
- SAST: Semgrep or CodeQL rules in CI. Block PRs with high-severity findings.
- DAST: OWASP ZAP baseline scan against staging after deploy.
- Secret scanning: GitLeaks or TruffleHog in pre-commit hook and CI.
- Infrastructure scanning: Checkov or tfsec for Terraform/CloudFormation.

### Manual Penetration Testing Scope
- Auth bypass: test every auth flow for bypass opportunities.
- Privilege escalation: regular user → admin, cross-tenant access.
- Business logic abuse: price manipulation, rate limit bypass, replay attacks.
- API abuse: mass assignment, BOLA (Broken Object Level Authorization), BFLA.
- File operations: upload malicious files, path traversal, symlink attacks.

## Mode 5: output-discipline (Mandatory)
### Completion Rules
- Do not claim \"secure\" without evidence (scan results, header verification, test output).
- Do not skip dependency audit because \"it takes too long.\"
- Do not approve secret suppression without documented justification and review date.
- If security tooling is unavailable, document blocker and return blocked status.

### Quality Gate
- Every security review must include: auth audit + input audit + secret scan + dependency scan.
- Residual risk statement must list: accepted risks, mitigation plan, risk owner.
- Every claim must reference validation evidence (scan output, header check, test result).
- Missing context must produce owner questions, not assumptions.

## StackMoss Adaptation Rules
- Always align with BRD lock status before execution.
- Keep runtime boundary clear during generated skill output.
- Log validation evidence and failure-handling behavior.
- Surface blocked-state explicitly when prerequisites are missing.
`;
}

function renderMlEngineerSkillPack(): string {
    return `# ML Engineer Skill Pack

## How to Use
- skill-creator reads this file during mode selection (workflow step 7).
- Score each mode against BRD to determine which modes to include in the generated skill.
- Mandatory modes must always be included. Optional modes are included only when BRD justifies them.

## Mode Activation Matrix
| Mode | Type | Include When |
|:--|:--|:--|
| experiment-core | Mandatory | Always include |
| model-serving | Optional | BRD includes inference API, prediction endpoint, or model deployment |
| model-monitoring | Optional | BRD includes production ML, drift detection, or model performance tracking |
| feature-engineering | Optional | BRD includes feature store, feature pipelines, or data preprocessing |
| output-discipline | Mandatory | Always include |

## Mode 1: experiment-core (Mandatory)
### Experiment Lifecycle
1. Define hypothesis: what metric will improve, by how much, and why.
2. Prepare data: version dataset, document splits, validate quality.
3. Train baseline: simple model first, log all parameters and metrics.
4. Iterate: one variable at a time, compare to baseline with same evaluation.
5. Report: document what worked, what did not, and why.

### Reproducibility Checklist
- Random seed set for all sources of randomness (numpy, torch, sklearn).
- Dataset version pinned (DVC, Delta Lake, or artifact hash).
- Environment captured (Python version, package versions, hardware).
- All hyperparameters logged (not just the ones you changed).
- Training script version controlled (git commit hash in experiment log).

### Evaluation Best Practices
| Context | Metrics | Why |
|:--|:--|:--|
| Classification | Precision, Recall, F1, AUC-ROC, Confusion Matrix | Single accuracy hides class imbalance |
| Regression | MAE, RMSE, R², Residual Distribution | RMSE alone hides outlier sensitivity |
| Ranking | NDCG, MRR, MAP | Accuracy at top positions matters more |
| NLP / Generation | BLEU, ROUGE, BERTScore, Human Eval | Automated metrics correlate poorly alone |
| Object Detection | mAP@0.5, mAP@0.75, Per-class AP | Single mAP hides per-class failures |

### Data Pipeline Patterns
- Train/Val/Test split by time (no future data leaking into training).
- Stratified sampling for imbalanced classes.
- Feature scaling fit on training set only, applied to val/test.
- Missing value strategy documented (imputation method, threshold for dropping).

## Mode 2: model-serving (Optional)
### Serving Architecture Patterns
| Pattern | Use When | Latency Budget |
|:--|:--|:--|
| REST API (Flask/FastAPI + Triton) | Standard request-response prediction | < 200ms p95 |
| gRPC (Triton, TorchServe) | High-throughput, low-latency inference | < 50ms p95 |
| Batch prediction (Spark, Airflow) | Large-scale offline scoring | Minutes to hours |
| Streaming (Kafka + Flink) | Real-time event-driven prediction | < 100ms p95 |
| Edge (ONNX, TFLite, Core ML) | On-device inference, no network | < 30ms p95 |

### Model Optimization
- Quantization: INT8 quantization for 2-4x speedup with < 1% accuracy loss.
- Pruning: remove low-magnitude weights for smaller model size.
- Distillation: train smaller student model to mimic larger teacher.
- ONNX export: framework-agnostic format for cross-platform deployment.
- Batching: dynamic batching in Triton/TorchServe for throughput.

### Deployment Checklist
- Model versioned with unique ID (model registry: MLflow, BentoML, SageMaker).
- Rollback path defined (can revert to previous model version in < 5 min).
- Input validation: schema check before inference (reject malformed inputs).
- Health check endpoint: /health returns model version and status.
- Load testing done: p50, p95, p99 latency under expected QPS.

## Mode 3: model-monitoring (Optional)
### Drift Detection
| Drift Type | What to Monitor | Alert Threshold |
|:--|:--|:--|
| Data drift | Input feature distributions (PSI, KL divergence) | PSI > 0.2 for any feature |
| Prediction drift | Output distribution shift (KS test, chi-squared) | p-value < 0.01 |
| Concept drift | Model performance on recent data (accuracy, F1, AUC) | > 5% degradation from baseline |
| Label drift | Ground truth distribution change | Chi-squared test significant |

### Monitoring Stack
- Log all predictions: input features, output, latency, timestamp.
- Dashboard: model performance over time, drift metrics, error rates.
- Alerts: fire on metric degradation, not on infrastructure issues (that is DevOps).
- Retraining trigger: automated data collection + manual approval for retrain.

### Model Performance Reporting
- Weekly model health report: accuracy trend, drift scores, prediction volume.
- Slicing analysis: performance across segments (geography, user type, time period).
- Failure mode tracking: categorize and count prediction failures.

## Mode 4: feature-engineering (Optional)
### Feature Store Patterns
- Online features: low-latency serving (Redis, DynamoDB) for real-time inference.
- Offline features: batch computation and storage (S3, BigQuery) for training.
- Point-in-time correct joins: prevent future data leakage at training time.
- Feature versioning: backward-compatible evolution, deprecation with notice.

### Feature Engineering Best Practices
- Feature documentation: name, description, data type, source, computation logic.
- Feature quality checks: null rate, value range, distribution, freshness.
- Feature correlation analysis: drop redundant features, avoid multicollinearity.
- Category encoding: target encoding with cross-validation, not on full dataset.

## Mode 5: output-discipline (Mandatory)
### Completion Rules
- Do not claim a model is "better" without statistical significance testing.
- Do not skip evaluation on held-out test set because "validation looks good."
- Do not deploy a model without a rollback path and monitoring dashboard.
- If evaluation data or infrastructure is unavailable, document blocker and return blocked status.

### Quality Gate
- Every experiment must have: baseline comparison + held-out evaluation + reproducibility evidence.
- Model ship decision must reference: metric comparison table, test set performance, model card.
- Every claim must reference validation evidence (experiment logs, metric screenshots, training curves).
- Missing context must produce owner questions, not assumptions.

## StackMoss Adaptation Rules
- Always align with BRD lock status before execution.
- Keep runtime boundary clear during generated skill output.
- Log validation evidence and failure-handling behavior.
- Surface blocked-state explicitly when prerequisites are missing.
`;
}

function renderDocsSkillPack(): string {
    return `# Documentation Skill Pack

## How to Use
- skill-creator reads this file during mode selection (workflow step 7).
- Score each mode against BRD to determine which modes to include in the generated skill.
- Mandatory modes must always be included. Optional modes are included only when BRD justifies them.

## Mode Activation Matrix
| Mode | Type | Include When |
|:--|:--|:--|
| readme-runbook-core | Mandatory | Always include |
| api-docs | Optional | BRD includes REST API, GraphQL, or SDK documentation |
| developer-portal | Optional | BRD includes docs site, developer experience, or multi-version docs |
| changelog-release-notes | Optional | BRD includes release management, versioned software, or public changelog |
| output-discipline | Mandatory | Always include |

## Mode 1: readme-runbook-core (Mandatory)
### README Template
Every project README must include these sections in order:
1. **Project Title + One-Line Description**: what this does, in one sentence.
2. **Quick Start**: from git clone to running app in < 5 min. Test this yourself.
3. **Prerequisites**: exact versions (Node 20+, Python 3.11+, Docker 24+).
4. **Architecture Overview**: diagram (Mermaid preferred) + 3-5 sentence description.
5. **Development**: how to run locally, run tests, lint, format.
6. **Deployment**: how to deploy to staging and production.
7. **Contributing**: PR process, code style, commit message format.

### Runbook Template
Every operational runbook must include:
1. **Title**: what task this runbook covers.
2. **When to Use**: trigger conditions (alert fired, scheduled maintenance, incident).
3. **Prerequisites**: access needed, tools required, permissions.
4. **Steps**: numbered, copy-paste-able commands with expected output.
5. **Verification**: how to confirm the task was successful.
6. **Rollback**: how to undo if something goes wrong.
7. **Troubleshooting**: common failure modes and fixes.

### Writing Guide
- Lead with the most important information (inverted pyramid).
- Show the command, show the output (readers copy-paste, not read).
- Use tables for structured comparison data.
- Link to related docs, do not duplicate content.
- Max line width: 80 characters for readability in terminals and diffs.

## Mode 2: api-docs (Optional)
### OpenAPI / Swagger Best Practices
- Every endpoint documented: method, path, description, parameters, request body, response, errors.
- Example requests and responses for every endpoint (realistic data, not "string").
- Error catalog: standardized error codes with HTTP status, error code, and human message.
- Authentication: how to authenticate, token format, expiry, refresh flow.
- Rate limiting: documented per-endpoint limits and retry-after headers.

### API Documentation Structure
\`\`\`
docs/api/
  README.md           # API overview, base URL, auth, rate limits
  endpoints/
    users.md          # All /users/* endpoints
    orders.md         # All /orders/* endpoints
  errors.md           # Error code catalog
  changelog.md        # API version history
  webhooks.md         # Webhook events and payloads
\`\`\`

### Interactive Documentation
- Swagger UI or Redoc for try-it-now experience.
- Postman collection exported and maintained alongside OpenAPI spec.
- SDK code examples in at least 2 languages (curl + one SDK language).

## Mode 3: developer-portal (Optional)
### Docs Site Architecture (Docusaurus / VitePress)
- Sidebar: group by feature area, not file structure.
- Versioning: version docs alongside API versions (v1, v2).
- Search: full-text search (Algolia DocSearch or Pagefind).
- Code examples: tabbed by language (JavaScript, Python, curl).

### Content Types
| Type | Purpose | Update Frequency |
|:--|:--|:--|
| Conceptual (Guide) | Explain why and how | When architecture changes |
| Procedural (Tutorial) | Step-by-step walkthrough | When workflow changes |
| Reference (API) | Exact specifications | Every release |
| Troubleshooting | Fix common problems | Continuously |

### Documentation-as-Code
- Docs live in the same repo as code (monorepo) or linked repo.
- Docs reviewed in same PR as feature changes.
- CI validates: markdown lint, link check, build succeeds.
- Preview deploys for docs PRs (Vercel, Netlify, GitHub Pages).

## Mode 4: changelog-release-notes (Optional)
### Keep a Changelog Format
\`\`\`markdown
# Changelog

## [Unreleased]
### Added
- New feature description

### Changed
- Modified behavior description

### Fixed
- Bug fix description

### Removed
- Deprecated feature removed
\`\`\`

### Release Notes Best Practices
- Audience-appropriate: developer release notes vs. user-facing release notes.
- Breaking changes: called out prominently with migration guide.
- Version format: Semantic Versioning (MAJOR.MINOR.PATCH).
- Automated from conventional commits where possible.

### ADR (Architecture Decision Records)
- One ADR per significant decision.
- Format: Title, Status, Context, Decision, Consequences.
- ADRs are immutable once accepted (supersede with new ADR, don't edit).
- Store in docs/adr/ directory, numbered sequentially.

## Mode 5: output-discipline (Mandatory)
### Completion Rules
- Do not ship documentation without running every code example.
- Do not claim a guide is "complete" without someone else following it.
- Do not leave placeholder text (TODO, TBD, FIXME) in shipped docs.
- If source code context is unavailable, document blocker and return blocked status.

### Quality Gate
- Every doc deliverable must have: fact verification + link check + audience identification.
- README must pass onboarding test (new dev can run the app following it).
- Every claim must reference validation evidence (command output, screenshot, tested link).
- Missing context must produce owner questions, not assumptions.

## StackMoss Adaptation Rules
- Always align with BRD lock status before execution.
- Keep runtime boundary clear during generated skill output.
- Log validation evidence and failure-handling behavior.
- Surface blocked-state explicitly when prerequisites are missing.
`;
}

function renderRuntimeAdapter(runtime: 'claude' | 'codex' | 'antigravity'): string {
    const runtimeRoot = runtime === 'claude'
        ? '.claude/skills/*'
        : runtime === 'codex'
            ? '.agents/skills/*'
            : '.agent/skills/*';

    return `# Runtime Adapter: ${runtime}

## Target Root
- ${runtimeRoot}

## Required Mapping
- role template -> runtime skill folder
- shared templates -> assets/templates
- contracts -> contracts/*
- governance -> governance/*
- evidence -> data/*

## Guardrails
- never generate skills outside ${runtimeRoot}
- keep instructions runtime-agnostic except path and config conventions
`;
}

export function generateSkillKit(_input: TemplateInput): GeneratedFile[] {
    const files: GeneratedFile[] = [
        { path: '.stackmoss/skill-kit/ROLE_INDEX.md', content: renderRoleIndex() },
        { path: '.stackmoss/skill-kit/shared/SKILL.template.md', content: renderSharedSkillTemplate() },
        { path: '.stackmoss/skill-kit/shared/role-skill-blueprint.md', content: renderRoleBlueprint() },
        { path: '.stackmoss/skill-kit/shared/owner-questions.md', content: renderOwnerQuestions() },
        { path: '.stackmoss/skill-kit/shared/validation-matrix.md', content: renderValidationMatrix() },
        { path: '.stackmoss/skill-kit/shared/insufficiency-gate.md', content: renderInsufficiencyGate() },
        { path: '.stackmoss/skill-kit/shared/source-adoption-log.template.md', content: renderSourceAdoptionLogTemplate() },
        { path: '.stackmoss/skill-kit/shared/pressure-test-scenarios.md', content: renderPressureTestScenarios() },
        { path: '.stackmoss/skill-kit/shared/output-contract.md', content: renderOutputContract() },
        { path: '.stackmoss/skill-kit/shared/runtime-boundary-checklist.md', content: renderRuntimeBoundaryChecklist() },
        { path: '.stackmoss/skill-kit/sources-registry.md', content: renderSourcesRegistry() },
        { path: '.stackmoss/skill-kit/runtime-adapters/claude.md', content: renderRuntimeAdapter('claude') },
        { path: '.stackmoss/skill-kit/runtime-adapters/codex.md', content: renderRuntimeAdapter('codex') },
        { path: '.stackmoss/skill-kit/runtime-adapters/antigravity.md', content: renderRuntimeAdapter('antigravity') },
    ];

    for (const role of ROLE_TEMPLATES) {
        files.push({
            path: `.stackmoss/skill-kit/roles/${role.slug}.template.md`,
            content: renderRoleTemplate(role),
        });
    }

    files.push(
        { path: '.stackmoss/skill-kit/roles/frontend.skill-pack.md', content: renderFrontendSkillPack() },
        { path: '.stackmoss/skill-kit/roles/frontend.DESIGN.template.md', content: renderFrontendDesignTemplate() },
        { path: '.stackmoss/skill-kit/roles/backend.skill-pack.md', content: renderBackendSkillPack() },
        { path: '.stackmoss/skill-kit/roles/backend.API-CONTRACT.template.md', content: renderBackendApiContractTemplate() },
        { path: '.stackmoss/skill-kit/roles/mobile.skill-pack.md', content: renderMobileSkillPack() },
        { path: '.stackmoss/skill-kit/roles/devops.skill-pack.md', content: renderDevOpsSkillPack() },
        { path: '.stackmoss/skill-kit/roles/data-engineer.skill-pack.md', content: renderDataEngineerSkillPack() },
        { path: '.stackmoss/skill-kit/roles/data-engineer.DATA-CONTRACT.template.md', content: renderDataEngineerContractTemplate() },
        { path: '.stackmoss/skill-kit/roles/qa.skill-pack.md', content: renderQaSkillPack() },
        { path: '.stackmoss/skill-kit/roles/security.skill-pack.md', content: renderSecuritySkillPack() },
        { path: '.stackmoss/skill-kit/roles/ml-engineer.skill-pack.md', content: renderMlEngineerSkillPack() },
        { path: '.stackmoss/skill-kit/roles/docs.skill-pack.md', content: renderDocsSkillPack() },
    );

    return files;
}
