# Gỡ lỗi có hệ thống: tìm nguyên nhân gốc trước khi sửa

Dùng cho mọi lỗi, test đỏ, build hỏng, hành vi lạ, chậm bất thường — **nhất là** khi đang vội, khi
"sửa nhanh một chỗ" trông hiển nhiên, hoặc khi đã sửa một lần mà không được.

Luật: **chưa có nguyên nhân gốc thì chưa đề xuất cách sửa.** Vá triệu chứng = lỗi quay lại ở chỗ khác.

*Phỏng theo skill systematic-debugging của [obra/superpowers](https://github.com/obra/superpowers)
(MIT, © Jesse Vincent), ghép với bài học của team.*

## Bước 1 — Điều tra (chưa sửa gì)

1. **Đọc hết thông báo lỗi.** Cả stack trace, mã lỗi, số dòng, cảnh báo phía trên dòng lỗi. Thông báo
   lỗi thường nói thẳng đáp án; đọc lướt là bỏ mất nó.
2. **Tái hiện có chủ đích.** Bước nào, dữ liệu nào, lần nào cũng lỗi không? Không tái hiện được ⇒ thu thêm
   dữ liệu (log, file đầu vào thật, phiên bản), **không đoán**. Ghi số đo "trước khi sửa".
3. **Gần đây đổi gì?** `git log`, `git diff`, dependency mới, cấu hình, máy khác, phiên bản host khác
   (AutoCAD / Revit / Node / Python). "Hôm qua còn chạy" ⇒ `git bisect` giữa bản chạy và bản hỏng.
4. **Hệ nhiều tầng ⇒ đo ở từng ranh giới trước khi đoán tầng nào hỏng.** CI → build → ký số; giao diện →
   API → DB; script `.scr` → accoreconsole → plugin → file log. Ở mỗi ranh giới ghi: dữ liệu vào, dữ liệu ra,
   biến môi trường / cấu hình có tới nơi không (in **có/không** hoặc độ dài, không in giá trị secret).
   Chạy **một lần** để thấy hỏng ở ranh giới nào, rồi mới đào vào tầng đó.
5. **Truy ngược dòng dữ liệu.** Lỗi hiện ra sâu trong call stack ⇒ hỏi "giá trị sai này do ai truyền vào?",
   lần lên từng cấp tới **nơi sinh ra** giá trị sai. Sửa ở nguồn, không ở chỗ nó nổ. (Ví dụ kiểu hay gặp:
   đường dẫn rỗng `''` được hiểu thành thư mục hiện tại ⇒ lệnh chạy nhầm chỗ.)

## Bước 2 — So với cái đang chạy đúng

- Tìm đoạn code / cấu hình / file mẫu **tương tự mà chạy đúng** ngay trong repo (hoặc bản cũ trong git).
- Liệt kê **mọi** khác biệt, kể cả cái "không thể quan trọng" — đừng tự loại trước khi kiểm.
- Đang làm theo một mẫu / tài liệu ⇒ đọc mẫu **trọn vẹn**, không đọc lướt rồi "phỏng theo".

## Bước 3 — Giả thuyết và thử

- Viết ra **một** giả thuyết: "Tôi nghĩ nguyên nhân là X vì Y."
- Thử bằng thay đổi **nhỏ nhất**, **một biến** mỗi lần. Không sửa nhiều thứ một lúc rồi chạy test.
- Sai ⇒ gỡ thay đổi thử, lập giả thuyết **mới**. Không chồng thêm bản sửa lên bản sửa chưa hiệu quả.
- Không hiểu ⇒ nói thẳng "tôi chưa hiểu X", đọc thêm hoặc hỏi. Không giả vờ biết.

## Bước 4 — Sửa

1. **Test tái hiện lỗi trước**, đỏ trên mã hiện tại ([testing-net.md](testing-net.md); chưa có framework
   thì một script kiểm chạy bằng một lệnh).
2. **Một** bản sửa, nhắm vào nguyên nhân gốc. Không "tiện tay" sửa thêm, không gộp refactor.
3. Kiểm: test mới xanh, toàn bộ lưới xanh, **triệu chứng gốc** hết trên hệ thống thật
   ([measurement.md](measurement.md)).
4. Lỗi do dữ liệu sai đi qua nhiều tầng ⇒ cân nhắc chặn ở **nhiều tầng** (kiểm đầu vào ở biên, kiểm ở
   logic nghiệp vụ, rào môi trường — ví dụ trong test từ chối ghi ra ngoài thư mục tạm), để lỗi không thể
   tái diễn theo đường khác. Luật rút ra ⇒ ghi `BI-*` ([invariants.md](invariants.md)).

## Dừng lại khi đã sửa hỏng 3 lần

Đã thử ≥ 3 bản sửa mà không được, hoặc mỗi bản sửa làm lộ ra vấn đề mới ở chỗ khác, hoặc bản sửa đòi
"refactor lớn" ⇒ **dừng**. Đây không còn là giả thuyết sai mà có thể là **thiết kế sai**. Báo chủ dự án:
đã thử gì, mỗi lần thấy gì, nghi vấn về kiến trúc, các hướng đi (sửa tiếp / đổi thiết kế / tạm lùi) — rồi
chờ quyết. Không thử bản sửa thứ tư khi chưa bàn.

## Dấu hiệu đang làm sai — quay lại bước 1

- "Sửa tạm đã, tìm hiểu sau." · "Thử đổi X xem sao." · "Đổi vài chỗ rồi chạy test."
- "Chắc là do X" — khi chưa có bằng chứng nào chỉ vào X.
- Liệt kê "các vấn đề chính" kèm cách sửa trước khi đã truy dòng dữ liệu.
- "Thử thêm một lần nữa" khi đã thử từ 2 lần.
- Người dùng hỏi lại "cái đó có thật xảy ra không?" / "có log cho thấy không?" ⇒ mình đã giả định mà chưa đo.

## Kỹ thuật hay dùng

| Tình huống | Cách |
|---|---|
| Test lúc xanh lúc đỏ (flaky), có `sleep` / `setTimeout` chờ cố định | Chờ **điều kiện thật** (`waitFor(() => trạng thái === 'ready')`, file đã tồn tại, số bản ghi đủ) có giới hạn thời gian và thông báo khi hết giờ. Chỉ dùng thời gian cố định khi đang test chính thời gian (debounce), và ghi vì sao |
| Một test làm bẩn trạng thái (tạo file, để lại dữ liệu) khiến test khác đỏ | Chạy từng nhóm test và kiểm thứ bị làm bẩn sau mỗi nhóm, chia đôi tới khi tìm ra test gây bẩn |
| "Hôm qua chạy, hôm nay hỏng" | `git bisect` với một lệnh kiểm tự động |
| Chạy được trên máy này, hỏng trên máy kia | So phiên bản (runtime, host, thư viện), biến môi trường, đường dẫn có dấu / dấu cách, quyền ghi, locale / encoding |
| Plugin trong host (AutoCAD / Revit) | Ghi log ra **file** ở đầu và cuối lệnh, tái hiện trong accoreconsole nếu được; xem skill `inno-aec` |
