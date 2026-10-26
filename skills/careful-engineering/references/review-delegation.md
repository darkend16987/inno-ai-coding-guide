# Giao việc cho subagent, review độc lập, nhận review

Claude Code, Codex và nhiều agent khác giao được việc cho **subagent** (agent con có ngữ cảnh riêng).
Dùng đúng thì nhanh hơn và soát được lỗi mà người viết không thấy; dùng sai thì tốn token và mang về
những báo cáo "xong" chưa ai kiểm.

*Phỏng theo các skill subagent-driven-development, requesting-code-review và receiving-code-review của
[obra/superpowers](https://github.com/obra/superpowers) (MIT, © Jesse Vincent).*

## 1. Khi nào giao, khi nào tự làm

| Giao cho subagent | Tự làm |
|---|---|
| Đọc / tìm kiếm rộng nhiều thư mục, chỉ cần kết luận | Việc vài lệnh, biết sẵn file nào |
| Các phần **độc lập** của kế hoạch (không chung file, không cần kết quả của nhau) | Các bước dính nhau, cùng sửa một file |
| **Review** cần con mắt không bị kéo theo cách nghĩ của người viết | Kiểm chứng cuối cùng trước khi báo người dùng |

Mỗi lần giao tốn một ngữ cảnh mới ⇒ phân vân thì tự làm.

## 2. Viết lời giao việc (brief)

Subagent **không thấy** cuộc trò chuyện. Lời giao là toàn bộ những gì nó biết:
- Mục tiêu và **tiêu chí xong** đo được; phạm vi: được sửa file nào, **không** được chạm gì.
- Đường dẫn chính xác cần đọc; điều đã loại trừ (để nó khỏi đi lại đường cũ); luật repo liên quan (`BI-*`).
- Lệnh test phải chạy và câu chữ "xanh" của runner; yêu cầu báo **phần chưa kiểm**.
- Không giao kèm giả thuyết của mình khi muốn nó tự kiểm — agent được đưa giả thuyết thường "xác nhận" nó.

## 3. Báo cáo của subagent là LỜI KHAI, không phải bằng chứng

- "Đã xong, test xanh" ⇒ tự xem `git diff` / `git status`, tự chạy lại lệnh kiểm then chốt trước khi nói
  với người dùng ([measurement.md](measurement.md)).
- Lý do thiết kế trong báo cáo ("để đơn giản", "theo YAGNI") cũng là lời tự chấm — xét code theo chính nó.
- Không bao giờ chuyển tiếp báo cáo của subagent cho người dùng như kết quả đã xác nhận.

## 4. Review độc lập (trước khi báo xong việc mức L, trước merge)

Giao cho một agent **mới** (không mang ngữ cảnh phiên làm việc), đưa: yêu cầu / thiết kế / kế hoạch, mô
tả ngắn đã làm gì, khoảng commit (`BASE_SHA..HEAD_SHA`). Yêu cầu nó trả **hai kết luận riêng**:

1. **Đúng yêu cầu chưa** — có làm thiếu, làm thừa (tính năng không ai xin), hiểu lệch chỗ nào. Mục nào
   không kiểm được chỉ từ diff (yêu cầu nằm ở code không đổi) ⇒ liệt kê riêng "chưa kiểm được từ diff" —
   người giao phải tự kiểm từng mục đó.
2. **Chất lượng** — lỗi, ca biên, test có đỏ được không, đọc có hiểu không, có phá `BI-*` nào không.

Mức độ: **Nghiêm trọng** (sửa ngay) · **Quan trọng** (sửa trước khi đi tiếp) · **Nhỏ** (ghi lại).
Reviewer chỉ đọc: không sửa cây làm việc, không đổi nhánh. Ngoài diff chỉ xem khi gọi tên được một rủi ro
cụ thể (đổi hợp đồng hàm ⇒ xem các nơi gọi).

## 5. Nhận review (từ agent hay từ người)

1. Đọc hết, chưa phản ứng.
2. Diễn lại yêu cầu bằng lời mình; mục nào không rõ ⇒ **hỏi trước, chưa sửa gì** (sửa nửa vời theo mục đã
   hiểu, bỏ mục chưa hiểu, thường sai cả hai).
3. **Kiểm với code thật**: góp ý có đúng với repo này không, có phá gì khác không?
4. Đúng ⇒ sửa từng mục, test từng mục. Sai ⇒ **phản biện có lý lẽ** và bằng chứng (test, dòng code).
5. Không đồng ý cho có ("Anh nói rất đúng!") — hành động hoặc lý lẽ thay cho lời khen.
6. Góp ý vượt phạm vi việc này ⇒ ghi vào sổ việc mở, không gộp vào commit hiện tại.

## 6. Trong lúc chạy một kế hoạch đã duyệt

Đừng dừng hỏi "làm tiếp nhé?" giữa các đợt ([asking-the-owner.md](asking-the-owner.md) §2). Gặp chỗ kế
hoạch không nói ⇒ tự quyết, ghi vào memo §7 dạng `quyết định — vì — nếu sai thì tốn gì`, rồi đi tiếp.
Chỉ dừng khi: thao tác khó lùi / ra ngoài (xoá, push, deploy, gửi tin), việc liên quan bảo mật, hoặc kế
hoạch hỏng tới mức mọi hướng đi đều là đoán.
