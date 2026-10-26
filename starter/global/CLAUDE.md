# Hướng dẫn chung — áp dụng cho MỌI dự án trên máy này

> Mẫu từ https://darkend16987.github.io/inno-ai-coding-guide/ — đặt tại `%USERPROFILE%\.claude\CLAUDE.md`
> (Claude Code nạp ở mọi phiên) và/hoặc `%USERPROFILE%\.codex\AGENTS.md` (Codex). Sửa cho hợp với bạn, xoá
> dòng này. Giữ NGẮN: chỉ điều đúng với mọi dự án. Luật riêng của một dự án viết vào `AGENTS.md` của repo đó.

## Tôi & máy
- Giao tiếp, giải thích, tài liệu: **tiếng Việt**. Tên biến / hàm / file trong code: tiếng Anh.
- Windows 11 · PowerShell 5.1 + Git Bash · dự án ở `D:\GitHub\<tên>`.

## Cách làm việc
- Việc sửa code / dữ liệu / hạ tầng: dùng skill **careful-engineering** — chọn mức S/M/L theo rủi ro, nói
  mức một dòng rồi làm đúng các pha của mức đó.
- Repo của INNO, hoặc việc chạm AutoCAD / Revit / LISP / bản vẽ / diện tích / khối lượng / hợp đồng / tiền
  VND: dùng thêm skill **inno-aec**.
- Được giao "xem / kiểm tra / review / giải thích" ⇒ chỉ đọc và báo cáo, chưa sửa.
- Thư mục chưa là git repo ⇒ đề xuất `git init` + commit nguyên trạng trước khi sửa bất cứ gì.
- Không bịa tên hàm, lệnh, API, phiên bản, số liệu. Thư viện / framework đổi nhanh ⇒ đọc phiên bản đang cài
  và tài liệu đúng phiên bản đó trước khi viết code theo trí nhớ.
- Không push, deploy, xoá dữ liệu, gửi tin nhắn, đổi CI khi chưa được bảo. Không commit `.env`, khoá, token.

## Báo cáo
- Kết quả trước; con số đo được (test N/N, probe X/Y); phần **chưa** kiểm và vì sao; cuối cùng một câu hỏi
  quyết định nếu có.
