# Đo xem skill có làm agent tốt lên không

Sửa một skill là sửa hành vi của mọi agent trong team. Câu "thêm luật này chắc sẽ tốt hơn" cũng là một
câu chưa đo. Thư mục này chứa **tình huống thử** cho từng skill và cách chạy để so **có skill** với
**không có skill** (hoặc bản cũ với bản mới).

Thư mục `evals/` không nằm trong `skills/`, nên lệnh cài không chép nó vào máy người dùng.

| File | Skill |
|---|---|
| [careful-engineering.md](careful-engineering.md) | quy trình chung |
| [project-scope.md](project-scope.md) | khảo sát, SCOPE, đổi phạm vi (người không chuyên) |
| [scope-check.test.js](scope-check.test.js) | bộ kiểm của `scope-check.js` — `node evals/scope-check.test.js`, không cần agent |
| [inno-aec.md](inno-aec.md) | luật INNO, CAD/BIM, tính toán, dữ liệu |
| [RESULTS.md](RESULTS.md) | kết quả các lần chạy |

## Cách chạy một tình huống

1. **Môi trường sạch, giống nhau cho hai bên.** Một thư mục tạm (tình huống có ghi repo mẫu thì dựng đúng
   repo đó). Bên A: không cài skill (hoặc bản skill cũ). Bên B: cài skill cần thử — ví dụ cài cho riêng thư
   mục thử bằng `install.ps1 -Project -Skill <tên>`.
2. **Agent mới cho mỗi lần chạy**, cùng model, cùng mức effort. Dán nguyên văn phần *Lời nhắn*.
3. Để agent làm tới khi nó dừng hoặc hỏi. Nếu nó hỏi, trả lời bằng câu ghi trong tình huống (nếu có),
   không gợi ý thêm.
4. **Chấm theo danh sách** *Phải có* / *Không được* của tình huống, từng dòng đạt / không đạt, dựa trên
   transcript và `git diff` — không theo cảm giác. Người chấm tốt nhất là người không biết bên nào là A, B.
5. Ghi một dòng vào [RESULTS.md](RESULTS.md): ngày, model, phiên bản skill (commit), tình huống, A x/y, B x/y,
   ghi chú câu agent dùng để biện minh khi vi phạm (nguyên văn).

Chạy mỗi tình huống ít nhất 2 lần mỗi bên — agent không tất định; một lần đạt có thể là may.

## Quy trình sửa skill (từ bằng chứng, không từ ý thích)

1. **Thấy lỗi thật trước.** Một phiên làm việc thật mà agent làm sai, hoặc một tình huống mà bên *không có
   skill* làm sai. Chưa thấy agent sai thì chưa biết luật mới chặn đúng cái gì.
2. **Viết tình huống tái hiện** vào file của skill (lời nhắn + phải có + không được), chạy với skill hiện tại
   ⇒ phải **thấy nó trượt**. Ghi nguyên văn câu agent biện minh — đó là chỗ luật mới cần nói thẳng.
3. **Sửa skill nhỏ nhất** để chặn đúng lỗi đó. Đề xuất vài cách sửa khác nhau thì chạy thử từng cách trên
   cùng tình huống và giữ cách tốt nhất (không cần đúng ngay lần đầu).
4. **Chạy lại** tình huống mới **và toàn bộ tình huống cũ** của skill đó ⇒ cái mới đạt, cái cũ không tụt.
5. **Bịt lỗ hổng:** agent tìm cách lách bằng câu chữ khác ⇒ thêm câu chữ đó vào luật, chạy lại.
6. Commit kèm số đo: `tình huống CE-07: không skill 0/2, skill cũ 0/2, skill mới 2/2; CE-01..06 không tụt`.

Bài học đưa vào `references/` cũng theo cùng luật của README gốc: chuyện đã xảy ra (có số đo) → luật → cách
áp dụng. Bài học không có bằng chứng thì chưa vào.

## Nguồn

Cách làm phỏng theo:
- *Testing skills with subagents* trong [obra/superpowers](https://github.com/obra/superpowers) (MIT) — chạy
  tình huống khi không có skill để thấy agent trượt, rồi viết luật, rồi bịt lỗ hổng.
- `evals/evals.json` của [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) (MIT) — mỗi tình huống
  chạy cho một agent có skill và một agent không có, người chấm không biết bên nào.
- Vòng *Propose – Probe – Compose* của [google-research/harness2](https://github.com/google-research/harness2)
  (Apache-2.0) — đề xuất vài thay đổi, chạy thử trên cùng việc, chỉ giữ bài học có bằng chứng.
