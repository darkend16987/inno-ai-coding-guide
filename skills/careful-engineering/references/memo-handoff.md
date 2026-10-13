# Memo, sổ ghi, handoff — mẫu dùng ngay

Nguyên tắc: **mỗi loại thông tin có đúng một nơi ở**. Tìm nơi đó trong `AGENTS.md` / `CLAUDE.md` của
repo trước khi tạo file mới. Repo đã đặt tên khác (ví dụ `docs/04_BAN_GIAO_PHIEN.md`) ⇒ theo repo,
đừng đổi tên. Repo chưa có ⇒ dùng tên mặc định dưới đây (khớp bộ `starter/` của guide).

| Thông tin | Nơi ở mặc định |
|---|---|
| Phiên này đã làm gì, bước kế tiếp | `docs/HANDOFF.md` (khối mới nhất ở TRÊN) |
| Việc còn mở: chờ quyết, chưa rõ nghĩa, chờ dữ liệu, mâu thuẫn, nợ kỹ thuật | `docs/OPEN-ISSUES.md` |
| Quyết định kiến trúc + đường thoát | `docs/DECISIONS.md` |
| Câu trả lời của chủ dự án + diễn giải | `docs/OWNER-ANSWERS.md` |
| Bất biến / luật chống hồi quy + ma trận test | `docs/REGRESSION-GUARD.md` |
| Cách chạy app, biết app đã sẵn sàng, lấy log, dọn dẹp | `docs/RUNBOOK.md` |
| Kế hoạch của một việc lớn | `docs/plans/active/` → xong thì chuyển sang `docs/plans/completed/` |
| Bẫy mới gặp (môi trường, công cụ) | `AGENTS.md` mục "Điều dễ vướng" + memory |

Code, test và lịch sử git là nguồn sự thật về **cái đang chạy**. Sổ ghi chỉ giữ cái code không nói
được: ý định, lý do, quyết định, trạng thái. Trỏ tới file/dòng, đừng chép lại nội dung code vào sổ —
bản chép sẽ lệch.

Mọi dòng mang **mã truy được**: `BI-*` bất biến, `RR-*` rủi ro, `QĐ-*` quyết định, `W*` luật dữ liệu,
`C*`/`PB-*` câu hỏi, `P1…P8` / `Đợt A` hạng mục kế hoạch. Mục đã đóng: **gạch ngang + 🟢 ngày**, không xoá.

## 1. Memo kế hoạch (trước khi làm việc lớn)

Viết khi việc kéo dài nhiều đợt / nhiều phiên, chạm dữ liệu hoặc schema, hoặc chủ dự án cần duyệt
trước. Việc một commit thì kế hoạch trong chat là đủ. File: `docs/plans/active/YYYY-MM-DD-<ten-viec>.md`.

```markdown
# <Tên việc> — kế hoạch
Ngày tạo: YYYY-MM-DD
> **Trạng thái:** ĐANG LÀM | TẠM DỪNG — chờ <ai / cái gì> | XONG — <commit>   ← cập nhật mỗi đợt

## 1. Kết quả cần đạt (đo được)
## 2. Hiện trạng (đã kiểm — file:dòng, lệnh, số đo; ghi riêng tiền đề lấy từ tài liệu chưa kiểm)
## 3. Phạm vi
- Làm: …
- **Không làm:** … (thấy thêm việc ⇒ ghi vào sổ việc mở, không gộp vào đây)
- **Không được đổi:** … (bất biến BI-… liên quan)
## 4. Phương án (khuyến nghị + vì sao loại phương án khác)
<Bằng chứng mới làm đổi phương án ⇒ sửa mục này, ghi ngày và lý do; không viết tiếp như chưa có gì.>
## 5. Rủi ro & đường lùi
| Rủi ro | Cách phòng | Nếu xảy ra thì lùi thế nào (revert commit / migration ngược / bật lại đường cũ) |
## 6. Kế hoạch theo đợt
| Đợt | Việc | File chạm | Verify | ☐/☑ + commit |
## 7. Quyết định trong lúc làm
- YYYY-MM-DD: <quyết định nhỏ> — vì <lý do>.
## 8. Kiểm chứng
- Tập trung: <test mới, đột biến N/M>
- App thật / tích hợp: <probe theo docs/RUNBOOK.md, số đo, baseline mã cũ>
- Bắt buộc của repo: <toàn bộ lưới test, lint, build>
## 9. Câu hỏi cần chủ dự án chốt (nếu có)
## 10. Kết quả (điền khi xong)
<Đạt gì (số đo), giới hạn còn lại, việc để lại (đã ghi vào sổ việc mở)>
```

Đóng memo: điền §10, đổi trạng thái thành XONG, `git mv` sang `docs/plans/completed/` trong commit
cuối của việc. **Trước khi đóng**, chuyển những gì sống lâu hơn việc này ra sổ chính: quyết định ở §7
còn hiệu lực ⇒ `QĐ-*`; luật mới ⇒ `BI-*`; việc để lại ⇒ sổ việc mở. Thư mục `completed/` ít ai đọc.
Memo TẠM DỪNG phải ghi đang chờ ai, chờ cái gì — "tạm dừng" trống trơn là memo chết.

## 2. Mục sổ bất biến (sau mỗi sửa lỗi / luật mới)

```markdown
### BI-<n> · <luật một câu, khẳng định>
- **Căn cứ:** <QĐ-x / lỗi đã tái hiện ngày … / câu trả lời C… đã xác nhận / spec> <(tôi tự đặt, chờ duyệt)?>
- **Phạm vi:** <file / module / bảng>. Ngoại lệ: <chỉ ngoại lệ căn cứ cho phép | không có>.
- **Lỗi cũ:** <triệu chứng, cách tái hiện, số đo trước khi sửa>.
- **Luật:** <điều kiện phải giữ; vì sao>.
- **Hàng rào:** <file> `<hàm/test>` trong `<lệnh test>`; khi đỏ in "<thông báo>". Chứng minh: ca hợp lệ
  xanh, <N/M đột biến đỏ> (gồm đưa lỗi gốc trở lại). Chưa tự động được ⇒ `test tay — <các bước>`.
- **Mức bảo vệ:** chạy tay <đã chạy, N/N> · hook <có/không> · CI <workflow gọi lệnh: có/không/chưa kiểm>
  · chặn merge <đã xem / chưa kiểm>.
- E2E (<ngày>, <môi trường thật>): <X/Y> — <các số đo then chốt>; cùng probe trên mã cũ: <đỏ Z>.
- **Vỡ khi:** <người dùng thấy gì nếu luật bị phá>.
```
Kèm **một dòng ma trận** "đụng gì → test gì": `| <hàm/file> | BI-<n> · <lệnh test> · test tay: <các bước bấm> |`.
Sửa một mục cũ bị thay thế ⇒ ghi chú "*(đã sửa ở BI-<m>)*", đừng xoá lịch sử. Cách biến luật thành
check tự động và chứng minh nó: [invariants.md](invariants.md).

## 3. Mục sổ quyết định

```markdown
### QĐ-<x> · <tiêu đề>
Ngày · Người quyết · Trạng thái (ĐỀ XUẤT / ĐÃ CHỐT / BỊ BÁC / THAY BẰNG QĐ-y)
- **Bối cảnh:** …
- **Quyết định:** …
- **Phương án đã cân nhắc:** … (vì sao không chọn — để phiên sau khỏi đề xuất lại)
- **Lý do:** … (số đo)
- **Hệ quả lên schema / mã:** …
- **Đường thoát nếu sai:** … (bắt buộc — ví dụ "một cột và một câu UPDATE")
```
Luật tự đặt mà chưa hỏi chủ dự án ⇒ ghi rõ **"(tôi tự đặt, chờ anh duyệt)"** để phiên sau đảo được.

## 4. Câu trả lời của chủ dự án (trước khi chạm DDL / logic theo câu trả lời đó)

```markdown
**<Mã câu hỏi>**
- Anh <tên> trả lời: "<nguyên văn>"
- Tôi hiểu là: … (*Không* hiểu là: …)
- Tác động: <DDL / mã / dữ liệu>
- Trạng thái: CHỜ ANH XÁC NHẬN DIỄN GIẢI | ĐÃ XÁC NHẬN <ngày>
```
Không đổi DDL / logic khi trạng thái còn **CHỜ XÁC NHẬN**. Câu trả lời của phòng ban ≠ chủ dự án đã
xác nhận diễn giải.

## 5. Khối handoff (cuối mỗi phiên / mỗi đợt — khối mới nhất ở TRÊN CÙNG)

```markdown
> 🟢/🟡/🔴 **<ngày> · <tiêu đề phiên>** — đọc kèm <docs/§…>
> - **Đã làm:** <việc + commit hash + số đo>
> - **Nghiệm thu:** <test N/N, probe X/Y, đột biến, so dữ liệu>
> - **Trạng thái git / deploy:** <đã push tới <hash> / chưa push>; <deployment id ACTIVE, dòng log>
> - 🟠 **Chưa kiểm:** <cái gì chưa đo, nói rõ để không ai tưởng đã có>
> - 🔴 **Việc của anh:** <duyệt push / cho phép đọc production / trả lời câu C…>
> - **Bước kế tiếp:** 1. … 2. …
> - **Một quyết định tôi tự làm — phiên sau đảo được:** …
> - **Lỗi của chính tôi trong phiên:** … (và luật rút ra)
> - **Cảnh báo đúng thiết kế (đừng sửa):** <ví dụ "0024 ĐÃ TỒN TẠI và KHÁC bản sinh">
```
Bị bỏ qua một phiên ⇒ ghi thẳng "⚠️ File này bị bỏ qua một phiên" thay vì bịa lại.

## 6. Memory (nếu harness có memory theo file)

- Ghi điều **không suy ra được từ repo**: quyết định / sở thích của chủ dự án, bẫy môi trường đã đo,
  trạng thái push / phát hành, lý do "đừng đề xuất lại X".
- Không ghi cái repo đã ghi (cấu trúc mã, lịch sử git, nội dung CLAUDE.md).
- Mỗi file một sự thật, có `Why:` và `How to apply:`; cập nhật file cũ thay vì tạo bản trùng; xoá
  memory đã sai. Đổi ngày tương đối thành ngày tuyệt đối.
- Memory là ảnh chụp quá khứ: tên file/hàm/cờ trong memory phải kiểm còn tồn tại trước khi dựa vào.
