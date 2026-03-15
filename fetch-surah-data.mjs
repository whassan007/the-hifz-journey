#!/usr/bin/env node
/**
 * Hifz Journey — Surah Data Fetcher & Validator
 * Run: node fetch-surah-data.mjs
 * Outputs: surah-ground-truth.json + surah-validation-report.json
 */

import fs from "fs";
import https from "https";

const PRIMARY_URL   = "https://api.alquran.cloud/v1/quran/quran-uthmani";
const SECONDARY_URL = "https://api.quran.com/api/v4/chapters";
const TIMEOUT_MS    = 10000;

const RESET  = "\x1b[0m";
const GREEN  = "\x1b[32m";
const AMBER  = "\x1b[33m";
const RED    = "\x1b[31m";
const CYAN   = "\x1b[36m";
const BOLD   = "\x1b[1m";
const DIM    = "\x1b[2m";

const ok   = (msg) => console.log(`${GREEN}  ✓${RESET}  ${msg}`);
const warn = (msg) => console.log(`${AMBER}  ⚠${RESET}  ${msg}`);
const fail = (msg) => console.log(`${RED}  ✗${RESET}  ${msg}`);
const info = (msg) => console.log(`${CYAN}  →${RESET}  ${msg}`);
const dim  = (msg) => console.log(`${DIM}     ${msg}${RESET}`);

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: TIMEOUT_MS }, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error(`JSON parse failed for ${url}`)); }
      });
    });
    req.on("timeout", () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
    req.on("error", reject);
  });
}

function containsArabic(str) {
  return /[\u0600-\u06FF]/.test(str);
}

function juzForSurah(surahId) {
  // Canonical Juz start boundaries (surah where each Juz begins)
  const JUZ_STARTS = [1,2,2,2,2,2,2,2,2,2,2,2,12,12,12,12,17,18,19,20,
    21,22,23,24,25,26,27,28,28,28,28,28,28,28,28,36,36,36,39,40,
    41,42,43,44,45,46,47,48,49,50,51,52,53,53,54,55,57,58,59,60,
    61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,
    81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,
    101,102,103,104,105,106,107,108,109,110,111,112,113,114];
  
  const JUZ_MAP = {};
  let juz = 1;
  for (let i = 1; i <= 114; i++) {
    if (JUZ_STARTS.indexOf(i) !== -1 && i !== 1) juz++;
    JUZ_MAP[i] = juz;
  }

  // Known correct mapping (canonical)
  const CANONICAL = {
    1:1,2:1,3:3,4:4,5:6,6:7,7:8,8:9,9:10,10:11,11:11,12:12,13:13,14:13,
    15:14,16:14,17:15,18:15,19:16,20:16,21:17,22:17,23:18,24:18,25:18,
    26:19,27:19,28:20,29:20,30:21,31:21,32:21,33:21,34:22,35:22,36:22,
    37:23,38:23,39:23,40:24,41:24,42:25,43:25,44:25,45:25,46:26,47:26,
    48:26,49:26,50:26,51:26,52:27,53:27,54:27,55:27,56:27,57:27,58:28,
    59:28,60:28,61:28,62:28,63:28,64:28,65:28,66:28,67:29,68:29,69:29,
    70:29,71:29,72:29,73:29,74:29,75:29,76:29,77:29,78:30,79:30,80:30,
    81:30,82:30,83:30,84:30,85:30,86:30,87:30,88:30,89:30,90:30,91:30,
    92:30,93:30,94:30,95:30,96:30,97:30,98:30,99:30,100:30,101:30,102:30,
    103:30,104:30,105:30,106:30,107:30,108:30,109:30,110:30,111:30,112:30,
    113:30,114:30
  };
  return CANONICAL[surahId] || null;
}

const CANONICAL_VERSE_COUNTS = {
  1:7,2:286,3:200,4:176,5:120,6:165,7:206,8:75,9:129,10:109,
  11:123,12:111,13:43,14:52,15:99,16:128,17:111,18:110,19:98,20:135,
  21:112,22:78,23:118,24:64,25:77,26:227,27:93,28:88,29:69,30:60,
  31:34,32:30,33:73,34:54,35:45,36:83,37:182,38:88,39:75,40:85,
  41:54,42:53,43:89,44:59,45:37,46:35,47:38,48:29,49:18,50:45,
  51:60,52:49,53:62,54:55,55:78,56:96,57:29,58:22,59:24,60:13,
  61:14,62:11,63:11,64:18,65:12,66:12,67:30,68:52,69:52,70:44,
  71:28,72:28,73:20,74:56,75:40,76:31,77:50,78:40,79:46,80:42,
  81:29,82:19,83:36,84:25,85:22,86:17,87:19,88:26,89:30,90:20,
  91:15,92:21,93:11,94:8,95:8,96:19,97:5,98:8,99:8,100:11,
  101:11,102:8,103:3,104:9,105:5,106:4,107:7,108:3,109:6,110:3,
  111:5,112:4,113:5,114:6
};

async function main() {
  console.log(`\n${BOLD}${CYAN}Hifz Journey — Surah Data Fetcher & Validator${RESET}`);
  console.log(`${"─".repeat(50)}`);
  console.log();

  // ── Step 1: Fetch both APIs in parallel ──────────────────
  info("Fetching from both sources in parallel…");
  
  let primaryData = null;
  let secondaryData = null;
  let primaryStatus = "live";
  let secondaryStatus = "live";

  const [primaryResult, secondaryResult] = await Promise.allSettled([
    fetchJson(PRIMARY_URL),
    fetchJson(SECONDARY_URL)
  ]);

  if (primaryResult.status === "fulfilled") {
    primaryData = primaryResult.value;
    ok(`Primary   alquran.cloud — ${primaryData.data?.surahs?.length ?? "?"} surahs`);
  } else {
    primaryStatus = "unreachable";
    fail(`Primary   alquran.cloud — ${primaryResult.reason.message}`);
  }

  if (secondaryResult.status === "fulfilled") {
    secondaryData = secondaryResult.value;
    ok(`Secondary quran.com     — ${secondaryData.data?.chapters?.length ?? "?"} surahs`);
  } else {
    secondaryStatus = "unreachable";
    warn(`Secondary quran.com     — ${secondaryResult.reason.message} (cross-validation skipped)`);
  }

  if (!primaryData) {
    fail("Primary source unavailable. Cannot proceed without data.");
    process.exit(1);
  }

  const primarySurahs   = primaryData.data.surahs;        // array of 114
  const secondarySurahs = secondaryData?.data?.chapters ?? []; // array of 114 or empty

  // Build secondary lookup by id
  const secondaryById = {};
  for (const ch of secondarySurahs) secondaryById[ch.id] = ch;

  console.log();
  info("Validating all 114 surahs…");
  console.log();

  // ── Step 2: Build merged dataset + validation results ─────
  const groundTruth    = [];
  const validationResults = [];
  let passCount      = 0;
  let mismatchCount  = 0;
  let missingCount   = 0;

  for (let i = 0; i < 114; i++) {
    const p = primarySurahs[i];
    const s = secondaryById[p.number] ?? null;

    const surahId  = p.number;
    const juz      = juzForSurah(surahId);
    const canonical_vc = CANONICAL_VERSE_COUNTS[surahId];

    const fields = {
      arabicName:      { value: p.name,                       verified: containsArabic(p.name) },
      transliteration: { value: p.englishName,                verified: p.englishName?.length > 0 },
      englishMeaning:  { value: p.englishNameTranslation,     verified: p.englishNameTranslation?.length > 0 },
      verseCount:      { value: p.ayahs.length,               verified: p.ayahs.length === canonical_vc },
      juzNumber:       { value: juz,                          verified: juz !== null },
      revelationType:  { value: p.revelationType,             verified: ["Meccan","Medinan"].includes(p.revelationType) },
      bismillah:       { value: surahId !== 9,                verified: true }
    };

    const allVerified = Object.values(fields).every(f => f.verified);

    // Cross-validate with secondary
    let mismatchDetails = null;
    const mismatches = [];
    if (s) {
      if (s.verses_count !== p.ayahs.length)
        mismatches.push(`verseCount: primary=${p.ayahs.length} secondary=${s.verses_count}`);
      if (s.name_arabic && s.name_arabic !== p.name)
        mismatches.push(`arabicName: primary="${p.name}" secondary="${s.name_arabic}"`);
    }
    if (mismatches.length > 0) mismatchDetails = mismatches.join(" | ");

    const status = !allVerified ? "missing"
                 : mismatchDetails ? "mismatch"
                 : "pass";

    if (status === "pass")      { passCount++;     }
    else if (status === "mismatch") { mismatchCount++; warn(`Surah ${surahId} · ${p.englishName} — ${mismatchDetails}`); }
    else                        { missingCount++;  fail(`Surah ${surahId} — field validation failed`); }

    const entry = {
      id:              surahId,
      arabicName:      fields.arabicName.value,
      transliteration: fields.transliteration.value,
      englishMeaning:  fields.englishMeaning.value,
      verseCount:      fields.verseCount.value,
      juzNumber:       fields.juzNumber.value,
      revelationType:  fields.revelationType.value,
      bismillah:       fields.bismillah.value
    };

    groundTruth.push(entry);

    validationResults.push({
      surahId,
      status,
      primarySource:   "alquran.cloud",
      secondarySource: secondaryStatus === "live" ? "quran.com" : "unavailable",
      fields,
      mismatchDetails,
      fetchedAt: new Date().toISOString()
    });
  }

  // ── Step 3: Structural integrity checks ───────────────────
  console.log();
  info("Running structural integrity checks…");
  console.log();

  const totalVerses     = groundTruth.reduce((s, r) => s + r.verseCount, 0);
  const meccanCount     = groundTruth.filter(r => r.revelationType === "Meccan").length;
  const medinanCount    = groundTruth.filter(r => r.revelationType === "Medinan").length;
  const noBismillah     = groundTruth.filter(r => !r.bismillah);
  const uniqueIds       = new Set(groundTruth.map(r => r.id)).size;

  const checks = [
    { label: "Total surahs === 114",              pass: groundTruth.length === 114,      detail: `got ${groundTruth.length}` },
    { label: "Total verse count === 6236",        pass: totalVerses === 6236,             detail: `got ${totalVerses}` },
    { label: "Exactly 86 Meccan surahs",          pass: meccanCount === 86,               detail: `got ${meccanCount}` },
    { label: "Exactly 28 Medinan surahs",         pass: medinanCount === 28,              detail: `got ${medinanCount}` },
    { label: "Exactly 1 surah without bismillah", pass: noBismillah.length === 1 && noBismillah[0].id === 9, detail: noBismillah.map(r=>r.id).join(",") || "none" },
    { label: "All surah IDs unique (1–114)",      pass: uniqueIds === 114,                detail: `${uniqueIds} unique` }
  ];

  let integrityPass = true;
  for (const c of checks) {
    if (c.pass) { ok(c.label); }
    else { fail(`${c.label} — ${c.detail}`); integrityPass = false; }
  }

  // ── Step 4: Assemble final output ─────────────────────────
  const meta = {
    primaryUrl:     PRIMARY_URL,
    secondaryUrl:   SECONDARY_URL,
    primaryStatus,
    secondaryStatus,
    narration:      "Hafs",
    fetchedAt:      new Date().toISOString(),
    totalSurahs:    groundTruth.length,
    totalVerses,
    passCount,
    mismatchCount,
    missingCount,
    integrityChecks: checks,
    integrity:      integrityPass ? "passed" : "failed"
  };

  const groundTruthOutput = {
    meta,
    surahs: groundTruth
  };

  const reportOutput = {
    meta,
    validationResults
  };

  // ── Step 5: Write files ────────────────────────────────────
  console.log();
  info("Writing output files…");

  fs.writeFileSync("surah-ground-truth.json",      JSON.stringify(groundTruthOutput, null, 2));
  fs.writeFileSync("surah-validation-report.json", JSON.stringify(reportOutput,      null, 2));

  ok("surah-ground-truth.json      — import this into your app as the canonical dataset");
  ok("surah-validation-report.json — import this into the Settings › Data Sources screen");

  // ── Step 6: Summary ───────────────────────────────────────
  console.log();
  console.log(`${"─".repeat(50)}`);
  console.log(`${BOLD}Summary${RESET}`);
  console.log(`${"─".repeat(50)}`);
  console.log();
  dim(`Total surahs:    ${groundTruth.length}`);
  dim(`Passed:          ${passCount}`);
  dim(`Mismatches:      ${mismatchCount}`);
  dim(`Missing:         ${missingCount}`);
  dim(`Total verses:    ${totalVerses}`);
  dim(`Integrity:       ${integrityPass ? "PASSED" : "FAILED"}`);
  console.log();

  if (passCount === 114 && integrityPass) {
    console.log(`${GREEN}${BOLD}  ✓ STATUS: PASS — all 114 surahs validated${RESET}`);
  } else {
    console.log(`${AMBER}${BOLD}  ⚠ STATUS: ISSUES FOUND — review the output above${RESET}`);
  }

  console.log();
  process.exit(integrityPass && missingCount === 0 ? 0 : 1);
}

main().catch((err) => {
  fail(`Fatal error: ${err.message}`);
  process.exit(1);
});

