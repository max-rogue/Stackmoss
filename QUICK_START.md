# 🚀 Quick Start: Tạo Agent Team cho dự án của bạn

## Bước 1: Install

```bash
npm install -g stackmoss
```

Verify:
```bash
stackmoss --version
# → 0.4.0
```

---

## Bước 2: Tạo Agent Team Config

Mở terminal, `cd` vào thư mục dự án muốn thêm agent team:

```bash
cd E:\MyProject   # ← thay bằng đường dẫn dự án của bạn
stackmoss new my-project
```

### Trả lời 7 câu hỏi (Fast Mode)

| # | Câu hỏi | Ví dụ trả lời |
|:---|:---|:---|
| Q1 | Project name | `my-project` |
| Q2 | One-liner goal | `E-commerce platform for Vietnamese market` |
| Q3 | Tech stack | `Next.js, NestJS, PostgreSQL, Prisma` |
| Q4 | Repo structure | `monorepo` |
| Q5 | Mode | `Fast (7 questions)` |
| Q6 | User type | `Solo dev` hoặc `Team 2-5` |
| Q7 | Project type | `Production` |

### Output (tự động tạo)

```
my-project/
├── team.md                    ← Agent roles & capabilities
├── FEATURES.md                ← Feature tracking
├── NORTH_STAR.md              ← Project vision
├── NON_GOALS.md               ← What NOT to build
├── OPEN_QUESTIONS.md           ← Unresolved decisions
├── README_AGENT_TEAM.md        ← Team documentation
├── stackmoss.config.json       ← Config state machine
│
├── CLAUDE.md                   ← Claude Code root instructions
└── .claude/
    └── rules/
        ├── tl.md               ← Tech Lead rules
        ├── dev.md              ← Developer rules
        ├── qa.md               ← QA rules
        └── ...                 ← More per role
```

---

## Bước 3: Mở trong Claude Code

```bash
# Mở project trong IDE
code .    # VS Code / Cursor

# Hoặc chạy Claude Code trực tiếp
claude    # Claude Code sẽ auto-read CLAUDE.md
```

Claude Code sẽ **tự động đọc** `CLAUDE.md` khi bắt đầu session và biết:
- Team có những role nào
- Mỗi role có capabilities gì
- Budget giới hạn per capability
- Working contract + rules

---

## Bước 4: Test thử

### Test 1: Yêu cầu Claude Code implement feature
Trong Claude Code chat:
```
Tạo feature đăng nhập với Google OAuth. Follow acceptance criteria format trong FEATURES.md.
```

→ Claude Code sẽ check `.claude/rules/dev.md` để biết Developer capabilities và follow team rules.

### Test 2: Yêu cầu review
```
Review code login flow. Check security concerns.
```

→ Claude Code sẽ tham khảo TL-REVIEW capabilities và SEC-SCAN rules.

---

## Compile sang Cursor (thay vì Claude Code)

Edit `stackmoss.config.json`:
```json
{
  "compileTarget": "Cursor"
}
```

Rồi chạy lại:
```bash
stackmoss new my-project
```

Output sẽ là `.cursor/rules/*.mdc` thay vì `.claude/rules/*.md`.

---

## Troubleshooting

| Lỗi | Fix |
|:---|:---|
| `stackmoss: command not found` | `npm install -g stackmoss` |
| Permission denied | Chạy terminal as Admin |
| `ENOENT: no such file or directory` | Chạy `stackmoss new` trong folder trống hoặc project root |
