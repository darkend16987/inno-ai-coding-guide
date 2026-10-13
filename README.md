# AI Coding Guide — bộ skill & hướng dẫn GitHub cho team

Trang hướng dẫn: **https://darkend16987.github.io/inno-ai-coding-guide/**

Bộ tài liệu cho thành viên team khi làm phần mềm / tool mới với AI agent (Claude Code, OpenAI Codex):

| Thư mục / file | Là gì |
|---|---|
| [`index.html`](index.html) | Trang chủ (GitHub Pages): bắt đầu từ đâu, cài skill, quy trình 8 pha, prompt mẫu, checklist dự án mới, đọc skill |
| [`guides/github-desktop-claude-code-codex.html`](guides/github-desktop-claude-code-codex.html) | Hướng dẫn A–Z: GitHub, GitHub Desktop, VS Code, Claude Code, Codex |
| [`skills/careful-engineering/`](skills/careful-engineering/) | Skill cho Claude Code: quy trình làm việc chống hallucination & regression |
| [`starter/`](starter/) | Mẫu `CLAUDE.md`, `AGENTS.md`, `.gitignore` cho repo mới |
| [`install.ps1`](install.ps1) | Cài skill bằng một lệnh PowerShell |

## Cài skill (Windows, PowerShell)

```powershell
irm https://darkend16987.github.io/inno-ai-coding-guide/install.ps1 | iex
```

Cài vào `%USERPROFILE%\.claude\skills\careful-engineering` (bản cũ được sao lưu `.bak-<ngày giờ>`).
Cài cho riêng một repo: chạy tại gốc repo

```powershell
& ([scriptblock]::Create((irm https://darkend16987.github.io/inno-ai-coding-guide/install.ps1))) -Project
```

Kiểm tra: mở phiên Claude Code mới, gõ `/careful-engineering`.

## Skill careful-engineering gồm gì

- `SKILL.md` — vai trò, 4 nguyên tắc Karpathy, luật vàng, quy trình 8 pha (đọc → hiểu → kế hoạch → làm →
  kiểm chứng → ghi sổ → commit → deploy), mỗi pha có phép kiểm.
- `references/` — đo trước khi kết luận · lưới test & đột biến · mẫu memo/handoff/sổ bất biến · commit &
  deploy · bẫy Windows/Unicode · hỏi & báo cáo · dữ liệu & migration.
- `templates/` — `patch.js` (sửa chuỗi chính xác, tất-cả-hoặc-không) · `mutate.js` (chứng minh test bắt được lỗi).

Nền tảng: [andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) (4 nguyên tắc), cộng
các bài học đã đo được từ dự án thật của team (đã ẩn danh hoá).

## Đóng góp

Pull Request vào `skills/careful-engineering/references/`. Mỗi bài học: chuyện đã xảy ra (có số đo) → luật →
cách áp dụng. **Không** đưa số liệu, tên khách hàng, mật khẩu hay dữ liệu nội bộ vào repo này — repo public.
