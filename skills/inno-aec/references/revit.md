# Revit add-in (C#)

Team chưa có dự án Revit đã chạy thật, nên mọi điều dưới đây là **kiến thức chung về Revit API**, chưa
qua đo của team. Việc đầu tiên trong dự án Revit đầu tiên: kiểm từng điều với đúng phiên bản Revit đang
dùng, ghi kết quả vào `AGENTS.md` / `docs/RUNBOOK.md`, rồi gửi Pull Request sửa file này thành "(đã đo)".

## 1. Phiên bản & build

- **Revit 2025 trở đi: .NET 8** (`net8.0-windows`); **Revit 2021–2024: .NET Framework 4.8**. x64.
- `RevitAPI.dll` / `RevitAPIUI.dll` đổi theo **từng năm** ⇒ mỗi năm hỗ trợ một cấu hình build (thường
  `Release R24`, `Release R25`…), tham chiếu DLL đúng năm với Copy Local = false. Không commit DLL của Autodesk.
- API đổi giữa các năm — đã biết: `ElementId.IntegerValue` bị thay bằng `ElementId.Value` (kiểu `long`)
  từ 2024; hệ đơn vị dùng `ForgeTypeId` / `UnitTypeId` (từ 2021, `DisplayUnitType` bị bỏ từ 2022). Gặp
  cảnh báo `Obsolete` ⇒ đọc ghi chú phát hành API của năm đó, không tắt cảnh báo.

## 2. Luật viết code

- **Đơn vị nội bộ là feet** (chiều dài), feet² (diện tích), radian (góc). Chuyển đổi **ở biên** bằng
  `UnitUtils.ConvertFromInternalUnits` / `ConvertToInternalUnits`. Không chia 304.8 rải rác trong code.
  Test chuyển đổi bằng giá trị đã biết (1000 mm = 3.28084 ft).
- Mọi thay đổi mô hình trong `Transaction` (đặt tên rõ để hiện trong Undo); nhiều bước ⇒ `TransactionGroup`.
  Lỗi giữa chừng ⇒ `RollBack`, không để transaction treo.
- API chỉ được gọi trong **ngữ cảnh API** (trong `Execute` của lệnh, trong handler sự kiện của Revit).
  Cửa sổ không modal (WPF) ⇒ gửi việc qua `ExternalEvent` + `IExternalEventHandler`; không gọi API từ
  nút bấm trực tiếp, không từ thread phụ.
- Lọc phần tử bằng `FilteredElementCollector` với bộ lọc nhanh (`OfClass`, `OfCategory`) trước, lọc chậm
  sau; mô hình lớn ⇒ đo thời gian trên file thật cỡ lớn, không trên file mẫu nhỏ.
- Đọc tham số: theo `BuiltInParameter` hoặc GUID của shared parameter, không theo **tên hiển thị** (tên đổi
  theo ngôn ngữ Revit và theo template của từng dự án).
- Workshared (file trung tâm): ghi vào phần tử người khác đang mượn sẽ lỗi ⇒ kiểm và báo, không ép.

## 3. Nạp add-in & phát hành

- File `.addin` (XML) đặt trong `%ProgramData%\Autodesk\Revit\Addins\<năm>\` (mọi người dùng) hoặc
  `%AppData%\Autodesk\Revit\Addins\<năm>\` (một người). `AddInId` là GUID cố định — không sinh mới mỗi bản.
- Trên .NET Framework mọi add-in chạy chung một không gian nạp DLL ⇒ hai add-in dùng hai phiên bản của
  cùng một thư viện (Newtonsoft.Json…) có thể đá nhau. Hạn chế phụ thuộc ngoài; gặp lỗi nạp DLL ⇒ kiểm
  add-in khác đang cài trước khi sửa code mình.
- Bộ cài: chép DLL + `.addin` đúng năm, có gỡ cài đặt; thử trên máy đồng nghiệp có add-in khác đang cài.

## 4. Test

Revit desktop **không có chế độ chạy không giao diện** như accoreconsole. Theo thứ tự ưu tiên:

1. **Core thuần** (hình học, quy tắc đặt tên, tính toán, đọc/ghi Excel) không tham chiếu RevitAPI ⇒ unit
   test bình thường. Đẩy càng nhiều logic vào đây càng tốt — kể cả "cái gì cần đổi" (tính trong Core, Revit
   chỉ áp).
2. **Test chạy trong Revit**: có các test runner mã nguồn mở chạy NUnit / xUnit bên trong phiên Revit — kiểm
   còn được duy trì và hỗ trợ đúng năm Revit trước khi dùng, ghi lựa chọn vào `docs/DECISIONS.md`.
3. **Kịch bản thử tay** trong `docs/RUNBOOK.md`: file `.rvt` mẫu (nhỏ, đã ẩn danh, để trong `tests/samples/`),
   các bước bấm, kết quả mong đợi đo được (số phần tử đổi, giá trị tham số, file xuất). Người dùng chạy và
   báo số — AI ghi lại.

Báo cáo luôn tách: "unit Core 45/45 · trong Revit: chưa chạy (không có Revit trên máy này) · kịch bản tay: chờ anh/chị chạy".
