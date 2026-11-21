// Test cho hooks/inno-skill-router.js — chạy: node evals/skill-router.test.js
// In "N/M" và thoát 1 nếu có ca đỏ. Dùng thư mục tạm, không đụng ~/.claude thật.
"use strict";
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const SCRIPT = path.join(__dirname, "..", "hooks", "inno-skill-router.js");
const R = require(SCRIPT);

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "router-test-"));
let seq = 0;
const mk = (files = {}) => {
  const dir = path.join(tmpRoot, "d" + ++seq);
  fs.mkdirSync(dir, { recursive: true });
  for (const [rel, body] of Object.entries(files)) {
    const f = path.join(dir, rel);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, body);
  }
  return dir;
};
const skillFiles = (names) => Object.fromEntries(names.map((n) => [".claude/skills/" + n + "/SKILL.md", "---\nname: " + n + "\n---\n"]));
const ALL = ["careful-engineering", "project-scope", "inno-aec"];
// home giả có đủ skill; home trống để thử "chưa cài".
const HOME = mk(skillFiles(ALL));
const EMPTY_HOME = mk();
const ctx = (cwd, home = HOME) => R.buildContext({ cwd, home });

const tests = [];
const t = (name, fn) => tests.push([name, fn]);

// ---- nội dung gợi ý ----
t("chưa cài skill nào => im lặng (null)", () => {
  assert.strictEqual(ctx(mk({ "a.txt": "x", ".git/HEAD": "" }), EMPTY_HOME), null);
});
t("liệt kê đúng ba skill đã cài ở home", () => {
  const c = ctx(mk({ "a.txt": "x", ".git/HEAD": "" }));
  for (const n of ALL) assert.ok(c.includes("`" + n + "`"), n);
});
t("chỉ nhắc skill ĐÃ cài (home chỉ có careful-engineering)", () => {
  const home = mk(skillFiles(["careful-engineering"]));
  const c = ctx(mk({ "a.txt": "x", ".git/HEAD": "" }), home);
  assert.ok(c.includes("`careful-engineering`"));
  assert.ok(!c.includes("`project-scope`") && !c.includes("`inno-aec`"));
});
t("skill cài ở .claude/skills của repo cũng được nhận", () => {
  const c = ctx(mk(Object.assign({ "a.txt": "x", ".git/HEAD": "" }, skillFiles(["project-scope"]))), EMPTY_HOME);
  assert.ok(c && c.includes("`project-scope`"));
});
t("không có git => nhắc git init", () => {
  assert.ok(ctx(mk({ "a.txt": "x" })).includes("git init"));
});
t("có git => không nhắc git init", () => {
  assert.ok(!ctx(mk({ "a.txt": "x", ".git/HEAD": "" })).includes("git init"));
});
t("git ở thư mục cha vẫn tính là có git, gốc là thư mục cha", () => {
  const top = mk({ ".git/HEAD": "", "AGENTS.md": "x", "docs/SCOPE.md": "x", "sub/a.txt": "x" });
  const c = ctx(path.join(top, "sub"));
  assert.ok(!c.includes("git init"));
  assert.ok(c.includes("docs/SCOPE.md"));
});
t("thư mục trống (chỉ file dấu chấm) => gợi ý project-scope chế độ A", () => {
  const c = ctx(mk({ ".git/HEAD": "", ".gitignore": "x" }));
  assert.ok(c.includes("dự án mới") && c.includes("chế độ A"));
});
t("repo có mã mà thiếu AGENTS.md/CLAUDE.md => đề xuất mẫu starter", () => {
  assert.ok(ctx(mk({ ".git/HEAD": "", "main.py": "x" })).includes("starter/"));
});
t("có AGENTS.md => không đề xuất mẫu starter", () => {
  assert.ok(!ctx(mk({ ".git/HEAD": "", "main.py": "x", "AGENTS.md": "x" })).includes("starter/"));
});
t("có docs/SCOPE.md => nhắc đọc SCOPE và chế độ C", () => {
  const c = ctx(mk({ ".git/HEAD": "", "AGENTS.md": "x", "docs/SCOPE.md": "x" }));
  assert.ok(c.includes("docs/SCOPE.md") && c.includes("chế độ C"));
});
t("luôn có câu 'luật repo đứng trên' và 'chỉ đọc'", () => {
  const c = ctx(mk({ ".git/HEAD": "", "AGENTS.md": "x" }));
  assert.ok(c.includes("AGENTS.md / CLAUDE.md của repo đứng trên") && c.includes("chỉ đọc"));
});

// ---- dấu hiệu AutoCAD / Revit ----
t("file .dwg => dấu hiệu AEC", () => {
  assert.ok(ctx(mk({ ".git/HEAD": "", "AGENTS.md": "x", "plan.dwg": "x" })).includes("dấu hiệu AutoCAD / Revit"));
});
t("file .lsp ở thư mục con => dấu hiệu AEC", () => {
  assert.ok(ctx(mk({ ".git/HEAD": "", "AGENTS.md": "x", "lisp/a.lsp": "x" })).includes("dấu hiệu AutoCAD / Revit"));
});
t(".csproj tham chiếu Autodesk.Revit => dấu hiệu AEC", () => {
  const c = ctx(mk({ ".git/HEAD": "", "AGENTS.md": "x", "App/App.csproj": '<Reference Include="RevitAPI" />' }));
  assert.ok(c.includes("dấu hiệu AutoCAD / Revit"));
});
t(".csproj thường (không Autodesk) => không có dấu hiệu AEC", () => {
  const c = ctx(mk({ ".git/HEAD": "", "AGENTS.md": "x", "App/App.csproj": "<Project Sdk=\"Microsoft.NET.Sdk\"/>" }));
  assert.ok(!c.includes("dấu hiệu AutoCAD / Revit"));
});
t("dấu hiệu AEC nằm trong node_modules bị bỏ qua", () => {
  const c = ctx(mk({ ".git/HEAD": "", "AGENTS.md": "x", "node_modules/a.dwg": "x" }));
  assert.ok(!c.includes("dấu hiệu AutoCAD / Revit"));
});

// ---- chạy như hook thật (tiến trình con) ----
const runHook = (cwd, env = {}) => spawnSync(process.execPath, [SCRIPT], {
  input: JSON.stringify({ hook_event_name: "SessionStart", source: "startup", cwd }),
  encoding: "utf8",
  env: Object.assign({}, process.env, { USERPROFILE: HOME, HOME }, env),
});
t("hook thật: stdout là JSON SessionStart với additionalContext, thoát 0", () => {
  const r = runHook(mk({ ".git/HEAD": "", "AGENTS.md": "x", "a.txt": "x" }));
  assert.strictEqual(r.status, 0, r.stderr);
  const j = JSON.parse(r.stdout);
  assert.strictEqual(j.hookSpecificOutput.hookEventName, "SessionStart");
  assert.ok(j.hookSpecificOutput.additionalContext.includes("careful-engineering"));
});
t("hook thật: INNO_SKILL_ROUTER=off => không in gì, thoát 0", () => {
  const r = runHook(mk({ ".git/HEAD": "", "a.txt": "x" }), { INNO_SKILL_ROUTER: "off" });
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.stdout, "");
});
t("hook thật: stdin rác => vẫn thoát 0, dùng cwd tiến trình", () => {
  const r = spawnSync(process.execPath, [SCRIPT], { input: "not json", encoding: "utf8", cwd: mk({ ".git/HEAD": "", "a.txt": "x" }), env: Object.assign({}, process.env, { USERPROFILE: HOME, HOME }) });
  assert.strictEqual(r.status, 0, r.stderr);
  assert.ok(JSON.parse(r.stdout).hookSpecificOutput.additionalContext.length > 50);
});
t("hook thật: tiếng Việt có dấu đi qua pipe nguyên vẹn", () => {
  const r = runHook(mk({ ".git/HEAD": "", "a.txt": "x" }));
  const c = JSON.parse(r.stdout).hookSpecificOutput.additionalContext;
  assert.ok(c.includes("Mọi việc sửa code / dữ liệu / hạ tầng"));
});

// ---- cài / gỡ mục hook ----
const CMD = 'node "C:/Users/x/.claude/hooks/inno-skill-router.js"';
t("addHook: tạo hooks.SessionStart khi chưa có, có matcher + command", () => {
  const s = R.addHook({}, CMD);
  assert.strictEqual(s.hooks.SessionStart.length, 1);
  assert.strictEqual(s.hooks.SessionStart[0].hooks[0].command, CMD);
  assert.strictEqual(s.hooks.SessionStart[0].hooks[0].type, "command");
  assert.ok(s.hooks.SessionStart[0].matcher.includes("compact"));
});
t("addHook: giữ nguyên khoá khác và hook của người khác", () => {
  const other = { matcher: "startup", hooks: [{ type: "command", command: "echo hi" }] };
  const s = R.addHook({ theme: "dark", hooks: { SessionStart: [other], Stop: [{ hooks: [] }] } }, CMD);
  assert.strictEqual(s.theme, "dark");
  assert.deepStrictEqual(s.hooks.Stop, [{ hooks: [] }]);
  assert.strictEqual(s.hooks.SessionStart.length, 2);
  assert.deepStrictEqual(s.hooks.SessionStart[0], other);
});
t("addHook: chạy hai lần vẫn một mục (idempotent), đổi lệnh thì thay mục cũ", () => {
  const a = R.addHook(R.addHook({}, CMD), CMD);
  assert.strictEqual(a.hooks.SessionStart.length, 1);
  const b = R.addHook(a, 'node "D:/other/inno-skill-router.js"');
  assert.strictEqual(b.hooks.SessionStart.length, 1);
  assert.ok(b.hooks.SessionStart[0].hooks[0].command.includes("D:/other"));
});
t("addHook: hooks hoặc SessionStart sai kiểu => ném lỗi, không sửa", () => {
  assert.throws(() => R.addHook({ hooks: [] }, CMD), /không phải object/);
  assert.throws(() => R.addHook({ hooks: { SessionStart: {} } }, CMD), /không phải mảng/);
});
t("removeHook: chỉ gỡ mục của mình, dọn khoá rỗng", () => {
  const other = { hooks: [{ type: "command", command: "echo hi" }] };
  const s = R.removeHook(R.addHook({ hooks: { SessionStart: [other] } }, CMD));
  assert.deepStrictEqual(s.hooks.SessionStart, [other]);
  const e = R.removeHook(R.addHook({}, CMD));
  assert.deepStrictEqual(e, {});
});

const settingsPath = () => path.join(mk(), "settings.json");
const cli = (...args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" });
t("--install-hook: tạo file mới (kể cả thư mục cha chưa có)", () => {
  const f = path.join(mk(), "nested", "settings.json");
  const r = cli("--install-hook", f, CMD);
  assert.strictEqual(r.status, 0, r.stderr);
  assert.strictEqual(JSON.parse(fs.readFileSync(f, "utf8")).hooks.SessionStart[0].hooks[0].command, CMD);
});
const cmdOf = (f) => JSON.parse(fs.readFileSync(f, "utf8")).hooks.SessionStart[0].hooks[0].command;
t("--install-hook --script: lệnh có dấu nháy quanh đường dẫn, đổi \\ thành / (đường dẫn có dấu cách)", () => {
  const f = settingsPath();
  const r = cli("--install-hook", f, "--script", "C:\\Users\\Nguyen Van A\\.claude\\hooks\\inno-skill-router.js");
  assert.strictEqual(r.status, 0, r.stderr);
  assert.strictEqual(cmdOf(f), 'node "C:/Users/Nguyen Van A/.claude/hooks/inno-skill-router.js"');
});
t("--install-hook --project: lệnh dùng $CLAUDE_PROJECT_DIR, có nháy", () => {
  const f = settingsPath();
  assert.strictEqual(cli("--install-hook", f, "--project").status, 0);
  assert.strictEqual(cmdOf(f), 'node "$CLAUDE_PROJECT_DIR/.claude/hooks/inno-skill-router.js"');
});
t("--install-hook --script thiếu đường dẫn => lỗi dùng sai (2), không tạo file", () => {
  const f = settingsPath();
  assert.strictEqual(cli("--install-hook", f, "--script").status, 2);
  assert.ok(!fs.existsSync(f));
});
t("--install-hook: file có sẵn (có BOM) được sao lưu, khoá cũ còn nguyên", () => {
  const f = settingsPath();
  fs.writeFileSync(f, "\uFEFF" + JSON.stringify({ theme: "dark" }));
  const r = cli("--install-hook", f, CMD);
  assert.strictEqual(r.status, 0, r.stderr);
  assert.ok(/backup:/.test(r.stdout));
  const baks = fs.readdirSync(path.dirname(f)).filter((n) => n.startsWith("settings.json.bak-"));
  assert.strictEqual(baks.length, 1);
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(path.join(path.dirname(f), baks[0]), "utf8").replace(/^\uFEFF/, "")), { theme: "dark" });
  assert.strictEqual(JSON.parse(fs.readFileSync(f, "utf8")).theme, "dark");
});
t("--install-hook: chạy lại => UNCHANGED, không thêm bản sao lưu", () => {
  const f = settingsPath();
  cli("--install-hook", f, CMD);
  const r = cli("--install-hook", f, CMD);
  assert.strictEqual(r.status, 0);
  assert.ok(r.stdout.startsWith("UNCHANGED"));
  assert.strictEqual(fs.readdirSync(path.dirname(f)).filter((n) => n.includes(".bak-")).length, 0);
});
t("--install-hook: file không phải JSON => lỗi, file giữ nguyên byte", () => {
  const f = settingsPath();
  fs.writeFileSync(f, "{ not json");
  const r = cli("--install-hook", f, CMD);
  assert.strictEqual(r.status, 1);
  assert.strictEqual(fs.readFileSync(f, "utf8"), "{ not json");
});
t("--remove-hook: gỡ sạch, giữ khoá khác", () => {
  const f = settingsPath();
  fs.writeFileSync(f, JSON.stringify({ theme: "dark" }));
  cli("--install-hook", f, CMD);
  const r = cli("--remove-hook", f);
  assert.strictEqual(r.status, 0, r.stderr);
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(f, "utf8")), { theme: "dark" });
});

let pass = 0;
for (const [name, fn] of tests) {
  try { fn(); pass++; } catch (e) { console.log("RED  " + name + "\n     " + String(e.message).split("\n")[0]); }
}
fs.rmSync(tmpRoot, { recursive: true, force: true });
console.log(pass + "/" + tests.length);
process.exit(pass === tests.length ? 0 : 1);
