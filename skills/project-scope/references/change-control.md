# Giữ SCOPE sống — mở lại, kiểm, và đổi có kiểm soát

Phạm vi **sẽ** đổi: người dùng hiểu thêm, dữ liệu thật khác dự kiến, luật thay đổi. Mục tiêu không phải cấm
đổi, mà là **không đổi trong im lặng**. Một SCOPE chết (không ai cập nhật) còn tệ hơn không có SCOPE, vì nó
tự tin sai. File này nói khi nào mở SCOPE, phân loại thay đổi, và cập nhật gì khi đổi.

## 1. Mở lại mỗi phiên (đầu việc)

1. Chạy `node scripts/scope-check.js docs/SCOPE.md`. Đọc bảng tiến độ, **LỖI**, **CẢNH BÁO** (số đo quá hạn,
   câu hỏi quá hạn, câu hỏi MỞ đang chặn việc).
2. Đọc **chỉ** các dòng liên quan, tìm theo ID (`grep "R-7"`) — bảng yêu cầu, `Q-` đang mở, `B-` / `E-` / `NG-`
   mà việc hôm nay chạm tới. Đừng đọc cả file mỗi phiên.
3. **Truy vết:** việc hôm nay phục vụ `R-` nào (hoặc `G-` nào)? Nói ra: `Việc này phục vụ R-7, R-9`.
   Không truy được ⇒ dừng; đây là thay đổi phạm vi (mục 2).
4. Số đo / giả định có `As-of` quá cũ ⇒ đo lại trước khi dựa vào (đo bằng cách nào ghi ở cột *Cách kiểm*).

`careful-engineering` pha 0 gọi bước này. Pha 5 (ghi sổ) là chiều ngược lại: cập nhật trạng thái (mục 4).

## 2. Phân loại thay đổi

Phân loại bằng **phép thử**, không bằng cảm giác. Phân vân ⇒ chọn loại cao hơn.

| Loại | Phép thử (đúng **một** điều là đủ để lên loại cao hơn) | Làm gì |
|---|---|---|
| **LÀM RÕ** | Chỉ chi tiết hoá một yêu cầu có sẵn; người dùng không thấy gì khác đi so với những gì họ đã duyệt | Sửa tại chỗ, ghi một dòng `CR-` loại LÀM RÕ. Không cần duyệt. Không đổi phiên bản |
| **ĐỔI NHỎ** | Thêm / đổi một `R-` **nằm trong mục tiêu `G-` đã duyệt**; không đụng quy tắc `B-`, ví dụ `E-`, `NG-`; không thêm vai trò hay nguồn dữ liệu; làm trong ≤ 1 đợt; lùi được bằng revert | Ghi `CR-`. Nói với người dùng một câu: "Tôi sẽ thêm R-12 …, ảnh hưởng …, đồng ý?" — trừ khi họ đã cho phép đứng "đổi nhỏ không cần hỏi" (ghi thành `C-`); khi đó làm rồi báo. Phiên bản +0.1 |
| **ĐỔI HƯỚNG** | Có **một** trong: vai trò người dùng mới · nguồn dữ liệu mới hoặc dữ liệu ra khỏi công ty · đụng con số dùng để quyết định (tiền, diện tích, khối lượng, hợp đồng) · đổi / xoá `B-`, `E-` · đụng `NG-` · dời hạn chót cứng · sửa hoặc bỏ `R-` đã XONG · cần > 1 đợt | **Dừng.** Làm đề xuất `CR-` (mục 3), chờ duyệt rõ ràng. Trạng thái SCOPE → ĐANG ĐỔI. Hỏi lại khối câu hỏi / gói loại dự án liên quan. Phiên bản +1.0 |

Người dùng nhờ trong chat "tiện thể làm luôn …" là **thay đổi phạm vi** — phân loại như trên, đừng làm ngay.
Yêu cầu chạm `NG-` (đã thoả thuận không làm) luôn là ĐỔI HƯỚNG: nói rõ đã thoả thuận không làm vì lý do gì.

## 3. Đề xuất đổi hướng

Trình bày cho người dùng **bằng lời thường**, một trang:
- **Đề nghị:** muốn đổi gì, vì sao (người dùng nói gì hoặc phát hiện gì lúc làm).
- **Đổi gì trong SCOPE:** các `R-`, `B-`, `E-`, `NG-` bị chạm.
- **Ảnh hưởng:** việc đã xong phải làm lại? kế hoạch / test / dữ liệu / hạn chót thay đổi thế nào?
- **2–3 phương án** (kể cả "không đổi", và "đổi nhỏ hơn"), có khuyến nghị và lý do.
- **Cái bạn cần quyết:** một câu. Kèm "làm theo cách hiểu của tôi" nếu người dùng không muốn bàn.

Chưa duyệt thì **không** sửa mã theo đề xuất, không đổi `R-` sang ĐÃ DUYỆT. Duyệt xong ghi tên + ngày vào `CR-`.

## 4. Cập nhật khi đổi (cascade)

| Việc | Ở đâu |
|---|---|
| Dòng `CR-` mới: ngày · loại · thay đổi · vì sao · ai duyệt · ảnh hưởng (liệt kê ID) | §14 SCOPE — chỉ thêm, không xoá |
| `R-` / `B-` / `E-` / `NG-` bị chạm; dòng bị thay thế ghi "(đã sửa ở CR-n)" thay vì xoá | các mục tương ứng |
| Câu hỏi mới phát sinh từ thay đổi | §12 `Q-` |
| `A-` bị chứng minh sai ⇒ trạng thái SAI + `CR-` + sửa `R-` phụ thuộc | §10, §14 |
| Phiên bản (LÀM RÕ: giữ · ĐỔI NHỎ: +0.1 · ĐỔI HƯỚNG: +1.0) và ngày cập nhật | đầu file |
| Kế hoạch đang làm: đợt nào bị chạm, đánh dấu | `docs/plans/active/` |
| Luật chống hồi quy / ràng buộc môi trường nếu đổi | `docs/REGRESSION-GUARD.md`, `AGENTS.md` |
| Chạy lại `scope-check`; commit riêng `docs(scope): CR-n …` | git |

Lịch sử = git của `docs/SCOPE.md` + §14. Hai người mâu thuẫn ⇒ ghi cả hai vào `Q-`, hỏi **ai quyết**, đừng chọn im lặng.

## 5. Khi xong việc (chiều ngược lại)

- `R-` làm xong ⇒ `XONG` **chỉ khi** cột *Nghiệm thu* trỏ tới thứ chạy được (ví dụ `E-3`, tên test, probe)
  và thứ đó đã chạy xanh. Ghi commit vào ô *Nghiệm thu* hoặc dòng `CR-` / handoff.
- Câu hỏi đã có trả lời ⇒ `Q-` ĐÃ TRẢ LỜI; trả lời đổi quy tắc / con số ⇒ viết vào `docs/OWNER-ANSWERS.md` theo
  mẫu (nguyên văn · tôi hiểu là · không hiểu là · tác động · CHỜ XÁC NHẬN / ĐÃ XÁC NHẬN) rồi mới đổi `B-`.
- Giả định đã kiểm ⇒ ĐÚNG hoặc SAI kèm ngày đo mới (`As-of`).
- Phát hiện lúc làm việc cần thêm ngoài phạm vi ⇒ **không** gộp vào việc đang làm: tạo đề xuất `CR-` hoặc ghi `docs/OPEN-ISSUES.md`.

## 6. Dấu hiệu SCOPE đang chết

`scope-check` cảnh báo hoặc bạn thấy: số đo `As-of` > 30 ngày · `Q-` quá hạn vẫn MỞ · `R-` ĐANG LÀM nhiều tuần
không đổi · code có tính năng không truy được `R-` nào · người dùng nói "tôi tưởng nó phải làm cả X" mà SCOPE
không có X. Gặp một dấu hiệu ⇒ báo ngay và dọn (đo lại, hỏi lại, hoặc đóng `R-` đã bỏ).
