# Bất biến: từ một dòng trong sổ thành hàng rào chạy được

Một mục `BI-*` trong sổ chỉ là chữ. Nó chỉ bảo vệ được khi có một phép kiểm **tự chạy** ở đúng chỗ
mọi người vẫn chạy test, **đỏ đúng lúc** luật bị phá, và **nói rõ phải sửa gì**. File này trả lời:
khi nào được đặt luật, viết ranh giới thế nào, gắn check vào đâu, chứng minh ra sao, và báo cáo
mức bảo vệ thật — không hơn.

*Phỏng theo pattern "Encoding Invariants" của [hoangnb24/repository-harness](https://github.com/hoangnb24/repository-harness) (MIT), ghép với bài học của team.*

## 1. Căn cứ: ai nói luật này phải đúng?

- Chỉ mã hoá một luật khi có **căn cứ**: quyết định `QĐ-*` đã chốt; câu trả lời của chủ dự án đã
  xác nhận diễn giải ([memo-handoff.md](memo-handoff.md) §4); một lỗi đã tái hiện có chủ đích (luật
  sinh ra từ việc sửa lỗi đó); spec / hợp đồng API / quy định nghiệp vụ.
- **Không phải căn cứ:** code đang viết như vậy, một pattern lặp lại, test hiện có, giá trị mặc định
  của công cụ hay của file cấu hình, sở thích chưa ai ghi. Những thứ đó cho biết hệ thống **đang** làm
  gì, không cho biết nó **phải** làm gì. Mã hoá chúng thành luật = đóng băng một sự tình cờ.
- Lời luật có hai cách hiểu cho ra hai ranh giới khác nhau ⇒ dừng, hỏi **đúng một** lựa chọn còn
  thiếu ([asking-the-owner.md](asking-the-owner.md) §3). Ví dụ: "UI không được gọi thẳng DB" chưa đủ
  để viết check — UI là những thư mục nào? Gọi qua `repo/` có được không? Script admin có tính không?
- Luật tự đặt khi chưa ai duyệt: vẫn được ghi và mã hoá, nhưng đánh dấu **"(tôi tự đặt, chờ duyệt)"**
  như một `QĐ` đề xuất, để phiên sau gỡ được.

## 2. Viết ranh giới trước khi chọn công cụ

| Trường | Nội dung bắt buộc |
|---|---|
| Căn cứ | Nguồn ở §1 + câu luật nguyên văn |
| Phạm vi | File / module / bảng / cấu hình / đối tượng runtime mà luật phủ |
| Được phép | Ít nhất một ví dụ hợp lệ cụ thể |
| Bị cấm | Chính xác cấu trúc / hành vi phải chặn |
| Ngoại lệ | Chỉ những ngoại lệ **chính căn cứ** nêu — không tự thêm cho tiện |
| Thông báo khi đỏ | Thứ vi phạm, luật bị phá, mã `BI-*`, việc cần làm |

Đừng gắn thêm sở thích lân cận vào cùng check: luật cấm một hướng phụ thuộc thì đừng kiểm luôn cách
đặt tên file. Mỗi thứ thêm vào là một nguồn đỏ giả mà người sau sẽ tắt luôn cả check.

## 3. Gắn vào lệnh kiểm sẵn có của repo

- Tìm **chủ** của việc kiểm: lệnh test, task runner (`npm test`, `pytest`, `make check`), cấu hình
  linter, script validate. Thêm check vào đó để mọi người vẫn chạy **một lệnh như cũ** — check nằm ở
  lệnh riêng thì sẽ không ai chạy.
- Check **nhỏ nhất, tất định**, ở tầng thấp nhất nhìn được toàn bộ phạm vi. Dùng cơ chế có sẵn (một
  test, một rule của linter đang dùng). Không thêm framework, ngôn ngữ hay dịch vụ mới chỉ để kiểm
  một luật.
- Chọn kiểu check theo loại luật:

  | Loại luật | Kiểu check |
  |---|---|
  | Hành vi (đầu vào X ⇒ kết quả Y) | test đơn vị / test tái hiện lỗi |
  | Cấu trúc (ai được gọi ai, trường phải có ở đủ N chỗ) | test quét mã nguồn, ghim regex — [testing-net.md](testing-net.md) §3 |
  | Dữ liệu (đếm khớp, không dòng mồ côi) | khối đối soát `RAISE EXCEPTION` trong file sinh ra — [data-migration.md](data-migration.md) §1 |
  | Môi trường (đúng phiên bản, đủ biến môi trường) | script kiểm trước khi chạy, dừng với thông báo rõ |

- **Thông báo khi đỏ phải tự đủ**, người đọc không cần lần ngược code để hiểu luật:
  ```text
  src/ui/OrderForm.js gọi db.query trực tiếp: UI không được truy vấn DB
  (BI-7, docs/REGRESSION-GUARD.md). Gọi qua orderRepo.
  ```
  Không chấp nhận: `assertion failed`, `expected true, got false`.
- Check **tự kiểm đầu vào**: quét 0 file / đọc 0 dòng ⇒ FAIL, không PASS. Đổi tên thư mục là đủ để
  một check quét sai chỗ xanh mãi mãi ([measurement.md](measurement.md) §3).

## 4. Chứng minh hai chiều

- **Chiều cho qua:** một ca hợp lệ đã biết vẫn xanh. Bắt được check cấm luôn cả cái đúng, hoặc quét
  nhầm phạm vi.
- **Chiều chặn:** đưa vi phạm vào bằng đột biến ([templates/mutate.js](../templates/mutate.js)) hoặc
  một fixture riêng ⇒ check đỏ, **và đỏ với đúng thông báo / mã luật** — đỏ vì lỗi cú pháp không
  tính. Đột biến quan trọng nhất: đưa **lỗi gốc** trở lại.
- Vi phạm thử phải khôi phục được: không để file vi phạm nằm lại trong cây làm việc.
- Repo xanh mà chưa từng thấy check đỏ = chưa chứng minh check bắt được gì. Xem thêm
  [measurement.md](measurement.md) §6.

## 5. Báo đúng mức bảo vệ thật

Mỗi mức chỉ chứng minh chính nó. Báo **riêng từng mức**, mức nào chưa xem thì nói "chưa kiểm":

| Mức | Được phép nói | Kiểm bằng |
|---|---|---|
| Chạy tay | Lệnh tồn tại; đã chạy trong phiên này chưa, kết quả bao nhiêu | chạy lệnh |
| Hook (pre-commit…) | Có hook gọi lệnh hay không. Hook là tiện ích của từng máy, bỏ qua được | đọc cấu hình hook |
| CI | Có workflow gọi đúng lệnh đó không. **Có file workflow ≠ đã chạy trên commit này** | `.github/workflows/`, `gh run list --limit 5` |
| Chặn merge | Chỉ nói "bắt buộc trước khi merge" khi đã xem branch protection / ruleset | `gh api repos/<owner>/<repo>/rules/branches/main` (cần quyền; không xem được ⇒ "chưa kiểm") |

Được giao "mã hoá luật" **không** bao gồm cài hook, sửa CI hay đổi branch protection. Những việc đó
đổi trạng thái dùng chung của cả team ⇒ đề xuất, xin phép riêng.

## 6. Ghi sổ và báo cáo

- Ghi mục `BI-*` theo mẫu [memo-handoff.md](memo-handoff.md) §2 (có dòng **Căn cứ**, **Hàng rào**,
  **Mức bảo vệ**) + một dòng ma trận "đụng gì → test gì".
- Luật chưa tự động hoá được (cần mắt người, cần production) ⇒ ghi thẳng
  `Hàng rào: test tay — <các bước>`, để không ai tưởng đã có máy canh.
- Báo cáo theo thứ tự: ① căn cứ + phạm vi; ② lệnh chủ + check đã thêm; ③ chứng minh hai chiều kèm số
  đo; ④ từng mức bảo vệ ở §5; ⑤ chỗ hở, ngoại lệ, phần chưa kiểm.

## 7. Check cấu trúc có sẵn: đừng làm chúng im

Repo đã có test canh cấu trúc (trùng tên toàn cục, hợp đồng IPC, "mọi chỗ ghi phải qua undo"…) mà
code mới làm đỏ ⇒ **sửa code theo luật, không nới luật**. Luật thật sự sai ⇒ đổi căn cứ trước (QĐ
mới, được duyệt), rồi mới sửa check. Thêm một phụ thuộc lúc nạp module ⇒ thêm luật tương ứng vào test.
