---
name: inno-aec
description: Luật và kinh nghiệm riêng của INNO khi làm phần mềm cho ngành kiến trúc – xây dựng — plugin AutoCAD (.NET, AutoLISP, accoreconsole), add-in Revit, đọc/trích xuất DWG/DXF, tool tính diện tích / GFA / khối lượng, CSDL dự án – hợp đồng – nhân sự, web app nội bộ công ty. Dùng khi làm việc trong repo của INNO hoặc khi việc chạm AutoCAD, Revit, LISP, bản vẽ, diện tích, khối lượng, hợp đồng, tiền VND, dữ liệu 1Office/Excel nội bộ. Đi kèm (không thay) quy trình careful-engineering.
---

# INNO · phần mềm cho kiến trúc – xây dựng

Skill này là **lớp công ty**: nó không lặp lại quy trình. Quy trình (chọn mức S/M/L, 8 pha, đo trước khi
kết luận) là của **careful-engineering** — dùng cả hai. Thứ tự ưu tiên khi mâu thuẫn:
`AGENTS.md` của repo  >  skill này  >  careful-engineering  >  thói quen chung.

## Luật nhà (mọi repo INNO)

1. **Có git trước khi sửa.** Thư mục chưa là git repo ⇒ đề xuất `git init`, `.gitignore`, commit nguyên
   trạng, tạo repo **Private** trên GitHub — rồi mới sửa. Không có git = không có đường lùi, không có backup.
2. **Ngôn ngữ:** tài liệu, giao diện, thông báo cho người dùng, commit: tiếng Việt. Tên biến / hàm / file
   mã: tiếng Anh. Có dấu hay không dấu trong commit: theo `AGENTS.md` (mặc định: có dấu, qua `git commit -F`).
3. **Con số người khác dùng để ra quyết định = mức L.** Diện tích, GFA, khối lượng, dự toán, tiền hợp đồng,
   lương: đủ 8 pha, golden test với số đã được người trong nghề kiểm tay. → [references/calc-quantities.md](references/calc-quantities.md)
4. **Dữ liệu của khách hàng và của công ty không ra ngoài.** Bản vẽ khách hàng, hợp đồng, dữ liệu nhân sự:
   không vào repo public, không vào issue / chat công khai, không gửi API LLM bên ngoài khi chưa có người có
   thẩm quyền đồng ý loại dữ liệu đó. Mẫu thử trong repo: bản vẽ / bảng đã ẩn danh hoặc tự vẽ.
5. **Ghi host và phiên bản vào `AGENTS.md`**: phần mềm chủ + các năm hỗ trợ (AutoCAD 2024, Revit
   2025…), target .NET, cách build, cách test ngoài host và trong host, nơi phát hành.
6. **Plugin phát hành cho đồng nghiệp**: thử trên giao diện thật của host **và** trên ít nhất 2 máy đồng
   nghiệp trước khi phát hành rộng; có hướng dẫn cài **và gỡ**; lệnh hiển thị được số version; bộ cài
   **không tự đổi** cài đặt bảo mật của máy người dùng (SECURELOAD, Trusted Locations) — hướng dẫn họ làm.
7. **LLM mặc định là Gemini qua SDK `google-genai`** (gói cũ `google-generativeai` đã ngừng phát triển;
   repo còn dùng ⇒ ghi vào `docs/OPEN-ISSUES.md`, đừng tự chuyển khi không được giao). Tên model đọc từ
   cấu hình / danh sách model hiện có, không viết theo trí nhớ.
8. **Tiền VND là số nguyên.** Không `float` cho tiền, diện tích đưa vào hợp đồng, khối lượng thanh toán.

## Chọn tài liệu theo việc

| Việc | Đọc |
|---|---|
| Plugin AutoCAD (.NET), AutoLISP, test bằng accoreconsole, bundle / NETLOAD, font TCVN3 / VNI | [references/autocad.md](references/autocad.md) |
| Add-in Revit (C#), `.addin`, Transaction, ExternalEvent, đơn vị feet, nhiều năm Revit | [references/revit.md](references/revit.md) |
| Diện tích, GFA, khối lượng, làm tròn, đơn vị bản vẽ, golden test | [references/calc-quantities.md](references/calc-quantities.md) |
| CSDL dự án / hợp đồng / nhân sự, tiền & VAT, web app nội bộ, nguồn Excel / 1Office | [references/business-data.md](references/business-data.md) |
| Đọc DWG/DXF không cần AutoCAD (thư viện, license) | [references/autocad.md](references/autocad.md) §6 |

Loại dự án khác (web, bot, scraper, LLM, ML…): careful-engineering `references/project-types.md`.

## Khung repo cho plugin (dự án mới)

```
src/<Ten>.Core/        logic thuần: đọc file, tính toán, chuyển đổi — KHÔNG tham chiếu DLL của host
src/<Ten>.Acad/        (hoặc .Revit) lệnh / UI gọi API host; DLL host tham chiếu Copy Local = false
tests/<Ten>.Tests/     unit test cho Core (MSTest / xUnit / NUnit), chạy bằng `dotnet test`
tests/host/            test chạy trong host (accoreconsole + script .scr; Revit: runner trong Revit / kịch bản tay)
tests/samples/         file mẫu nhỏ đã ẩn danh + đầu ra mong đợi (golden)
deploy/                bundle / .addin / install.ps1 / uninstall.ps1
build.ps1              một lệnh: build + unit test (+ -HostTest để chạy test trong host)
```

Lý do tách Core: mọi thứ không cần host thì test được trong vài giây trên mọi máy (kể cả máy AI đang
chạy); phần cần host mỏng nhất có thể. Đây là cách duy nhất để "pha 4 không bỏ" với plugin.

## Mục cần có trong `AGENTS.md` của repo plugin

```markdown
## Host & phiên bản
- Host: AutoCAD <năm> (R<xx>), <bản đầy đủ / không hỗ trợ LT>. Target: <net48 x64 | net8.0-windows>.
- DLL host lấy từ: <đường dẫn cài AutoCAD / NuGet / thư mục Lib> — không commit DLL của Autodesk.
## Chạy & test
- `./build.ps1` — build + unit test (xanh = "<câu runner in ra>")
- `./build.ps1 -HostTest` — test trong <accoreconsole / Revit>; log ở <đường dẫn>; xanh = "<…>"
- Chưa tự động được: <danh sách kịch bản thử tay trong docs/RUNBOOK.md §9>
## Phát hành
- <bundle vào %ProgramData%\Autodesk\ApplicationPlugins | .addin vào …>, kênh: <…>, ai duyệt: <…>
```

## Chưa chốt ở cấp công ty (gặp thì hỏi, đừng tự quyết)

- Kênh phát hành plugin nội bộ (thư mục mạng, GitHub Releases private, phần mềm quản lý) và người duyệt.
- Danh sách năm AutoCAD / Revit công ty đang dùng thực tế.
- Loại dữ liệu nào được phép gửi tới API LLM bên ngoài.

Khi được trả lời: ghi vào `AGENTS.md` của repo (và đề xuất cập nhật skill này qua Pull Request).
