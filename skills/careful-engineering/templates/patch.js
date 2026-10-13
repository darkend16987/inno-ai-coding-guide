// Mẫu script PATCH an toàn — dùng thay cho sed / heredoc / python -c khi chuỗi có
// dấu \ , backtick, tiếng Việt, hoặc khi cần sửa nhiều chỗ một lượt.
//
// Vì sao: shell quoting trên Windows đã nhiều lần ĂN dấu \ (\\ → \, '\b' → ký tự 0x08 vô hình),
// vấp backtick, và đổi CRLF. Script này đọc file, thay CHUỖI CHÍNH XÁC, đòi đúng N lần khớp
// (0 hoặc 2 lần ⇒ dừng, không ghi gì), giữ nguyên kiểu xuống dòng của file.
//
// Cách dùng: chép file này vào scratchpad, sửa mảng PATCHES, chạy `node patch.js`.
// Viết file này bằng công cụ Write (KHÔNG qua heredoc). Trong template literal JS, dấu \ và
// backtick phải viết \\ và \` .
const fs = require("fs");

const PATCHES = [
  // [đường dẫn tuyệt đối, chuỗi cũ, chuỗi mới, số lần khớp mong đợi (mặc định 1)]
  // ["D:/repo/src/a.js", `  const x = 1;\n`, `  const x = 2;\n`],
];

const byFile = new Map();
for (const [file, from, to, n = 1] of PATCHES) {
  if (!byFile.has(file)) byFile.set(file, []);
  byFile.get(file).push([from, to, n]);
}
// Kiểm hết rồi mới ghi: một chỗ sai thì KHÔNG file nào bị đổi.
const out = new Map();
for (const [file, list] of byFile) {
  let s = fs.readFileSync(file, "utf8");
  const EOL = s.includes("\r\n") ? "\r\n" : "\n"; // giữ CRLF/LF như file gốc
  for (const [from0, to0, n] of list) {
    const from = from0.replace(/\r?\n/g, EOL);
    const to = to0.replace(/\r?\n/g, EOL);
    const cnt = s.split(from).length - 1;
    if (cnt !== n) throw new Error(`${file}: cần ${n} chỗ khớp, thấy ${cnt}: ${JSON.stringify(from0.slice(0, 80))}`);
    s = s.split(from).join(to); // không dùng String.replace: "$&", "$1" trong chuỗi mới sẽ bị hiểu sai
  }
  if (s.includes("\uFFFD")) throw new Error(`${file}: có ký tự U+FFFD — đọc/ghi sai mã hoá`);
  out.set(file, s);
}
for (const [file, s] of out) {
  fs.writeFileSync(file, s, "utf8"); // UTF-8 KHÔNG BOM
  console.log("patched", file);
}
