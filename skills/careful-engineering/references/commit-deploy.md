# Commit, push, deploy

## 1. Trước khi commit

- Lưới test xanh **sau** thay đổi (số đúng câu chữ của runner); probe đã chạy cho phần cần probe.
- `git status --short` — chỉ những file thuộc việc này. Stage **từng file đích danh**; không
  `git add -A` / `git add .` mù. Không commit: build output (`dist/`, `out/`), `node_modules/`,
  file bí mật (`.env`, key, file mật khẩu), file tạm / scratch / `.bak`.
- File generated nằm trong git (SQL sinh từ script, bundle…) ⇒ **chạy lại generator** rồi xem
  `git status`: file sinh ra phải khớp generator (đã có lần file trong git lệch generator 2 ngày
  mà không ai thấy vì lệnh regen sinh lại trước khi chạy).
- Một commit = một việc. Đổi hành vi và di chuyển/refactor ⇒ hai commit.

## 2. Thông điệp commit

### Quy ước ngôn ngữ — THEO REPO
Đọc `AGENTS.md` / `CLAUDE.md` của repo trước. Hai quy ước đang dùng thực tế:
- **Tiếng Việt có dấu** (ví dụ một app desktop Electron) — được, NHƯNG chỉ qua `git commit -F <file>`.
- **Tiếng Việt KHÔNG dấu** (ví dụ một dự án ETL + CSDL: *"Commit message không dùng dấu (tránh vỡ
  encoding khi qua PowerShell)"*). Tài liệu và comment vẫn có dấu; chỉ commit message không dấu.
Không có quy ước ⇒ hỏi một lần, hoặc theo `git log` gần nhất của repo.

### Cách ghi an toàn (cả hai quy ước)
1. Viết message ra **file** trong scratchpad bằng công cụ Write (UTF-8 không BOM). Không dùng
   `-m "..."` cho message dài / có dấu / có ngoặc kép / backtick — PowerShell 5.1 here-string
   có `"` làm vỡ `git commit -m`; heredoc Bash nuốt `\` và vấp backtick.
2. `git commit -F <file>`.
3. **Kiểm lại**: `git log -1 --format=%B` — không có `â€`, `Ã`, `�`, `\x08`; dấu tiếng Việt
   hiển thị đúng. Sai ⇒ `git commit --amend -F <file>` **trước khi push** (sau khi push thì không amend).

### Cấu trúc
```
<type>(<scope>): <làm gì> — <chi tiết then chốt / mã bất biến>

<Nguyên nhân: lỗi gì, tái hiện thế nào, số đo trước khi sửa.>

- <file/hàm>: <thay đổi gì, vì sao>
- <test mới>: <bao nhiêu ý>, <N/M đột biến đỏ>

Kiểm chứng: <lưới test N/N>, <probe app thật X/Y, mã cũ đỏ Z>, <số đo trước → sau>.
<Chưa kiểm / không đổi: "Khong doi CSDL, khong migration" / "chua test tay EN"...>

Co-Authored-By: <theo hướng dẫn attribution của phiên>
```
- `type`: `feat` / `fix` / `docs` / `test` / `refactor` / `chore` / `release`; `scope` = module
  (không dấu, gạch nối: `hop-dong`, `edit-text`).
- Tiêu đề ≤ ~100 ký tự; nêu mã bất biến / mã việc (`BI-12`, `W7`, `RR-3`).
- Thân phải đủ để người khác **không cần đọc diff** cũng biết: vì sao, đổi gì, chứng minh thế nào,
  cái gì **chưa** chứng minh.
- Kết quả deploy ghi bằng một commit `docs:` riêng sau khi deploy xong (id deployment ACTIVE, dòng
  log quan trọng, health check).

## 3. Push

- Chỉ push khi người dùng bảo, hoặc có phép đứng đã ghi (memory / CLAUDE.md). Repo mà
  **push = deploy production** (`deploy_on_push`) ⇒ nói rõ "push này kích hoạt deploy" trước.
- Không force-push nhánh chung; không amend commit đã push; không `--no-verify`.
- Sau push: dòng `abc..def branch -> branch` trong output; `git status` sạch.
- Không chạy đổi dependency hàng loạt (`npm audit fix`) ngay trước bàn giao khi push = deploy.

## 4. Deploy / phát hành

Theo checklist của repo (skill `/deploy`, runbook trong `docs/`). Khung chung:
1. **Cổng**: toàn bộ test xanh; artefact phụ thuộc (sidecar, bundle, migration) **tươi** theo
   đúng commit (marker / hash), không theo mtime.
2. **Bump version** (lớn hơn mọi bản đã phát hành — OTA chỉ nâng cấp lên số lớn hơn).
3. **Tài liệu**: ghi chú vX.Y.Z đầu HANDOFF; README / hướng dẫn người dùng nếu tính năng người dùng
   thấy thay đổi. Không bịa thay đổi — liệt kê từ `git log <bản trước>..HEAD`.
4. Commit release, push, **kiểm lại cổng** trên HEAD mới.
5. **Build dài ⇒ chạy nền**, ghi log ra file, chờ thông báo. Build bị kill để lại artefact trông
   như thật (bộ cài 325 KB). **Kiểm trên đĩa**: đủ file, kích thước hợp lý, `version` đúng trong
   manifest, artefact con (sidecar trong bộ cài) giống byte bản đã thử.
6. **Thử chính artefact** sẽ phát hành (chạy exe, gọi endpoint đã đổi) — không chỉ mã nguồn.
7. Phát hành đúng nơi (repo release / registry / app platform), đủ asset. Xoá bản cũ **chỉ** theo
   checklist (thường chỉ một bản liền trước).
8. **Đo sau deploy**: release list có bản mới là Latest đủ asset; deployment ACTIVE; log migration
   (`đã áp N · chờ M` → `MIGRATE OK`); health check. "Healthy" / "đã push" ≠ "dùng được" / "đã xác nhận".
9. Báo cáo: version, test, artefact đã build lại chưa, file đính kèm, bản đã xoá, URL, phần chưa kiểm.

## 5. Production: chỉ-đọc, xin phép, dọn và liệt kê lại

- Đọc production ⇒ bọc `BEGIN READ ONLY … ROLLBACK`; mở IP tạm phải xin phép; gỡ xong **liệt kê
  lại** để chắc, đừng tin dòng "đã gỡ".
- Không in secret ra màn hình / log; công cụ kiểm chuỗi kết nối chỉ báo **độ dài**, không báo giá trị.
  Secret đã lộ ⇒ phải **xoay** (rotate), sửa biến môi trường là chưa đủ.
- Lệnh thay thế cả cấu hình (`apps update --spec`, `firewalls replace`) ⇒ tránh; dùng lệnh nối thêm.
