# Windows, shell, Unicode tiếng Việt — các bẫy đã đo được

Đặc điểm chung: các lỗi này **im lặng** — `node --check` xanh, test chạy, file trông đúng khi
`cat`. Chỉ lộ khi đếm byte / eval / so số.

## 1. Đừng sửa chuỗi khó qua shell

| Bẫy (đã xảy ra) | Hậu quả |
|---|---|
| Heredoc Bash (kể cả `<<'EOF'` đã quote) gộp `\\` thành `\` | `"Ctrl+\\"` thành `Ctrl+)`: mất dấu `\` |
| Chuỗi Python thường `'\b'` trong heredoc | file nhận ký tự **0x08** vô hình; regex `\b` đếm 0 khớp |
| Backtick trong heredoc / `node -e '…'` | Bash báo `unexpected EOF`, **không chạy gì** |
| `\n` trong anchor Python qua heredoc | thành xuống dòng thật ⇒ không khớp |
| PowerShell 5.1 here-string có `"` cho `git commit -m` | message vỡ |
| Backtick trong comment SQL nằm trong template literal JS | template literal đóng sớm (TS1005) |

**Luật:** chuỗi có `\`, backtick, `$`, tiếng Việt, hoặc nhiều dòng ⇒ dùng công cụ **Edit / Write**,
hoặc viết **script patch ra file** (`templates/patch.js`, khớp đúng N lần) rồi `node file.js`.
Trong template literal JS của script đó: viết `\\` và `` \` ``.

**Kiểm bằng EVAL, không bằng grep:** `node -e 'console.log(JSON.stringify(line))'` — một `\` thật
hiện `"\\"`, hai hiện `"\\\\"`. `grep -o` không phân biệt được. Ký tự vô hình: `od -c`.

## 2. Mã hoá

- **PowerShell 5.1** đọc `.ps1` không BOM theo ANSI: `—` thành `â€"`, đóng chuỗi sớm ⇒ script hỏng.
  ⇒ `.ps1` lưu **UTF-8 có BOM** (`EF BB BF`), và chuỗi in ra màn hình của script giữ **ASCII không
  dấu** (`MIGRATE OK`, `TU CHOI CHAY`).
- PowerShell: `Set-Content` / `Add-Content` mặc định ANSI ⇒ luôn `-Encoding utf8`; `>` / `Out-File`
  ra UTF-8 có BOM. Ưu tiên công cụ Write (UTF-8 không BOM).
- Python in tiếng Việt ra stdout trên console cp1252 ⇒ `UnicodeEncodeError` (ghi FILE thì vẫn
  được). Dùng `python -X utf8` hoặc `PYTHONIOENCODING=utf-8`. Lưu ý **`python -I` bỏ qua
  `PYTHONIOENCODING`** ⇒ với `-I` dùng `-X utf8`.
- `sys.stdout.reconfigure(encoding="utf-8", errors="replace")` ở đầu script test Python.
- CSV từ Google Sheets / Excel có **BOM** ⇒ đọc `encoding="utf-8-sig"` (không thì header đầu là
  `\ufeffMã dự án` ⇒ KeyError).
- Sau khi ghi file có tiếng Việt: kiểm không có `U+FFFD` (`�`), không có `â€`/`Ã` (mojibake
  UTF-8 đọc như cp1252).

## 3. Xuống dòng (CRLF / LF)

- `git config core.autocrlf` thường `true` trên máy này ⇒ cảnh báo "LF will be replaced by CRLF"
  là bình thường; script patch phải **giữ EOL của file gốc** (đọc `\r\n` hay `\n` rồi thay theo).
- Kiểm EOL: `git ls-files --eol <file>` hoặc `grep -cP '\r'`. **Không** dùng `grep -c $'\r'` trong
  Bash tool ở máy này (cho "số CR = số dòng" ở mọi file — mẫu thành rỗng).
- Dữ liệu: Python `Path.write_text()` dùng `os.linesep` ⇒ ghi bằng `open(..., newline='')`.
  `.gitattributes` `*.sql text eol=lf` khi SQL có literal nhiều dòng (CR trong literal là DỮ LIỆU).
- Kiểm CR trong cột text: **đếm CR, không đếm LF** (LF là dữ liệu nhiều dòng thật).
- File mới tạo mang EOL của công cụ tạo ra nó ⇒ chuẩn hoá file mới theo working tree, đừng viết
  lại file cũ.

## 4. Tiếng Việt: chuẩn hoá & so sánh

- Bỏ dấu: `unicodedata.normalize('NFD', s)` rồi bỏ category `Mn`; **`đ`/`Đ` không tách được bằng
  NFD** ⇒ thay tay (`str.maketrans('đĐ', 'dD')`).
- So chuỗi người dùng nhập ⇒ chuẩn hoá cùng dạng (NFC) ở cả hai vế trước khi so / băm.
- Mã danh mục / tên file migration / tên nhánh: ASCII không dấu (`0031_dong_bo_du_lieu.sql`).
- Hàm chuẩn hoá tên người ≠ tên công ty (bộ mở rộng viết tắt khác nhau) — đừng dùng chung.
- Khoảng trắng thừa trong mã (`'NCC-001 '`) có thể là bản ghi riêng — đừng TRIM âm thầm.

## 5. Bash tool trên Windows (Git Bash / MSYS)

- MSYS đổi `/tmp/x.sql` thành `C:/Users/…` khi truyền cho chương trình Windows ⇒
  `MSYS_NO_PATHCONV=1` khi cần đường dẫn nguyên văn.
- Dùng **đường dẫn tuyệt đối**; `cd` có thể bị reset giữa các lần gọi.
- Lệnh dài hơn ~10 phút ⇒ `run_in_background`; ghi log ra file (pipe qua `tail` giữ hết output tới cuối).
- Kill tiến trình theo **PID / cổng**, không `taskkill /IM electron.exe` (quá rộng). Tiến trình
  nền (`next start`, server dev) sống sót sau `kill %1` ⇒ dừng theo cổng.

## 6. PowerShell 5.1

- Không có `&&`, `||`, `?:`, `??` ⇒ `A; if ($?) { B }`.
- `2>&1` trên lệnh native biến stderr (cả NOTICE của psql) thành `NativeCommandError` và `$?` false.
- Exit code của lệnh native **không** kích `$ErrorActionPreference='Stop'` ⇒ kiểm `$LASTEXITCODE`
  sau mỗi lệnh native (đã có lần `SETUP OK` in ra trong khi một bước ném lỗi, mất 118 bản ghi).
- Chuỗi trần trong function thành giá trị trả về ⇒ dùng `Write-Host`.
- `curl` là alias ⇒ `curl.exe`. `Move-Item` sang thư mục chưa có = đổi tên.
- ExecutionPolicy `Restricted` ⇒ `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` (đừng để
  `-ExecutionPolicy Bypass` của chính mình che lỗi người dùng sẽ gặp).
