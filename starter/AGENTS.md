# <Tên dự án> — hướng dẫn cho AI agent

> Mẫu từ https://darkend16987.github.io/inno-ai-coding-guide/ — chép vào gốc repo, điền các chỗ `<…>`,
> xoá dòng này. Đây là **nguồn hướng dẫn duy nhất** cho mọi agent: Codex đọc thẳng file này,
> Claude Code đọc qua dòng `@AGENTS.md` trong `CLAUDE.md`. Giữ NGẮN (dưới ~200 dòng): tri thức dài
> để ở `docs/` và chỉ trỏ tới.

Ngôn ngữ giao tiếp & tài liệu: **tiếng Việt**. Commit message: <tiếng Việt có dấu qua `git commit -F` |
tiếng Việt KHÔNG dấu> (chọn một, ghi rõ).

## Quy trình làm việc

Dùng skill **careful-engineering** (pha 0 → 7: đọc, hiểu, kế hoạch, làm, kiểm chứng, ghi sổ, commit, deploy).
- Claude Code: skill đã cài ở `~/.claude/skills/` hoặc `.claude/skills/` của repo.
- Codex / agent khác: đọc `skills/careful-engineering/SKILL.md` (chép thư mục đó từ
  https://github.com/darkend16987/inno-ai-coding-guide vào repo), mở file trong `references/` khi pha
  tương ứng cần.

Tối thiểu bắt buộc, kể cả khi không có skill:
- Không bịa tên hàm / file / lệnh / số liệu — chỉ nói điều đã đọc hoặc đã đo trong phiên. Không chạy
  được cái gì thì nói rõ, đừng bịa lệnh thay thế.
- Được giao "xem / kiểm tra / review" ⇒ chỉ đọc và báo cáo. Yêu cầu mơ hồ thật ⇒ hỏi, kèm phương án khuyến nghị.
- Chạy toàn bộ test trước và sau thay đổi; test mới phải đỏ được; thay đổi giao diện / tích hợp thì
  chạy thử app thật theo `docs/RUNBOOK.md`.
- Mỗi việc một commit; message viết ra file rồi `git commit -F`; kiểm lại tiếng Việt sau khi commit.
- Không push / deploy / xoá dữ liệu / đổi CI khi chưa được yêu cầu. Không commit secret / `.env` / build output.
- Cuối phiên: cập nhật `docs/HANDOFF.md` (đã làm, số đo, chưa kiểm + vì sao, bước kế tiếp).

## Bản đồ repo

| Thư mục / file | Là gì |
|---|---|
| `<src/>` | <…> |
| `<tests/>` | <…> |
| `docs/` | sổ ghi (xem bên dưới) |

## Chạy & test (làm TRƯỚC và SAU mỗi thay đổi)

```bash
<lệnh cài đặt>
<lệnh chạy toàn bộ test>      # xanh = <câu chữ runner in ra khi đạt>
```
Chạy app, biết app đã sẵn sàng, dữ liệu thử, lấy log, dọn dẹp: `docs/RUNBOOK.md`.

## Sổ ghi — mỗi loại thông tin một nơi

| Thông tin | File |
|---|---|
| Phiên này đã làm gì + bước kế tiếp (khối mới nhất ở trên) | `docs/HANDOFF.md` |
| Kế hoạch việc lớn đang làm / đã xong | `docs/plans/active/` → `docs/plans/completed/` |
| Việc còn mở (chờ quyết, chưa rõ, nợ kỹ thuật) | `docs/OPEN-ISSUES.md` |
| Quyết định kiến trúc + đường thoát nếu sai | `docs/DECISIONS.md` |
| Bất biến chống hồi quy + ma trận "đụng gì → test gì" | `docs/REGRESSION-GUARD.md` |
| Cách chạy & quan sát app | `docs/RUNBOOK.md` |

Code, test và git là nguồn sự thật về cái đang chạy; sổ ghi chỉ giữ ý định, lý do, quyết định, trạng thái.

## Luật không được phá

- <BI-1: … (căn cứ: …)>  ← thêm mỗi khi sửa một lỗi có thể tái diễn; chi tiết ở `docs/REGRESSION-GUARD.md`

## Điều dễ vướng (bẫy đã gặp thật)

- <môi trường / công cụ / dữ liệu: triệu chứng → cách tránh>
  ← chỉ thêm dòng đã gây lỗi thật; dòng không còn đúng thì xoá
