#!/usr/bin/env node
// scope-check.js — kiểm docs/SCOPE.md và in bảng tiến độ. Không cần gói nào, Node 18+.
//
//   node scripts/scope-check.js [docs/SCOPE.md] [--stale-days 30] [--today YYYY-MM-DD] [--strict]
//
// Mã thoát: 0 = không có LỖI (CẢNH BÁO vẫn cho qua; --strict coi CẢNH BÁO là lỗi) · 1 = có LỖI ·
// 2 = không đọc được file / tham số sai. Chép file này vào scripts/ của repo dự án (skill project-scope, bước 4).
//
// Đọc bảng Markdown theo TÊN CỘT (không theo thứ tự) và theo tiền tố ID ở cột đầu:
// G U S R NG D E B C RR A Q V CR. Ký tự | trong ô phải viết \| . Chỉ kiểm cấu trúc và sự nhất quán —
// không kiểm nghiệp vụ đúng hay sai.
"use strict";
const fs = require("fs");

const PREFIXES = "NG|RR|CR|G|U|S|R|D|E|B|C|A|Q|V";
const ID_RE = new RegExp("^(" + PREFIXES + ")-(\\d+)$");
const REF_RE = new RegExp("\\b(?:" + PREFIXES + ")-\\d+\\b", "g");
const PH_RE = /<(?!\/?br\s*\/?>)[^<>\n]+>|\bTBD\b|\bTODO\b|YYYY-MM-DD/i; // chỗ còn giữ chỗ chưa điền

const ENUM = {
  doc: { "du thao": "DỰ THẢO", "da duyet": "ĐÃ DUYỆT", "dang doi": "ĐANG ĐỔI" },
  prio: { "phai co": "Phải có", "nen co": "Nên có", "de sau": "Để sau" },
  rst: { "de xuat": "ĐỀ XUẤT", "da duyet": "ĐÃ DUYỆT", "dang lam": "ĐANG LÀM", xong: "XONG", hoan: "HOÃN", bo: "BỎ" },
  qst: { mo: "MỞ", "da tra loi": "ĐÃ TRẢ LỜI" },
  ast: { "chua kiem": "CHƯA KIỂM", dung: "ĐÚNG", sai: "SAI" },
  bst: { "de xuat": "ĐỀ XUẤT", "da xac nhan": "ĐÃ XÁC NHẬN" },
  crt: { "khoi tao": "KHỞI TẠO", "lam ro": "LÀM RÕ", "doi nho": "ĐỔI NHỎ", "doi huong": "ĐỔI HƯỚNG" },
};
const REQUIRED = {
  G: ["muc tieu", "do bang", "moc hien tai", "as-of"],
  R: ["yeu cau", "uu tien", "trang thai", "nguon", "nghiem thu", "ban"],
  E: ["dau vao", "ket qua dung", "ai da tu kiem", "ngay"],
  B: ["quy tac", "can cu", "ai xac nhan", "trang thai"],
  A: ["gia dinh", "neu sai", "cach kiem", "trang thai", "as-of"],
  Q: ["cau hoi", "ai tra loi", "chan", "trang thai", "han"],
  CR: ["ngay", "loai", "thay doi", "vi sao", "ai duyet", "anh huong"],
};
const ACTIVE = ["da duyet", "dang lam", "xong"];

const fold = (s) =>
  String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/đ/g, "d").replace(/\s+/g, " ").trim();
const clean = (s) => String(s).replace(/\*\*|~~|`/g, "").replace(/\s+/g, " ").trim();
const isEmpty = (s) => s === "" || /^[-–—…]+$/.test(s);
const enumKey = (s) => fold(String(s).replace(/\s*\(.*\)\s*$/, ""));
const p2 = (n) => String(n).padStart(2, "0");
const todayStr = () => { const d = new Date(); return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate()); };

function parseDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3] ? d : null;
}
const daysBetween = (a, b) => Math.round((b - a) / 86400000);

const isRow = (l) => /^\s*\|.*\|\s*$/.test(l);
const isSep = (l) => /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(l);
const splitCells = (l) =>
  l.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/).map((c) => c.replace(/\\\|/g, "|").trim());

function parseTables(text) {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/);
  const tables = [];
  for (let i = 0; i < lines.length; ) {
    if (isRow(lines[i]) && i + 1 < lines.length && isSep(lines[i + 1])) {
      const header = splitCells(lines[i]).map(clean);
      const rows = [];
      let j = i + 2;
      while (j < lines.length && isRow(lines[j])) rows.push({ cells: splitCells(lines[j]), line: ++j });
      tables.push({ hf: header.map(fold), rows, line: i + 1 });
      i = j;
    } else i++;
  }
  return tables;
}

function findCol(hf, key) {
  let i = hf.indexOf(key);
  if (i < 0) i = hf.findIndex((h) => h.startsWith(key));
  if (i < 0) i = hf.findIndex((h) => h.includes(key));
  return i;
}

function check(text, opts = {}) {
  const today = opts.today || todayStr();
  const staleDays = opts.staleDays == null ? 30 : opts.staleDays;
  const todayD = parseDate(today);
  const issues = [];
  const err = (code, id, line, msg) => issues.push({ level: "LỖI", code, id, line, msg });
  const warn = (code, id, line, msg) => issues.push({ level: "CẢNH BÁO", code, id, line, msg });
  const tables = parseTables(text);

  // ---- bảng thông tin đầu file
  const mt = tables.find((t) => t.hf.includes("trang thai") && t.hf.includes("phien ban"));
  let meta = null;
  if (!mt || !mt.rows.length) err("meta-thieu", "", 0, "thiếu bảng thông tin đầu file (Trạng thái | Phiên bản | Cập nhật | Người duyệt)");
  else {
    const c = mt.rows[0].cells.map(clean);
    const g = (k) => { const i = findCol(mt.hf, k); return i < 0 ? "" : c[i] || ""; };
    meta = { status: g("trang thai"), version: g("phien ban"), updated: g("cap nhat"), approver: g("nguoi duyet"), line: mt.rows[0].line };
  }
  const docKey = meta ? enumKey(meta.status) : "";
  const approvedDoc = docKey === "da duyet";

  // ---- gom các dòng có ID
  const items = [];
  const byId = new Map();
  const missingCols = new Set();
  for (const t of tables) {
    for (const r of t.rows) {
      const id = clean(r.cells[0] || "");
      const m = ID_RE.exec(id);
      if (!m) continue;
      const it = { id, prefix: m[1], line: r.line, t, ok: true };
      it.get = (key) => { const i = findCol(t.hf, key); return i < 0 ? "" : clean(r.cells[i] || ""); };
      it.cells = r.cells.map(clean);
      if (REQUIRED[it.prefix]) {
        for (const key of REQUIRED[it.prefix]) {
          if (findCol(t.hf, key) < 0) {
            it.ok = false;
            const tag = it.prefix + "@" + t.line + ":" + key;
            if (!missingCols.has(tag)) { missingCols.add(tag); err("thieu-cot", id, t.line, `bảng ${it.prefix}- thiếu cột "${key}"`); }
          }
        }
      }
      if (byId.has(id)) err("id-trung", id, r.line, `ID trùng với dòng ${byId.get(id).line}`);
      else byId.set(id, it);
      items.push(it);
    }
  }
  const of = (p) => items.filter((i) => i.prefix === p);
  const okOf = (p) => of(p).filter((i) => i.ok);

  const dateState = (it, key) => {
    const v = it.get(key);
    if (isEmpty(v)) return { s: "empty", v };
    if (PH_RE.test(v)) return { s: "ph", v };
    const d = parseDate(v);
    return d ? { s: "ok", v, d } : { s: "bad", v };
  };
  const checkEnum = (it, key, map, name) => {
    const raw = it.get(key);
    const k = enumKey(raw);
    if (!map[k]) err("gia-tri-sai", it.id, it.line, `${name} "${raw}" không hợp lệ (${Object.values(map).join(" · ")})`);
    return k;
  };
  const checkRefs = (it, key, level) => {
    for (const tok of it.get(key).match(REF_RE) || []) {
      if (!byId.has(tok)) (level === "warn" ? warn : err)("tham-chieu-treo", it.id, it.line, `cột "${key}" trỏ tới ${tok} nhưng không có dòng nào mang ID đó`);
    }
  };
  const stale = (it, key, what) => {
    const ds = dateState(it, key);
    if (ds.s === "bad") warn("ngay-sai", it.id, it.line, `${what} "${ds.v}" không đúng dạng YYYY-MM-DD`);
    else if (ds.s === "ok" && todayD && daysBetween(ds.d, todayD) > staleDays)
      warn("so-do-cu", it.id, it.line, `${what} ${ds.v} đã ${daysBetween(ds.d, todayD)} ngày — đo lại trước khi dựa vào`);
    return ds;
  };

  // ---- thông tin đầu file
  if (meta) {
    if (!ENUM.doc[docKey]) err("doc-trang-thai", "", meta.line, `Trạng thái "${meta.status}" không hợp lệ (${Object.values(ENUM.doc).join(" · ")})`);
    if (!/^v?\d+\.\d+$/i.test(meta.version)) err("doc-phien-ban", "", meta.line, `Phiên bản "${meta.version}" không đúng dạng vX.Y`);
    const d = parseDate(meta.updated);
    if (!d) (approvedDoc ? err : warn)("doc-ngay", "", meta.line, `Cập nhật "${meta.updated}" chưa phải ngày YYYY-MM-DD`);
    if (approvedDoc && (isEmpty(meta.approver) || PH_RE.test(meta.approver))) err("doc-nguoi-duyet", "", meta.line, "SCOPE ĐÃ DUYỆT nhưng chưa ghi người duyệt");
  }

  // ---- yêu cầu R
  for (const it of okOf("R")) {
    const st = checkEnum(it, "trang thai", ENUM.rst, "trạng thái");
    const pr = checkEnum(it, "uu tien", ENUM.prio, "ưu tiên");
    const nt = it.get("nghiem thu");
    if (isEmpty(it.get("nguon"))) err("thieu-nguon", it.id, it.line, 'thiếu nguồn (ai nói, ngày — hoặc "AI đề xuất")');
    if (ACTIVE.includes(st) && isEmpty(nt)) err("thieu-nghiem-thu", it.id, it.line, `đang ${ENUM.rst[st]} nhưng chưa có tiêu chí nghiệm thu`);
    checkRefs(it, "nghiem thu");
    checkRefs(it, "ban");
    if (st === "xong") {
      for (const tok of nt.match(REF_RE) || []) {
        const e = byId.get(tok);
        if (e && e.prefix === "E" && e.ok && (isEmpty(e.get("ai da tu kiem")) || PH_RE.test(e.get("ai da tu kiem"))))
          warn("xong-chua-kiem-tay", it.id, it.line, `XONG dựa trên ${tok} chưa có người kiểm tay`);
      }
    }
    if (approvedDoc && pr === "phai co" && st === "de xuat") warn("phai-co-chua-duyet", it.id, it.line, 'yêu cầu "Phải có" vẫn là ĐỀ XUẤT trong SCOPE ĐÃ DUYỆT');
  }
  // ---- câu hỏi Q
  for (const it of okOf("Q")) {
    const st = checkEnum(it, "trang thai", ENUM.qst, "trạng thái");
    checkRefs(it, "chan");
    if (st === "mo") {
      for (const tok of it.get("chan").match(REF_RE) || []) {
        const r = byId.get(tok);
        if (r && r.prefix === "R" && r.ok && ACTIVE.includes(enumKey(r.get("trang thai"))))
          err("q-chan-r-da-duyet", it.id, it.line, `còn MỞ nhưng đang chặn ${tok} (${ENUM.rst[enumKey(r.get("trang thai"))]})`);
      }
      if (isEmpty(it.get("ai tra loi"))) warn("q-khong-nguoi", it.id, it.line, "câu hỏi MỞ chưa có người trả lời");
      const h = dateState(it, "han");
      if (h.s === "ok" && todayD && h.d < todayD) warn("q-qua-han", it.id, it.line, `quá hạn ${h.v}`);
    }
  }
  // ---- giả định A
  for (const it of okOf("A")) {
    const st = checkEnum(it, "trang thai", ENUM.ast, "trạng thái");
    if (isEmpty(it.get("neu sai"))) err("a-thieu-neu-sai", it.id, it.line, 'giả định thiếu "nếu sai thì" — không có thì chỉ là đoán');
    if (st === "chua kiem" && isEmpty(it.get("cach kiem"))) warn("a-thieu-cach-kiem", it.id, it.line, "giả định chưa kiểm mà chưa nói kiểm bằng cách nào");
    const ds = it.get("as-of");
    if (isEmpty(ds)) warn("a-thieu-as-of", it.id, it.line, "thiếu ngày (As-of)");
    else if (st !== "sai") stale(it, "as-of", "As-of");
  }
  // ---- ví dụ nghiệm thu E, quy tắc B, mục tiêu G, nhật ký CR, bản V
  for (const it of okOf("E")) if (isEmpty(it.get("ai da tu kiem"))) warn("e-chua-kiem-tay", it.id, it.line, "ví dụ chưa có người kiểm tay — chưa phải golden");
  for (const it of okOf("B")) {
    const st = checkEnum(it, "trang thai", ENUM.bst, "trạng thái");
    if (isEmpty(it.get("can cu"))) warn("b-thieu-can-cu", it.id, it.line, "quy tắc thiếu căn cứ — luật cần căn cứ");
    if (st === "da xac nhan" && isEmpty(it.get("ai xac nhan"))) err("b-thieu-nguoi-xac-nhan", it.id, it.line, "ĐÃ XÁC NHẬN nhưng chưa ghi ai xác nhận");
  }
  for (const it of okOf("G")) {
    if (isEmpty(it.get("do bang"))) warn("g-chua-do", it.id, it.line, "mục tiêu chưa có cách đo");
    stale(it, "as-of", "As-of");
  }
  for (const it of okOf("CR")) {
    const k = checkEnum(it, "loai", ENUM.crt, "loại");
    if (k === "doi huong" && isEmpty(it.get("ai duyet"))) err("cr-doi-huong-chua-duyet", it.id, it.line, "ĐỔI HƯỚNG bắt buộc có người duyệt");
    if (k === "doi nho" && isEmpty(it.get("ai duyet"))) warn("cr-doi-nho-chua-ghi", it.id, it.line, "ĐỔI NHỎ chưa ghi ai duyệt (hoặc C-n cho phép đứng)");
    const d = dateState(it, "ngay");
    if (d.s === "bad") warn("ngay-sai", it.id, it.line, `ngày "${d.v}" không đúng dạng YYYY-MM-DD`);
    checkRefs(it, "anh huong", "warn");
  }
  for (const it of of("V")) checkRefs(it, "gom");

  // ---- chỗ còn giữ chỗ
  const ph = items.filter((it) => it.cells.slice(1).some((c) => PH_RE.test(c)));
  if (approvedDoc) for (const it of ph) err("con-giu-cho", it.id, it.line, "SCOPE ĐÃ DUYỆT nhưng dòng còn chỗ giữ chỗ (<…>, TBD, YYYY-MM-DD)");
  else if (ph.length) warn("con-giu-cho", "", 0, `${ph.length} dòng còn chỗ giữ chỗ (<…>, TBD, YYYY-MM-DD): ${ph.slice(0, 8).map((i) => i.id).join(", ")}${ph.length > 8 ? ", …" : ""}`);

  // ---- SCOPE ĐÃ DUYỆT phải đủ khung
  const rs = okOf("R");
  const live = rs.filter((r) => !["bo", "hoan"].includes(enumKey(r.get("trang thai"))));
  if (approvedDoc) {
    if (!of("G").length) err("thieu-g", "", 0, "SCOPE ĐÃ DUYỆT mà chưa có mục tiêu (G-)");
    if (!of("R").length) err("thieu-r", "", 0, "SCOPE ĐÃ DUYỆT mà chưa có yêu cầu (R-)");
    if (!of("NG").length) warn("thieu-ng", "", 0, 'chưa có mục "Không làm" (NG-)');
    if (live.some((r) => enumKey(r.get("uu tien")) === "phai co") && !of("E").length) err("thieu-e", "", 0, 'có yêu cầu "Phải có" nhưng chưa có ví dụ nghiệm thu (E-)');
  }

  // ---- bảng tiến độ
  const cnt = (o, f) => Object.keys(o).map((k) => [k, f(k)]);
  const stCount = Object.fromEntries(cnt(ENUM.rst, (k) => rs.filter((r) => enumKey(r.get("trang thai")) === k).length));
  const prioText = Object.keys(ENUM.prio)
    .map((k) => {
      const all = live.concat(rs.filter((r) => enumKey(r.get("trang thai")) === "hoan")).filter((r) => enumKey(r.get("uu tien")) === k);
      return `${ENUM.prio[k]} XONG ${all.filter((r) => enumKey(r.get("trang thai")) === "xong").length}/${all.length}`;
    })
    .join(" · ");
  const openQ = okOf("Q").filter((q) => enumKey(q.get("trang thai")) === "mo");
  const blocking = [...new Set(openQ.flatMap((q) => (q.get("chan").match(REF_RE) || []).filter((t) => byId.has(t) && byId.get(t).prefix === "R")))];
  const crs = okOf("CR");
  const lines = [];
  lines.push(`SCOPE · ${opts.file || "(văn bản)"} · ${meta ? meta.version : "?"} · ${meta ? ENUM.doc[docKey] || meta.status : "?"} · cập nhật ${meta ? meta.updated : "?"}`);
  lines.push(`Yêu cầu (không tính BỎ): ${prioText}`);
  lines.push("Trạng thái R: " + Object.keys(ENUM.rst).map((k) => `${ENUM.rst[k]} ${stCount[k]}`).join(" · "));
  lines.push(
    `Câu hỏi mở: ${openQ.length}${blocking.length ? " (đang chặn: " + blocking.join(", ") + ")" : ""} · Giả định chưa kiểm: ${okOf("A").filter((a) => enumKey(a.get("trang thai")) === "chua kiem").length} · Thay đổi: ${crs.length} (ĐỔI HƯỚNG ${crs.filter((c) => enumKey(c.get("loai")) === "doi huong").length})`
  );
  const errors = issues.filter((i) => i.level === "LỖI");
  const warnings = issues.filter((i) => i.level === "CẢNH BÁO");
  for (const i of errors.concat(warnings)) lines.push(`  ${i.level}${i.id ? " " + i.id : ""}${i.line ? " (dòng " + i.line + ")" : ""}: ${i.msg}`);
  lines.push(`Kết quả: ${errors.length} LỖI, ${warnings.length} CẢNH BÁO → ${errors.length ? "KHÔNG ĐẠT" : "ĐẠT"}`);
  return { issues, errors, warnings, meta, report: lines.join("\n"), ids: [...byId.keys()] };
}

function main(argv) {
  const args = argv.slice(2);
  let file = null, staleDays = 30, today = null, strict = false;
  const bad = (m) => { process.stderr.write(m + "\nCách dùng: node scope-check.js [docs/SCOPE.md] [--stale-days 30] [--today YYYY-MM-DD] [--strict]\n"); process.exitCode = 2; };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--strict") strict = true;
    else if (a === "--stale-days") { staleDays = Number(args[++i]); if (!Number.isInteger(staleDays) || staleDays < 0) return bad("--stale-days cần một số nguyên ≥ 0"); }
    else if (a === "--today") { today = args[++i]; if (!parseDate(today || "")) return bad("--today cần dạng YYYY-MM-DD"); }
    else if (a.startsWith("--")) return bad("Tham số lạ: " + a);
    else file = a;
  }
  file = file || "docs/SCOPE.md";
  let text;
  try { text = fs.readFileSync(file, "utf8"); } catch (e) { return bad("Không đọc được " + file + ": " + e.message); }
  const res = check(text, { today, staleDays, file });
  process.stdout.write(res.report + "\n");
  process.exitCode = res.errors.length || (strict && res.warnings.length) ? 1 : 0;
}

if (require.main === module) main(process.argv);
module.exports = { check, parseTables, fold };
