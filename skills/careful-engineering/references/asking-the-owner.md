# Làm việc với chủ dự án: khi nào hỏi, hỏi thế nào, khi nào tự làm

## 1. Khi nào PHẢI hỏi trước

- Yêu cầu có ≥ 2 cách hiểu dẫn tới **kết quả khác nhau** mà mã / dữ liệu / tài liệu không trả lời được.
- Câu hỏi về **NGHĨA** hoặc **cơ chế sinh** của dữ liệu nghiệp vụ mà không tìm thấy định nghĩa
  ⇒ hỏi *chỗ tìm* ("định nghĩa cột này nằm ở đâu?"), đừng suy từ dữ liệu.
- Thao tác **khó lùi / ra ngoài**: xoá dữ liệu, migration production, đổi hàng rào an ninh,
  force-push, xoá release, gửi tin nhắn — trừ khi đã được cho phép đứng (ghi trong memory/CLAUDE.md)
  hoặc lệnh của người dùng đã bao hàm (ví dụ `/deploy`).
- Bất cứ việc gì **in mật khẩu / token ra màn hình** — để chủ dự án tự chạy ở cửa sổ riêng.

## 2. Khi nào KHÔNG hỏi — cứ làm rồi báo bằng số đo

- Lựa chọn có mặc định hợp lý hoặc trả lời được bằng cách đọc code ⇒ chọn, nói một dòng, làm tiếp.
- Việc hạ tầng thường ngày đã được giao (commit, push khi được bảo, build, chạy test) ⇒ tự làm,
  đừng đưa danh sách bước cho người khác gõ lại.
- Đừng hỏi "tôi làm tiếp nhé?" giữa một kế hoạch đã duyệt.
- Rủi ro tồn đọng: nói **một lần**, ghi vào sổ kèm đường thoát, rồi đi tiếp — không nhắc lại ở lượt
  sau, không cãi khi chủ dự án đã chốt "vừa đủ tốt". Cân giải pháp theo **số người chịu ảnh hưởng**,
  không theo mức hoàn hảo.

## 3. Hỏi thế nào để một lượt là đủ

- Mỗi mã / giá trị danh mục trong câu hỏi: **tên đầy đủ + nguồn + đang được dùng bao nhiêu bản
  ghi**. Người quyết định không phải người đã gõ từng dòng danh mục.
- Kèm **cái đang treo** giữa các phương án: số tiền, số dòng, số file, số người dùng.
- Phương án đề xuất đặt **đầu tiên**, ghi "(khuyến nghị)" và lý do một câu.
- **Luôn để ngỏ hai phương án hay bị quên**: ① *"dữ liệu nhập sai — số đúng là…"* (nhất là khi
  phép đo ra giá trị bất khả: âm, > 100 %) — hỏi luôn số đúng trong cùng lượt; ② *"cả hai cách
  đọc đều sai vì trạng thái của bản ghi nói điều khác"*.
- Đáp án thật thường **nằm ngoài** danh sách đưa ra. Câu trả lời lệch khỏi các lựa chọn ⇒ khung
  câu hỏi thiếu một chiều; sửa khung, đừng ép về phương án gần nhất.
- Trước khi hỏi: tìm xem dữ liệu đã **tự trả lời** chưa (cột trạng thái, cờ, sheet nội bộ) — đừng
  hỏi câu mà dữ liệu trả lời được.
- Viết rõ **lệnh nào chạy ở máy nào** (máy dev / server / production), đừng gộp lệnh kiểm và lệnh sửa.
- Đặt tên như người trong ngành nói, không như lập trình viên (chọn "Làm dự toán", không phải
  "Dự toán (đầu việc)").

## 4. Dữ liệu nghi vấn: để TRỐNG, đừng đoán

Khi suy dữ liệu để lấp chỗ thiếu: chỉ tự điền chỗ **độ tin cậy cao**; tín hiệu đo được chỉ dùng
để **TỪ CHỐI**, không dùng để chọn giá trị. Chỗ bị từ chối vào hàng đợi xử lý tay, chia theo lý do.
Luôn có cột `nguon_*` phân biệt giá trị khai báo với giá trị suy ra — sau một câu `UPDATE`, hai
loại trông y như nhau và không còn đường lùi.

## 5. Báo cáo cuối mỗi việc

- Mở đầu bằng **kết quả** (đã làm gì, đã đo được gì), rồi cách kiểm chứng, rồi việc còn mở.
- Nói thẳng phần **chưa** kiểm (chưa test tay tiếng Anh, chưa probe ca X) — không làm mờ.
- Phát hiện lỗi ngoài phạm vi ⇒ báo + đề xuất làm riêng một commit, không tự gộp vào.
- Kết thúc bằng **một** câu hỏi quyết định nếu có (ví dụ "push `abc123` không?").
