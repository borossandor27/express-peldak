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

// Express 5-ben a req.body undefined, ha a kérésnek nincs törzse, vagy a törzs nem JSON
// (hiányzik a Content-Type: application/json fejléc). Ilyenkor a const { ... } = req.body
// sor TypeError-ral elszállna. Ezért:
//   - van törzs, de nem JSON -> érthető 400-as hibaüzenet
//   - nincs törzs            -> üres objektum, és a végpont saját ellenőrzése mondja meg,
//                               mi hiányzik (a törzs nélküli PATCH végpontok is működnek)
app.use((req, res, next) => {
  if (req.body === undefined) {
    const vanTorzs = Number(req.headers['content-length'] ?? 0) > 0 || req.headers['transfer-encoding'] !== undefined;
    if (vanTorzs && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
      return res.status(400).json({
        hiba: 'A kérés törzse nem JSON. Az adatokat JSON formában küldd, Content-Type: application/json fejléccel.',
      });
    }
    req.body = {};
  }
  next();
});

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
