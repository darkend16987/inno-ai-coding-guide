# Ngân hàng câu hỏi — hỏi người dùng, kể cả người không chuyên

Dùng ở bước 2 của `SKILL.md`. Chọn khối theo chế độ (nhanh / đầy đủ), nạp thêm gói theo loại dự án ở
[type-packs.md](type-packs.md). Mỗi khối cho biết câu hỏi, ví dụ trả lời, khi nào hỏi thêm, mặc định đề xuất
khi người dùng "chưa biết", và ghi vào đâu trong `SCOPE.md`.

## Cách hỏi (đọc trước)

1. **Tối đa 5 câu mỗi vòng**, đánh số, mỗi câu **một ý chính (một dấu hỏi)**, thêm nhiều nhất một ý phụ liền
   kề. Phần *Hỏi thêm* của mỗi khối là để hỏi ở **vòng sau** khi câu trả lời gợi ra — đừng gộp vào câu đầu. Câu
   có bốn ý thì người không chuyên trả lời ý đầu rồi bỏ qua phần còn lại; nhiều hơn 5 câu thì họ trả lời cho
   xong chứ không trả lời cho đúng.
2. **Nói như người trong nghề**, không như lập trình viên. Không "API", "schema", "database", "backend".
   Cần hỏi về kỹ thuật thì hỏi hệ quả: không hỏi "dùng database nào" mà hỏi "nhiều người cùng xem và sửa
   một danh sách trên mạng công ty không?".
3. **Mỗi câu có ba thứ:** *vì sao hỏi* (một dòng, để người trả lời biết câu này quan trọng), *ví dụ trả lời*
   (để họ biết mức chi tiết), và *"chưa biết — bạn đề xuất"* (không ai phải bịa câu trả lời).
4. **Xin hiện vật thay vì mô tả:** file mẫu, ảnh chụp màn hình, bảng Excel đang dùng, một bản vẽ thật. Một
   file mẫu trả lời được năm câu hỏi.
5. **Nhắc lại rồi mới đi tiếp.** Sau mỗi vòng viết 3–5 dòng "tôi hiểu như sau"; với mọi câu trả lời về
   **quy tắc, con số, ai được làm gì**: nhắc lại bằng lời mình và xin xác nhận trước khi ghi ĐÃ XÁC NHẬN
   (quy ước OWNER-ANSWERS của `memo-handoff.md` §4).
6. **Người trả lời chưa chắc là người làm.** Quản lý kể quy trình thường gọn hơn thực tế. Hỏi: "Người làm
   việc này hằng ngày có làm giống vậy không? Họ có mẹo hay ngoại lệ nào?". Hai người nói khác nhau ⇒ ghi cả
   hai vào câu hỏi mở và hỏi **ai là người quyết**, đừng chọn im lặng.
7. **Không hỏi điều đã có đáp án** trong file / repo / tài liệu, hay điều AI tự đo được.
8. **"Chưa biết" không phải ngõ cụt.** Đề xuất mặc định (ghi ở mỗi khối), ghi thành giả định có "nếu sai
   thì …", nói rõ đó là đề xuất của AI. Ngoại lệ: **quy tắc nghiệp vụ và công thức không có mặc định** — chưa
   có căn cứ thì hỏi *chỗ tìm* ("quy định này nằm ở văn bản nào, ai nắm?") và để câu hỏi mở.
9. **Hai câu hay bị quên** khi ví dụ của người dùng cho giá trị bất khả (âm, > 100 %…): ① "dữ liệu nhập sai,
   số đúng là…" ② "cả hai cách hiểu đều sai vì trường hợp này khác". Hỏi luôn số đúng trong cùng lượt.
10. **Dữ liệu nhạy cảm không vào chat.** Xin đường dẫn tới file đã ẩn danh; không dán tên khách hàng, giá
    hợp đồng, lương vào cuộc trò chuyện hay vào SCOPE.
11. **Dấu hiệu mệt:** trả lời ngắn dần, "sao cũng được", "cứ làm đi". Dừng, chốt bản nháp, phần còn lại thành
    giả định / câu hỏi mở. Mệt rồi mà vẫn hỏi thì câu trả lời sau là rác.

### Khuôn một câu hỏi

```
**3. Ai sẽ dùng nó?**
Vì sao hỏi: quyết định tool chỉ chạy trên máy một người hay cần đăng nhập, phân quyền.
Ví dụ: "3 người phòng thiết kế, dùng AutoCAD 2024 trên máy bàn; trưởng phòng duyệt kết quả."
Chưa biết? Tôi đề xuất "một người dùng, máy cá nhân, không phân quyền" — tôi sẽ ghi là giả định.
```

## Các khối

### 1. Hiện tại làm thế nào → `S-`, `G-`
- **Hỏi:** "Hiện giờ việc này đang được làm thế nào? Kể một ca thật từ lúc nhận việc tới lúc xong: ai làm,
  bằng phần mềm / file nào, mất bao lâu, bước nào hay sai hoặc phải làm lại."
- **Ví dụ:** "Bạn A mở bản vẽ AutoCAD, dùng lệnh AREA bấm từng phòng, chép sang Excel, khoảng 2 giờ một căn hộ;
  hay sót ban công."
- **Hỏi thêm khi:** người trả lời là quản lý ⇒ "người làm hằng ngày có làm giống vậy không?"; "lần gần nhất
  làm sai là khi nào, sai chỗ nào?" (ca sai thật là nguồn ví dụ nghiệm thu tốt nhất).
- **Chưa biết:** không có mặc định. Xin xem một ca thật; ghi câu hỏi mở.
- **Ghi:** §3 (mỗi ca một dòng `S-`), §1 `G-`. Đây là câu đáng giá nhất — đừng bỏ.

### 2. Vì sao, vì sao bây giờ, đo bằng gì → `G-`
- **Hỏi:** "Hiện việc này tốn bao nhiêu giờ hoặc gây bao nhiêu lỗi mỗi tháng, và đạt mức nào thì bạn coi tool là thành công?"
- **Hỏi thêm khi:** "Không làm tool này thì chuyện gì xảy ra?" (nếu chưa rõ vì sao phải làm ngay bây giờ); hạn chót cứng hỏi ở khối 12.
- **Ví dụ:** "~40 giờ/tháng; lỗi sót làm lệch hợp đồng 1–2 lần/quý; muốn từ 2 giờ xuống 15 phút/căn."
- **Chưa biết:** ghi `G-` với "Mốc hiện tại: chưa đo" + giả định "đo mốc trong tuần đầu dùng thử".
- **Ghi:** §1 (`Đo bằng`, `Mốc hiện tại`, `As-of` = ngày đo).

### 3. Ai dùng → `U-`, `C-`
- **Hỏi:** "Ai sẽ dùng — mấy người, vai trò gì, dùng máy bàn hay điện thoại?"
- **Hỏi thêm:** ai duyệt kết quả; ai lo khi nó hỏng sau khi ra mắt; có người ngoài công ty (khách, đối tác,
  freelancer) dùng hoặc xem kết quả không? Có người ngoài ⇒ dữ liệu nào họ được thấy? Nhiều vai trò ⇒ mỗi vai
  trò thấy / làm được / không được gì? (người ngoài hoặc nhiều vai trò ⇒ nâng lên mức L.)
- **Chưa biết:** "một người dùng, máy cá nhân, không phân quyền" (giả định).
- **Ghi:** §2 `U-`; người bảo trì và người quyết khi tranh chấp vào §9 `C-`.

### 4. Đầu vào → `D-`, `C-`
- **Hỏi:** "Cho tôi xem dữ liệu đầu vào: 3 file mẫu thật — 1 bình thường, 1 khó, 1 hay gây lỗi (do phần mềm nào tạo ra?)."
- **Hỏi thêm khi:** mỗi tháng bao nhiêu file, nặng cỡ nào; có thông tin nhạy cảm không (khách hàng, hợp đồng,
  lương) ⇒ xin bản đã ẩn danh; định dạng có hay đổi không (đổi tên cột, đổi phiên bản phần mềm).
- **Chưa biết / không có mẫu:** câu hỏi mở **chặn mọi yêu cầu tính toán**; AI tự tạo mẫu nhỏ và dán nhãn
  "mẫu tự tạo — chưa phải dữ liệu thật".
- **Ghi:** §6 `D-` (đường dẫn, nhạy cảm, đã ẩn danh).

### 5. Đầu ra → `R-`, `E-`
- **Hỏi:** "Bạn muốn nhận kết quả dưới dạng nào — Excel, PDF, bản vẽ, màn hình? Nếu đã có file hay bảng mẫu đúng
  dạng đó thì cho tôi xem."
- **Hỏi thêm khi:** ai nhận và dùng vào việc gì; mẫu cố định hay hay đổi; có phải khớp với file khác (Excel kế toán…) không.
- **Chưa biết:** đề xuất dạng đơn giản nhất (một bảng Excel một sheet) làm `R-` ĐỀ XUẤT.
- **Ghi:** §4 `R-`; file mẫu đầu ra vào §6 `D-`.

### 6. Thế nào là đúng → `E-`
- **Hỏi:** "Cho tôi 3–5 ví dụ mà bạn biết chắc đáp án và tự kiểm được bằng tay: đầu vào là gì, kết quả đúng là
  gì. Gồm 1 ca thường, 1 ca khó, 1 ca mà tool phải từ chối hoặc báo lỗi. Sai lệch bao nhiêu thì chấp nhận được?"
- **Hỏi thêm khi:** ai trong nghề đã tự kiểm các số này (ghi tên + ngày)? số dùng vào việc gì?
- **Chưa biết:** AI soạn ví dụ dự kiến, ghi "CHƯA CÓ NGƯỜI KIỂM". **Chưa có ví dụ có người kiểm thì không
  đánh dấu yêu cầu "Phải có" nào là ĐÃ DUYỆT** — mở câu hỏi xin ví dụ.
- **Ghi:** §7 `E-` (cột `Ai đã tự kiểm`). Sau này thành golden test. Với mức L đây là khối quan trọng nhất.

### 7. Quy tắc nghiệp vụ và công thức → `B-`
- **Hỏi:** "Có quy tắc, công thức, quy định nào tool phải theo? (ví dụ: ban công tính 50 % diện tích; làm tròn
  tới 0,1; chủ đầu tư A tính khác chủ đầu tư B.) Căn cứ là văn bản nào, hay thói quen của ai?"
- **Hỏi thêm khi:** có ngoại lệ không; hai người hiểu khác nhau thì ai quyết; quy tắc có đổi theo thời gian /
  dự án không.
- **Chưa biết:** **không đặt mặc định, không suy từ dữ liệu cũ.** Hỏi chỗ tìm; để câu hỏi mở chặn.
- **Ghi:** §8 `B-` (`Căn cứ`, `Ai xác nhận`). Quy tắc quyết định con số ⇒ về sau thành `BI-*`.

### 8. Môi trường và ràng buộc → `C-`
- **Hỏi:** "Tool sẽ chạy ở đâu — máy cá nhân, máy chủ công ty, hay trên mạng — và dùng phần mềm nào, năm phiên bản
  nào (AutoCAD 2024? Revit 2025? Excel?)"
- **Hỏi thêm:** máy có bị chặn cài phần mềm không; có cần chạy khi mất mạng không; chi phí chạy hằng tháng chấp nhận được là bao nhiêu.
- **Chưa biết:** AI tự kiểm trên máy (phiên bản đã cài) thay vì hỏi.
- **Ghi:** §9 `C-`.

### 9. Kết nối với nơi khác → `C-`, `R-`
- **Hỏi:** "Tool có cần lấy hoặc đưa dữ liệu từ nơi nào khác không — Excel, Google Sheet, 1Office, Zalo, email,
  phần mềm khác? Ai cấp quyền truy cập?"
- **Hỏi thêm khi:** một chiều hay hai chiều; liên tục hay thỉnh thoảng; khi hai nơi lệch nhau thì nơi nào đúng.
- **Chưa biết:** "bản đầu không kết nối, chỉ nhập / xuất file" (giả định).

### 10. Rủi ro và "chạy đúng mà vẫn thất bại" → `RR-`, `NG-`, `A-`
- **Hỏi:** "Nếu tool sai thì sai kiểu nào là không chấp nhận được?"
- **Hỏi thêm:** dữ liệu nào tuyệt đối không được ra ngoài; có tình huống nào tool chạy đúng mà mọi người vẫn bỏ
  không dùng không — vì sao? (hỏi ở cùng vòng nếu còn chỗ trong 5 câu.)
- **Ví dụ:** "Sai diện tích 1 % là báo giá lệch; số liệu khách không lên mạng; nếu mất hơn 5 phút/ca thì kế
  toán quay lại Excel."
- **Hỏi thêm khi:** số này dùng để quyết định tiền / hợp đồng không (⇒ mức L)? sai thì ai chịu?
- **Chưa biết:** AI đề xuất rủi ro theo loại dự án (xem `type-packs.md`), ghi `RR-` ĐỀ XUẤT.

### 11. Ưu tiên và bản đầu tiên → `R-` (Ưu tiên, Bản), `V-`, `NG-`
- **Hỏi:** AI liệt kê tính năng rút từ các câu trả lời trước thành "thẻ": "Xếp mỗi thẻ vào **Phải có / Nên có
  / Để sau / Không làm**. Nếu chỉ có hai tuần, bản đầu tiên chỉ cần làm xong **một** ca thật chạy hết từ đầu
  đến cuối — chọn ca nào?"
- **Hỏi thêm:** "Cái gì tuyệt đối không được thiếu ở ngày đầu dùng?" · "Cái gì nghe hay nhưng bạn không muốn
  làm lần này?" (thành `NG-`, kèm vì sao và khi nào xét lại).
- **Chưa biết:** AI đề xuất lát mỏng nhất (một ca thường, đầu vào → đầu ra) làm `V-1`.

### 12. Vận hành và phát hành → `C-`, `R-`, `RR-`
- **Hỏi:** "Ai sẽ cài, cập nhật cho người dùng, và ai hỗ trợ khi lỗi?"
- **Hỏi thêm:** có hạn chót cứng không (sự kiện, kỳ quyết toán, ngày ký hợp đồng); cần sao lưu dữ liệu không;
  nhiều người dùng cùng lúc; ai duyệt phát hành. (Plugin phát hành cho đồng nghiệp: thử trên
  ít nhất 2 máy trước — luật 6 của `inno-aec`.)
- **Chưa biết:** "người yêu cầu tự cài và dùng trước, sau đó mới phát rộng" (giả định).

## Chọn khối theo chế độ

| Chế độ | Vòng | Khối |
|---|---|---|
| Nhanh (M) | 1 | 1 (gộp 2) · 3 · 4 · 5 |
| | 2 | 6 · 10 · 11 · 12 (7 – 9 chỉ khi liên quan) |
| Đầy đủ (L) | 1 | 1 · 2 · 3 · 4 · 5 |
| | 2 | 6 · 7 · 8 · 9 · 10 |
| | 3 | 11 · 12 · gói theo loại dự án (≤ 5 câu mỗi lượt, thêm vòng 3b nếu cần) |

Người dùng đã đưa sẵn tài liệu / file mẫu: đọc trước, bỏ câu đã có đáp án, gộp khối.
