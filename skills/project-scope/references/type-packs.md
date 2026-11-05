# Gói câu hỏi theo loại dự án

Nạp **thêm** vào [question-bank.md](question-bank.md) ở vòng 3 (hoặc sớm hơn nếu loại dự án đã rõ). Chọn đúng
gói, bỏ câu đã có đáp án; dự án lai ⇒ nạp nhiều gói. Cách kiểm chứng và bẫy kỹ thuật của từng loại nằm ở
`careful-engineering/references/project-types.md` — ở đây chỉ là **câu hỏi nghiệp vụ** để điền vào SCOPE.
Mỗi gói ghi: hỏi thêm · dễ quên · ghi vào đâu.

## 1. Plugin cho phần mềm chủ (AutoCAD · Revit · SketchUp · Office)
- Năm phiên bản đang dùng thật, kể cả máy đồng nghiệp (có máy nào khác năm không)? Bản đầy đủ hay LT?
- Người dùng ra lệnh thế nào: gõ lệnh, bấm nút, hay tự chạy khi mở / lưu bản vẽ? Chọn đối tượng thế nào (chọn
  tay, cả bản vẽ, theo layer)?
- Quy ước bản vẽ: layer, block, đặt tên, đơn vị (mm / m), font (TCVN3 / VNI), template chuẩn của công ty. Xin 1
  bản vẽ **đúng chuẩn** và 1 bản vẽ **lộn xộn như thực tế**.
- Kết quả đi đâu: vẽ vào bản vẽ, xuất Excel, hay **sửa** đối tượng sẵn có? (Sửa bản vẽ gốc khó lùi — hỏi
  Undo, bản sao lưu.)
- Ai cài, cho bao nhiêu máy; máy có chặn nạp DLL (SECURELOAD) không; gỡ bằng cách nào.
- **Dễ quên:** đơn vị nội bộ của host · bản vẽ đã ẩn danh để thử · hỏng bản vẽ gốc (`RR-`).
- **Ghi:** `C-` (host + năm), `D-` (mẫu), `E-`, `RR-`. Chi tiết kỹ thuật: skill `inno-aec`.

## 2. Tool tính toán (diện tích · GFA · khối lượng · tối ưu)
- Định nghĩa chính xác: "diện tích" theo quy định nào (thông thủy, tim tường, xây dựng, sử dụng)? Đối tượng nào
  tính / không tính (ban công, lô gia, hố thang, giếng trời)?
- Làm tròn ở bước nào, mấy chữ số; đơn vị cuối cùng.
- Đối chiếu với cách hiện hành nào (lệnh AREA, Excel của ai)? Sai lệch bao nhiêu thì chấp nhận được?
- Số cuối cùng ai kiểm và ai chịu trách nhiệm? Dùng vào đâu (báo giá, hợp đồng, nộp cơ quan)? ⇒ mức L.
- Bài toán **tối ưu** (tối đa diện tích sàn…): ràng buộc cứng nào (hệ số sử dụng đất, mật độ xây dựng… theo
  văn bản nào)? mục tiêu là gì? nhiều lời giải thì chọn theo tiêu chí nào? có ca đã biết đáp án để kiểm không?
- **Dễ quên:** mỗi quy tắc cần `Căn cứ` · ca "phải từ chối" · người kiểm tay độc lập.
- **Ghi:** `B-` (mỗi dòng có căn cứ), `E-` (có người kiểm), `RR-`. Chi tiết: `inno-aec` → `calc-quantities.md`.

## 3. CSDL dự án – hợp đồng / chuyển Excel sang cơ sở dữ liệu
- Hiện nay **nguồn sự thật** là file / bảng nào? Ai được sửa? Có nhiều bản lệch nhau không?
- Các đối tượng chính (dự án, hợp đồng, phụ lục, đợt thanh toán, nhân sự) và mã định danh — mã có bị đổi, trùng không?
- Tiền: đơn vị, VAT, ngoại tệ; khi hai file lệch thì số nào là số đúng?
- Dữ liệu cũ bẩn đến đâu; ai xử lý hàng đợi ngoại lệ? Dữ liệu nghi vấn **để trống, không đoán**.
- Ai được xem giá trị hợp đồng, lương? Sau chuyển, đối soát bằng gì (số dòng, tổng tiền, danh sách mẫu)?
- **Ghi:** `D-`, `B-`, `E-` (tổng đối soát), `RR-`. Chi tiết: `careful-engineering` → `data-migration.md`.

## 4. Web app nội bộ (đăng nhập, nhiều vai trò)
- Bảng **vai trò × chức năng**: mỗi vai trò thấy / làm được / không được gì?
- Đăng nhập thế nào (tài khoản Google công ty, tài khoản riêng)? Ai cấp và thu hồi?
- Dùng trên điện thoại không? Bao nhiêu người cùng lúc? Cần lịch sử "ai sửa gì lúc nào" không?
- Thông báo (email, Zalo) khi nào, cho ai?
- **Dễ quên:** người nghỉ việc / chuyển bộ phận · người ngoài công ty xem được gì (`RR-`: lộ dữ liệu giữa các vai trò).
- **Ghi:** `U-`, `R-`, `C-`, `RR-`.

## 5. Bot / tự động nhắn tin (Telegram · Zalo · Facebook)
- Gửi vào đâu (nhóm / kênh nào), cho ai, tần suất? Nội dung có người duyệt trước khi gửi không?
- Đã có nhóm / tài khoản **thử** chưa? Gửi nhầm thì sao (không lùi được)?
- Dùng cách chính thức hay thư viện không chính thức (rủi ro khoá tài khoản khi nền tảng đổi)?
- Giờ Việt Nam; người dùng gõ lệnh thế nào ("T2", "thứ 2", "chủ nhật")?
- **Ghi:** `RR-` (gửi nhầm, khoá tài khoản), `C-`, `A-`.

## 6. Scraper / thu thập dữ liệu
- Trang nào, vài trang hay hàng nghìn? Điều khoản của trang cho phép chưa? Có cần đăng nhập?
- Dữ liệu cá nhân thu về (tên, SĐT): giữ để làm gì, bao lâu, ở đâu?
- Trang đổi cấu trúc thì ai được báo? "0 kết quả" phải bị coi là lỗi.
- Chạy khi nào, kết quả lưu ở đâu, bao nhiêu bản ghi là bình thường?
- **Ghi:** `RR-`, `C-`, `A-` (số bản ghi bình thường — có ngày đo).

## 7. Ứng dụng LLM (chat · RAG · trích xuất / OCR · sinh ảnh)
- **Chịu sai mức nào?** Trích sai một số tiền hợp đồng có sao không? Có người kiểm lại kết quả không?
- Dữ liệu nào **được phép** gửi tới dịch vụ AI bên ngoài? Ai có thẩm quyền đồng ý? Có bắt buộc chạy trên máy công ty không?
- Ai cung cấp 10–30 ca thật có đáp án (bộ đánh giá), gồm ca khó và ca **phải từ chối / nói "không biết"**?
- Chi phí tối đa mỗi tháng; số lượt mỗi ngày; chậm tối đa bao lâu?
- Sinh ảnh / nhìn ảnh: tiêu chí "đạt" là gì, ai chấm bằng mắt, theo bảng nào? Ảnh đầu vào mẫu?
- **Dễ quên:** tài liệu đưa vào có thể chứa lệnh giả (`RR-`) · lưu model + phiên bản prompt để truy lại câu trả lời sai.
- **Ghi:** `E-` (bộ đánh giá, có ngày), `RR-`, `C-` (dữ liệu ra ngoài + người đồng ý).

## 8. Desktop app / công cụ cài trên máy
- Cài cho ai, bao nhiêu máy, có quyền Admin không? Windows nào? Cần chạy offline không?
- Cập nhật tự động hay thủ công? Ai phát bản mới? Gỡ cài đặt thế nào?
- Đường dẫn có dấu tiếng Việt / dấu cách; antivirus chặn exe chưa ký.
- **Ghi:** `C-`, `R-` (cài, cập nhật, gỡ), `RR-`.

## 9. Script / CLI / tự động hoá Excel – Office – file
- Chạy một lần hay định kỳ? Ai bấm? Thư mục nào vào, thư mục nào ra?
- Có được ghi đè file gốc không (mặc định: **không**)? Excel đang mở thì sao?
- Muốn có chế độ "thử" (in ra sẽ làm gì, chưa làm) không?
- **Ghi:** `R-`, `NG-` (không ghi đè nguồn), `RR-`.

## 10. ML · dự báo · tài chính · chứng khoán
- "Thắng cái gì thì gọi là tốt?" (mốc đơn giản: mua-giữ, dự báo bằng giá hôm qua.)
- Giai đoạn dữ liệu nào; có tính phí, thuế, biên độ, T+ không?
- Kết quả để **tham khảo** hay để **ra lệnh**? Ai chịu trách nhiệm quyết định cuối? Lời miễn trừ viết thế nào?
- **Ghi:** `G-` (mốc so sánh), `RR-`, `NG-` (không khuyến nghị đầu tư).

## 11. Game · sự kiện · bình chọn
- **Luật chơi / luật tính điểm viết ra giấy** (một file): ca biên là hoà, huỷ, nộp trễ, chấp lẻ?
- Chống gian lận (một người nhiều phiếu) bằng cách nào? Hạn chót tính theo giờ nào?
- Bao nhiêu người cùng lúc vào ngày chạy? Từ ngày nào đóng băng thay đổi? Có bản dự phòng không? Ai làm trọng
  tài khi tranh chấp?
- **Ghi:** `B-` (luật), `E-` (bảng điểm mẫu có đáp án), `C-` (hạn chót cứng), `RR-`.

## 12. Trang tĩnh · landing · tài liệu
- Ai viết nội dung, ai duyệt? Ảnh, logo, số liệu có thật và được phép đăng không (không bịa số liệu / khách hàng)?
- Công khai hay nội bộ? (Repo công khai lộ gì?) Tên miền? Cần form liên hệ không?
- **Ghi:** `R-`, `C-`, `RR-`.

## 13. Viewer · đọc định dạng file lạ (.skp · .pst · .dwg · 3D)
- Định dạng nào, phiên bản nào? Xin nhiều file mẫu (nhỏ, lớn nhất, lỗi / mã hoá).
- Chỉ xem, hay còn sửa / xuất? Chạy trên web hay trên máy? Kích thước file lớn nhất?
- Thư viện đọc file có giấy phép (GPL…) công ty chấp nhận được không? File lỗi thì hiện gì?
- **Ghi:** `D-` (mẫu từng loại), `C-`, `RR-`.

## 14. Nhiều sản phẩm trong một repo (backend + app + landing + bản cài)
- Liệt kê từng sản phẩm: ai dùng, phát hành riêng hay cùng nhau, phiên bản chung hay riêng? Làm cái nào trước?
- Quá 3 sản phẩm ⇒ tách `docs/scope/<tên>.md`, mỗi file chạy `scope-check` riêng; file gốc chỉ liệt kê và trỏ tới.
- **Ghi:** mỗi sản phẩm một `V-` hoặc một file SCOPE.

## 15. Fork / dùng lại mã của bên thứ ba
- Upstream nào, giấy phép gì, mình đổi gì, có kéo bản mới về không? SCOPE chỉ ghi phần **của mình**.
- **Ghi:** `C-` (upstream + giấy phép), `NG-` (phần upstream không động tới).
