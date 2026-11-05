# Chế độ B — dựng SCOPE từ repo có sẵn

Dùng khi repo đã có code (thường cũng có README, plan, handoff rời rạc) nhưng chưa có `docs/SCOPE.md`. Cũng
dùng để gom nhiều tài liệu kế hoạch viết tay thành **một** file có ID, thay vì để agent đọc lại hàng trăm
dòng mỗi phiên.

**Luật gốc: code cho biết hệ thống đang làm gì, không cho biết nó phải làm gì.** Mọi thứ suy ra từ code là
**ĐỀ XUẤT** cho tới khi người dùng xác nhận. (Cùng luật với `careful-engineering` → `invariants.md`.)

## Các bước

1. **Chỉ đọc.** README, `AGENTS.md` / `CLAUDE.md`, `docs/`, plan / handoff / roadmap rời, điểm vào của app,
   test, dữ liệu mẫu, lịch sử `git log` (commit đổi hành vi). Chưa sửa gì, chưa hỏi gì người dùng.
   → verify: kể được dự án làm gì, ai dùng (theo tài liệu), cách chạy, test đang có.
2. **Rút ra bản nháp**, mỗi dòng ghi *nguồn* theo cách kiểm được:
   - `G-` mục tiêu: từ README / plan. Nguồn: "README.md:<dòng>".
   - `R-` yêu cầu: mỗi tính năng người dùng thấy. Nguồn: "suy từ code <file:dòng>". Trạng thái **ĐỀ XUẤT**; chỉ
     ghi `XONG` khi có test / probe chạy được trỏ vào *Nghiệm thu* (chạy thật rồi mới ghi).
   - `B-` quy tắc: công thức, ngưỡng, quy định thấy trong code. Căn cứ: "code <file:dòng>, **chưa xác nhận**".
   - `C-` ràng buộc: phiên bản host / runtime từ lockfile, csproj, `requirements.txt`; nơi deploy từ cấu hình.
   - `NG-` không làm: từ plan / roadmap ghi "để sau", từ TODO. Chỉ ghi khi có chữ của người dùng hoặc tài liệu.
   - `A-` giả định: mọi chỗ bạn phải đoán, kèm "nếu sai thì" và cách kiểm.
3. **Tìm mâu thuẫn:** tài liệu nói một đằng, code làm một nẻo; hai plan khác nhau; số liệu trong README lệch số đo
   thật (đếm lại). Mỗi mâu thuẫn là một `Q-`; **đừng** tự chọn bên nào đúng.
4. **Xếp hạng câu hỏi** theo mức hậu quả nếu sai: ① quy tắc quyết định con số (tiền, diện tích, khối lượng) ·
   ② dữ liệu khách hàng / nhân sự đi đâu · ③ ai được làm gì · ④ còn lại. Hỏi người dùng **5–8 câu đầu**, theo
   thứ tự đó, đúng khuôn của `question-bank.md` (có mặc định đề xuất, có "chưa biết"). Phần còn lại để `Q-` mở.
5. **Bản tóm tắt để duyệt** (`templates/scope-summary.md`, lời thường) — người dùng xác nhận / sửa. Chỉ khi đó
   dòng `ĐỀ XUẤT` đã được xác nhận mới chuyển `ĐÃ DUYỆT` / `ĐÃ XÁC NHẬN`.
6. **Ghi `docs/SCOPE.md`**, chép `scope-check.js`, chạy kiểm, thêm dòng vào `AGENTS.md`. Plan / handoff cũ **không
   xoá**: trỏ từ SCOPE tới chúng ("chi tiết kỹ thuật: `plan.md`"), rồi để người dùng quyết có dọn không.

## Đừng

- Đừng ghi hành vi hiện tại của code thành "yêu cầu đã duyệt". Lỗi đang tồn tại cũng là hành vi hiện tại.
- Đừng viết lại toàn bộ plan cũ vào SCOPE — chỉ lấy cái trả lời được "làm gì, không làm gì, thế nào là đúng".
- Đừng đưa dữ liệu thật (khách hàng, hợp đồng, lương) từ repo vào SCOPE; ghi đường dẫn.
- Đừng sửa mã trong chế độ này. Phát hiện lỗi ⇒ ghi `Q-` hoặc `docs/OPEN-ISSUES.md`.

Xong chế độ B, repo đã có SCOPE nên các việc sau đi theo chế độ C.
