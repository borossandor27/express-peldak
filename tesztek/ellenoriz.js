// =====================================================
// Automatikus ellenőrző a 23-28. feladathoz
//
// Egy megoldás:
//   node tesztek/ellenoriz.js 23                       (a feladatok/23-diakszuro mappát teszteli)
//   node tesztek/ellenoriz.js 23 megoldasok/23-diakszuro
//   node tesztek/ellenoriz.js 27 "D:/beadott/Kiss Anna"
//
// Egy egész osztály (a mappában diákonként egy almappa):
//   node tesztek/ellenoriz.js 27 "D:/beadott/Jegyzetek" --osztaly
//   node tesztek/ellenoriz.js 27 "D:/beadott/Jegyzetek" --osztaly --csv eredmeny.csv
//
// Minden futás egy friss másolaton történik, az eredeti adatfájlokkal,
// így a beadott mappák és a feladatok/*/data fájlok nem változnak.
// A szerver a 3000-es porton fut (a feladatok is ezt használják).
// =====================================================

import { spawn } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const GYOKER = resolve(import.meta.dirname, '..');
const PORT = 3000;
const ALAP_URL = `http://localhost:${PORT}`;
const KERES_IDOKORLAT = 2000; // ms - ennyi után a lefagyott kérést hibásnak vesszük
const INDULASI_IDOKORLAT = 8000; // ms
const BELEPESI_PONTOK = ['app.js', 'index.js', 'server.js', 'szerver.js', 'main.js'];
const KIHAGYOTT_MAPPAK = new Set(['node_modules', '.git', '.vscode']);

// ----------------- Parancssor -----------------

const args = process.argv.slice(2);
const feladatSzam = args[0];
if (!feladatSzam || !/^\d+$/.test(feladatSzam)) {
  console.log('Használat: node tesztek/ellenoriz.js <feladat száma> [mappa] [--osztaly] [--csv fajl.csv]');
  process.exit(1);
}
const osztalyMod = args.includes('--osztaly');
const csvIndex = args.indexOf('--csv');
const csvFajl = csvIndex !== -1 ? args[csvIndex + 1] : null;
const mappaArg = args.slice(1).find((a, i) => !a.startsWith('--') && args[i] !== '--csv');

const esetFajl = join(import.meta.dirname, 'esetek', `${feladatSzam}.js`);
if (!existsSync(esetFajl)) {
  console.log(`Ehhez a feladathoz nincs teszt: ${feladatSzam}`);
  process.exit(1);
}
const { default: feladat } = await import(pathToFileURL(esetFajl).href);
const eredetiMappa = join(GYOKER, 'feladatok', feladat.mappa);
const celMappa = mappaArg ? resolve(mappaArg) : eredetiMappa;

// ----------------- Segédfüggvények -----------------

const varj = (ms) => new Promise((r) => setTimeout(r, ms));

// Megkeresi a belépési pontot (app.js, index.js, ...), a legkevésbé mélyen fekvőt
function belepesiPont(mappa, melyseg = 0) {
  if (melyseg > 4 || !existsSync(mappa)) return null;
  for (const nev of BELEPESI_PONTOK) {
    if (existsSync(join(mappa, nev))) return join(mappa, nev);
  }
  for (const elem of readdirSync(mappa)) {
    const ut = join(mappa, elem);
    if (!KIHAGYOTT_MAPPAK.has(elem) && statSync(ut).isDirectory()) {
      const talalat = belepesiPont(ut, melyseg + 1);
      if (talalat) return talalat;
    }
  }
  return null;
}

function fajlKereses(mappa, fajlNev, melyseg = 0) {
  if (melyseg > 4) return [];
  const talalatok = [];
  for (const elem of readdirSync(mappa)) {
    const ut = join(mappa, elem);
    if (KIHAGYOTT_MAPPAK.has(elem)) continue;
    if (statSync(ut).isDirectory()) talalatok.push(...fajlKereses(ut, fajlNev, melyseg + 1));
    else if (elem === fajlNev) talalatok.push(ut);
  }
  return talalatok;
}

async function portSzabad() {
  try {
    await fetch(ALAP_URL, { signal: AbortSignal.timeout(500) });
    return false;
  } catch {
    return true;
  }
}

async function keres(metodus, ut, body) {
  const opciok = { method: metodus, signal: AbortSignal.timeout(KERES_IDOKORLAT), headers: {} };
  if (body !== undefined) {
    opciok.headers['Content-Type'] = 'application/json';
    opciok.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  const valasz = await fetch(ALAP_URL + ut, opciok);
  const text = await valasz.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = undefined;
  }
  return { status: valasz.status, text, json, tipus: valasz.headers.get('content-type') || '' };
}

// ----------------- Egy megoldás futtatása -----------------

async function futtat(mappa) {
  const belepes = belepesiPont(mappa);
  if (!belepes) return { hiba: 'Nem találtam app.js / index.js / server.js fájlt.', eredmenyek: [] };

  // Friss másolat a tesztek/.futas mappába (innen a node_modules/express is elérhető)
  const futasMappa = join(import.meta.dirname, '.futas', `${Date.now()}`);
  mkdirSync(futasMappa, { recursive: true });
  const forras = dirname(belepes);
  cpSync(forras, futasMappa, {
    recursive: true,
    filter: (src) => !KIHAGYOTT_MAPPAK.has(basename(src)),
  });

  // Hiányzó package.json pótlása (ES modulként fusson)
  if (!existsSync(join(futasMappa, 'package.json'))) {
    writeFileSync(join(futasMappa, 'package.json'), JSON.stringify({ type: 'module' }));
  }

  // Az adatfájlok cseréje az eredetiekre
  const adatUtak = {};
  for (const adat of feladat.adatok || []) {
    const eredeti = readFileSync(join(eredetiMappa, 'data', adat));
    let helyek = fajlKereses(futasMappa, adat);
    if (helyek.length === 0) {
      mkdirSync(join(futasMappa, 'data'), { recursive: true });
      helyek = [join(futasMappa, 'data', adat)];
    }
    for (const hely of helyek) writeFileSync(hely, eredeti);
    adatUtak[adat] = helyek[0];
  }

  const belepesMasolat = join(futasMappa, belepes.slice(forras.length + 1));
  const gyerek = spawn(process.execPath, [belepesMasolat], { cwd: futasMappa, stdio: ['ignore', 'ignore', 'pipe'] });
  let hibaKimenet = '';
  let kilepett = false;
  gyerek.stderr.on('data', (d) => (hibaKimenet += d));
  gyerek.on('exit', () => (kilepett = true));

  // Megvárjuk, amíg a szerver válaszol
  const kezdes = Date.now();
  let fut = false;
  while (!kilepett && Date.now() - kezdes < INDULASI_IDOKORLAT) {
    if (!(await portSzabad())) {
      fut = true;
      break;
    }
    await varj(150);
  }

  const eredmenyek = [];
  let hiba = null;
  if (!fut) {
    hiba = 'A szerver nem indult el. ' + hibaKimenet.trim().split('\n').slice(-3).join(' | ');
    for (const e of feladat.esetek) eredmenyek.push(false);
  } else {
    const k = {
      get: (ut) => keres('GET', ut),
      post: (ut, b) => keres('POST', ut, b),
      put: (ut, b) => keres('PUT', ut, b),
      patch: (ut, b) => keres('PATCH', ut, b),
      del: (ut) => keres('DELETE', ut),
      adat: (nev) => JSON.parse(readFileSync(adatUtak[nev], 'utf-8')),
    };
    for (const eset of feladat.esetek) {
      let ok = false;
      try {
        ok = (await eset.fn(k)) === true;
      } catch {
        ok = false;
      }
      eredmenyek.push(ok);
    }
  }

  gyerek.kill();
  await new Promise((r) => (kilepett ? r() : gyerek.on('exit', r)));
  await varj(200);
  rmSync(futasMappa, { recursive: true, force: true });
  return { hiba, eredmenyek };
}

// ----------------- Kiírás -----------------

const max = feladat.esetek.length;

function jegy(pont) {
  const p = pont / max;
  if (p >= 0.85) return 5;
  if (p >= 0.7) return 4;
  if (p >= 0.55) return 3;
  if (p >= 0.4) return 2;
  return 1;
}

function reszletes(nev, { hiba, eredmenyek }) {
  console.log(`\n=== ${feladat.cim} - ${nev} ===`);
  if (hiba) console.log(`!! ${hiba}`);
  feladat.esetek.forEach((e, i) => {
    console.log(`${eredmenyek[i] ? ' ✔' : ' ✘'}  ${e.vegpont.padEnd(26)} ${e.leiras}`);
  });
  const pont = eredmenyek.filter(Boolean).length;
  console.log(`\nPont: ${pont} / ${max}  (jegy: ${jegy(pont)})`);
}

// ----------------- Fő program -----------------

if (!(await portSzabad())) {
  console.log(`A ${PORT}-es porton már fut valami. Állítsd le (Ctrl + C), és próbáld újra.`);
  process.exit(1);
}

if (!osztalyMod) {
  reszletes(basename(celMappa), await futtat(celMappa));
} else {
  const diakok = readdirSync(celMappa)
    .filter((n) => !KIHAGYOTT_MAPPAK.has(n) && statSync(join(celMappa, n)).isDirectory())
    .sort((a, b) => a.localeCompare(b, 'hu'));

  const osszes = [];
  for (const diak of diakok) {
    process.stdout.write(`${diak} ... `);
    const eredmeny = belepesiPont(join(celMappa, diak))
      ? await futtat(join(celMappa, diak))
      : { hiba: 'nincs beadott kód', eredmenyek: null };
    const pont = eredmeny.eredmenyek ? eredmeny.eredmenyek.filter(Boolean).length : null;
    console.log(pont === null ? 'nincs beadott kód' : `${pont} / ${max}${eredmeny.hiba ? '  (nem indult el)' : ''}`);
    osszes.push({ diak, ...eredmeny, pont });
  }

  console.log(`\n=== ${feladat.cim} - összesítés ===`);
  for (const { diak, pont } of osszes) {
    console.log(
      `${diak.padEnd(30)} ${pont === null ? '-' : `${String(pont).padStart(2)} / ${max}   jegy: ${jegy(pont)}`}`,
    );
  }

  if (csvFajl) {
    // Pontosvesszős CSV, BOM-mal: a magyar Excel így nyitja meg helyesen
    const beadott = osszes.filter((o) => o.eredmenyek);
    const sorok = [['Végpont', 'Ellenőrzés', ...beadott.map((o) => o.diak)]];
    feladat.esetek.forEach((e, i) => {
      sorok.push([e.vegpont, e.leiras, ...beadott.map((o) => (o.eredmenyek[i] ? 1 : 0))]);
    });
    sorok.push(['', 'Összesen', ...beadott.map((o) => o.pont)]);
    sorok.push(['', 'Jegy', ...beadott.map((o) => jegy(o.pont))]);
    const szoveg = sorok.map((s) => s.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(';')).join('\r\n');
    writeFileSync(resolve(csvFajl), '\uFEFF' + szoveg);
    console.log(`\nCSV mentve: ${resolve(csvFajl)}`);
  }
}

rmSync(join(import.meta.dirname, '.futas'), { recursive: true, force: true });
