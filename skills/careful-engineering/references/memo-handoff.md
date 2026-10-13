# Memo, sổ ghi, handoff — mẫu dùng ngay

Nguyên tắc: **mỗi loại thông tin có đúng một nơi ở**. Tìm nơi đó trong `CLAUDE.md` của repo trước
khi tạo file mới. Bảng dưới là cách hai repo đang làm; repo chưa có thì đề xuất theo bảng này.

| Thông tin | Nơi ở (ví dụ) |
|---|---|
| Phiên này đã làm gì, bước kế tiếp | `HANDOFF.md` / `docs/04_BAN_GIAO_PHIEN.md` (khối mới nhất ở TRÊN) |
| Việc còn mở: chờ quyết, chưa rõ nghĩa, chờ dữ liệu, mâu thuẫn, nợ kỹ thuật | `docs/11_SO_VIEC_DANG_MO.md` |
| Quyết định kiến trúc + đường thoát | `docs/01_SO_QUYET_DINH.md` |
| Câu trả lời của chủ dự án + diễn giải | `docs/03_TRA_LOI_…md` |
| Bất biến / luật chống hồi quy + ma trận test | `docs/REGRESSION-GUARD.md` |
| Bẫy mới gặp (môi trường, công cụ) | `CLAUDE.md` mục "Điều dễ vướng" + memory |
| Kế hoạch / nghiên cứu của một đợt lớn | `docs/RESEARCH-…`, `docs/REVIEW-…` (có dòng trạng thái ở đầu) |

Mọi dòng mang **mã truy được**: `BI-*` bất biến, `RR-*` rủi ro, `QĐ-*` quyết định, `W*` luật dữ liệu,
`C*`/`PB-*` câu hỏi, `P1…P8` / `Đợt A` hạng mục kế hoạch. Mục đã đóng: **gạch ngang + 🟢 ngày**, không xoá.

## 1. Memo kế hoạch (trước khi làm việc lớn)

```markdown
# <Tên việc> — kế hoạch (YYYY-MM-DD)
> Trạng thái: <chưa làm / Đợt 1 xong (commit) / …>  ← cập nhật mỗi đợt

## 1. Hiện trạng (đã kiểm — kèm file:dòng hoặc lệnh)
## 2. Vấn đề / yêu cầu, tiêu chí thành công đo được
## 3. Phương án (khuyến nghị + vì sao loại phương án khác)
## 4. Rủi ro & cái tuyệt đối không được đổi (bất biến liên quan: BI-…)
## 5. Kế hoạch theo đợt
| Đợt | Việc | File chạm | Verify | Trạng thái |
## 6. Câu hỏi cần chủ dự án chốt (nếu có)
```

## 2. Mục sổ bất biến (sau mỗi sửa lỗi / luật mới)

```markdown
### BI-<n> · <luật một câu, khẳng định>
- <file> `<hàm>`: <cơ chế bảo vệ>. Lưới: `<lệnh test>` (<số ý>, <N/M đột biến đỏ>).
- **Lỗi cũ:** <triệu chứng, cách tái hiện, số đo trước khi sửa>.
- **Luật:** <điều kiện phải giữ; ngoại lệ; vì sao>.
- E2E (<ngày>, <môi trường thật>): <X/Y> — <các số đo then chốt>; cùng probe trên mã cũ: <đỏ Z>.
- **Vỡ khi:** <người dùng thấy gì nếu luật bị phá>.
```
Kèm **một dòng ma trận** "đụng gì → test gì": `| <hàm/file> | BI-<n> · <lệnh test> · test tay: <các bước bấm> |`.
Sửa một mục cũ bị thay thế ⇒ ghi chú "*(đã sửa ở BI-<m>)*", đừng xoá lịch sử.

## 3. Mục sổ quyết định

```markdown
### QĐ-<x> · <tiêu đề>
Ngày · Người quyết · Trạng thái (ĐỀ XUẤT / ĐÃ CHỐT / ĐÃ THU HỒI)
- **Bối cảnh:** …
- **Quyết định:** …
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
