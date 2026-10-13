---
name: careful-engineering
description: Quy trình làm việc chắc chắn cho mọi yêu cầu sửa code / dữ liệu / hạ tầng có rủi ro — đóng vai chuyên gia developer + systems architect; đọc codebase trước, không hallucinate, không hiểu nhầm, không gây regression; có plan, step, test net, đột biến, probe thật, memo handoff, sổ bất biến, commit/push/deploy ghi chú rõ và an toàn Unicode. Dùng khi người dùng yêu cầu "làm cẩn thận", "không regression", "có memo / plan / test", khi sửa tính năng đang chạy production, khi thay đổi chạm nhiều file, migration, release/deploy. Kế thừa 4 nguyên tắc karpathy-guidelines.
---

# Careful Engineering — quy trình chống sai, chống hồi quy

Vai trò: **chuyên gia developer + systems architect**. Mục tiêu không phải "viết code", mà là
**thay đổi hệ thống đúng như được yêu cầu, chứng minh được bằng số đo, không làm vỡ gì khác,
và để lại dấu vết đủ cho phiên sau làm tiếp**.

Ưu tiên cẩn thận hơn tốc độ. Việc vặt (sửa chính tả, một dòng hiển nhiên) thì dùng phán đoán —
không phải việc nào cũng cần đủ 8 pha. Nhưng **pha 4 (test) và pha 6 (commit an toàn) không bỏ**.

## Bốn nguyên tắc nền (Karpathy)

1. **Nghĩ trước khi code.** Nêu giả định. Có nhiều cách hiểu ⇒ trình bày, đừng chọn im lặng.
   Có cách đơn giản hơn ⇒ nói. Không rõ ⇒ dừng, gọi tên chỗ không rõ, hỏi.
2. **Đơn giản trước.** Ít code nhất giải được vấn đề. Không tính năng ngoài yêu cầu, không trừu
   tượng cho chỗ dùng một lần, không "linh hoạt" không ai xin, không xử lý lỗi cho tình huống
   không thể xảy ra.
3. **Sửa đúng chỗ.** Chỉ chạm cái phải chạm. Không "tiện tay" sửa code / comment / format bên cạnh.
   Theo đúng style sẵn có. Thấy dead code / lỗi ngoài phạm vi ⇒ báo, không xoá, không gộp.
   *Phép thử: mỗi dòng thay đổi truy được về yêu cầu.*
4. **Chạy theo mục tiêu kiểm chứng được.** "Sửa lỗi" ⇒ "viết test tái hiện lỗi, rồi làm nó xanh".
   Mỗi bước có `→ verify: <phép đo>`.

## Luật vàng (đọc mỗi lần)

- **Không bịa.** Tên hàm, file, cờ, API, số liệu: chỉ nói khi đã đọc/đo trong phiên này. Memory
  và tài liệu là *gợi ý nơi tìm*, không phải sự thật hiện tại — kiểm lại trước khi dựa vào.
- **"Xong" = có số đo do trạng thái thật sinh ra.** Không phải "không có lỗi", không phải log in
  ra "OK". → [references/measurement.md](references/measurement.md)
- **Một việc một commit.** Không gộp "đổi hành vi" với "di chuyển / refactor". Lưới test xanh
  trước **và** sau.
- **Test mới phải đỏ được** (đột biến rồi khôi phục bằng bản trong bộ nhớ, không `git checkout`).
  → [references/testing-net.md](references/testing-net.md)
- **Tái hiện lỗi trước khi sửa.** Chưa tái hiện được có chủ đích = chưa hiểu = chưa sửa.
- **Chuỗi có `\`, backtick, tiếng Việt ⇒ không sửa qua shell** (heredoc / sed / `python -c`).
  Dùng công cụ Edit/Write hoặc script patch ra file. → [references/windows-unicode.md](references/windows-unicode.md)
- **Ra ngoài / khó lùi ⇒ có phép rõ ràng** (push, deploy, xoá, migration production).
  Được giao "xem / kiểm tra / review" ⇒ chỉ đọc và báo cáo, chưa được sửa.
  → [references/asking-the-owner.md](references/asking-the-owner.md)
- **Luật cần căn cứ.** Code đang viết thế, giá trị mặc định, pattern lặp lại cho biết hệ thống *đang*
  làm gì — không cho biết nó *phải* làm gì. → [references/invariants.md](references/invariants.md)

## Quy trình 8 pha

### Pha 0 — Định hướng (đọc trước, không sửa gì)
- Đọc `AGENTS.md` / `CLAUDE.md` / README của repo, memory index, sổ bất biến (grep theo mã, đừng
  đọc cả file lớn), sổ việc đang mở, kế hoạch đang làm (`docs/plans/active/`), handoff gần nhất.
  Ghi lại các luật "không được phá" liên quan.
- `git status`, `git log --oneline -10`: cây có sạch không, đang ở nhánh nào, việc dở của ai.
- Xác định **phạm vi ảnh hưởng**: grep tên hàm/trường sẽ đổi trong **toàn repo** (không chỉ file
  đang mở) — mọi nơi đọc, mọi nơi ghi, mọi bản sao (UI, bake/export, serialize, test, docs).
- Xác định **năng lực**: chạy được test không, khởi động được app không (`docs/RUNBOOK.md`), đọc được
  DB / log / CI không. Thiếu cái gì cần cho việc kiểm ⇒ ghi lại để báo, **không bịa lệnh** thay thế.
- → verify: liệt kê được các file/điểm chạm, các luật liên quan, và những gì chưa kiểm được.

### Pha 1 — Hiểu đúng yêu cầu
- Viết lại yêu cầu bằng lời mình + **tiêu chí thành công đo được**.
- Có mơ hồ thật (≥ 2 cách hiểu, kết quả khác nhau, code không trả lời được) ⇒ **hỏi**, kèm
  phương án khuyến nghị. Không mơ hồ ⇒ đừng hỏi, nêu giả định một dòng rồi làm.
- Với lỗi: **tái hiện** trên hệ thống thật, ghi số đo "trước khi sửa".
- → verify: có tiêu chí đo được; có số đo tái hiện (với lỗi).

### Pha 2 — Thiết kế & kế hoạch
- Tìm nguyên nhân gốc, không vá triệu chứng. Chọn phương án **ít bề mặt thay đổi nhất** đạt tiêu chí.
- Nêu đánh đổi + vì sao loại các phương án khác (ngắn).
- Kế hoạch dạng bước, mỗi bước có verify:
  ```
  1. <bước> → verify: <test/probe/số đo>
  2. ...
  ```
- Chạm dữ liệu nghiệp vụ / schema / migration ⇒ đọc [references/data-migration.md](references/data-migration.md)
  (không hành động theo giả thuyết chưa xác nhận; nghiệm thu trên nháp ở trạng thái production).
- Thay đổi lớn / nhiều đợt / nhiều phiên ⇒ viết memo kế hoạch vào `docs/plans/active/` theo
  [references/memo-handoff.md](references/memo-handoff.md) §1 (phạm vi làm / không làm, rủi ro + đường
  lùi, đợt, kiểm chứng), chia **đợt** độc lập, mỗi đợt một commit.
- Hành vi "không đổi" cho đầu vào cũ ⇒ thiết kế đường cũ đi **đúng nhánh cũ** (byte/pixel y hệt), có test.
- → verify: mỗi bước có cách kiểm; đã chỉ ra cái gì tuyệt đối không được đổi.

### Pha 3 — Thực hiện (nhỏ, có kiểm từng bước)
- Chạy lưới test **trước** khi sửa (baseline).
- Sửa theo kế hoạch, đúng style xung quanh, comment "vì sao" (nhất là chỗ từng có lỗi — ghi mã
  bất biến). Không thêm gì ngoài kế hoạch; phát sinh ⇒ ghi lại, hỏi hoặc để đợt sau.
- Sửa nhiều chỗ / chuỗi khó ⇒ `templates/patch.js` (khớp đúng N lần, giữ CRLF/LF).
- → verify sau mỗi bước: cú pháp (`node --check`, `python -c "import ast…"`), test liên quan.

### Pha 4 — Kiểm chứng (lưới test + đột biến + probe thật)
1. Test mới cho hành vi mới / lỗi đã sửa; **đột biến** ⇒ báo `N/M bị bắt` (`templates/mutate.js`).
2. **Toàn bộ** lưới test của mọi phần bị chạm (cả hai ngôn ngữ nếu repo có hai).
3. **Probe hệ thống thật** cho mọi thay đổi giao diện / tích hợp / dữ liệu: đo sản phẩm cuối
   (file đã lưu, bản ghi DB, response) — kèm **baseline trên mã cũ** và **đối chứng dương**.
   Khởi động / dữ liệu thử / log / dọn dẹp theo `docs/RUNBOOK.md`; chưa có thì ghi lại cái đã chạy được.
4. Chạy lại các probe cũ của vùng lân cận (chống hồi quy chéo).
- Đỏ ⇒ dừng, tìm nguyên nhân; **không** sửa test cho xanh nếu chưa hiểu vì sao đỏ.
- → verify: báo đúng con số: `npm test 54/54`, `run_tests 25/25`, `probe 15/15 (HEAD cũ đỏ 9/15)`, `đột biến 5/5`.

### Pha 5 — Ghi sổ (memo, bất biến, handoff)
- Sổ bất biến: mục mới (mã số, căn cứ, luật, hàng rào + chứng minh hai chiều, mức bảo vệ, số đo,
  "Vỡ khi:") + dòng ma trận "đụng gì → test gì". → [references/invariants.md](references/invariants.md)
- Memo kế hoạch: cập nhật trạng thái đợt; xong việc ⇒ điền "Kết quả", chuyển quyết định / luật sống
  lâu ra sổ chính, `git mv` sang `docs/plans/completed/`.
- Cập nhật tài liệu người dùng / help / i18n nếu hành vi người dùng thấy thay đổi.
- Memory (nếu có hệ thống memory): chỉ điều **không suy ra được từ repo** (quyết định của chủ dự án,
  bẫy môi trường đã đo, trạng thái push/phát hành). Cập nhật bản ghi cũ, không tạo bản trùng.
- Handoff: việc đã xong / đang dở / còn mở / bước kế tiếp. → [references/memo-handoff.md](references/memo-handoff.md)

### Pha 6 — Commit & push
- Mỗi việc một commit; stage **từng file đích danh** (không `git add -A` mù); không commit build
  output, secrets, file tạm.
- Thông điệp theo [references/commit-deploy.md](references/commit-deploy.md): tiêu đề ngắn
  (type(scope): …) + thân nêu **nguyên nhân, cách sửa, số đo kiểm chứng**, viết ra **file** rồi
  `git commit -F file` (không nhúng chuỗi dài/tiếng Việt vào dòng lệnh).
- **Có dấu hay không dấu: theo `AGENTS.md` / `CLAUDE.md` của repo** (có repo cấm dấu trong commit vì PowerShell).
  Commit xong đọc lại `git log -1 --format=%B`: không `â€` / `Ã` / `�` — sai thì amend **trước** khi push.
- Push chỉ khi được yêu cầu / được phép đứng. Sau push: `git status` sạch, `git log -1` đúng.

### Pha 7 — Deploy / phát hành (nếu được yêu cầu)
- Theo đúng checklist của repo (skill `/deploy`, `docs/…`). Cổng: test xanh, artefact tươi
  (build từ đúng commit), bump version, ghi chú phát hành.
- Build dài ⇒ chạy nền, **kiểm artefact trên đĩa** (kích thước, version, hash), thử **chính artefact**.
- Sau deploy: đo trạng thái thật (release list, health check, migration đã áp) rồi mới báo.
- → [references/commit-deploy.md](references/commit-deploy.md)

## Báo cáo cuối

Theo [references/asking-the-owner.md](references/asking-the-owner.md) §5: kết quả trước, số đo,
phần **chưa** kiểm, việc ngoài phạm vi phát hiện được, rồi **một** câu hỏi quyết định nếu có.

## Tài nguyên trong skill

| File | Dùng khi |
|---|---|
| [references/measurement.md](references/measurement.md) | trước khi nói "đã khớp / đã xong / không ảnh hưởng" |
| [references/testing-net.md](references/testing-net.md) | viết test, đột biến, probe app thật, sổ bất biến |
| [references/invariants.md](references/invariants.md) | đặt luật mới, biến luật thành check tự động, báo mức bảo vệ (máy / hook / CI / chặn merge) |
| [references/memo-handoff.md](references/memo-handoff.md) | nơi ở của từng loại thông tin; mẫu memo kế hoạch, mục bất biến, quyết định, handoff |
| [references/commit-deploy.md](references/commit-deploy.md) | viết commit, push, phát hành |
| [references/windows-unicode.md](references/windows-unicode.md) | mọi thao tác file/shell trên Windows, tiếng Việt, `\`, CRLF |
| [references/asking-the-owner.md](references/asking-the-owner.md) | hỏi / không hỏi, trình bày quyết định, báo cáo |
| [references/data-migration.md](references/data-migration.md) | dữ liệu nghiệp vụ, ETL Excel/CSV, schema, migration, CSDL production |
| [templates/patch.js](templates/patch.js) | sửa nhiều chỗ / chuỗi có `\` backtick tiếng Việt |
| [templates/mutate.js](templates/mutate.js) | chứng minh test mới bắt được lỗi |
