# Đo trước khi kết luận

Một câu "đã xong", "đã khớp", "không ảnh hưởng" chỉ được nói khi có **một phép đo do chính
trạng thái thật sinh ra**. Mọi luật dưới đây đều đến từ một lần kết luận sai đã xảy ra thật.

## 1. Con số và tính chất trong tài liệu là để ĐỐI SOÁT, không phải để TÍNH

- Số nào đi vào một phép tính hay một quyết định ⇒ **đo lại từ nguồn**, kể cả khi CLAUDE.md /
  README / chú thích có nó. Tài liệu đúng vào ngày được ghi, không đúng hôm nay.
  *(Đã xảy ra: lấy một số nền cũ ghi trong CLAUDE.md làm số bị trừ ⇒ báo chênh lệch lớn gấp gần 70 lần chênh lệch thật.)*
- **Tính chất nguy hơn con số**: "X là khoá ổn định", "cột này không bao giờ rỗng" đọc như bảo
  đảm nên không ai đo lại. Hỏi *ai bảo đảm điều đó?* Nếu câu trả lời là "một lần đo" ⇒ đo lại mỗi
  lần dùng, hoặc biến nó thành **hàng rào chạy được** (script/test), đừng để nó là chú thích.
  *(Đã xảy ra: chú thích "khoá này là vĩnh viễn" — đo lại: khoảng 1/10 số khoá đã trỏ sang bản ghi khác.)*
- **Không dựng con số đầy đủ từ số đã làm tròn.** `78,830` (đã làm tròn để hiển thị) không cho biết chữ số sau đó.
  Cần độ chính xác ⇒ chạy lại truy vấn lấy giá trị thô. Ngưỡng so tương đối (1e-6) che được
  chữ số bịa.
- Không có công cụ để đo (Docker tắt, không có quyền) ⇒ **nói rõ "chưa đo được"**, đừng lấy
  tài liệu thay số đo.

## 2. Một phép đo đơn lẻ không đủ

- Thứ có bộ đệm / TTL / bất đồng bộ (DNS, cache, localStorage ghi trễ ~5 s, ResizeObserver,
  undo gộp 800 ms…) ⇒ đo **qua thời gian**, không đo một điểm.
- Điều kiện đóng việc phải **đủ**, không chỉ **cần**. Đặt điều kiện = triệu chứng gốc biến mất,
  đo lại đúng triệu chứng đó.
- "Mọi dấu hiệu đều khớp" **không** chứng minh cơ chế: dấu hiệu khớp vì cơ chế thật tạo ra
  chúng. Với câu hỏi *"cái này được SINH ra thế nào / NGHĨA là gì"* ⇒ tìm **vết của thứ sinh ra
  nó** (sheet nội bộ, log, sổ ghi của công cụ, công thức ẩn ở tiêu đề), hoặc hỏi chủ dự án
  *chỗ tìm*. Đừng suy từ dữ liệu.
- Báo một suy luận thì kèm **tỉ lệ khớp** (`251/333`, không phải "đa số"), không nói "phần lớn khớp".

## 3. Kết quả "OK" phải do trạng thái đo ra — không phải do script in ra

Họ lỗi hay gặp nhất, và im lặng nhất:
- Ẩn stderr (`>/dev/null`, `2>$null`) rồi `echo "đã gỡ"` ⇒ báo xong khi lệnh đã lỗi.
  **Dọn dẹp xong phải LIỆT KÊ LẠI trạng thái** rồi mới báo.
- Bộ thử PASS giả vì đầu vào rỗng (không kết nối được ⇒ so hai file băm rỗng ⇒ "giống nhau").
  Bộ thử phải **tự kiểm đầu vào** (đủ số bảng / số dòng > 0).
- Nhánh dự phòng âm thầm đổi cách so (parse JSON lỗi ⇒ rơi về so chuỗi thô) ⇒ nhánh dự phòng
  phải **kêu**, không im lặng.
- Hàm poll trả object lỗi `{__err}` — truthy ⇒ vòng chờ tưởng xong. So `=== true`.
- Probe/test "không ném lỗi" không phải bằng chứng — mỗi bước phải **khẳng định dương tính**
  một giá trị.
- Lệnh build bị kill vẫn để lại file trông như thành công (bộ cài 325 KB thay vì 596 MB,
  `latest.yml` cũ). **Kiểm file trên đĩa** (kích thước, version), không tin log.

## 4. Hai kết quả mâu thuẫn = chỗ có lỗi

Đừng chọn một cái để tin. Truy từng phần tử lệch tới khi biết bên nào sai — rất thường là
**công cụ đo của chính mình** sai.

## 5. Đối soát phải phủ đủ

Trước khi coi "đã khớp" là đủ, hỏi hai câu:
1. Thay đổi này **chạm tới những bảng / file / đường ghi nào**? (đối chiếu `git status` các file
   sinh ra, grep mọi nơi ghi cùng trường).
2. Đang so **giá trị từng dòng** hay chỉ **có/không có khoá**? Khoá giống nhau, giá trị có thể khác.

## 6. Hàng rào (fence / guard) phải thử cả hai chiều

- Chặn đúng **và** cho qua đúng. Một hàng rào chỉ được thử chiều "chặn" có thể chặn tất cả.
- Dữ liệu dev/nháp **không có** loại dữ liệu do app ghi trên production. Hàng rào đọc loại dữ
  liệu đó ⇒ đo **production chỉ-đọc** (xin phép) và dựng dữ liệu thử theo số đo, TRƯỚC khi deploy.
  *(Đã xảy ra: nháp 0 dòng, production hàng chục nghìn dòng ⇒ hàng rào chặn tất cả, deploy đổ.)*

## 7. Đề xuất của công cụ tự động là GIẢ THUYẾT

difflib, auto-match, linter "fix", AI khác… Nhất là khi có hai phần tử cùng tên/khoá. Soát bằng
**một thuộc tính khác** với thứ công cụ đã dùng để ghép (hoá đơn, tiền về, id) trước khi hành
động — bắt buộc khi hành động là **xoá**.

## 8. So sánh phải có BASELINE thật

- Muốn nói "bản sửa làm X tốt hơn" ⇒ chạy **cùng một probe trên HEAD cũ** (`git show HEAD:file >
  file`, chạy, khôi phục bản mới) và trên bản mới; báo cả hai con số. Probe trên mã cũ phải
  **đỏ đúng những ca lỗi** — nếu không, probe chưa tái hiện được lỗi.
- **Đối chứng dương**: tính năng cũ mà bản sửa có thể vô tình tắt cũng phải được đo là vẫn chạy.
- Lỗi chưa tái hiện được có chủ đích ⇒ chưa hiểu lỗi ⇒ chưa được sửa.
- So bằng **dung sai** đã nêu (`≤ 0,6 pt`), không so bằng tuyệt đối; nêu số đo thật.

## 9. Ghi lại cái gì đã đo, cái gì lấy từ nguồn khác

Trong memo / commit: tiền đề nào **đã đo** (kèm số), tiền đề nào **lấy từ tài liệu / người khác**
(chưa kiểm). Người đọc sau cần biết cái nào đáng đo lại.
