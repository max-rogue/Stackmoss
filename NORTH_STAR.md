# North Star - StackMoss

_Cap nhat bang tay khi huong san pham thay doi._

**Ai dung:**
- solo founder
- vibe coder
- dev team nho
- nguoi da co IDE/CLI agent nhung chua co governance ro rang

**Van de can giai quyet:**
- Agent code nhanh nhung de drift scope, sai command, sai path, va phinh context
- Team agent bootstrap theo assumption neu khong duoc Tech Lead calibrate lai
- User khong biet buoc tiep theo sau khi setup
- Mỗi runtime co format config rieng, de bi cross-talk va ton token neu khong tach ro

**Success signal:**
- User vao repo va setup bootstrap team nhanh
- User duoc dan dung tung buoc bang ngon ngu da chon
- Tech Lead calibrate duoc team theo BRD va repo that
- Team giu config gon, replace-only, khong append memory log
- User co the tu kiem thu team bang eval flow dung chinh runtime cua ho

**Constraints:**
- open source core
- khong can StackMoss goi LLM
- BYO-LLM
- replace-only config updates
- safe by default
- user confirm truoc khi apply shared config patch

**Pham vi v1 hien tai:**
- `stackmoss new`
- `stackmoss init`
- BRD-first intake
- bootstrap outputs cho:
  - Claude Code
  - Cursor
  - VS Code / Copilot
  - Codex
  - Antigravity
- Tech Lead-first calibration flow
- portable eval prepare/grade flow
- methodology layer adapted tu Superpowers

**Ngoai pham vi:**
- background daemon
- auto-apply config khong xin phep
- runtime-specific orchestration phu thuoc subagent/worktree workflow
