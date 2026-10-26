# AutoCAD: plugin .NET, AutoLISP, test không cần mở AutoCAD

Phần đánh dấu **(đã đo)** đến từ một plugin AutoCAD 2024 thật của team (AutoCAD 2024 R24.3, Windows 11).
Phần còn lại là kiến thức chung về API — vẫn phải kiểm với đúng phiên bản AutoCAD của repo.

## 1. Phiên bản & build

- Target theo năm AutoCAD: **2025 trở đi: .NET 8** (`net8.0-windows`); **2021–2024: .NET Framework 4.8**.
  Bản cũ hơn ⇒ kiểm tài liệu ObjectARX / .NET SDK của đúng năm đó. Plugin phải build **x64**.
- Một họ release dùng chung nhị phân: R24 = 2021–2024. Bắt đầu .NET 8 là một họ khác ⇒ cần cấu hình
  build riêng. Hỗ trợ nhiều năm ⇒ ghi bảng "năm → target → cấu hình build" vào `AGENTS.md`.
- Tham chiếu `acdbmgd.dll`, `acmgd.dll`, `accoremgd.dll` (từ thư mục cài AutoCAD, gói NuGet chính thức
  hoặc ObjectARX SDK) với **Copy Local = false**. Không commit DLL của Autodesk vào repo; đường dẫn để
  ở biến MSBuild (ví dụ `$(AcadDir)`) để máy khác build được.
- **AutoCAD LT không chạy plugin .NET.** Người dùng LT ⇒ chỉ AutoLISP (LT 2024 trở đi), hỏi trước khi thiết kế.

## 2. Luật viết code .NET cho AutoCAD

- Mọi đọc / ghi đối tượng qua `Transaction` (`using`, `Commit()` cuối); đối tượng mở trong transaction
  không dùng sau khi transaction đóng.
- Gọi từ ngữ cảnh ứng dụng (palette, form không modal, sự kiện) ⇒ `using (doc.LockDocument())` trước khi ghi.
- API **không an toàn đa luồng**: không gọi từ `Task.Run` / thread phụ. Việc nặng (đọc file lớn, gọi mạng)
  làm ở thread phụ, rồi quay về thread chính mới chạm bản vẽ.
- Lệnh `[CommandMethod]`: tên lệnh có tiền tố riêng của plugin (`CALC...`) để không trùng lệnh khác.
  Thao tác người dùng có thể Undo ⇒ một lệnh = một nhóm undo; test thử `U` sau lệnh.
- Hỏi người dùng (`Editor.GetXxx`) luôn xử lý trạng thái huỷ (Esc), không chỉ OK.
- Bắt lỗi ở biên lệnh: lỗi không bắt trong lệnh .NET có thể làm sập AutoCAD — báo lỗi bằng
  `Editor.WriteMessage` + ghi log file, không nuốt im lặng.

## 3. Test không cần mở AutoCAD: `accoreconsole.exe`  (đã đo)

`accoreconsole.exe` (cùng thư mục cài AutoCAD) chạy bản lõi không giao diện, nhận script `.scr`.
Khung test đã dùng thật:

1. Build plugin + một **DLL test** riêng chứa lệnh tự kiểm (ví dụ `XXX_SELFTEST`): dựng bản vẽ từ file
   mẫu trong `tests/samples/`, đối chiếu với kết quả mong đợi, ghi `pass=N fail=M` + chi tiết ra **file log**
   (đường dẫn nhận qua biến môi trường).
2. Sinh file `.scr` (ghi **ASCII**, CRLF): đặt `TRUSTEDPATHS` tới thư mục build, `NETLOAD` plugin,
   `NETLOAD` DLL test, gọi lệnh tự kiểm, lệnh thật cần thử, rồi `QUIT`.
3. Chạy với **profile cách ly** để không đụng cài đặt AutoCAD thật của người dùng:
   ```powershell
   & "$AcadDir\accoreconsole.exe" /i $templateDwt /isolate <tenprofile> <thumuc_profile> /s $scr /l en-US
   ```
4. Đọc **file log**, không đọc stdout của accoreconsole (stdout lẫn ký tự `\0`, chỉ để tham khảo).
   Xanh = log có `fail=0` **và** số kiểm tra > 0 (0 kiểm tra là đỏ).
5. Kiểm bằng mắt khi cần: `-PLOT` ra PNG qua `PublishToWeb PNG.pc3`, so ảnh trước / sau.

Giới hạn: accoreconsole không có giao diện ⇒ không có `acmgd` (palette, ribbon, hộp thoại, nhấp đúp).
Những phần đó ghi thành **kịch bản thử tay trên GUI** trong `docs/RUNBOOK.md`, và báo "chưa thử trên GUI".
Một số tính năng có thể chạy khác GUI (đã gặp: Data Link báo thành công ở `AddDataLink` nhưng
`SetDataLink` lỗi `eCantOpenFile` trong accoreconsole) ⇒ kết luận "không chạy được" chỉ sau khi thử GUI.

## 4. Nạp DLL & phát hành  (đã đo)

- `SECURELOAD = 1` (mặc định) ⇒ DLL ngoài vùng tin cậy bị từ chối (accoreconsole: "Unable to load …
  assembly"; GUI: hộp thoại hỏi). `%APPDATA%\Autodesk\ApplicationPlugins` **không** được tin cậy mặc định;
  `%ProgramData%\Autodesk\ApplicationPlugins` thì có.
- Phát hành bằng **bundle autoloader** (`<Ten>.bundle\PackageContents.xml` + `Contents\`), cài vào
  `%ProgramData%\Autodesk\ApplicationPlugins` (cần quyền admin) — hoặc hướng dẫn người dùng thêm Trusted
  Location. `install.ps1` **không** tự đổi `SECURELOAD` / `TRUSTEDPATHS`.
- `PackageContents.xml` khai báo dải phiên bản (`SeriesMin` / `SeriesMax`) đúng với target đã build.
- Trước phát hành rộng: test tự động xanh + thử GUI + thử trên 2–3 máy đồng nghiệp (khác cấu hình).

## 5. AutoLISP

- AutoCAD 2021 trở đi có AutoLISP Unicode; biến `LISPSYS` quyết định dùng bản nào (và editor nào). Chuỗi
  tiếng Việt trong file `.lsp` chỉ an toàn khi đúng bản đó đọc đúng encoding của file ⇒ kiểm `LISPSYS` trên
  máy người dùng, thử thật; không chắc ⇒ thông báo giao diện viết **không dấu**.
- Test LISP: viết hàm `(xxx-test)` tự so kết quả và `princ` ra `pass/fail`; chạy trong accoreconsole bằng
  script `(load "duong/dan.lsp") (xxx-test)`; ghi kết quả ra file bằng `open` / `write-line`.
- Biến hệ thống bị đổi trong hàm (`OSMODE`, `CMDECHO`…) ⇒ lưu và **khôi phục** kể cả khi lỗi (`*error*`).
- `(command ...)` phụ thuộc thứ tự câu hỏi của lệnh — đổi năm AutoCAD có thể đổi thứ tự ⇒ ưu tiên
  `entmake` / `vla-*` cho logic quan trọng, hoặc test trên từng năm hỗ trợ.

## 6. Đọc DWG / DXF ngoài AutoCAD

- Thư viện mở: `ezdxf` (Python, DXF), LibreDWG (đọc DWG — **GPL**: kiểm hệ quả license trước khi đóng gói
  vào sản phẩm phân phối), ODA (cần membership). Ghi lựa chọn và lý do vào `docs/DECISIONS.md`.
- Kết quả trích xuất ngoài AutoCAD phải **đối chiếu** với AutoCAD trên vài bản vẽ mẫu (số đối tượng, toạ độ,
  diện tích) trước khi tin — các thư viện khác nhau về block lồng, đơn vị, đối tượng proxy, xref.
- Phân loại đối tượng (cửa, tường, phòng…) bằng luật hay bằng LLM: luật trước, LLM chỉ cho phần còn lại,
  và báo tỉ lệ khớp trên bộ mẫu có đáp án (`182/200`), không nói "đa số đúng".

## 7. Tiếng Việt trong bản vẽ: TCVN3 / VNI / Unicode

- Bản vẽ cũ dùng font TCVN3 (`.Vn…`) / VNI hoặc SHX tiếng Việt: chữ lưu dạng **byte mã cũ**, chỉ hiện đúng
  với font đó. Trích ra Excel / CSDL mà không chuyển mã ⇒ chữ rác; ghi chữ Unicode vào style dùng font
  TCVN3 ⇒ hiện rác trên bản vẽ.
- Luật: nhận diện mã theo **font của text style** (không đoán theo nội dung); chuyển mã ở **biên** (lúc
  xuất / nhập), giữ giá trị gốc; một bản vẽ có thể trộn nhiều mã. Không tự chuyển mã chữ **trong** bản vẽ
  của người dùng khi chưa được yêu cầu — nó đổi cách hiển thị với mọi người mở bản vẽ.
- Bảng chuyển mã TCVN3 / VNI → Unicode: một module duy nhất + golden test có đủ chữ hoa / thường / mọi dấu
  và chữ `đ` / `Đ`.
- Clipboard / DDE dạng ANSI làm tiếng Việt thành `?` (đã đo với clipboard `Link` của LibreOffice Calc —
  có bản UTF-8 đi kèm ở phần sau) ⇒ ưu tiên định dạng Unicode khi có nhiều định dạng.
