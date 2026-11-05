// Test cho skills/project-scope/templates/scope-check.js — chạy: node evals/scope-check.test.js
// In "N/M" và thoát 1 nếu có ca đỏ. Mỗi ca đột biến một chỗ của bản SCOPE mẫu rồi đòi đúng mã lỗi.
"use strict";
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const SCRIPT = path.join(__dirname, "..", "skills", "project-scope", "templates", "scope-check.js");
const TEMPLATE = path.join(__dirname, "..", "skills", "project-scope", "templates", "SCOPE.md");
const { check } = require(SCRIPT);
const TODAY = "2026-11-05";
const run = (text, o) => check(text, Object.assign({ today: TODAY }, o));

// Bản SCOPE hợp lệ, đã duyệt, không lỗi, không cảnh báo (dữ liệu giả, tự đặt cho test).
const BASE = `# Dự án thử — phạm vi

| Trạng thái | Phiên bản | Cập nhật | Người duyệt |
|---|---|---|---|
| ĐÃ DUYỆT | v1.0 | 2026-11-01 | Lan (2026-11-01) |

| ID | Mục tiêu | Đo bằng | Mốc hiện tại | As-of |
|---|---|---|---|---|
| G-1 | Giảm thời gian tính diện tích | phút mỗi ca | 120 phút | 2026-10-25 |

| ID | Yêu cầu | Ưu tiên | Trạng thái | Nguồn | Nghiệm thu | Bản |
|---|---|---|---|---|---|---|
| R-1 | Tính diện tích từng phòng | Phải có | ĐANG LÀM | Lan, 2026-10-20 | E-1 | V-1 |
| R-2 | Xuất kết quả A \\| B ra Excel | Nên có | ĐỀ XUẤT | AI đề xuất | | V-1 |

| ID | Không làm | Vì sao | Xét lại khi |
|---|---|---|---|
| NG-1 | Gửi kết quả cho khách | dữ liệu nội bộ | có người duyệt |

| ID | Đầu vào | Kết quả đúng | Ai đã tự kiểm | Ngày |
|---|---|---|---|---|
| E-1 | Bản vẽ mẫu 1 | 42,5 m2 | Lan | 2026-10-25 |

| ID | Quy tắc | Căn cứ | Ai xác nhận | Trạng thái |
|---|---|---|---|---|
| B-1 | Ban công tính 50 % | quy định nội bộ 2024 | Lan | ĐÃ XÁC NHẬN |

| ID | Giả định | Nếu sai thì | Cách kiểm | Trạng thái | As-of |
|---|---|---|---|---|---|
| A-1 | Chạy trên máy cá nhân | phải làm bản chạy trên mạng | hỏi IT | CHƯA KIỂM | 2026-10-25 |

| ID | Câu hỏi | Ai trả lời | Chặn | Trạng thái | Hạn |
|---|---|---|---|---|---|
| Q-1 | Có cần xuất PDF không | Lan | R-2 | MỞ | 2026-12-01 |

| ID | Bản | Gồm | Xong khi |
|---|---|---|---|
| V-1 | Bản đầu | R-1, R-2 | E-1 đạt |

| ID | Ngày | Loại | Thay đổi | Vì sao | Ai duyệt | Ảnh hưởng |
|---|---|---|---|---|---|---|
| CR-0 | 2026-10-20 | KHỞI TẠO | Bản đầu tiên | Lan yêu cầu | Lan | R-1 |
`;

// Đột biến đúng một chỗ; đòi chuỗi gốc khớp đúng 1 lần để ca test không âm thầm thành "không làm gì".
function mut(text, from, to) {
  const n = text.split(from).length - 1;
  assert.strictEqual(n, 1, `chuỗi gốc phải khớp đúng 1 lần, khớp ${n}: ${from}`);
  return text.replace(from, to);
}
const has = (res, code, id) => res.issues.some((i) => i.code === code && (id === undefined || i.id === id));
const hasErr = (res, code, id) => res.errors.some((i) => i.code === code && (id === undefined || i.id === id));
const hasWarn = (res, code, id) => res.warnings.some((i) => i.code === code && (id === undefined || i.id === id));

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); pass++; } catch (e) { fail++; console.log("ĐỎ  " + name + "\n     " + e.message.split("\n")[0]); }
}

t("bản mẫu hợp lệ: 0 lỗi, 0 cảnh báo", () => {
  const r = run(BASE);
  assert.deepStrictEqual(r.issues.map((i) => i.code + ":" + i.id), []);
});
t("dấu | thoát \\| trong ô không làm lệch cột", () => {
  const r = run(BASE);
  assert.ok(r.report.includes("Nên có XONG 0/1"), r.report);
});
t("CRLF + BOM + Unicode dạng NFD cho cùng kết quả", () => {
  const v = "﻿" + BASE.normalize("NFD").replace(/\n/g, "\r\n");
  assert.deepStrictEqual(run(v).issues, []);
});
t("tiến độ: đếm đúng Phải có, câu hỏi mở và R bị chặn", () => {
  const r = run(BASE);
  assert.ok(r.report.includes("Phải có XONG 0/1"), r.report);
  assert.ok(r.report.includes("Câu hỏi mở: 1 (đang chặn: R-2)"), r.report);
});
t("ID trùng", () => assert.ok(hasErr(run(mut(BASE, "| R-2 | Xuất", "| R-1 | Xuất")), "id-trung", "R-1")));
t("R đang làm mà không có nghiệm thu", () =>
  assert.ok(hasErr(run(mut(BASE, "| Lan, 2026-10-20 | E-1 | V-1 |", "| Lan, 2026-10-20 | | V-1 |")), "thieu-nghiem-thu", "R-1")));
t("R thiếu nguồn", () => assert.ok(hasErr(run(mut(BASE, "| ĐANG LÀM | Lan, 2026-10-20 |", "| ĐANG LÀM | |")), "thieu-nguon", "R-1")));
t("tham chiếu treo (E-9 không tồn tại)", () => assert.ok(hasErr(run(mut(BASE, "| Lan, 2026-10-20 | E-1 |", "| Lan, 2026-10-20 | E-9 |")), "tham-chieu-treo", "R-1")));
t("Q còn MỞ chặn R đang làm", () => assert.ok(hasErr(run(mut(BASE, "| Lan | R-2 | MỞ |", "| Lan | R-1 | MỞ |")), "q-chan-r-da-duyet", "Q-1")));
t("Q đã trả lời thì không chặn R đang làm", () => assert.ok(!has(run(mut(BASE, "| Lan | R-2 | MỞ |", "| Lan | R-1 | ĐÃ TRẢ LỜI |")), "q-chan-r-da-duyet")));
t("trạng thái R sai chính tả", () => assert.ok(hasErr(run(mut(BASE, "| ĐANG LÀM |", "| LAM DO |")), "gia-tri-sai", "R-1")));
t("ĐỔI HƯỚNG không có người duyệt", () =>
  assert.ok(hasErr(run(BASE + "| CR-1 | 2026-11-02 | ĐỔI HƯỚNG | Thêm vai trò khách | khách xin | | R-1 |\n"), "cr-doi-huong-chua-duyet", "CR-1")));
t("ĐỔI NHỎ chưa ghi người duyệt chỉ cảnh báo", () => {
  const r = run(BASE + "| CR-1 | 2026-11-02 | ĐỔI NHỎ | Thêm cột | tiện | | R-1 |\n");
  assert.ok(hasWarn(r, "cr-doi-nho-chua-ghi", "CR-1") && r.errors.length === 0);
});
t("SCOPE ĐÃ DUYỆT mà thiếu người duyệt", () => assert.ok(hasErr(run(mut(BASE, "| Lan (2026-11-01) |", "| — |")), "doc-nguoi-duyet")));
t("trạng thái SCOPE không hợp lệ", () => assert.ok(hasErr(run(mut(BASE, "| ĐÃ DUYỆT | v1.0 |", "| XONG | v1.0 |")), "doc-trang-thai")));
t("phiên bản sai dạng", () => assert.ok(hasErr(run(mut(BASE, "| v1.0 |", "| mới |")), "doc-phien-ban")));
t("còn chỗ giữ chỗ: ĐÃ DUYỆT là LỖI", () => assert.ok(hasErr(run(mut(BASE, "| 120 phút |", "| <số đo> |")), "con-giu-cho", "G-1")));
t("còn chỗ giữ chỗ: DỰ THẢO chỉ cảnh báo", () => {
  const r = run(mut(mut(BASE, "| 120 phút |", "| <số đo> |"), "| ĐÃ DUYỆT | v1.0 |", "| DỰ THẢO | v1.0 |"));
  assert.ok(hasWarn(r, "con-giu-cho") && r.errors.length === 0, r.report);
});
t("<br> trong ô không bị coi là chỗ giữ chỗ", () => assert.ok(!has(run(mut(BASE, "| 120 phút |", "| 120 phút<br>cũ |")), "con-giu-cho")));
t("số đo quá cũ (> 30 ngày) cảnh báo", () => assert.ok(hasWarn(run(mut(BASE, "| CHƯA KIỂM | 2026-10-25 |", "| CHƯA KIỂM | 2026-08-01 |")), "so-do-cu", "A-1")));
t("--stale-days nới ngưỡng thì hết cảnh báo", () =>
  assert.ok(!has(run(mut(BASE, "| CHƯA KIỂM | 2026-10-25 |", "| CHƯA KIỂM | 2026-08-01 |"), { staleDays: 200 }), "so-do-cu")));
t("ví dụ nghiệm thu chưa có người kiểm tay", () => assert.ok(hasWarn(run(mut(BASE, "| 42,5 m2 | Lan |", "| 42,5 m2 | |")), "e-chua-kiem-tay", "E-1")));
t("R XONG dựa trên E chưa kiểm tay", () => {
  const r = run(mut(mut(BASE, "| 42,5 m2 | Lan |", "| 42,5 m2 | |"), "| ĐANG LÀM |", "| XONG |"));
  assert.ok(hasWarn(r, "xong-chua-kiem-tay", "R-1"), r.report);
});
t("quy tắc thiếu căn cứ", () => assert.ok(hasWarn(run(mut(BASE, "| quy định nội bộ 2024 |", "| |")), "b-thieu-can-cu", "B-1")));
t("quy tắc ĐÃ XÁC NHẬN nhưng không ai xác nhận", () => assert.ok(hasErr(run(mut(BASE, "| Lan | ĐÃ XÁC NHẬN |", "| | ĐÃ XÁC NHẬN |")), "b-thieu-nguoi-xac-nhan", "B-1")));
t("giả định thiếu 'nếu sai thì'", () => assert.ok(hasErr(run(mut(BASE, "| phải làm bản chạy trên mạng |", "| |")), "a-thieu-neu-sai", "A-1")));
t("câu hỏi mở quá hạn", () => assert.ok(hasWarn(run(mut(BASE, "| MỞ | 2026-12-01 |", "| MỞ | 2026-10-01 |")), "q-qua-han", "Q-1")));
t("thiếu cột bắt buộc", () => assert.ok(hasErr(run(mut(BASE, "| Nguồn | Nghiệm thu | Bản |", "| Nguồn | Ghi chú | Bản |")), "thieu-cot")));
t("SCOPE ĐÃ DUYỆT có Phải có mà không có ví dụ E", () => {
  const noE = BASE.replace(/\| ID \| Đầu vào[\s\S]*?\| E-1 \|[^\n]*\n\n/, "").replace("| Lan, 2026-10-20 | E-1 |", "| Lan, 2026-10-20 | test_dien_tich |");
  assert.ok(hasErr(run(noE), "thieu-e"), run(noE).report);
});
t("Phải có còn ĐỀ XUẤT trong SCOPE ĐÃ DUYỆT cảnh báo", () => assert.ok(hasWarn(run(mut(BASE, "| Phải có | ĐANG LÀM |", "| Phải có | ĐỀ XUẤT |")), "phai-co-chua-duyet", "R-1")));
t("không có bảng thông tin đầu file", () => assert.ok(hasErr(run(BASE.replace(/\| Trạng thái \| Phiên bản[\s\S]*?\n\n/, "")), "meta-thieu")));

// ---- dòng lệnh: mã thoát
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "scope-check-"));
const cli = (text, extra = []) => {
  const f = path.join(dir, "SCOPE.md");
  if (text != null) fs.writeFileSync(f, text, "utf8");
  return spawnSync(process.execPath, [SCRIPT, text == null ? path.join(dir, "khong-co.md") : f, "--today", TODAY].concat(extra), { encoding: "utf8" });
};
t("CLI: bản hợp lệ thoát 0 và in 'ĐẠT'", () => { const r = cli(BASE); assert.strictEqual(r.status, 0); assert.ok(r.stdout.includes("→ ĐẠT")); });
t("CLI: có LỖI thoát 1", () => assert.strictEqual(cli(mut(BASE, "| ĐANG LÀM |", "| LAM DO |")).status, 1));
t("CLI: file không có thoát 2", () => assert.strictEqual(cli(null).status, 2));
t("CLI: --strict biến CẢNH BÁO thành thất bại", () => {
  const w = mut(BASE, "| 42,5 m2 | Lan |", "| 42,5 m2 | |");
  assert.strictEqual(cli(w).status, 0);
  assert.strictEqual(cli(w, ["--strict"]).status, 1);
});
t("CLI: tham số lạ thoát 2", () => assert.strictEqual(cli(BASE, ["--bay-ba"]).status, 2));
t("bản mẫu trong skill không có LỖI (chỉ cảnh báo giữ chỗ)", () => {
  const r = spawnSync(process.execPath, [SCRIPT, TEMPLATE, "--today", TODAY], { encoding: "utf8" });
  assert.strictEqual(r.status, 0, r.stdout);
  assert.ok(r.stdout.includes("CẢNH BÁO"), r.stdout);
});
fs.rmSync(dir, { recursive: true, force: true });

console.log(`scope-check: ${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
