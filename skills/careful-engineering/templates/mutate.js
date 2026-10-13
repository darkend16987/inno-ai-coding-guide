// Mẫu chạy ĐỘT BIẾN — chứng minh test mới thật sự bắt được lỗi.
//
// Mỗi đột biến: làm hỏng có chủ đích một chỗ trong file THẬT → chạy test → mong test ĐỎ →
// KHÔI PHỤC từ bản trong bộ nhớ (không bao giờ `git checkout`: nó xoá luôn thay đổi chưa commit).
// Một đột biến "SURVIVED" = test chưa đủ chặt (hoặc đột biến không đổi hành vi — ghi rõ lý do).
//
// Chống "bắt giả": trước khi đột biến, chạy test trên mã NGUYÊN TRẠNG — phải XANH. Nếu lệnh test
// sai đường dẫn / không chạy được / đã đỏ sẵn thì mọi đột biến sẽ trông như "bị bắt" ⇒ dừng ngay.
// Đỏ chỉ được tính khi output khớp EXPECT (đỏ vì lỗi cú pháp / timeout không phải là test bắt được lỗi).
//
// Sau khi chạy: kiểm file đã về nguyên trạng (`md5sum -c` với hash lấy TRƯỚC khi chạy).
const fs = require("fs");
const { spawnSync } = require("child_process");

const CWD = "D:/repo";                       // thư mục chạy test
const CMD = [process.execPath, ["test/x.test.js"]]; // hoặc [".venv/Scripts/python.exe", ["test_x.py"]]
const TIMEOUT_MS = 120000;                   // test treo vì đột biến (vòng lặp vô hạn) ⇒ không tính là bắt
const MUT = [
  // [file, chuỗi gốc (phải khớp đúng 1 lần), chuỗi hỏng, nhãn: "lỗi gì mà test phải bắt", EXPECT?]
  // EXPECT (tuỳ chọn): regex mà output phải khớp khi đỏ, ví dụ /BI-7/ hoặc /tong tien/ — đỏ đúng chỗ.
  // ["D:/repo/src/a.js", `if (n > 0)`, `if (n >= 0)`, "biên lệch một", /n=0 phải bị từ chối/],
];

function run() {
  const r = spawnSync(CMD[0], CMD[1], { cwd: CWD, encoding: "utf8", timeout: TIMEOUT_MS });
  if (r.error && r.error.code !== "ETIMEDOUT") throw new Error("Không chạy được lệnh test: " + r.error.message);
  return { status: r.status, timedOut: !!r.error, out: (r.stdout || "") + (r.stderr || "") };
}

const base = run();
if (base.status !== 0 || base.timedOut) {
  console.log(base.out.slice(-1500));
  throw new Error("Test trên mã NGUYÊN TRẠNG không xanh — sửa lệnh test / test trước, rồi mới đột biến.");
}

let killed = 0;
for (const [file, a0, b0, label, expect] of MUT) {
  const orig = fs.readFileSync(file, "utf8");
  const EOL = orig.includes("\r\n") ? "\r\n" : "\n";
  const a = a0.replace(/\r?\n/g, EOL), b = b0.replace(/\r?\n/g, EOL);
  if (orig.split(a).length !== 2) { console.log("BỎ QUA (mẫu không khớp đúng 1 lần): " + label); continue; }
  let r;
  try {
    fs.writeFileSync(file, orig.split(a).join(b));
    r = run();
  } finally {
    fs.writeFileSync(file, orig); // LUÔN khôi phục, kể cả khi lệnh test ném lỗi
    if (fs.readFileSync(file, "utf8") !== orig) throw new Error("KHÔI PHỤC THẤT BẠI: " + file);
  }
  const red = r.status !== 0 && !r.timedOut;
  const ok = red && (!expect || expect.test(r.out));
  if (ok) killed++;
  const why = r.timedOut ? "timeout" : red && !ok ? "đỏ nhưng không khớp EXPECT" :
    (r.out.match(/FAIL[^\n]*|Error[^\n]*/) || [""])[0].slice(0, 110);
  console.log(`${ok ? "KILLED  " : "SURVIVED"} ${label}  ${why}`);
}
console.log(`${killed}/${MUT.length} đột biến bị bắt (baseline xanh)`);
