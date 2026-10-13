# AI Coding Guide — bộ skill & hướng dẫn GitHub cho team

Trang hướng dẫn: **https://darkend16987.github.io/inno-ai-coding-guide/**

Bộ tài liệu cho thành viên team khi làm phần mềm / tool mới với AI agent (Claude Code, OpenAI Codex):

| Thư mục / file | Là gì |
|---|---|
| [`index.html`](index.html) | Trang chủ (GitHub Pages): bắt đầu từ đâu, cài skill, quy trình 8 pha, prompt mẫu, checklist dự án mới, đọc skill |
| [`guides/github-desktop-claude-code-codex.html`](guides/github-desktop-claude-code-codex.html) | Hướng dẫn A–Z: GitHub, GitHub Desktop, VS Code, Claude Code, Codex |
| [`skills/careful-engineering/`](skills/careful-engineering/) | Skill cho Claude Code: quy trình làm việc chống hallucination & regression |
| [`skills/caveman/`](skills/caveman/), [`ultracave/`](skills/ultracave/), [`megacave/`](skills/megacave/) | Skill giọng trả lời gọn (bật bằng `/caveman`), chép nguyên văn từ [juliusbrussee/caveman](https://github.com/juliusbrussee/caveman), Apache-2.0 |
| [`starter/`](starter/) | Mẫu `AGENTS.md`, `CLAUDE.md`, `docs/RUNBOOK.md`, `docs/plans/`, `.gitignore` cho repo mới |
| [`install.ps1`](install.ps1) | Cài các skill bằng một lệnh PowerShell |

## Cài skill (Windows, PowerShell)

```powershell
irm https://darkend16987.github.io/inno-ai-coding-guide/install.ps1 | iex
```

Cài cả bốn skill vào `%USERPROFILE%\.claude\skills\<tên skill>` (bản cũ được sao lưu `.bak-<ngày giờ>`).
Chỉ cài một vài skill: thêm `-Skill careful-engineering,caveman`. Cài cho riêng một repo: chạy tại gốc repo

```powershell
& ([scriptblock]::Create((irm https://darkend16987.github.io/inno-ai-coding-guide/install.ps1))) -Project
```

Kiểm tra: mở phiên Claude Code mới, gõ `/careful-engineering` hoặc `/caveman`.

## Skill careful-engineering gồm gì

- `SKILL.md` — vai trò, 4 nguyên tắc Karpathy, luật vàng, quy trình 8 pha (đọc → hiểu → kế hoạch → làm →
  kiểm chứng → ghi sổ → commit → deploy), mỗi pha có phép kiểm.
- `references/` — đo trước khi kết luận · lưới test & đột biến · bất biến → hàng rào tự động · mẫu
  memo kế hoạch/handoff/sổ bất biến/quyết định · commit & deploy · bẫy Windows/Unicode · hỏi & báo cáo ·
  dữ liệu & migration.
- `templates/` — `patch.js` (sửa chuỗi chính xác, tất-cả-hoặc-không) · `mutate.js` (chứng minh test bắt được
  lỗi; tự dừng nếu test trên mã nguyên trạng không xanh).

Nền tảng: [andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) (4 nguyên tắc), cộng
các bài học đã đo được từ dự án thật của team (đã ẩn danh hoá). Phần bất biến (căn cứ, chứng minh hai chiều,
mức bảo vệ), mẫu `RUNBOOK.md`, memo kế hoạch có vòng đời và cách dùng `AGENTS.md` làm nguồn duy nhất phỏng
theo [hoangnb24/repository-harness](https://github.com/hoangnb24/repository-harness) (MIT, © 2025 Hoang Nguyen).

## Starter cho repo mới

| File | Là gì |
|---|---|
| [`starter/AGENTS.md`](starter/AGENTS.md) | Hướng dẫn chung cho mọi agent — nguồn duy nhất, Codex đọc trực tiếp |
| [`starter/CLAUDE.md`](starter/CLAUDE.md) | Chỉ có `@AGENTS.md` để Claude Code nhập cùng nội dung (Claude Code không tự đọc `AGENTS.md` khi repo có `CLAUDE.md`) |
| [`starter/docs/RUNBOOK.md`](starter/docs/RUNBOOK.md) | Cách chạy, biết app đã sẵn sàng, dữ liệu thử, lấy log, dọn dẹp — để AI tự kiểm trên app thật |
| [`starter/docs/plans/`](starter/docs/plans/) | Kế hoạch việc lớn: `active/` → `completed/` |
| [`starter/.gitignore`](starter/.gitignore) | `.gitignore` cơ bản |

## Skill caveman

Giọng trả lời: kết quả trước, bỏ chữ thừa, giữ nguyên code / lệnh / số / lỗi. Chỉ đổi cách viết trong chat;
code, commit, memo vẫn viết bình thường nên dùng chung với careful-engineering được. Bật `/caveman`
(hoặc `/ultracave` để gọn hơn nữa), tắt bằng `stop caveman`. Số đo của chính tác giả: `caveman` chỉ ngắn hơn
lệnh "Answer concisely." ~3% (trong sai số), `ultracave` ~35%. Lợi ích chính là dễ đọc, không phải tiết kiệm.
Bộ cài chỉ chép `SKILL.md`, không cài hook / proxy của dự án gốc. Cập nhật: chép lại từ upstream, sửa commit
trong `NOTICE` của từng thư mục.

## Đóng góp

Pull Request vào `skills/careful-engineering/references/`. Mỗi bài học: chuyện đã xảy ra (có số đo) → luật →
cách áp dụng. **Không** đưa số liệu, tên khách hàng, mật khẩu hay dữ liệu nội bộ vào repo này — repo public.
