# Kết quả chạy tình huống thử

Mỗi lần chạy một dòng. Tình huống của `careful-engineering` và `inno-aec` (viết 2026-10-26) **chưa chạy lần nào**.
`project-scope` đã chạy một phần (PS-01, PS-03), kết quả ở dưới; PS-02, PS-04 – PS-07 chưa chạy.
Lần chạy đầu tiên cho mỗi skill là mốc (baseline) để so các lần sửa sau.

| Ngày | Model / effort | Skill @ commit | Tình huống | Không skill (đạt/lần) | Có skill (đạt/lần) | Ghi chú — câu biện minh khi vi phạm (nguyên văn) |
|---|---|---|---|---|---|---|
| 2026-11-05 | subagent mặc định / effort mặc định | project-scope v1, chưa commit (trên `62f431c`) | PS-01 · lượt trả lời đầu | 5/8 và 3/8 (2 lần) | 8/8 và 8/8 (2 lần) | Chấm 8 mục "phải có" đã viết trước khi chạy. Không bên nào vi phạm mục "không được". Bên không skill: chỉ 1 câu hỏi lớn về dạng file (DWG / Revit / PDF), không hỏi cách làm hiện tại, không hỏi ai dùng, nhảy sang `git init`. **Mục thứ 9 viết thêm sau khi thấy kết quả** ("mỗi câu một ý chính"): không skill 2/2, có skill 0/2 — mỗi số gộp 3–5 ý nhỏ, nặng cho người không chuyên ⇒ rút gọn `question-bank.md` |
| 2026-11-05 | như trên | project-scope v1.1, chưa commit (sau khi rút gọn câu hỏi) | PS-01 · lượt trả lời đầu | — (không đổi, không chạy lại) | 9/9 và 9/9 (2 lần) | Chạy lại sau sửa; mục 9 đạt cả hai lần, 8 mục đầu không tụt. Bên không skill không chạy lại vì skill mới không ảnh hưởng nó |
| 2026-11-05 | như trên | project-scope v1, chưa commit | PS-03 · đổi phạm vi chạm `NG-1` | 4/6 (1 lần) | 6/6 (1 lần) | Cả hai bên đều dừng, không viết code, không sửa file (đã `diff` với thư mục gốc). Bên không skill thiếu: phân loại ĐỔI HƯỚNG, và phương án "không đổi" / phân tích ảnh hưởng. **Chênh lệch bị thu hẹp** vì thư mục dựng sẵn có dòng `AGENTS.md` "việc không truy được về `R-` là đổi phạm vi: hỏi trước" và `C-1` "mọi thay đổi phải hỏi" |

## Giới hạn của các số này

- **Người chấm không mù:** người chấm (cùng phiên với người viết skill) biết bên nào là bên nào; có thể có thiên lệch.
- **Ít lần chạy:** 2 lần mỗi bên cho PS-01, 1 lần cho PS-03 — chưa đủ để nói về độ ổn định.
- **Cách nạp skill:** bên "có skill" được bảo đọc thẳng `SKILL.md` — **chưa đo** việc `description` có tự kích hoạt skill đúng lúc khi cài thật.
- **Chỉ chấm lượt đầu:** chưa chạy cả khảo sát nhiều vòng (câu trả lời của người dùng, bản tóm tắt, ghi `SCOPE.md`).
- **Bên không skill vẫn thấy** các skill khác đã cài trên máy (ví dụ `careful-engineering`), nên đây là "bộ hiện có" so với "bộ hiện có + project-scope".
- Bộ kiểm của script (`node evals/scope-check.test.js`): 37/37; đột biến `scope-check.js` 16/16 bị bắt, ca đối chứng không đổi gì sống sót như dự kiến.
