// =====================================================
// 03 - Adatok lekérése JSON tömbből (csak GET)
// Indítás:  npm run 03
// =====================================================

import express from 'express';

// JSON fájl importálása ES modulban (Node 22+):
// a "with { type: 'json' }" rész KÖTELEZŐ!
import diakok from './data/diakok.json' with { type: 'json' };

// Alternatíva (régebbi Node-hoz is jó): fájl beolvasása fs-sel
//   import { readFileSync } from 'node:fs';
//   const diakok = JSON.parse(readFileSync('./03-json-get/data/diakok.json', 'utf-8'));

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.type('text/plain').send(
    [
      '03 - JSON GET példa. Végpontok:',
      '',
      'GET /diakok                    - összes diák',
      'GET /diakok/3                  - egy diák id alapján',
      'GET /diakok?osztaly=10.A       - szűrés osztályra',
      'GET /diakok?varos=Budapest     - szűrés városra',
      'GET /diakok?min=4              - szűrés minimum átlagra',
      'GET /diakok?rendez=atlag       - rendezés (nev | atlag)',
      'GET /diakok-nevek              - csak a nevek (map)',
      'GET /statisztika               - darabszám, átlag, legjobb',
      'GET /osztalyok                 - különböző osztályok',
    ].join('\n')
  );
});

// ---------- 1. Az összes elem + szűrés query paraméterekkel ----------
app.get('/diakok', (req, res) => {
  // Másolatot készítünk, hogy az eredeti tömböt ne rontsuk el a rendezéssel
  let eredmeny = [...diakok];

  const { osztaly, varos, min, rendez } = req.query;

  if (osztaly) {
    eredmeny = eredmeny.filter((d) => d.osztaly === osztaly);
  }
  if (varos) {
    eredmeny = eredmeny.filter((d) => d.varos.toLowerCase() === varos.toLowerCase());
  }
  if (min) {
    eredmeny = eredmeny.filter((d) => d.atlag >= Number(min));
  }
  if (rendez === 'nev') {
    eredmeny.sort((a, b) => a.nev.localeCompare(b.nev, 'hu'));
  } else if (rendez === 'atlag') {
    eredmeny.sort((a, b) => b.atlag - a.atlag); // csökkenő
  }

  // res.json() -> automatikusan JSON-ná alakít és beállítja a Content-Type-ot
  res.json(eredmeny);
});

// ---------- 2. Egy elem id alapján ----------
app.get('/diakok/:id', (req, res) => {
  const id = Number(req.params.id);
  const diak = diakok.find((d) => d.id === id);

  if (!diak) {
    // 404 = Not Found
    return res.status(404).json({ hiba: `Nincs ${id} azonosítójú diák` });
  }
  res.json(diak);
});

// ---------- 3. Átalakítás map-pel ----------
app.get('/diakok-nevek', (req, res) => {
  const nevek = diakok.map((d) => d.nev);
  res.json(nevek);
});

// ---------- 4. Számított adatok (reduce) ----------
app.get('/statisztika', (req, res) => {
  const osszeg = diakok.reduce((s, d) => s + d.atlag, 0);
  const legjobb = diakok.reduce((max, d) => (d.atlag > max.atlag ? d : max));

  res.json({
    darab: diakok.length,
    atlag: Number((osszeg / diakok.length).toFixed(2)),
    legjobb: legjobb.nev,
  });
});

// ---------- 5. Egyedi értékek (Set) ----------
app.get('/osztalyok', (req, res) => {
  const osztalyok = [...new Set(diakok.map((d) => d.osztaly))].sort();
  res.json(osztalyok);
});

app.use((req, res) => {
  res.status(404).json({ hiba: 'Nincs ilyen végpont' });
});

app.listen(PORT, () => {
  console.log(`Szerver fut: http://localhost:${PORT}`);
});
