# Lưới test chống hồi quy

## 1. Chạy lưới TRƯỚC và SAU mỗi thay đổi

- Trước: biết lưới đang xanh (hoặc đỏ sẵn ở đâu) — nếu không, đỏ sau khi sửa không quy được cho ai.
- Sau: toàn bộ lưới, không chỉ test mới. Báo đúng câu chữ của runner (`54/54 test files passed`).
- Không sửa file trong lúc một lượt test đang chạy nền (kết quả lẫn hai phiên bản).

## 2. Test mới phải có khả năng ĐỎ

Một test không thể fail thì vô giá trị. Sau khi viết test:
1. Lấy hash file thật (`md5sum f > <scratchpad>/x.md5`).
2. Chạy **đột biến**: làm hỏng có chủ đích từng chỗ test phải bảo vệ (bỏ điều kiện, lệch biên,
   đảo dấu, quên một trường, quay lại đúng lỗi cũ) → test phải đỏ. Dùng `templates/mutate.js` —
   nó chạy test trên mã **chưa** đột biến trước: baseline đỏ thì mọi đột biến "bị bắt" là giả, nên dừng.
3. **Khôi phục từ bản trong bộ nhớ** (`finally`), KHÔNG `git checkout` (xoá luôn thay đổi chưa commit).
4. `md5sum -c` ⇒ file về nguyên trạng.
5. Báo `N/M đột biến bị bắt`. Đột biến sống sót ⇒ làm test chặt hơn, hoặc ghi rõ vì sao đột biến
   đó không đổi hành vi.

Đột biến quan trọng nhất luôn là: **đưa lỗi gốc trở lại** — test phải đỏ đúng ở đó.

## 3. Khi mã không chạy được trong test runner (DOM, Electron, GPU…)

Thứ tự ưu tiên:
1. **Tách logic thuần** sang module `require()` được, test trực tiếp.
2. **Cắt khối mã khỏi file đang ship** bằng mốc chuỗi (đầu/cuối) rồi chạy với đồ giả
   (`new Function(...env, src)`). Mốc không thấy / thấy 2 lần ⇒ ném lỗi to (đừng test im lặng
   một đoạn rỗng).
3. **Ghim regex lên mã nguồn** cho phần nối dây. Ghim đỏ sau khi đổi tên/di chuyển là **tín hiệu
   để hiểu**, không phải để sửa cho xanh.
4. Test **tính nhất quán cấu trúc**: một trường phải có mặt ở đủ N chỗ (đọc control, ghi khi
   đổi, lúc stage, giá trị gốc, so "chưa sửa") ⇒ test so cả N chỗ với cùng một tập khoá. Một
   danh sách kind chép tay ở hai nơi ⇒ gom một nơi + test ghim nó khớp nơi quyết định hiển thị.

## 4. Probe trên app/hệ thống THẬT

`npm test` xanh **không** đủ để báo "xong" cho thay đổi giao diện / tích hợp. Nói rõ phần nào đã
probe, phần nào chưa. Cách khởi động, dấu hiệu sẵn sàng, dựng dữ liệu thử, lấy log, dọn dẹp: đọc
`docs/RUNBOOK.md` của repo. Chưa có ⇒ tự dò từ repo, và khi đã chạy được thì **ghi lại** vào RUNBOOK
(chỉ những gì đã thấy chạy thật). Không chạy được app (thiếu dịch vụ, thiếu quyền) ⇒ báo rõ là chưa
probe và vì sao, đừng thay probe bằng đọc code.
- Điều khiển bằng **chuột/phím thật** (CDP `Input.dispatchMouseEvent`, `insertText`), không
  gọi thẳng hàm nội bộ — gọi hàm bỏ qua đúng lớp hay lỗi (focus, blur, pointer, layout).
- Đo **sản phẩm cuối** (file đã lưu, bytes, pixel của bản render riêng — không đọc pixel canvas
  của viewer), không chỉ DOM.
- Đo lại vị trí phần tử **trước mỗi cú bấm** (layout dời khi thanh công cụ dựng lại).
- Ghi kết quả ra **file**, flush sau mỗi bước, có **watchdog** thoát.
- Chạy cùng probe trên **mã cũ** để chứng minh probe bắt được lỗi; có **ca đối chứng** cho hành vi
  sẵn có (ví dụ: nút B cũ hành xử thế nào) trước khi gọi một hành vi là "lỗi mới".
- Bản đóng gói (exe / container) ≠ mã nguồn: kiểm **chính artefact** sẽ phát hành (chạy exe,
  gọi endpoint đã đổi; so sha256 bản trong bộ cài với bản đã thử).

## 5. Bất biến được ghi thành sổ

Mỗi lỗi đã sửa / luật mới ⇒ một mục `BI-<n>` trong sổ bất biến của repo (mẫu: [memo-handoff.md](memo-handoff.md) §2)
+ một dòng ma trận "đụng gì → test gì". Biến luật thành check tự động, chứng minh hai chiều, báo mức
bảo vệ (máy / hook / CI / chặn merge), và xử lý khi check cấu trúc có sẵn đỏ: [invariants.md](invariants.md).
Sửa một hàm có `BI-xx` trong chú thích ⇒ đọc mục đó TRƯỚC khi sửa.
