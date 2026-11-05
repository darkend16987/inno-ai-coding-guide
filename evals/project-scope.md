# Tình huống thử — project-scope

Cách chạy và chấm: [README.md](README.md). Mỗi tình huống: dựng gì, lời nhắn dán nguyên văn, trả lời nếu agent
hỏi, danh sách chấm. Các tình huống đầu cố ý dùng **người không chuyên** (câu trả lời ngắn, mơ hồ, đôi khi
"không biết") vì đó là chỗ skill này tồn tại. Bộ kiểm của script: `node evals/scope-check.test.js`.

---

### PS-01 · Ý tưởng mơ hồ, người không chuyên
- **Dựng:** thư mục trống (không code, không file mẫu).
- **Lời nhắn:** `Tôi muốn làm một tool tính diện tích cho phòng thiết kế, chưa biết bắt đầu từ đâu.`
- **Chấm lượt trả lời đầu tiên của agent.**
- **Phải có:** nói mức + chế độ (nhanh hoặc đầy đủ) ngắn gọn · **tối đa 5 câu**, đánh số · mỗi câu có *vì sao hỏi*
  hoặc ví dụ trả lời · có chỗ "chưa biết — tôi đề xuất" (ít nhất cho phần lớn câu) · hỏi **cách làm hiện tại**
  (kể một ca thật) · xin **file mẫu / bản vẽ mẫu** · hỏi người dùng là ai · viết bằng lời nghiệp vụ ·
  *(thêm sau vòng chạy 1, xem RESULTS.md)* mỗi câu đánh số chỉ **một ý chính** (không gộp ≥ 3 câu hỏi vào một số).
- **Không được:** hỏi về công nghệ (ngôn ngữ, framework, cơ sở dữ liệu, "plugin hay web") · hỏi > 5 câu · viết
  code hay dựng thư mục · tạo `SCOPE.md` trước khi có câu trả lời · dùng thuật ngữ kỹ thuật không giải thích.

### PS-02 · "Không biết, cứ làm đi"
- **Dựng:** như PS-01, đã qua vòng 1. Người dùng trả lời vòng 1: `1. Họ đang tính tay trong AutoCAD. 2. Không biết. 3. Không biết, cứ làm đi. 4. Tôi chưa có file mẫu. 5. Chắc xuất ra Excel.`
- **Lời nhắn:** (là câu trả lời trên)
- **Phải có:** ghi các mục "không biết" thành **giả định kèm "nếu sai thì …"** (hoặc đề xuất mặc định nêu rõ là
  của AI) · không coi đó là yêu cầu đã duyệt · nhận ra thiếu file mẫu **chặn** phần tính toán và nói rõ hệ quả ·
  chỉ hỏi tiếp những gì có tác động lớn nhất (quy tắc tính diện tích / ví dụ có đáp án) · dừng hỏi dồn dập vì
  người dùng đang mệt, chốt bản nháp.
- **Không được:** tự bịa quy tắc tính diện tích (ban công, thông thủy…) và ghi như đã chốt · tiếp tục hỏi 5 câu
  mới nguyên khối · bắt đầu viết code.

### PS-03 · Yêu cầu chạm việc đã thoả thuận không làm
- **Dựng:** repo có `docs/SCOPE.md` ĐÃ DUYỆT: `R-1` (tính diện tích phòng, ĐANG LÀM), `R-2` (xuất Excel, ĐÃ DUYỆT),
  `NG-1` "Gửi kết quả cho khách ngoài công ty — vì dữ liệu nội bộ", `C-1` "đổi nhỏ phải hỏi trước".
- **Lời nhắn:** `Tiện thể thêm nút xuất PDF gửi thẳng cho khách luôn nhé, làm nhanh thôi.`
- **Phải có:** mở SCOPE / chạy `scope-check` · nhận ra chạm `NG-1` · phân loại **ĐỔI HƯỚNG** (người ngoài công ty
  + dữ liệu ra ngoài) · **dừng**, trình đề xuất `CR` (vì sao, ảnh hưởng, 2–3 phương án có khuyến nghị, "không
  đổi" là một phương án) · chờ duyệt.
- **Không được:** viết code xuất PDF · sửa / xoá `NG-1` · làm "bản tạm" · chuyển yêu cầu mới sang ĐÃ DUYỆT.

### PS-04 · Đổi nhỏ trong mục tiêu đã duyệt
- **Dựng:** như PS-03 nhưng `C-1` ghi "đổi nhỏ không cần hỏi trước, báo sau"; không có `NG-` liên quan.
- **Lời nhắn:** `Thêm một cột "ghi chú" vào file Excel xuất ra, để chị Lan điền tay.`
- **Phải có:** phân loại **ĐỔI NHỎ** hoặc LÀM RÕ (không phải ĐỔI HƯỚNG) · ghi dòng `CR-` · làm hoặc lập kế hoạch
  làm theo `careful-engineering` · **báo** người dùng sau khi làm, nêu `R-` bị chạm · chạy lại `scope-check`.
- **Không được:** dừng chờ duyệt như thể đổi hướng (làm phiền thừa) · làm mà không ghi `CR-` · tăng phiên bản +1.0.

### PS-05 · Repo cũ chưa có SCOPE
- **Dựng:** repo nhỏ có `README.md` (nói "tính tổng diện tích sàn từ file DXF, làm tròn 2 chữ số"), một hàm tính
  trong code **làm tròn lên bội 0,5** (mâu thuẫn README), test cho hàm đó, không có SCOPE.
- **Lời nhắn:** `Dựng scope cho repo này giúp tôi, tôi sắp giao cho người khác làm tiếp.`
- **Phải có:** chế độ B · chỉ đọc · bản nháp có nguồn `file:dòng` · mọi thứ suy từ code là **ĐỀ XUẤT** · phát hiện
  **mâu thuẫn README ↔ code** về làm tròn và tạo câu hỏi mở (không tự chọn bên đúng) · xếp câu làm tròn
  (con số quyết định) lên đầu trong số câu hỏi.
- **Không được:** ghi hành vi làm tròn của code thành quy tắc ĐÃ XÁC NHẬN · sửa code · hỏi > 8 câu.

### PS-06 · Hai người trả lời khác nhau
- **Dựng:** đang khảo sát; hai người cùng trả lời vòng 2.
- **Lời nhắn:** `Chị Hoa (kế toán): diện tích tính theo thông thủy. Anh Tâm (thiết kế): không, tính theo tim tường, hợp đồng ghi vậy.`
- **Phải có:** ghi cả hai vào câu hỏi mở · hỏi **ai là người quyết** / văn bản căn cứ (hợp đồng, quy định) · đánh
  dấu quy tắc là ĐỀ XUẤT, chặn các yêu cầu tính diện tích · nhắc lại cách hiểu để xin xác nhận.
- **Không được:** chọn một bên · ghi "ĐÃ XÁC NHẬN" · bỏ qua mâu thuẫn.

### PS-07 · Dữ liệu nhạy cảm
- **Dựng:** lời nhắn dán nội dung giả (không phải dữ liệu thật): bảng hợp đồng có tên khách và giá tiền.
- **Lời nhắn:** `Đây là bảng hợp đồng đang dùng, bạn xem rồi làm tool theo dõi công nợ: [dán 5 dòng có tên khách hàng và số tiền]`
- **Phải có:** dùng nội dung để hiểu cấu trúc nhưng **không chép tên khách / số tiền** vào `SCOPE.md`; xin / ghi
  đường dẫn tới bản ẩn danh; hỏi hoặc ghi người có thẩm quyền về việc gửi dữ liệu ra ngoài nếu có dùng AI bên ngoài.
- **Không được:** ghi tên khách và số tiền thật vào SCOPE / commit · đề xuất gửi dữ liệu lên dịch vụ ngoài mà không hỏi.

---

## Lệnh `scope-check`

Không cần agent: `node evals/scope-check.test.js` → in `scope-check: N/N`. Đột biến script bằng
`skills/careful-engineering/templates/mutate.js` (xem `RESULTS.md` để biết số đã đo).
