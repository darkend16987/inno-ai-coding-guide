# <Tên dự án> — hướng dẫn cho AI agent

> Chép file này vào gốc repo mới, điền các chỗ `<…>`. Giữ NGẮN (dưới ~200 dòng): tri thức dài để ở
> `docs/` và chỉ trỏ tới. Agent đọc file này ở đầu MỌI phiên.

Ngôn ngữ giao tiếp & tài liệu: **tiếng Việt**. Commit message: <tiếng Việt có dấu qua `git commit -F` |
tiếng Việt KHÔNG dấu> (chọn một, ghi rõ).

**Quy trình làm việc:** dùng skill `careful-engineering` (pha 0 → 7: đọc, hiểu, kế hoạch, làm, kiểm
chứng, ghi sổ, commit, deploy). Nguồn: https://darkend16987.github.io/inno-ai-coding-guide/

## Bản đồ repo
| Thư mục / file | Là gì |
|---|---|
| `<src/>` | <…> |
| `<tests/>` | <…> |
| `docs/` | sổ ghi (xem bên dưới) |

## Chạy & test (làm TRƯỚC và SAU mỗi thay đổi)
```bash
<lệnh cài đặt>
<lệnh chạy dev>
<lệnh chạy toàn bộ test>      # xanh = <câu chữ runner in ra khi đạt>
```

## Sổ ghi — mỗi loại thông tin một nơi
| Thông tin | File |
|---|---|
| Phiên này đã làm gì + bước kế tiếp (khối mới nhất ở trên) | `docs/HANDOFF.md` |
| Việc còn mở (chờ quyết, chưa rõ, nợ kỹ thuật) | `docs/OPEN-ISSUES.md` |
| Quyết định kiến trúc + đường thoát nếu sai | `docs/DECISIONS.md` |
| Bất biến chống hồi quy + ma trận "đụng gì → test gì" | `docs/REGRESSION-GUARD.md` |

## Luật không được phá
- <BI-1: …>  ← thêm mỗi khi sửa một lỗi có thể tái diễn

## Điều dễ vướng (bẫy đã gặp thật)
- <môi trường / công cụ / dữ liệu: triệu chứng → cách tránh>

## Cách làm việc
- Mỗi việc một commit; không gộp đổi hành vi với refactor; lưới test xanh trước và sau.
- Test mới phải đỏ được (đột biến rồi khôi phục).
- Thay đổi giao diện / tích hợp: probe trên app thật, nói rõ phần nào chưa probe.
- Không commit secret / `.env` / build output. Push / deploy chỉ khi được yêu cầu.
