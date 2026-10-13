# Runbook — <tên app / dịch vụ>

> Cách chạy và quan sát app để **kiểm chứng trên hệ thống thật** (pha 4 của careful-engineering).
> Chỉ ghi điều **đã thấy chạy thật** (kèm ngày). Mục chưa xác minh để `CHƯA BIẾT` — một mục trống là
> chỗ thiếu, không phải chỉ dẫn; agent không được tự bịa lệnh để lấp.
> Phỏng theo mẫu Application Runbook của hoangnb24/repository-harness (MIT).

## 1. Phạm vi
<App / phần nào runbook này phục vụ: web, API, CLI, worker, app desktop… và những việc kiểm nào dùng nó.>

## 2. Cần có trước
| Thứ cần | Phiên bản / giá trị | Kiểm bằng (lệnh an toàn, chỉ đọc) |
|---|---|---|
| <Node / Python / .NET…> | <…> | `<node --version>` |
| <Dịch vụ: DB, Docker, Redis…> | <…> | `<docker ps>` |
| <Biến môi trường / file cấu hình> | <tên biến — KHÔNG ghi giá trị secret> | <lệnh in độ dài, không in giá trị> |

## 3. Khởi động
```bash
<lệnh chính xác>
```
- Cổng / địa chỉ: <…> — <cố định trong code | mặc định | cấu hình qua `<biến>` | quan sát thấy ngày …>
- Ghi vào đâu: <thư mục dữ liệu, DB, file log, cache> (để biết chạy thử sẽ đụng gì)

## 4. Dấu hiệu đã sẵn sàng
<Điều quan sát được chứng minh app khởi động xong: dòng log "<…>", `curl <url>/health` trả 200,
cửa sổ chính hiện tiêu đề "<…>". "Lệnh không báo lỗi" không tính.>

## 5. Dữ liệu thử (trạng thái xác định)
<Cách tạo / chọn / reset kịch bản thử mà không đụng dữ liệu không phải của mình: seed script, DB nháp,
tài khoản thử, thư mục tạm. Ghi rõ cái gì TUYỆT ĐỐI không được dùng để thử (DB production…).>

## 6. Cách thao tác
<Gọi API nào, bấm gì trên giao diện, lệnh CLI nào để đi đúng đường người dùng đi. Có công cụ tự động
(Playwright, CDP, script probe) thì ghi đường dẫn.>

## 7. Lấy bằng chứng
| Bằng chứng | Lấy bằng | Ghi chú |
|---|---|---|
| Log ứng dụng | `<lệnh / đường dẫn file>` | <trường luôn có vs. tuỳ lúc> |
| Lỗi / stack trace | `<…>` | |
| Sản phẩm cuối (file xuất, bản ghi DB, response) | `<…>` | đo cái này, không chỉ đo giao diện |

## 8. Dọn dẹp
<Cách nhận ra tiến trình / file / bản ghi do LẦN CHẠY NÀY tạo ra, và dừng / xoá đúng những thứ đó
(theo PID / cổng / tiền tố tên), không dừng rộng (`taskkill /IM node.exe`). Xong thì liệt kê lại để chắc.>

## 9. Kiểm chứng tiêu biểu
<Lệnh test tập trung + một hành trình trên app thật chứng minh tính năng chính chạy được, kèm kết quả mong đợi.>

## 10. CHƯA BIẾT
- <Điều còn thiếu hoặc chưa ai quyết, ví dụ "chưa có cách reset DB nháp", "chưa rõ log production ở đâu">
