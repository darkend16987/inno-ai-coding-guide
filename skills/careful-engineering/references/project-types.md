# Theo loại dự án: kiểm chứng gì, bẫy gì, phát hành ra sao

Quy trình 8 pha giống nhau cho mọi dự án; cái khác nhau là **"chạy thật" nghĩa là gì** (pha 4), **bẫy
nào hay gặp** (pha 0, 2) và **phát hành thế nào** (pha 7). Tìm đúng loại, đọc mục đó. Dự án lai (web +
bot + LLM) ⇒ đọc mọi mục liên quan. Mục nào có cách chạy cụ thể cho repo ⇒ ghi vào `docs/RUNBOOK.md`.

Luật chung cho mọi loại:
- **Phiên bản là sự thật của máy, không của trí nhớ.** Framework / SDK đổi nhanh (Next.js, SDK LLM,
  Firebase, API của host CAD). Đọc phiên bản trong lockfile / csproj / `pip show` rồi đọc tài liệu
  **đúng phiên bản đó** (trong `node_modules/<gói>/` hoặc trang chính thức) trước khi viết code theo trí nhớ.
- **Secret không bao giờ vào git, log hay chat.** `.env` và file khoá ở `.gitignore` *trước* commit đầu tiên.
- **Dữ liệu thật để thử phải là bản sao** — không thử trên dữ liệu production, tài khoản thật của người khác.

---

## 1. Web app (React / Vite / Next.js) + BaaS (Firebase / Supabase)

- **Kiểm chứng:** `build` sạch (không chỉ `dev` chạy được — `next build` bắt lỗi kiểu dữ liệu và lỗi
  server/client mà `dev` bỏ qua); test logic (Vitest); **mở trang thật** bằng trình duyệt tự động, đi đúng
  hành trình người dùng, đo DOM **và** dữ liệu đã ghi (document Firestore, dòng DB). Đổi luật bảo mật
  (Firestore rules, RLS) ⇒ test bằng emulator / DB nháp, thử cả chiều **bị cấm**.
- **Bẫy:**
  - Next.js bản mới đổi API (App Router, caching, `params` bất đồng bộ…) — đọc tài liệu đi kèm gói đã cài.
  - Khoá quyền cao (Supabase `service_role`, Firebase Admin SDK) **bỏ qua RLS / rules** ⇒ chỉ dùng ở
    server, không bao giờ có tiền tố `NEXT_PUBLIC_` / `VITE_`. Mọi biến có tiền tố đó đều lộ ra trình duyệt.
  - Tự viết đăng nhập (JWT riêng) ⇒ mọi route API phải tự kiểm quyền; test cả khi thiếu / sai / hết hạn token.
  - Firestore: không ghi `undefined`; thời gian dùng `serverTimestamp()`; truy vấn mới có thể cần index.
  - Tiền: số nguyên (VND không có phần lẻ), không `float`.
- **Phát hành:** Vercel / Firebase Hosting thường **deploy khi push** ⇒ push = phát hành, nói trước. Biến
  môi trường production đặt trên nền tảng, kiểm tên biến (không in giá trị). Sau deploy mở URL thật.

## 2. API / backend / worker (Flask, FastAPI, Express, n8n, job định kỳ)

- **Kiểm chứng:** test đơn vị cho logic; gọi **endpoint thật** trên server chạy local (curl / httpie / test
  client) và kiểm response **và** trạng thái đã ghi. Job định kỳ ⇒ có lệnh chạy một lần bằng tay để thử,
  không chờ lịch.
- **Bẫy:** lỗi bị nuốt trong `try/except: pass` ⇒ API trả 200 rỗng; timeout / retry gọi dịch vụ ngoài
  thiếu; job chạy chồng nhau khi lần trước chưa xong; múi giờ (server UTC, người dùng UTC+7); worker và
  web đọc hai bản cấu hình khác nhau.
- **Phát hành:** Docker ⇒ build image từ đúng commit, chạy chính image đó để thử; health check thật sau
  deploy; xem log container lúc khởi động.

## 3. Desktop app (Electron, Tauri, WPF / WinForms, Python GUI)

- **Kiểm chứng:** tách logic khỏi giao diện để test; điều khiển app thật bằng chuột/phím (CDP cho
  Electron) và đo **file đã lưu**, không chỉ màn hình — [testing-net.md](testing-net.md) §4.
- **Bẫy:** sidecar (Python đóng gói PyInstaller, helper .NET) lệch phiên bản với app chính; đường dẫn có
  dấu tiếng Việt / dấu cách; quyền ghi (`Program Files` chỉ đọc); antivirus chặn exe chưa ký; build
  dài bị kill vẫn để lại bộ cài trông như thật.
- **Phát hành:** kiểm **chính bộ cài** trên đĩa (kích thước, version, sha256 sidecar) và cài thử trên
  máy sạch; bump version để auto-update chạy; ghi chú phát hành từ `git log`.

## 4. Plugin cho phần mềm chủ (AutoCAD, Revit, SketchUp, Office…)

- **Kiểm chứng:** logic thuần (đọc file, tính toán, chuyển đổi) ở thư viện riêng, test không cần phần
  mềm chủ; phần gọi API của host test **trong** host — AutoCAD có `accoreconsole.exe` chạy không giao
  diện; Revit không có, cần test runner chạy trong Revit hoặc kịch bản thử tay.
- **Bẫy:** đúng **phiên bản host** (mỗi năm một bản, .NET Framework 4.8 ↔ .NET 8); DLL của host không
  được chép theo plugin; cài đặt bảo mật nạp DLL; đơn vị nội bộ của host; đa luồng bị cấm.
- **Chi tiết đầy đủ** (AutoCAD .NET, AutoLISP, Revit add-in, phát hành bundle): skill **`inno-aec`**.

## 5. Script / CLI / tự động hoá (Excel, file, Office, PowerShell, .bat)

- **Kiểm chứng:** chạy trên **bản sao** của thư mục / file thật; có chế độ `--dry-run` in ra sẽ làm gì;
  so đầu ra với golden file ([testing-net.md](testing-net.md) §0).
- **Bẫy:** script đổi / xoá file không có đường lùi ⇒ ghi ra thư mục mới, không ghi đè nguồn; Excel bị
  khoá khi đang mở; COM Office để lại tiến trình `EXCEL.EXE` treo; encoding CSV (BOM, cp1258 / cp1252);
  PowerShell 5.1 và tiếng Việt — [windows-unicode.md](windows-unicode.md).
- **Phát hành:** một lệnh chạy được trên máy người khác (README ghi Python / Node bản nào, cài gì);
  không hard-code đường dẫn máy mình.

## 6. Bot (Telegram, Zalo, Facebook, Discord) và tích hợp nhắn tin

- **Kiểm chứng:** tách bộ hiểu lệnh / xử lý tin khỏi lớp gửi-nhận để test bằng tin nhắn giả; thử thật
  trong **nhóm / tài khoản thử**, không trong nhóm thật của công ty.
- **Bẫy:** gửi tin là **không lùi được** — mọi lệnh gửi hàng loạt cần chế độ thử (in ra thay vì gửi) và
  giới hạn số tin; thư viện **không chính thức** (Zalo cá nhân, Facebook scraping) có thể làm khoá tài
  khoản và hỏng khi nền tảng đổi — ghi rủi ro này vào `docs/DECISIONS.md`; webhook nhận trùng tin ⇒
  xử lý idempotent; lịch nhắc theo giờ Việt Nam; ngày tháng tiếng Việt ("thứ 2", "T2", "chủ nhật").
- **Phát hành:** token bot là secret; một bot token chỉ một tiến trình polling chạy (hai bản chạy cùng
  lúc tranh tin).

## 7. Scraper / crawler

- **Kiểm chứng:** lưu **trang mẫu thật** (HTML / JSON) vào `tests/fixtures/` và test parser trên đó; chạy
  thật với giới hạn nhỏ (vài trang).
- **Bẫy:** trang đổi cấu trúc ⇒ parser trả rỗng **im lặng** — 0 kết quả phải là lỗi, không phải thành
  công ([measurement.md](measurement.md) §3); rate limit / chặn IP; điều khoản sử dụng của trang; dữ liệu
  cá nhân thu về (tên, SĐT) phải có lý do giữ và nơi giữ an toàn.
- **Phát hành:** lịch chạy, nơi lưu kết quả, cảnh báo khi số bản ghi thu về lệch bất thường.

## 8. Ứng dụng dùng LLM (chatbot, RAG, trích xuất / OCR + LLM, công cụ prompt)

- **Kiểm chứng:** đầu ra không tất định ⇒ không so bằng chuỗi. Dựng **bộ đánh giá nhỏ** (10–30 ca thật
  có đáp án / tiêu chí, gồm ca khó và ca phải từ chối), chấm bằng luật (trường bắt buộc có, JSON hợp
  lệ, số khớp nguồn) trước, LLM-chấm sau. Báo `đạt 27/30` trước và sau thay đổi prompt / model.
- **Bẫy:**
  - SDK đổi nhanh — kiểm gói đang cài và tài liệu hiện hành; ví dụ với Gemini, SDK cũ
    `google-generativeai` đã ngừng phát triển, dự án mới dùng `google-genai`. Tên model cũng đổi: đọc
    danh sách model hiện có, đừng viết tên theo trí nhớ.
  - Trích xuất số liệu (hợp đồng, hoá đơn) ⇒ **đối chiếu với văn bản nguồn**, LLM được phép trả "không
    tìm thấy", không được đoán; giữ vị trí nguồn (trang / dòng) để người kiểm lại.
  - Nội dung người dùng / tài liệu đưa vào prompt có thể chứa lệnh (prompt injection) ⇒ không cho LLM
    quyền làm hành động khó lùi chỉ dựa trên nội dung đó.
  - Chi phí và giới hạn tốc độ: log số token / số lần gọi; cache kết quả khi chạy lại.
  - Dữ liệu nội bộ gửi lên API bên ngoài ⇒ người có thẩm quyền đồng ý loại dữ liệu nào được gửi.
- **Phát hành:** khoá API ở server; giới hạn số lần gọi mỗi người dùng; ghi model + phiên bản prompt
  vào log để truy lại câu trả lời sai.

## 9. Dữ liệu / ETL / CSDL nghiệp vụ

Đọc [data-migration.md](data-migration.md) — năm luật cứng, migration, đối soát, Excel/CSV nguồn.

## 10. ML / dự báo / tài chính / chứng khoán

- **Kiểm chứng:** tách dữ liệu theo **thời gian** (train quá khứ, test tương lai), không xáo ngẫu nhiên;
  so với **mốc đơn giản** (mua-giữ, dự báo bằng giá hôm qua) — mô hình không thắng mốc thì chưa có gì;
  báo số đo trên tập test chưa từng dùng để chỉnh.
- **Bẫy:** rò rỉ tương lai (look-ahead: dùng giá đóng cửa hôm nay để quyết định hôm nay, chỉ báo tính
  trên cả chuỗi trước khi cắt); bỏ qua phí giao dịch, thuế, biên độ trần sàn, T+ ; dữ liệu điều chỉnh
  cổ tức / chia tách lẫn với dữ liệu chưa điều chỉnh; thư viện dữ liệu đổi API giữa các thế hệ
  (kiểm bản đang cài trước khi viết code).
- **Trình bày:** kết quả là thông tin tham khảo, không phải khuyến nghị đầu tư; ghi rõ giai đoạn
  backtest và giả định.

## 11. Game, app sự kiện, bình chọn, cá cược vui

- **Kiểm chứng:** luật chơi / luật tính điểm viết thành tài liệu nguồn sự thật (`docs/RULES.md`) và
  **golden test** cho bảng điểm (các ca biên: hoà, huỷ trận, nộp trễ, chấp lẻ); thử tải đồng thời nếu
  có bình chọn realtime.
- **Bẫy:** gian lận bình chọn (một người nhiều phiếu) ⇒ ràng buộc ở server / rules, không ở giao diện;
  hạn chót tính theo giờ server; làm tròn điểm / tiền nhất quán một chỗ.
- **Phát hành:** sự kiện có ngày giờ cố định ⇒ đóng băng thay đổi trước giờ chạy, có bản dự phòng.

## 12. Trang tĩnh / tài liệu (GitHub Pages, landing page)

- **Kiểm chứng:** mở qua http (không mở file trực tiếp), thử link, thử màn hình điện thoại; kiểm nội
  dung không lộ thông tin nội bộ nếu repo public.

## 13. Fork / mã của bên thứ ba

- Ghi rõ upstream, commit gốc, license trong `NOTICE` / README. Thay đổi của mình tách khỏi mã upstream
  (thư mục / nhánh riêng) để còn kéo bản mới. Đọc `AGENTS.md` / `CONTRIBUTING.md` của upstream trước.
