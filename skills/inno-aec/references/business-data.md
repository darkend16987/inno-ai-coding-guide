# Dữ liệu nghiệp vụ: dự án, hợp đồng, nhân sự, web app nội bộ

Đọc kèm careful-engineering `references/data-migration.md` (năm luật cứng về dữ liệu, migration, đối soát,
Excel/CSV nguồn) — file này chỉ thêm phần riêng của INNO.

## 1. Nguồn dữ liệu

- Nguồn thường gặp: file Excel của phòng ban, xuất / API của hệ thống quản lý nội bộ (1Office…), Google
  Sheets. Thư mục / file nguồn là **chỉ đọc**; mọi chỉnh sửa đi qua file vá có tên, ngày, người yêu cầu.
- **Danh mục do INNO tự khai đứng trên suy luận thống kê.** Không tìm thấy định nghĩa một cột / một mã ⇒
  hỏi *chỗ tìm*, ghi câu trả lời + diễn giải của mình vào `docs/OWNER-ANSWERS.md` rồi mới đổi DDL.
- Hai nguồn mâu thuẫn (Excel nói A, hệ thống nói B) ⇒ không chọn hộ; đưa vào hàng đợi xử lý kèm cả hai giá trị.

## 2. Kiểu dữ liệu

| Dữ liệu | Lưu | Bẫy |
|---|---|---|
| Tiền VND | số nguyên (`BIGINT`, `long`, `int` Python) | `float`; nhân với % rồi lưu số lẻ — làm tròn theo quy tắc đã chốt, một chỗ |
| VAT | lưu **cả** trước thuế, thuế suất, tiền thuế, sau thuế như chứng từ ghi | Tự tính lại tiền thuế từ tổng ⇒ lệch vài đồng với hoá đơn thật |
| Mã dự án / hợp đồng / nhân viên | **chuỗi** | Ép thành số mất số 0 đầu; khoảng trắng thừa có thể là bản ghi khác — không TRIM im lặng |
| Ngày | ISO (`YYYY-MM-DD`) khi lưu, `dd/mm/yyyy` khi hiển thị; múi giờ Asia/Ho_Chi_Minh | Excel đọc `03/04` thành 4 tháng 3; server UTC lệch ngày lúc 0–7 giờ sáng |
| Tên người / công ty | Unicode NFC | So sánh / tìm kiếm phải chuẩn hoá cùng dạng; tìm không dấu ⇒ cột chuẩn hoá riêng, `đ`→`d` thay tay |
| Số trong chuỗi Excel | `1.234.567` (VN) vs `1,234,567` (EN) | Parse theo locale đã biết của file, không đoán từng ô |

## 3. Hợp đồng & quy trình

- Trạng thái hợp đồng / công việc / thanh toán là **máy trạng thái**: danh sách chuyển hợp lệ viết một
  chỗ, kiểm ở **server** (API / Cloud Function / trigger), không chỉ ở giao diện. Test mọi chuyển bị cấm.
- Thay đổi số tiền, trạng thái, người phụ trách ⇒ ghi **nhật ký** (ai, lúc nào, giá trị cũ → mới). Không
  xoá cứng bản ghi nghiệp vụ; dùng trạng thái huỷ / cờ xoá mềm.
- Số liệu hiển thị cho lãnh đạo (tổng giá trị hợp đồng, công nợ, doanh thu) ⇒ có truy vấn đối soát với
  nguồn, báo số dòng và tổng ở cả hai phía.

## 4. Dữ liệu cá nhân & quyền truy cập

- CCCD, lương, số điện thoại, địa chỉ, đánh giá nhân sự là dữ liệu cá nhân theo quy định bảo vệ dữ liệu cá
  nhân của Việt Nam: chỉ người cần mới thấy; không in ra log; không đưa vào prompt LLM bên ngoài khi chưa
  được duyệt; không dùng dữ liệu thật làm dữ liệu thử.
- Web app nội bộ: đăng nhập bằng tài khoản công ty / danh sách cho phép; quyền kiểm ở rules / RLS / server
  và **test cả chiều bị cấm** (nhân viên A không đọc được lương của B).
- Khoá quyền cao (Supabase `service_role`, Firebase Admin SDK) chỉ ở server — chúng bỏ qua rules / RLS.
- Xuất dữ liệu (Excel, PDF) ⇒ chỉ cột người đó được xem; ghi nhật ký ai xuất gì.

## 5. Kiểm chứng (pha 4)

- ETL / đồng bộ: khối đối soát số dòng + tổng tiền trong chính script sinh ra (lệch là dừng), chạy hai lần
  không đổi gì (idempotent), chạy trên CSDL nháp ở trạng thái production trước.
- Báo cáo / dashboard: golden test với bộ dữ liệu nhỏ có tổng tính tay; so với số phòng ban đang dùng
  (bảng Excel của kế toán) và giải thích mọi chênh lệch.
- Quyền: test tự động cho từng vai trò (xem được / không xem được / sửa được) trên emulator hoặc DB nháp.
