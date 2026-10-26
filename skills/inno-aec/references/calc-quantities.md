# Tool tính toán: diện tích, GFA, khối lượng, tỉ lệ căn hộ

Số do tool này sinh ra đi vào hồ sơ, hợp đồng, báo giá ⇒ **mức L**. "Chạy không lỗi" không nói gì về
"số đúng". Căn cứ duy nhất để nói "đúng" là: **định nghĩa có nguồn + golden test với số đã được người
trong nghề kiểm tay**.

## 1. Định nghĩa trước, code sau

- "Diện tích" có nhiều nghĩa: tim tường / thông thủy / phủ bì; GFA tính gì, trừ gì (ban công, lô-gia,
  hộp kỹ thuật, tầng hầm, mái…) tuỳ quy chuẩn, địa phương và hợp đồng. **Không chọn hộ chủ dự án.**
- Mỗi quy tắc tính ghi rõ **căn cứ** (tên văn bản QCVN / TCVN / quy định địa phương / điều khoản hợp đồng
  mà chủ dự án chỉ định, kèm mục / điều) trong `docs/DECISIONS.md`, và mã quy tắc trong code comment.
  Không có căn cứ ⇒ hỏi *chỗ tìm*, đừng suy từ bản vẽ mẫu.
- Hệ số, ngưỡng, tỉ lệ (mật độ, hệ số sử dụng đất, tỉ lệ loại căn) là **dữ liệu cấu hình có nguồn**, không
  phải hằng số rải trong code. Quy định đổi ⇒ đổi cấu hình, giữ được bản cũ cho dự án cũ.

## 2. Đơn vị

- Bản vẽ VN thường vẽ **mm** nhưng không phải luôn: đọc `INSUNITS` và **hỏi / kiểm** bằng một kích thước đã
  biết (khổ cửa, lưới trục). mm² → m²: chia 1 000 000.
- Revit: nội bộ feet² ⇒ chuyển ở biên ([revit.md](revit.md) §2).
- Block / xref bị scale, xoay, lật (scale âm) ⇒ biến đổi hình học trước khi tính; diện tích nhân |sx·sy|.
- Mỗi số báo cáo ghi đơn vị trong tên cột / nhãn (`dien_tich_m2`), không để người đọc đoán.

## 3. Hình học — các bẫy làm sai số im lặng

| Bẫy | Hậu quả | Cách chặn |
|---|---|---|
| Polyline **hở** | API vẫn trả diện tích như thể đã đóng | Chỉ nhận polyline `Closed` (hoặc điểm đầu = cuối trong dung sai); còn lại vào danh sách lỗi |
| Polyline **tự cắt** | Diện tích sai (phần chéo bù trừ nhau) | Kiểm tự cắt; báo lỗi, không tính |
| Cung (**bulge**) | Tự tính bằng công thức toạ độ đỉnh sẽ bỏ phần cung | Dùng diện tích của API, hoặc cộng phần cung; golden test có hình có cung |
| Lỗ / đảo (hatch, region) | Cộng cả phần rỗng | Trừ lỗ; test hình chữ "回" |
| Đối tượng **trùng / chồng** (copy hai lần) | Đếm đôi | Kiểm trùng hình học trong dung sai; báo |
| Phòng không có ranh giới kín (Revit Room "Not Enclosed") | Diện tích 0 hoặc sai | Liệt kê riêng, không cộng im lặng |
| Dung sai toạ độ | Điểm "trùng" lệch 1e-9 | Một hằng dung sai, ghi trong DECISIONS, dùng mọi nơi |

Mọi đối tượng bị loại vì lỗi ⇒ **danh sách riêng có lý do + vị trí** (handle, layer, toạ độ) để người dùng
sửa bản vẽ. Không bỏ im lặng; tổng báo cáo ghi "đã tính N, loại M (xem danh sách)".

## 4. Làm tròn

- Tính bằng số **đầy đủ**, chỉ làm tròn **ở bước hiển thị / báo cáo**, và chỉ một lần.
- Quy tắc làm tròn phải nói ra: **mặc định của ngôn ngữ thường KHÁC Excel.** .NET `Math.Round` và Python
  `round()` mặc định làm tròn **về số chẵn** (2,5 → 2; 3,5 → 4); Excel `ROUND` làm tròn **xa số 0** (2,5 → 3).
  Người dùng đối chiếu với Excel ⇒ dùng `MidpointRounding.AwayFromZero` / `Decimal.quantize(ROUND_HALF_UP)`.
- `float` / `double` không biểu diễn đúng 0,1 ⇒ tổng tiền / tổng diện tích để vào hợp đồng dùng
  `decimal` (C#), `Decimal` (Python), số nguyên đơn vị nhỏ (mm², đồng).
- "Tổng của số đã làm tròn" ≠ "làm tròn của tổng" ⇒ chọn một, ghi vào DECISIONS, báo cáo theo đúng cách đó.

## 5. Kiểm chứng (pha 4 cho tool tính toán)

1. **Golden set**: 5–20 trường hợp thật (đã ẩn danh) + vài hình tự vẽ có đáp án tính tay (chữ nhật, chữ L,
   có cung, có lỗ, có block scale, polyline hở để phải bị loại). Đáp án do **người trong nghề** kiểm, ghi tên
   người kiểm + ngày trong file golden.
2. **Đối chiếu chéo**: kết quả tool = lệnh `AREA` / `MASSPROP` của AutoCAD (hoặc schedule của Revit) trên
   cùng bản vẽ, trong dung sai đã nêu.
3. **Kiểm tổng**: tổng các phần = tổng sàn ± dung sai; số phòng tính được + số bị loại = số đối tượng đầu vào.
4. Đổi công thức ⇒ chạy golden **trên mã cũ và mã mới**, báo bảng chênh lệch từng ca; mọi chênh lệch phải
   giải thích được (là mục đích của thay đổi), không chỉ "tổng gần bằng".
5. Bài toán tối ưu (phương án tỉ lệ căn, xếp căn tối đa GFA): kiểm **mọi ràng buộc** trên lời giải trả về
   bằng một hàm kiểm độc lập với bộ tối ưu; so với một lời giải tay đã biết.

## 6. Báo cáo cho người dùng

Đầu ra (Excel / PDF / bảng trong bản vẽ) ghi: phiên bản tool, ngày, file nguồn, đơn vị, quy tắc tính (mã +
căn cứ), dung sai, số đối tượng bị loại. Người nhận báo cáo phải truy lại được số từ đâu ra.
