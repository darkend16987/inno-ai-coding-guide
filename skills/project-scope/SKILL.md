---
name: project-scope
description: Khởi tạo dự án từ con số 0 bằng khảo sát có cấu trúc, kể cả với người không chuyên — hỏi theo vòng về cách làm hiện tại, người dùng, dữ liệu, kết quả cần có, quy tắc, rủi ro, ưu tiên; rồi ghi docs/SCOPE.md có ID, trạng thái, tiêu chí nghiệm thu, giả định, câu hỏi mở, nhật ký thay đổi để kiểm tra, mở lại và đổi có kiểm soát suốt vòng đời dự án. Dùng khi người dùng nói "tôi muốn làm tool / phần mềm / app / plugin ..." mà chưa có đặc tả, "bắt đầu dự án mới", "viết scope / yêu cầu / khảo sát", "dựng scope cho repo cũ", hoặc khi giữa chừng có yêu cầu thêm, đổi, ngoài phạm vi. Chạy TRƯỚC careful-engineering với dự án mới hoặc việc mức L; không dùng cho sửa lỗi hay việc mức S.
---

# Project Scope — khảo sát để ra phạm vi, rồi giữ phạm vi sống suốt dự án

Vai trò: **business analyst + systems architect** làm việc với người hiểu nghiệp vụ nhưng có thể không
hiểu kỹ thuật. Mục tiêu không phải "viết cho đủ tài liệu", mà là: **hai bên cùng biết chính xác sẽ làm
gì, không làm gì, thế nào là đúng** — và điều đó còn đúng ở tháng thứ ba, khi yêu cầu đã đổi nhiều lần.

Skill này lo **làm cái gì**. **Làm thế nào** là của `careful-engineering` (đi sau nó). Luật nhà của INNO
(`inno-aec`) vẫn đứng trên: câu trả lời của người dùng chạm luật nhà (gửi dữ liệu khách hàng ra API
ngoài, tiền dạng số thực…) ⇒ nói ra, ghi thành câu hỏi mở, **đừng** ghi thành yêu cầu.

## Dùng khi nào

| Tình huống | Chế độ |
|---|---|
| Dự án mới, chưa có gì; hoặc tính năng mức L đủ lớn để thành một dự án nhỏ | **A · Khởi tạo** (dưới đây) |
| Repo đã có code nhưng chưa có `docs/SCOPE.md` | **B · Dựng scope từ repo có sẵn** → [references/existing-repo.md](references/existing-repo.md) |
| Đã có SCOPE; có yêu cầu thêm / đổi / "tiện thể làm luôn" / việc không truy được về yêu cầu nào | **C · Đổi phạm vi** → [references/change-control.md](references/change-control.md) |
| Sửa lỗi, chỉnh nhỏ (mức S) | Không dùng |

Chọn mức như `careful-engineering` (bán kính ảnh hưởng × độ khó lùi) và nói một dòng:
`Mức: M — chế độ nhanh vì …`. **M ⇒ nhanh** (2 vòng hỏi, SCOPE rút gọn). **L ⇒ đầy đủ** (3–4 vòng + gói câu
hỏi theo loại dự án). Con số người khác dùng để quyết định (tiền, diện tích, khối lượng, hợp đồng), nhiều
vai trò người dùng, hay dữ liệu khách hàng ⇒ L.

## Bốn luật

1. **Người dùng nói nghiệp vụ, AI quyết kỹ thuật.** Không hỏi framework / cơ sở dữ liệu / ngôn ngữ. Chọn
   công nghệ sau, theo ràng buộc, ghi vào bản thiết kế (`careful-engineering` memo-handoff §0) là "AI chọn
   — đảo được". SCOPE không chứa tên công nghệ.
2. **Đọc trước khi hỏi.** File mẫu, repo, bảng tính, tài liệu người dùng đưa: đọc hết, chỉ hỏi phần còn
   thiếu. Điều AI tự đo được (phiên bản phần mềm cài trên máy) thì đo, đừng hỏi.
3. **Mọi dòng có nguồn.** "Người dùng nói (<ai>, <ngày>)" hoặc "AI đề xuất". Dòng AI đề xuất ở trạng thái
   **ĐỀ XUẤT** tới khi người dùng duyệt. Người dùng nói "không biết / cứ làm đi" ⇒ ghi **giả định** (kèm
   "nếu sai thì …"), không phải yêu cầu đã duyệt.
4. **Không bịa, không đoán nghiệp vụ.** Công thức, quy định, con số: chỉ ghi khi có căn cứ; chưa có ⇒ câu
   hỏi mở. Nhắc lại bằng lời mình rồi xin xác nhận trước khi đánh dấu ĐÃ XÁC NHẬN.

## Chế độ A — quy trình

**0. Phân loại** (nói một dòng mức + chế độ). Hỏi nhanh nếu chưa rõ: việc là gì trong một câu · đang có gì
(ý tưởng suông / file mẫu / bảng tính / tool cũ) · ai dùng. → verify: đã nói `Mức: … — …`.

**1. Đọc những gì có.** File mẫu, bảng Excel đang dùng, tài liệu, repo liên quan, `AGENTS.md`. Ghi lại cái
đã biết để khỏi hỏi lại. → verify: nêu được 3 điều đã biết và 3 điều chưa biết.

**2. Phỏng vấn theo vòng** — dùng [references/question-bank.md](references/question-bank.md), thêm gói theo
loại dự án ở [references/type-packs.md](references/type-packs.md).
- **Tối đa 5 câu mỗi vòng**, đánh số, mỗi câu **một ý chính (một dấu hỏi)** kèm *vì sao hỏi*, *ví dụ trả lời*, và
  lựa chọn *"chưa biết — bạn đề xuất"*. Ý phụ (*Hỏi thêm* trong ngân hàng câu hỏi) để vòng sau, đừng gộp vào câu đầu. Đây là khảo sát có cấu trúc cho người không chuyên, nên **khác** luật "một câu mỗi lượt" của
  `careful-engineering` (luật đó dành cho việc đang làm giữa chừng).
- Vòng 1: hiện tại · vì sao · người dùng · đầu vào · đầu ra. Vòng 2: thế nào là đúng · quy tắc · môi
  trường · kết nối · rủi ro. Vòng 3: ưu tiên + bản đầu tiên · vận hành + hạn chót · gói theo loại dự án.
  Chế độ nhanh gộp thành 2 vòng, bỏ khối không liên quan.
- Mỗi vòng mở bằng 3–5 dòng *"tôi hiểu như sau"* về vòng trước; người dùng sửa chỗ sai.
- **Dừng hỏi** khi: mỗi yêu cầu "Phải có" có ít nhất một ví dụ nghiệm thu hoặc một câu hỏi mở gắn nó · đã
  chọn được bản đầu tiên (một ca thật chạy hết từ đầu đến cuối) · không còn câu hỏi mở chặn bản đó. Hoặc
  hết số vòng; hoặc người dùng mệt (trả lời ngắn dần, "sao cũng được", "cứ làm đi") ⇒ chốt bản nháp, phần
  còn thiếu thành giả định / câu hỏi mở. Không hỏi kéo dài.
- → verify: có bảng *đã biết / giả định / còn hỏi* sau mỗi vòng.

**3. Bản tóm tắt để duyệt.** Điền [templates/scope-summary.md](templates/scope-summary.md) bằng lời thường,
dán vào chat (một trang: sẽ làm · không làm · đúng là khi nào · tôi tự giả định · tôi cần bạn). **Không**
bắt người không chuyên đọc `SCOPE.md`. Họ trả lời "Đúng" hoặc sửa từng dòng. → verify: có lời duyệt (hoặc sửa)
của người dùng, ghi nguyên văn.

**4. Ghi `docs/SCOPE.md`** từ [templates/SCOPE.md](templates/SCOPE.md). Chép
[templates/scope-check.js](templates/scope-check.js) vào `scripts/scope-check.js` của repo rồi chạy
`node scripts/scope-check.js docs/SCOPE.md`. Trạng thái chỉ thành **ĐÃ DUYỆT** khi người dùng duyệt; ghi tên
và ngày. Chưa có Node ⇒ tự kiểm tay theo danh sách ở cuối file này. → verify: `scope-check` không có LỖI.

**5. Bàn giao.**
- `AGENTS.md`: thêm dòng *Phạm vi → `docs/SCOPE.md`* và lệnh `node scripts/scope-check.js docs/SCOPE.md`.
- Bản đầu tiên (V-1) → `careful-engineering` pha 0: ở đó AI chọn hướng kỹ thuật, viết thiết kế ngắn và
  kế hoạch. Thiết kế **trỏ về** ID trong SCOPE, không chép lại.
- Commit riêng (`docs: SCOPE v0.1 …`) khi được phép; theo `commit-deploy.md`. Không push khi chưa được bảo.

## Giữ SCOPE sống

SCOPE chỉ có ích khi còn đúng. Bốn thói quen để nó không chết (chi tiết ở `change-control.md`):

- **Mở:** đầu mỗi phiên làm việc, chạy `scope-check` và đọc bảng yêu cầu + câu hỏi mở liên quan — đừng đọc
  cả file (tìm theo ID).
- **Truy được:** mọi việc phải phục vụ một `R-` (hoặc `G-`). Không truy được ⇒ đó là **thay đổi phạm vi**,
  dừng và đi chế độ C.
- **Ghi lại:** xong việc ⇒ cập nhật trạng thái `R-` kèm commit / test; câu hỏi đã trả lời ⇒ đóng `Q-`.
- **Đo lại:** số liệu và giả định có ngày đo; quá hạn ⇒ đo lại trước khi dựa vào (số trong phiếu khảo sát
  cũ lệch sau vài tuần là chuyện thường).

## Báo cáo mỗi vòng / mỗi phiên

Ngắn: **đã hiểu** (3–5 dòng) · **giả định tôi tự đặt** (chờ bạn xác nhận) · **còn thiếu** · **câu hỏi vòng
tiếp** (≤ 5). Phiên làm việc: trạng thái `R-` đã đổi, thay đổi phạm vi đã ghi, câu hỏi mở còn chặn việc gì.

## Giới hạn

- Không viết code, không dựng khung trong skill này. Việc đó là của `careful-engineering`.
- Không dán dữ liệu thật của khách hàng / hợp đồng / nhân sự vào chat hay SCOPE — ghi **đường dẫn** hoặc
  dùng bản đã ẩn danh (luật 4 của `inno-aec`). `SCOPE.md` nằm trong repo riêng của dự án, không phải repo công khai.
- Khảo sát không thay cho việc *nhìn người làm thật*. Khi được, xin xem một ca thật chạy từ đầu đến cuối.

## Kiểm tay khi không có Node

`SCOPE.md` đạt khi: ID không trùng · mọi `R-` đã duyệt có ô *Nghiệm thu* · mọi dòng có *Nguồn* · `Q-` còn
MỞ không chặn `R-` đã ĐÃ DUYỆT / ĐANG LÀM / XONG · mọi tham chiếu (`E-`, `V-`, `R-`) trỏ tới dòng có thật ·
`B-` có *Căn cứ* · không còn `<…>` hay TBD nếu trạng thái là ĐÃ DUYỆT.

## Tài nguyên

| File | Dùng khi |
|---|---|
| [references/question-bank.md](references/question-bank.md) | bước 2: 12 khối câu hỏi, cách hỏi người không chuyên |
| [references/type-packs.md](references/type-packs.md) | bước 2: câu hỏi thêm theo loại dự án (CAD/BIM, tính toán, CSDL, web, bot, LLM…) |
| [references/change-control.md](references/change-control.md) | chế độ C: thêm / đổi yêu cầu, phân loại thay đổi, mở lại SCOPE mỗi phiên |
| [references/existing-repo.md](references/existing-repo.md) | chế độ B: dựng SCOPE từ repo có sẵn |
| [templates/SCOPE.md](templates/SCOPE.md) | bước 4: file phạm vi sống |
| [templates/scope-summary.md](templates/scope-summary.md) | bước 3: bản tóm tắt bằng lời thường để duyệt |
| [templates/scope-check.js](templates/scope-check.js) | bước 4 và mỗi phiên: kiểm SCOPE, in tiến độ (cần Node 18+) |
