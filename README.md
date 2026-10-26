# AI Coding Guide — bộ skill & hướng dẫn GitHub cho team

Trang hướng dẫn: **https://darkend16987.github.io/inno-ai-coding-guide/**

Bộ tài liệu cho thành viên team khi làm phần mềm / tool mới với AI agent (Claude Code, OpenAI Codex):

| Thư mục / file | Là gì |
|---|---|
| [`index.html`](index.html) | Trang chủ (GitHub Pages): bắt đầu từ đâu, cài skill, quy trình 8 pha, prompt mẫu, checklist dự án mới, đọc skill |
| [`guides/github-desktop-claude-code-codex.html`](guides/github-desktop-claude-code-codex.html) | Hướng dẫn A–Z: GitHub, GitHub Desktop, VS Code, Claude Code, Codex |
| [`skills/careful-engineering/`](skills/careful-engineering/) | Skill quy trình cho **mọi loại dự án**: chọn mức S/M/L theo rủi ro, 8 pha chống hallucination & regression, cách kiểm chứng theo loại dự án |
| [`skills/inno-aec/`](skills/inno-aec/) | Skill **riêng INNO**: luật nhà, plugin AutoCAD (.NET, LISP, accoreconsole), add-in Revit, tool tính diện tích / khối lượng, dữ liệu dự án – hợp đồng |
| [`skills/caveman/`](skills/caveman/), [`ultracave/`](skills/ultracave/), [`megacave/`](skills/megacave/) | Skill giọng trả lời gọn (bật bằng `/caveman`), chép nguyên văn từ [juliusbrussee/caveman](https://github.com/juliusbrussee/caveman), Apache-2.0 |
| [`starter/`](starter/) | Mẫu `AGENTS.md`, `CLAUDE.md`, `docs/RUNBOOK.md`, `docs/plans/`, `.gitignore` cho repo mới |
| [`install.ps1`](install.ps1) | Cài các skill bằng một lệnh PowerShell |
| [`evals/`](evals/) | Tình huống thử để đo skill có làm agent tốt lên không |

## Cài skill (Windows, PowerShell)

```powershell
irm https://darkend16987.github.io/inno-ai-coding-guide/install.ps1 | iex
```

Cài cả năm skill vào `%USERPROFILE%\.claude\skills\<tên skill>` (bản cũ được sao lưu `.bak-<ngày giờ>`).
Chỉ cài một vài skill: thêm `-Skill careful-engineering,caveman`. Thêm `-GlobalMemory` để chép mẫu hướng
dẫn cá nhân [`starter/global/CLAUDE.md`](starter/global/CLAUDE.md) vào `%USERPROFILE%\.claude\CLAUDE.md`
(chỉ khi file đó chưa có; đã có thì lưu mẫu cạnh nó thành `CLAUDE.inno-guide.md`). Cài cho riêng một repo: chạy tại gốc repo

```powershell
& ([scriptblock]::Create((irm https://darkend16987.github.io/inno-ai-coding-guide/install.ps1))) -Project
```

Kiểm tra: mở phiên Claude Code mới, gõ `/careful-engineering` hoặc `/caveman`.

## Skill careful-engineering gồm gì

- `SKILL.md` — vai trò, 4 nguyên tắc Karpathy, chọn mức S/M/L, luật vàng, quy trình 8 pha (đọc → hiểu →
  kế hoạch → làm → kiểm chứng → ghi sổ → commit → deploy), mỗi pha có phép kiểm.
- `references/` — theo loại dự án · đo trước khi kết luận · gỡ lỗi có hệ thống · subagent & review độc
  lập · lưới test & đột biến · bất biến → hàng rào tự động · mẫu thiết kế ngắn / memo kế hoạch / handoff /
  sổ bất biến / quyết định · commit & deploy · bẫy Windows/Unicode · hỏi & báo cáo · dữ liệu & migration.
- `templates/` — `patch.js` (sửa chuỗi chính xác, tất-cả-hoặc-không) · `mutate.js` (chứng minh test bắt được
  lỗi; tự dừng nếu test trên mã nguyên trạng không xanh).

Nền tảng: [andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) (4 nguyên tắc), cộng
các bài học đã đo được từ dự án thật của team (đã ẩn danh hoá). Phần bất biến (căn cứ, chứng minh hai chiều,
mức bảo vệ), mẫu `RUNBOOK.md`, memo kế hoạch có vòng đời và cách dùng `AGENTS.md` làm nguồn duy nhất phỏng
theo [hoangnb24/repository-harness](https://github.com/hoangnb24/repository-harness) (MIT, © 2025 Hoang Nguyen).

Phần viết lại (không chép nguyên văn) từ các dự án khác, có ghi nguồn ngay trong từng file:

| Nguồn | License | Đã lấy gì | Ở đâu |
|---|---|---|---|
| [obra/superpowers](https://github.com/obra/superpowers) (Jesse Vincent) | MIT | Gỡ lỗi có hệ thống; làm rõ ý định trước khi xây; thiết kế ngắn, giao diện giữa các đợt và "trọng tâm review" trong kế hoạch; giao việc cho subagent, review hai bước, nhận review; câu chữ báo hiệu chưa kiểm; thử skill bằng tình huống có / không có skill | `references/debugging.md`, `review-delegation.md`, pha 1 của `SKILL.md`, `memo-handoff.md` §0 §6b, `measurement.md` §9, `evals/` |
| [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) | MIT | Tự chụp và chấm giao diện ở 3 độ rộng, không bịa số liệu; eval có skill / không skill, người chấm không biết bên nào | `references/project-types.md` §1, `evals/` |
| [google-research/harness2](https://github.com/google-research/harness2) | Apache-2.0 | Bảng 8 thành phần của harness; vòng đề xuất → chạy thử → chỉ giữ bài học có bằng chứng | trang (mục 3 lớp), `evals/README.md` |

Không cài các dự án trên song song với `careful-engineering`; taste-skill là skill ngoài tuỳ chọn cho trang
web công khai — xem mục "Skill ngoài" trên trang.

## Đo chất lượng skill

[`evals/`](evals/) chứa tình huống thử cho `careful-engineering` và `inno-aec`, cách chạy (có skill / không
skill, chấm theo danh sách "phải có / không được") và [`RESULTS.md`](evals/RESULTS.md). Sửa luật của skill ⇒
kèm số đo trước / sau. Thư mục này không được lệnh cài chép về máy.

## Starter cho repo mới

| File | Là gì |
|---|---|
| [`starter/AGENTS.md`](starter/AGENTS.md) | Hướng dẫn chung cho mọi agent — nguồn duy nhất, Codex đọc trực tiếp |
| [`starter/CLAUDE.md`](starter/CLAUDE.md) | Chỉ có `@AGENTS.md` để Claude Code nhập cùng nội dung (Claude Code không tự đọc `AGENTS.md` khi repo có `CLAUDE.md`) |
| [`starter/docs/RUNBOOK.md`](starter/docs/RUNBOOK.md) | Cách chạy, biết app đã sẵn sàng, dữ liệu thử, lấy log, dọn dẹp — để AI tự kiểm trên app thật |
| [`starter/docs/plans/`](starter/docs/plans/) | Kế hoạch việc lớn: `active/` → `completed/` |
| [`starter/.gitignore`](starter/.gitignore) | `.gitignore` cơ bản |
| [`starter/global/CLAUDE.md`](starter/global/CLAUDE.md) | Hướng dẫn chung cá nhân, đặt ở `%USERPROFILE%\.claude\CLAUDE.md` (Codex: `%USERPROFILE%\.codex\AGENTS.md`) |

## Ba lớp hướng dẫn

| Lớp | Ở đâu | Chứa gì |
|---|---|---|
| 1 · Cá nhân | `~/.claude/CLAUDE.md` + skill `careful-engineering`, `caveman` | Sở thích chung, quy trình đúng cho mọi dự án |
| 2 · Công ty | skill `inno-aec` | Luật INNO, kiến thức CAD/BIM, tính toán, dữ liệu hợp đồng |
| 3 · Repo | `AGENTS.md` (+ `CLAUDE.md` chỉ `@AGENTS.md`), `docs/` | Bản đồ repo, lệnh test, host & phiên bản, luật không được phá |

Mâu thuẫn ⇒ `AGENTS.md` của repo > `inno-aec` > `careful-engineering` > CLAUDE.md cá nhân.

## Skill caveman

Giọng trả lời: kết quả trước, bỏ chữ thừa, giữ nguyên code / lệnh / số / lỗi. Chỉ đổi cách viết trong chat;
code, commit, memo vẫn viết bình thường nên dùng chung với careful-engineering được. Bật `/caveman`
(hoặc `/ultracave` để gọn hơn nữa), tắt bằng `stop caveman`. Số đo của chính tác giả: `caveman` chỉ ngắn hơn
lệnh "Answer concisely." ~3% (trong sai số), `ultracave` ~35%. Lợi ích chính là dễ đọc, không phải tiết kiệm.
Bộ cài chỉ chép `SKILL.md`, không cài hook / proxy của dự án gốc. Cập nhật: chép lại từ upstream, sửa commit
trong `NOTICE` của từng thư mục.

## Đóng góp

Pull Request vào `skills/careful-engineering/references/`. Mỗi bài học: chuyện đã xảy ra (có số đo) → luật →
cách áp dụng. Đổi luật của skill ⇒ thêm / chạy tình huống trong `evals/` theo [`evals/README.md`](evals/README.md). **Không** đưa số liệu, tên khách hàng, mật khẩu hay dữ liệu nội bộ vào repo này — repo public.
