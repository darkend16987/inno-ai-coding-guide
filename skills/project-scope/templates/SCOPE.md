# <Tên dự án> — phạm vi (SCOPE)

> **Cách dùng.** Đây là file sống: mở lại đầu mỗi phiên, cập nhật khi xong việc hoặc khi phạm vi đổi
> (quy trình ở skill `project-scope`, `references/change-control.md`). Mỗi dòng có ID bền (`R-3`, `Q-2`…) để
> tham chiếu — **không đánh số lại**, dòng bỏ thì chuyển trạng thái, không xoá. Giữ nguyên tên cột (script
> `scope-check.js` đọc theo tên cột). Ký tự `|` trong ô viết `\|`; cặp `<…>` chỉ dùng làm chỗ giữ chỗ chưa
> điền (script coi là chưa xong) — viết "nhỏ hơn 5" thay vì `< 5`. Không ghi tên công nghệ hay dữ liệu thật
> của khách hàng ở đây — ghi đường dẫn tới file. Kiểm: `node scripts/scope-check.js docs/SCOPE.md`.

| Trạng thái | Phiên bản | Cập nhật | Người duyệt |
|---|---|---|---|
| DỰ THẢO | v0.1 | YYYY-MM-DD | — |

<!-- Trạng thái: DỰ THẢO · ĐÃ DUYỆT · ĐANG ĐỔI. Đổi sang ĐÃ DUYỆT chỉ khi người dùng duyệt; ghi tên + ngày. -->

## 1. Mục tiêu — vì sao làm, đo bằng gì

| ID | Mục tiêu | Đo bằng | Mốc hiện tại | As-of |
|---|---|---|---|---|
| G-1 | <cho ai, để làm gì — một câu> | <phút/ca, lỗi/tháng, …> | <số đo hiện nay> | YYYY-MM-DD |

## 2. Người dùng

| ID | Vai trò | Số người | Làm gì với tool | Thiết bị / môi trường |
|---|---|---|---|---|
| U-1 | <vai trò> | <số> | <việc chính> | <máy bàn / điện thoại / phần mềm + năm> |

## 3. Quy trình hiện tại và mong muốn (mỗi ca thật một dòng)

| ID | Ca thật | Hiện tại | Mong muốn | Ngoại lệ |
|---|---|---|---|---|
| S-1 | <tên ca> | <ai làm gì, mất bao lâu, hay sai ở đâu> | <sau khi có tool> | <ca lạ, mẹo của người làm> |

## 4. Yêu cầu

Ưu tiên: **Phải có · Nên có · Để sau**. Trạng thái: **ĐỀ XUẤT** (AI đề xuất / chưa duyệt) · **ĐÃ DUYỆT** · **ĐANG LÀM** · **XONG** · **HOÃN** · **BỎ**.
`Nguồn`: "<ai nói, ngày>" hoặc "AI đề xuất". `Nghiệm thu`: ví dụ `E-n`, tên test, probe — bắt buộc khi đã duyệt.

| ID | Yêu cầu | Ưu tiên | Trạng thái | Nguồn | Nghiệm thu | Bản |
|---|---|---|---|---|---|---|
| R-1 | <người dùng thấy / làm được gì — một câu> | Phải có | ĐỀ XUẤT | <ai nói, ngày hoặc AI đề xuất> | E-1 | V-1 |

## 5. Không làm (lần này)

| ID | Không làm | Vì sao | Xét lại khi |
|---|---|---|---|
| NG-1 | <việc nghe hay nhưng không làm> | <lý do> | <điều kiện để bàn lại> |

## 6. Dữ liệu và file mẫu

| ID | Dữ liệu / file mẫu | Đường dẫn | Chủ sở hữu | Nhạy cảm | Đã ẩn danh |
|---|---|---|---|---|---|
| D-1 | <mô tả> | <đường dẫn, không dán nội dung> | <ai> | <có / không> | <có / không> |

## 7. Ví dụ nghiệm thu — đáp án người trong nghề đã tự kiểm

| ID | Đầu vào | Kết quả đúng | Ai đã tự kiểm | Ngày |
|---|---|---|---|---|
| E-1 | <ca thường — trỏ tới D-n> | <kết quả, kèm sai lệch cho phép> | <tên người kiểm tay> | YYYY-MM-DD |

## 8. Quy tắc nghiệp vụ

Trạng thái: **ĐỀ XUẤT** (chưa xác nhận) · **ĐÃ XÁC NHẬN** (người có thẩm quyền xác nhận, ghi tên).

| ID | Quy tắc | Căn cứ | Ai xác nhận | Trạng thái |
|---|---|---|---|---|
| B-1 | <công thức / quy định> | <văn bản, người, ngày> | <tên> | ĐỀ XUẤT |

## 9. Ràng buộc và môi trường

| ID | Ràng buộc | Giá trị | Nguồn |
|---|---|---|---|
| C-1 | <phiên bản phần mềm, nơi chạy, ngân sách, hạn chót cứng, ai quyết khi tranh chấp, đổi nhỏ có cần hỏi không…> | <giá trị> | <ai nói, ngày hoặc AI đo> |

## 10. Giả định

Mỗi giả định phải nói **nếu sai thì sao** và **kiểm bằng cách nào**. Trạng thái: **CHƯA KIỂM** · **ĐÚNG** · **SAI**.

| ID | Giả định | Nếu sai thì | Cách kiểm | Trạng thái | As-of |
|---|---|---|---|---|---|
| A-1 | <điều AI tự đặt hoặc người dùng "không biết" ở vòng khảo sát> | <hậu quả> | <lệnh / ai hỏi / file nào> | CHƯA KIỂM | YYYY-MM-DD |

## 11. Rủi ro — kể cả "chạy đúng mà vẫn thất bại"

| ID | Rủi ro | Cách phòng | Đường lùi |
|---|---|---|---|
| RR-1 | <sai kiểu nào thì không chấp nhận được; vì sao mọi người có thể bỏ không dùng> | <cách phòng> | <lùi thế nào> |

## 12. Câu hỏi mở

`Chặn`: các `R-` không thể duyệt / làm tiếp khi chưa có câu trả lời. Trạng thái: **MỞ** · **ĐÃ TRẢ LỜI**.
Câu trả lời đổi quy tắc / con số ⇒ ghi vào `docs/OWNER-ANSWERS.md` (nguyên văn · tôi hiểu là · tác động) rồi mới sửa mục 8.

| ID | Câu hỏi | Ai trả lời | Chặn | Trạng thái | Hạn |
|---|---|---|---|---|---|
| Q-1 | <câu hỏi còn mở> | <tên> | R-1 | MỞ | YYYY-MM-DD |

## 13. Bản phát hành (lát cắt)

Bản đầu tiên = **một ca thật chạy hết từ đầu đến cuối**, nhỏ nhất mà người dùng dùng được.

| ID | Bản | Gồm | Xong khi |
|---|---|---|---|
| V-1 | <tên bản đầu> | R-1 | <điều kiện đo được, trỏ E-n> |

## 14. Nhật ký thay đổi (chỉ thêm, không xoá)

Loại: **KHỞI TẠO** · **LÀM RÕ** · **ĐỔI NHỎ** · **ĐỔI HƯỚNG** (phép thử ở `change-control.md`). `ĐỔI HƯỚNG` bắt buộc có người duyệt.

| ID | Ngày | Loại | Thay đổi | Vì sao | Ai duyệt | Ảnh hưởng |
|---|---|---|---|---|---|---|
| CR-0 | YYYY-MM-DD | KHỞI TẠO | Bản đầu tiên từ khảo sát | <ai yêu cầu, bối cảnh> | <người duyệt> | R-1 |
