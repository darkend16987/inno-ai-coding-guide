# AGENTS.md — dành cho OpenAI Codex và các agent đọc AGENTS.md

Repo này dùng chung hướng dẫn với Claude Code. Trước khi làm bất cứ việc gì:

1. Đọc `CLAUDE.md` ở gốc repo (bản đồ repo, lệnh test, luật không được phá, bẫy đã gặp).
2. Làm theo quy trình trong `skills/careful-engineering/SKILL.md` (chép thư mục
   `skills/careful-engineering` từ https://github.com/darkend16987/inno-ai-coding-guide vào repo này),
   và mở các file trong `skills/careful-engineering/references/` khi bước tương ứng cần.

Tóm tắt bắt buộc:
- Không bịa tên hàm / file / số liệu — chỉ nói điều đã đọc hoặc đã đo trong phiên.
- Yêu cầu mơ hồ thật sự ⇒ hỏi trước, kèm phương án khuyến nghị.
- Chạy toàn bộ test trước và sau thay đổi; test mới phải đỏ được.
- Mỗi việc một commit; message viết ra file rồi `git commit -F`; kiểm lại tiếng Việt sau khi commit.
- Không push / deploy / xoá dữ liệu khi chưa được yêu cầu.
- Cuối việc: cập nhật `docs/HANDOFF.md` (đã làm, số đo, chưa kiểm, bước kế tiếp).
