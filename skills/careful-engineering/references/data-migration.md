# Dữ liệu, ETL, migration, CSDL production

Rút từ một dự án ETL + PostgreSQL + CMS chạy production. Đọc khi việc chạm dữ liệu nghiệp vụ,
schema, migration, đồng bộ từ Excel/CSV.

## 1. Năm luật cứng về dữ liệu

1. **Danh mục chủ dự án tự khai > suy luận thống kê của mình.** Mẫu "27/29 dòng khớp" vẫn có thể
   là hệ quả của một quy ước khác, không phải nguyên nhân. (Đã xảy ra: suy một mã = "dòng tổng" vì
   mọi dòng mang mã đó trông như dòng tổng; danh mục ghi mã đó nghĩa là "Hỗn hợp".)
2. **Không hành động theo giả thuyết chưa xác nhận**, kể cả khi bằng chứng mạnh. Lưu dữ liệu
   **nguyên trạng** để khi xác nhận chỉ tốn "một cột và một câu UPDATE".
3. **Diễn giải lại mọi câu trả lời** của chủ dự án trước khi chạm DDL (mẫu 4 dòng ở
   [memo-handoff.md](memo-handoff.md) §4). Câu trả lời ngành xây dựng/kế toán thường hiểu được 2–3 cách.
4. **Không sửa dữ liệu nguồn, không bỏ dòng im lặng.** Thư mục nguồn chỉ-đọc. Dòng bẩn vào hàng đợi
   xử lý kèm lý do. Không "chọn giá trị phổ biến nhất". File gửi **sau** thắng file gửi trước. Số
   đưa qua chat đi qua file vá (`*.csv`), không qua `UPDATE` gõ tay.
5. **Mọi thay đổi chạy lại được và phải đối soát.** SQL do script **sinh ra**, không chép tay; mỗi
   file sinh ra kết thúc bằng khối đối soát số dòng (`DO $$ … RAISE EXCEPTION`) — lệch một dòng là dừng.

## 2. Migration

- Tên `NNNN_mo_ta_khong_dau.sql`, tăng dần; **kiểm số lớn nhất hiện có ngay trước khi đặt tên**
  (đã có lần kế hoạch giữ số 0014 nhưng việc khác lấy mất, cuối cùng thành 0017).
- **File đã chạy trên production là bất biến** (runner lưu sha256, sửa ⇒ dừng deploy). Sai thì viết
  migration **mới**. Generator chỉ ghi khi file chưa tồn tại; cảnh báo "ĐÃ TỒN TẠI và KHÁC bản sinh"
  là đúng thiết kế — đừng sinh lại.
- Mọi thay đổi cấu trúc ghi **hai nơi**: schema gốc (dev) + migration (production); sau đó **so schema**
  hai đường từng dòng (cột, constraint, index, policy, RLS, `md5(prosrc)`, comment).
- **Nghiệm thu trên nháp ở trạng thái production**: dựng CSDL nháp = schema gốc + đúng các migration
  production đã chạy; áp file mới **chiều một** (cũ → mới) và **chiều hai** (chạy lại không đổi gì);
  chạy runner thật; thử **chiều đổ** (phải ném lỗi và rollback sạch).
- Bẫy SQL đã gặp: `ADD COLUMN IF NOT EXISTS` bỏ mất `CHECK`; `ALTER COLUMN TYPE` lỗi khi có view
  dùng cột (chỉ trên đường migration); `DROP VIEW` mất GRANT (dùng `CREATE OR REPLACE`); view trên
  bảng RLS cần `security_invoker = true`; function plpgsql phải `SET search_path`; `UNIQUE` có cột
  NULL không chặn gì (dùng partial index); kiểu số quá hẹp làm giá trị không tái tạo được.

## 3. Đối soát dữ liệu

- Băm **từng dòng rồi cộng** (không phụ thuộc collation), khoá theo **khoá nghiệp vụ**, không theo `id`.
  Ép kiểu ngày/số sang text tường minh (DateStyle, collation dev `C` ≠ production `en_US.UTF-8`).
- Phủ **mọi bảng** thay đổi chạm tới; so **giá trị**, không chỉ danh sách khoá.
- So chuỗi in ra bỏ sót đuôi bị cắt ⇒ so `length`, `octet_length`, `md5` từng cột.
- `COPY … TO STDOUT` nhân đôi `\` ⇒ công cụ so dựa trên nó báo KHÁC giả.
- Kỳ vọng trong phép kiểm phải **đo**, không **suy**; hard-code mã kỳ vọng (không lấy từ chính
  danh sách đang duyệt, nếu không phép kiểm rỗng). Truy vấn trả 0 dòng phải tự FAIL.
- Kiểm "thêm một dòng" ⇒ đếm trước, so với trước + 1 — đừng mã hoá giả định "bảng rỗng".

## 4. Excel / CSV nguồn

- Nghĩa của cột thường nằm **trong workbook**: công thức ẩn ở dòng tiêu đề, sheet nội bộ (tiền tố `_`),
  sheet log do người viết. Liệt kê **hết** sheet trước khi suy nghĩa.
- Tên cột trùng ⇒ đọc theo **chỉ số**, không theo tên. Sheet không có dòng tiêu đề ⇒ số dòng lệch.
- **Bản vá bỏ dòng thì thay bằng dòng trống, đừng xoá khỏi danh sách** — xoá làm mọi số dòng Excel
  phía sau lệch (đã lệch −7 suốt 11 ngày, mọi phép đếm vẫn đúng nên không ai thấy). Có hàng rào kiểm
  "số dòng trỏ đúng dòng thật có đúng khoá" trước khi ghi.
- Cột luỹ kế không được cộng; cột trước VAT và sau VAT nằm cạnh nhau; hai cột cùng tên khác nghĩa.
- sha256 file đổi không có nghĩa dữ liệu đổi (sheet dashboard tự lớn mỗi ngày).
- Lặp qua `set` cho thứ tự không xác định ⇒ luôn `sorted()` để file sinh ra ổn định.

## 5. Hàng rào đọc dữ liệu do APP ghi

Nháp/dev dựng từ file nguồn **không có** dữ liệu người dùng ghi qua app. Hàng rào hay migration đọc
loại dữ liệu đó ⇒ **đo production chỉ-đọc** (xin phép) và dựng dữ liệu mô phỏng nháp theo đúng số đo
TRƯỚC khi deploy.

## 6. Sync chỉ UPSERT thì không bao giờ xoá

Thiết kế đồng bộ hội tụ (UPSERT theo khoá hội tụ đo trên `pg_constraint`), không theo delta. Mỗi lần
sync chỉ xoá những dòng hàng đợi mang **nhãn của chính nó** (đã có lần xoá nhầm 15 dòng hàng đợi
production vì điều kiện `nguon IS NULL`). Đề xuất xoá của công cụ ghép tự động phải soát bằng thuộc
tính khác (hoá đơn, tiền về) trước khi xoá.
