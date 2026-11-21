#!/usr/bin/env node
// inno-skill-router — hook SessionStart của Claude Code: mở đầu mỗi phiên (startup / resume / clear /
// compact) nhắc agent dùng đúng skill của bộ inno-ai-coding-guide, kèm vài sự thật về thư mục đang mở.
// Chỉ ĐỌC (stat + đọc vài file nhỏ); không ghi gì, không gọi mạng, không chạy lệnh con. Cần Node 18+.
//
//   Hook:      node inno-skill-router.js            (đọc JSON của hook ở stdin, in additionalContext)
//   Cài hook:  node inno-skill-router.js --install-hook <settings.json> --script <đường dẫn file này>
//              node inno-skill-router.js --install-hook <settings.json> --project   (lệnh dùng $CLAUDE_PROJECT_DIR)
//   Gỡ hook:   node inno-skill-router.js --remove-hook  <settings.json>
//   Tắt tạm:   đặt biến môi trường INNO_SKILL_ROUTER=off
//
// Chỉ nhắc skill ĐÃ cài thật (có SKILL.md ở <repo>/.claude/skills hoặc ~/.claude/skills).
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");

const MARK = "inno-skill-router"; // dấu nhận ra mục hook của mình trong settings.json
const EVENTS = "startup|resume|clear|compact";

const SKILL_LINES = {
  "careful-engineering":
    "Mọi việc sửa code / dữ liệu / hạ tầng / deploy: gọi skill `careful-engineering` — nói mức S/M/L một dòng rồi làm đúng các pha của mức đó.",
  "project-scope":
    "Dự án mới, yêu cầu còn mơ hồ, người yêu cầu không chuyên kỹ thuật, hoặc yêu cầu thêm / đổi giữa chừng: gọi skill `project-scope` TRƯỚC khi làm. Sửa lỗi và việc mức S thì không cần.",
  "inno-aec":
    "Việc chạm AutoCAD / Revit / LISP / bản vẽ / diện tích / khối lượng / hợp đồng / tiền VND, hoặc repo của INNO: gọi thêm skill `inno-aec`.",
};

const AEC_EXT = new Set([".dwg", ".dxf", ".lsp", ".rvt", ".rfa", ".rte", ".addin", ".dyn"]);
const AEC_CODE_EXT = new Set([".csproj", ".cs", ".vb", ".fsproj"]);
const AEC_CODE_RE = /AcMgd|AcDbMgd|AcCoreMgd|Autodesk\.(Revit|AutoCAD)|RevitAPI|accoreconsole/i;
const SKIP_DIRS = new Set(["node_modules", ".git", "bin", "obj", "dist", "build", "out", ".venv", "venv", "__pycache__"]);

const exists = (p) => { try { return fs.existsSync(p); } catch (e) { return false; } };

/** Gốc repo = thư mục tổ tiên gần nhất có .git; không có thì chính cwd. */
function findRoot(cwd) {
  let dir = path.resolve(cwd);
  for (;;) {
    if (exists(path.join(dir, ".git"))) return { root: dir, hasGit: true };
    const up = path.dirname(dir);
    if (up === dir) return { root: path.resolve(cwd), hasGit: false };
    dir = up;
  }
}

function installedSkills(root, home) {
  return Object.keys(SKILL_LINES).filter((n) =>
    exists(path.join(root, ".claude", "skills", n, "SKILL.md")) ||
    exists(path.join(home, ".claude", "skills", n, "SKILL.md")));
}

/** Quét nông (gốc + một tầng con, tối đa ~300 mục) tìm dấu hiệu AutoCAD / Revit. */
function aecSignals(root) {
  const found = new Set();
  let budget = 300;
  const scan = (dir, depth) => {
    let ents;
    try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
    for (const e of ents) {
      if (budget-- <= 0) return;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (depth < 1 && !SKIP_DIRS.has(e.name) && !e.name.startsWith(".")) scan(full, depth + 1);
        continue;
      }
      const ext = path.extname(e.name).toLowerCase();
      if (AEC_EXT.has(ext)) found.add(ext);
      else if (AEC_CODE_EXT.has(ext) && found.size < 4) {
        try {
          const fd = fs.openSync(full, "r");
          const buf = Buffer.alloc(65536);
          const n = fs.readSync(fd, buf, 0, buf.length, 0);
          fs.closeSync(fd);
          if (AEC_CODE_RE.test(buf.toString("utf8", 0, n))) found.add("API Autodesk trong " + e.name);
        } catch (err) { /* bỏ qua file đọc không được */ }
      }
    }
  };
  scan(root, 0);
  return [...found];
}

function nonDotEntries(root) {
  try { return fs.readdirSync(root).filter((n) => !n.startsWith(".")).length; } catch (e) { return 0; }
}

/** Trả chuỗi ngữ cảnh, hoặc null nếu không có skill nào của bộ này đã cài (khi đó im lặng). */
function buildContext({ cwd, home }) {
  const { root, hasGit } = findRoot(cwd);
  const skills = installedSkills(root, home || os.homedir());
  if (!skills.length) return null;

  const out = ["[inno-ai-coding-guide] Skill có sẵn trong phiên này — tự dùng đúng lúc, không chờ người dùng gõ tên skill:"];
  for (const n of skills) out.push("- " + SKILL_LINES[n]);

  const facts = [];
  const entries = nonDotEntries(root);
  if (!hasGit) facts.push("Thư mục chưa là git repo ⇒ trước khi sửa gì: đề xuất `git init` + commit nguyên trạng.");
  if (entries === 0) {
    facts.push("Thư mục gần như trống ⇒ nhiều khả năng là dự án mới: dùng `project-scope` (chế độ A: khảo sát rồi ghi docs/SCOPE.md) trước khi viết code.");
  } else if (!exists(path.join(root, "AGENTS.md")) && !exists(path.join(root, "CLAUDE.md"))) {
    facts.push("Repo chưa có AGENTS.md / CLAUDE.md ⇒ khi hợp lý, đề xuất tạo từ mẫu starter/ của bộ hướng dẫn (chỉ đề xuất, không tự tạo).");
  }
  if (exists(path.join(root, "docs", "SCOPE.md"))) {
    facts.push("Có docs/SCOPE.md ⇒ đọc nó trước khi làm; việc không truy được về một yêu cầu R-xxx là thay đổi phạm vi, hỏi trước (project-scope, chế độ C).");
  }
  if (skills.includes("inno-aec")) {
    const sig = aecSignals(root);
    if (sig.length) facts.push("Repo có dấu hiệu AutoCAD / Revit (" + sig.slice(0, 4).join(", ") + ") ⇒ dùng `inno-aec` cho mọi việc ở đây.");
  }
  if (facts.length) { out.push("Trạng thái thư mục đang mở:"); for (const f of facts) out.push("- " + f); }

  out.push("Luật trong AGENTS.md / CLAUDE.md của repo đứng trên các skill. Được giao \"xem / kiểm tra / review / giải thích\" ⇒ chỉ đọc và báo cáo, chưa sửa.");
  return out.join("\n");
}

// ---- cài / gỡ mục hook trong settings.json (thuần, kiểm được) ------------------------------------

const isOurs = (entry) => !!entry && Array.isArray(entry.hooks) &&
  entry.hooks.some((h) => h && typeof h.command === "string" && h.command.includes(MARK));

function addHook(settings, command) {
  if (!settings || typeof settings !== "object" || Array.isArray(settings)) throw new Error("settings phải là một object JSON");
  if (settings.hooks === undefined) settings.hooks = {};
  if (!settings.hooks || typeof settings.hooks !== "object" || Array.isArray(settings.hooks)) throw new Error("\"hooks\" trong settings không phải object — không sửa");
  const cur = settings.hooks.SessionStart === undefined ? [] : settings.hooks.SessionStart;
  if (!Array.isArray(cur)) throw new Error("\"hooks.SessionStart\" không phải mảng — không sửa");
  settings.hooks.SessionStart = cur.filter((e) => !isOurs(e)).concat([
    { matcher: EVENTS, hooks: [{ type: "command", command }] },
  ]);
  return settings;
}

function removeHook(settings) {
  if (settings && settings.hooks && Array.isArray(settings.hooks.SessionStart)) {
    settings.hooks.SessionStart = settings.hooks.SessionStart.filter((e) => !isOurs(e));
    if (!settings.hooks.SessionStart.length) delete settings.hooks.SessionStart;
    if (!Object.keys(settings.hooks).length) delete settings.hooks;
  }
  return settings;
}

/** Đọc → sửa → ghi settings.json. File hỏng (không phải JSON) thì KHÔNG đụng vào. Có file cũ thì sao lưu. */
function editSettingsFile(file, mutate) {
  let settings = {};
  let hadFile = false;
  if (exists(file)) {
    hadFile = true;
    const raw = fs.readFileSync(file, "utf8").replace(/^﻿/, "");
    if (raw.trim()) {
      try { settings = JSON.parse(raw); }
      catch (e) { throw new Error(file + " không phải JSON hợp lệ (" + e.message + ") — chưa sửa gì"); }
    }
  }
  const before = JSON.stringify(settings);
  mutate(settings);
  if (JSON.stringify(settings) === before && hadFile) return { changed: false, backup: null };
  let backup = null;
  if (hadFile) {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    backup = file + ".bak-" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
    fs.copyFileSync(file, backup);
  } else {
    fs.mkdirSync(path.dirname(file), { recursive: true });
  }
  fs.writeFileSync(file, JSON.stringify(settings, null, 2) + "\n", "utf8");
  return { changed: true, backup };
}

// ---- điểm vào ------------------------------------------------------------------------------------

function readStdin() {
  try { return fs.readFileSync(0, "utf8"); } catch (e) { return ""; }
}

/** Lệnh hook cho từng kiểu cài. Dựng ở đây (không nhận từ PowerShell) vì PowerShell 5.1 làm rơi dấu " khi
 *  truyền tham số cho chương trình ngoài ⇒ đường dẫn có dấu cách sẽ vỡ. */
const PROJECT_COMMAND = 'node "$CLAUDE_PROJECT_DIR/.claude/hooks/inno-skill-router.js"';
const userCommand = (scriptPath) => 'node "' + String(scriptPath).replace(/\\/g, "/") + '"';

function main(argv) {
  const [flag, file, a3, a4] = argv;
  let command = a3;
  if (a3 === "--project") command = PROJECT_COMMAND;
  else if (a3 === "--script") command = a4 ? userCommand(a4) : undefined;
  if (flag === "--install-hook" || flag === "--remove-hook") {
    if (!file || (flag === "--install-hook" && !command)) {
      process.stderr.write("usage: --install-hook <settings.json> (--project | --script <path to this file> | \"<command>\")  |  --remove-hook <settings.json>\n");
      return 2;
    }
    try {
      const r = editSettingsFile(file, flag === "--install-hook" ? (s) => addHook(s, command) : removeHook);
      process.stdout.write((r.changed ? "UPDATED " : "UNCHANGED ") + file + (r.backup ? " (backup: " + r.backup + ")" : "") + "\n");
      return 0;
    } catch (e) {
      process.stderr.write("ERROR: " + e.message + "\n");
      return 1;
    }
  }

  if (String(process.env.INNO_SKILL_ROUTER || "").toLowerCase() === "off") return 0;
  let cwd = process.cwd();
  try { const j = JSON.parse(readStdin() || "{}"); if (j && typeof j.cwd === "string" && j.cwd) cwd = j.cwd; } catch (e) { /* dùng cwd tiến trình */ }
  let ctx = null;
  try { ctx = buildContext({ cwd, home: os.homedir() }); } catch (e) { return 0; } // hook không bao giờ được làm hỏng phiên
  if (ctx) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: ctx } }) + "\n");
  return 0;
}

// exitCode thay vì process.exit(): thoát cứng có thể cắt mất dòng vừa ghi vào pipe (Windows).
if (require.main === module) process.exitCode = main(process.argv.slice(2));
module.exports = { PROJECT_COMMAND, userCommand, buildContext, addHook, removeHook, editSettingsFile, findRoot, installedSkills, aecSignals, MARK };
