// =====================================================
// 26. feladat - Regisztráció (közös validáló függvény)
// Indítás: npm run f26      Teszt: npm run t26 (a függvényé: npm run t26-fv)
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-3.md
// =====================================================

import express from 'express';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { validal } from './utils/validal.js';

const app = express();
const PORT = 3000;
app.use(express.json());

const ADAT_FAJL = join(import.meta.dirname, 'data', 'felhasznalok.json');
let felhasznalok = JSON.parse(readFileSync(ADAT_FAJL, 'utf-8'));

function mentes() {
  writeFileSync(ADAT_FAJL, JSON.stringify(felhasznalok, null, 2));
}

// TODO: kovetkezoId()   -> max + 1

// TODO: foglalt(nev, kiveveId)  -> van-e már ilyen felhasználónév (kis- és nagybetű nem számít)

// TODO: GET   /felhasznalok
// TODO: GET   /felhasznalok/:id
// TODO: POST  /felhasznalok        -> 201 + az új felhasználó | 400 { hibak: [...] } | 409
// TODO: PATCH /felhasznalok/:id    -> 200 + a módosított felhasználó | 400 | 404 | 409
//   Mindkettő a validal() függvényt használja!

// TODO: 404-es kezelő (JSON)

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}/felhasznalok`));
