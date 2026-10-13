// Mẫu chạy ĐỘT BIẾN — chứng minh test mới thật sự bắt được lỗi.
//
// Mỗi đột biến: làm hỏng có chủ đích một chỗ trong file THẬT → chạy test → mong test ĐỎ →
// KHÔI PHỤC từ bản trong bộ nhớ (không bao giờ `git checkout`: nó xoá luôn thay đổi chưa commit).
// Một đột biến "SURVIVED" = test chưa đủ chặt (hoặc đột biến không đổi hành vi — ghi rõ lý do).
//
// Sau khi chạy: kiểm file đã về nguyên trạng (`md5sum -c` với hash lấy TRƯỚC khi chạy).
const fs = require("fs");
const { spawnSync } = require("child_process");

const CWD = "D:/repo";                       // thư mục chạy test
const CMD = [process.execPath, ["test/x.test.js"]]; // hoặc [".venv/Scripts/python.exe", ["test_x.py"]]
const MUT = [
  // [file, chuỗi gốc (phải khớp đúng 1 lần), chuỗi hỏng, nhãn: "lỗi gì mà test phải bắt"]
  // ["D:/repo/src/a.js", `if (n > 0)`, `if (n >= 0)`, "biên lệch một"],
];

let killed = 0;
for (const [file, a0, b0, label] of MUT) {
  const orig = fs.readFileSync(file, "utf8");
  const EOL = orig.includes("\r\n") ? "\r\n" : "\n";
  const a = a0.replace(/\r?\n/g, EOL), b = b0.replace(/\r?\n/g, EOL);
  if (orig.split(a).length !== 2) { console.log("BỎ QUA (mẫu không khớp đúng 1 lần): " + label); continue; }
  let r;
  try {
    fs.writeFileSync(file, orig.split(a).join(b));
    r = spawnSync(CMD[0], CMD[1], { cwd: CWD, encoding: "utf8" });
  } finally {
    fs.writeFileSync(file, orig); // LUÔN khôi phục, kể cả khi spawn ném lỗi
  }
  const ok = r.status !== 0;
  if (ok) killed++;
  const why = ((r.stdout + r.stderr).match(/FAIL[^\n]*|Error[^\n]*/) || [""])[0].slice(0, 110);
  console.log(`${ok ? "KILLED  " : "SURVIVED"} ${label}  ${why}`);
}
console.log(`${killed}/${MUT.length} đột biến bị bắt`);
