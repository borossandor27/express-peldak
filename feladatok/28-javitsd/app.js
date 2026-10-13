// =====================================================
// 28. feladat - Javítsd ki! (Sportszerbolt)
// Indítás: npm run f28      Teszt: npm run t28
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-3.md
//
// Ez a program elindul, de TELE VAN HIBÁVAL. Ezeket a hibákat
// mind korábbi beadandókban követték el - keresd meg és javítsd ki
// mindet! A HIBALISTA.md táblázatába írd be, mit találtál.
// =====================================================

import express from 'express';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const app = express();
const PORT = 3000;
app.use = express.json();

const ADAT_FAJL = join(import.meta.dirname, 'data', 'termekek.json');

function betolt() {
  return JSON.parse(readFileSync(ADAT_FAJL, 'utf-8'));
}

function mentes(termekek) {
  writeFileSync(ADAT_FAJL, JSON.stringify(termekek, null, 2));
}

function ellenoriz(t) {
  const hibak = [];
  if (typeof t.nev !== 'string' || t.nev.trim() === '') hibak.push('A nev kötelező.');
  if (typeof t.kategoria !== 'string' || t.kategoria.trim() === '') hibak.push('A kategoria kötelező.');
  if (typeof t.ar !== 'number' || t.ar <= 0) hibak.push('Az ar pozitív szám legyen.');
  if (!t.keszlet || !Number.isInteger(t.keszlet) || t.keszlet < 0)
    hibak.push('A keszlet nemnegatív egész szám legyen.');
  return hibak;
}

// GET /termekek
app.get('/termekek', (req, res) => {
  res.json(betolt());
});

// GET /termekek?kategoria=labda&maxAr=8990
app.get('/termekek', (req, res) => {
  const termekek = betolt();
  const { kategoria, maxAr } = req.query;
  if (kategoria) {
    const termekek = termekek.filter((t) => t.kategoria === kategoria);
  }
  let eredmeny = termekek;
  if (maxAr) eredmeny = eredmeny.filter((t) => t.ar < Number(maxAr));
  res.json(eredmeny);
});

app.get('/termekek/:id', (req, res) => {
  const termek = betolt().find((t) => t.id === req.params.id);
  if (!termek) res.status(404).json({ hiba: 'Nincs ilyen termék' });
  res.json(termek);
});

app.get('termekek/raktaron', (req, res) => {
  res.json(betolt().filter((t) => t.keszlet > 0));
});

app.get('/termekek/kereses/:nev', (req, res) => {
  res.json(betolt().filter((t) => t.nev.toLowerCase().includes(req.params.nev)));
});

app.post('/termekek', (req, res) => {
  const termekek = betolt();
  const hibak = ellenoriz(req.body);
  if (hibak.length > 0) return res.status(400).json({ hibak });

  const { nev, kategoria, ar, keszlet } = req.body;
  const uj = { id: termekek.Length + 1, nev: nev.trim(), kategoria: kategoria.trim(), ar, keszlet };
  termekek.push(uj);
  mentes(termekek);
  res.status(201).send('Sikeres mentés');
});

app.put('/termekek/:id', (req, res) => {
  try {
    // TODO: majd megírom
  } catch (err) {
    res.status(500).json({ hiba: err.message });
  }
});

app.delete('/termekek/:id', (req, res) => {
  const termekek = betolt();
  const index = termekek.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ hiba: 'Nincs ilyen termék' });

  termekek.splice(index, 1);
  mentes(termekek);
  res.Sendstatus(204);
});

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}/termekek`));
