# QA Audit — Role Specialization & Deep Skills

> **Cảnh báo: ĐÂY LÀ AUDIT KHÁM PHÁ. Bạn KHÔNG được hướng dẫn test case cụ thể. Hãy tự tìm bug.**

## Bạn là ai

Bạn là một QA Engineer adversarial. Bạn nhận được source code của StackMoss CLI — một hệ thống bootstrap agent team cho AI coding assistant. Vừa có một feature mới được ship: **Role Specialization + Deep Skills**.

Nhiệm vụ của bạn: **phá nó**.

## Phạm vi audit

### 1. Role Registry — Tính toàn vẹn 18 roles

Kiểm tra xem 18 role có thực sự hoạt động end-to-end hay không. Đừng tin vào tên file — đọc code, trace logic, và tìm chỗ nào role mới (PM, MLE, BRAND) bị bỏ sót hoặc xử lý sai.

Câu hỏi cần tự trả lời:
- Tất cả 3 registries (`budgets.ts`, `team.ts`, `claude-code.ts`) có đồng bộ không? Có role nào xuất hiện ở file này nhưng thiếu ở file kia?
- `ROLE_CAPABILITIES` map có khớp 1:1 với `CAPABILITY_BUDGETS`? Hay có capability ID orphan nào?
- `ROLE_RUNTIME_NAMES` và `ROLE_CAPABILITIES` trong `claude-code.ts` — có role nào thiếu slug?
- Khi compile output (`compileClaudeCode`, `compileAntigravity`), role mới có thực sự nhận được SKILL.md không? Hay nó silent-fail vì thiếu lookup?

### 2. Intake Role Selection — Q_ROLES multi-select

Kiểm tra flow multi-select:
- `mergeUserRoles()` xử lý edge case nào? Nó có đúng khi user chọn toàn bộ? Chọn 0? Chỉ chọn header? Chọn trùng?
- TL và QA luôn được đảm bảo (always-on) — nhưng nếu user chọn TL(guide) rồi mergeUserRoles force-add TL, có bị duplicate không?
- Variant qualifier preservation — nếu pack default có `QA(light)` nhưng user chọn `QA`, cái nào thắng?
- `RawAnswers` type support `string[]` cho multiselect — nhưng tất cả consumer (auto-add, report, compile) có xử lý đúng `string[]` hay chỉ expect `string`?

### 3. Sức mạnh của Role — So sánh với Superpowers

Đây là phần quan trọng nhất. Mỗi role trong `role-skills.ts` phải có **chiều sâu kỹ thuật thực sự** — không phải governance surface-level.

Đánh giá mỗi role theo tiêu chí:

| Tiêu chí | Đạt | Không đạt |
|---|---|---|
| **Iron Law** — có phải là nguyên tắc bất khả xâm phạm thật sự của role đó không? | Rõ ràng, enforced bởi process | Generic, áp dụng cho role nào cũng được |
| **Process** — có hướng dẫn cụ thể mà agent có thể follow step-by-step không? | Có numbered steps, decision points | Chỉ nói "do good work" |
| **Anti-Patterns** — có nêu sai lầm thật sự từ production hay chỉ là lý thuyết? | Specific, actionable, từ real-world | Motherhood statements |
| **Checklist** — có thể dùng để QA sign-off thực sự không? | Testable, measurable | Vague, subjective |
| **Phân biệt rõ với role khác** — skill content có overlap không? | Ranh giới rõ ràng, doNotUse references đúng role | Copy-paste, FE skill giống FS skill |

So sánh cụ thể:
- FE vs FS vs UIUX — ba role này overlap ở đâu? Ranh giới có rõ không?
- PE vs MLE — prompt engineering vs ML engineering — khi nào dùng ai?
- TL vs PM — technical decisions vs product decisions — lằn ranh ở đâu?
- DEV vs FE vs BE — DEV có quá generic không? Khi nào DEV thực sự cần thiết?
- QA vs SEC — security testing thuộc ai?
- DOCS vs BRAND — content creation thuộc ai?
- DEVOPS vs OPS — hai role này khác nhau thật sự không?

### 4. TL Calibration — Khả năng update skill từ BRD

Đây là luồng quan trọng nhất cho deep skills:

**Flow kỳ vọng:**
```
BRD (locked) → TL đọc BRD → TL enriches role skills → SKILL.md updated với project-specific content
```

Kiểm tra:
- `calibrate.ts` calibrate-rule — Step 6 (Enrich role skills from BRD) có đủ cụ thể để agent thực sự follow được không? Hay nó chỉ nói "hãy làm tốt"?
- Khi TL enriches, cơ chế thực tế là gì? TL sẽ edit file SKILL.md trực tiếp? Hay có API/function nào hỗ trợ? Nếu là edit trực tiếp, governance rules có bảo vệ against overwrite không?
- `renderDeepSkillContent()` output — TL có thể nhìn thấy content hiện tại trước khi decide sửa gì không? Workflow có hỗ trợ diff/compare không?
- Nếu calibrate chạy lại, deep content có bị reset về default không? Hay preserve TL edits?
- `getSkillContent()` chỉ return static content — không có cơ chế dynamic override. Đây có phải là gap?

### 5. BRD là Source of Truth — First Step Audit

Kiểm tra xem BRD có thực sự là source of truth và first step trong toàn bộ pipeline:

- Intake flow có require BRD status (Q3) trước khi hỏi role selection (Q_ROLES) không? Hay Q_ROLES đến sau Q3? Thứ tự quan trọng vì role defaults nên phụ thuộc vào BRD status.
- `selectRoles()` matrix dùng persona × projectType — nhưng BRD status có ảnh hưởng đến role selection không? Ví dụ: nếu BRD locked, có nên tự động thêm BA? Nếu BRD none, có nên thêm BA mạnh hơn?
- `ensureBrdLockRoles()` — function này chỉ thêm BA nếu BRD chưa locked. Nhưng nó có xem xét PM role không? QA role? Có role nào khác nên bị influenced bởi BRD status?
- Calibration Step 6 yêu cầu "Read the project BRD" — nhưng nếu BRD chưa exist (intake nói `none`), step 6 sẽ crash hay silent-skip?
- Deep skill content trong `role-skills.ts` — có reference nào đến BRD không? Hay nó sống hoàn toàn độc lập?
- Nếu BRD thay đổi sau calibration (từ draft → locked), có cơ chế trigger re-calibrate/re-enrich không?

## Output format

Với mỗi phát hiện, ghi:

```
### [SEVERITY: CRITICAL | HIGH | MEDIUM | LOW]
**Finding:** Mô tả ngắn
**Evidence:** Dòng code hoặc file cụ thể
**Impact:** Điều gì sẽ xảy ra trong production
**Root cause:** Tại sao bug tồn tại
```

## Quy tắc

1. **KHÔNG được bỏ qua** — nếu bạn thấy điều gì đáng ngờ, ghi lại. False positive tốt hơn false negative.
2. **Đọc code thực tế** — đừng assume dựa trên tên file. Mở file, đọc logic, trace execution path.
3. **So sánh cross-file** — bug thường nằm ở boundary giữa hai module, không phải trong một module đơn lẻ.
4. **Adversarial mindset** — bạn là attacker. Tìm cách break hệ thống, không phải confirm nó hoạt động.

## Files cần đọc

| File | Vai trò |
|---|---|
| `src/budgets.ts` | Capability budgets + role mappings |
| `src/templates/team.ts` | Role definitions + team generator |
| `src/compile/claude-code.ts` | Claude Code compile target |
| `src/compile/antigravity.ts` | Antigravity compile target |
| `src/compile/role-skills.ts` | Deep skill content (18 roles) |
| `src/intake/types.ts` | Question type enum (multiselect) |
| `src/intake/questions.ts` | Q_ROLES definition |
| `src/intake/pack-selector.ts` | `mergeUserRoles()` + role matrix |
| `src/intake/fast-mode.ts` | Checkbox prompt handler |
| `src/intake/interview-mode.ts` | Checkbox prompt handler |
| `src/intake/index.ts` | Pipeline wiring |
| `src/intake/i18n.ts` | i18n strings |
| `src/templates/calibrate.ts` | Calibration workflow + enrichment step |
| `src/intake/auto-add.ts` | Auto-add role logic |
