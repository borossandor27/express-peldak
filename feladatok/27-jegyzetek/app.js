// =====================================================
// 27. feladat - Jegyzetek CRUD (pontos válaszok és státuszkódok)
// Indítás: npm run f27      Teszt: npm run t27
// Teszteléshez: requests.http (minden kérésnél ott a várt válasz!)
// A feladat leírása: feladatok/FELADATOK-3.md
// =====================================================

import express from 'express';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const app = express();
const PORT = 3000;
app.use(express.json());

const ADAT_FAJL = join(import.meta.dirname, 'data', 'jegyzetek.json');
let jegyzetek = JSON.parse(readFileSync(ADAT_FAJL, 'utf-8'));

function mentes() {
  writeFileSync(ADAT_FAJL, JSON.stringify(jegyzetek, null, 2));
}

// TODO: kovetkezoId()  -> Nézd meg a data/jegyzetek.json id-it! Miért NEM jó a length + 1?

// TODO: ellenoriz(body, reszleges)  -> hibák tömbje
//   cim: nem üres szöveg, legfeljebb 50 karakter | szoveg: szöveg (lehet üres) | fontos: true/false

// TODO: ismertMezok(body)  -> csak a cim, szoveg, fontos mezőket veszi át (az id-t és a letrehozva-t SOHA!)

// TODO: GET    /jegyzetek          ?fontos=true|false
// TODO: GET    /jegyzetek/:id
// TODO: POST   /jegyzetek          -> 201 + AZ ÚJ OBJEKTUM
// TODO: PUT    /jegyzetek/:id      -> 200 + a módosított objektum (id, letrehozva marad)
// TODO: PATCH  /jegyzetek/:id      -> 200 + a módosított objektum
// TODO: DELETE /jegyzetek/:id      -> 204, ÜRES törzzsel

// TODO: 404-es kezelő (JSON)

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}/jegyzetek`));
