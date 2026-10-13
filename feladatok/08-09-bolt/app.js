// =====================================================
// 08. és 09. feladat - Papírbolt CRUD
// Indítás: npm run f08
// Teszteléshez: requests.http (VS Code REST Client)
// A feladat leírása: feladatok/FELADATOK.md
// =====================================================

import express from 'express';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const app = express();
const PORT = 3000;

// TODO: JSON törzs feldolgozása (middleware)

const ADAT_FAJL = join(import.meta.dirname, 'data', 'termekek.json');
let termekek = JSON.parse(readFileSync(ADAT_FAJL, 'utf-8'));

function mentes() {
  writeFileSync(ADAT_FAJL, JSON.stringify(termekek, null, 2));
}

// TODO: kovetkezoId()

// TODO: ellenoriz(adat) -> hibaüzenetek tömbje
//   nev: nem üres szöveg, kategoria: nem üres szöveg,
//   ar: pozitív szám, keszlet: nemnegatív egész szám

// ----------------- 08. feladat -----------------

// TODO: GET    /termekek
// TODO: GET    /termekek/:id
// TODO: POST   /termekek
// TODO: PUT    /termekek/:id
// TODO: PATCH  /termekek/:id
// TODO: DELETE /termekek/:id

// ----------------- 09. feladat -----------------
// Figyelj az útvonalak sorrendjére!

// TODO: GET /termekek?kategoria=...&maxAr=...
// TODO: GET /termekek/raktaron
// TODO: GET /termekek/kereses?q=...
// TODO: GET /termekek/osszertek
// TODO: GET /kategoriak
// TODO: PATCH /termekek/:id/keszlet   { "valtozas": -3 }

// TODO: 404-es kezelő (JSON)

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}/termekek`));
