// =====================================================
// 19. feladat - Receptkönyv (CRUD beágyazott tömbbel)
// Indítás: npm run f19
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-2.md
// =====================================================

import express from 'express';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const app = express();
const PORT = 3000;
app.use(express.json());

const ADAT_FAJL = join(import.meta.dirname, 'data', 'receptek.json');
let receptek = JSON.parse(readFileSync(ADAT_FAJL, 'utf-8'));

function mentes() {
  writeFileSync(ADAT_FAJL, JSON.stringify(receptek, null, 2));
}

// TODO: kovetkezoId()

// TODO: hozzavaloHibak(h, sorszam)  -> egy hozzávaló hibái (nev, mennyiseg, egyseg)

// TODO: ellenoriz(recept)           -> az összes hiba (a hozzávalókéval együtt)

// ----------------- Receptek -----------------

// TODO: GET    /receptek            ?kategoria=  ?maxIdo=  ?hozzavalo=   (rövid lista!)
// TODO: GET    /bevasarlolista?receptek=1,3
// TODO: GET    /receptek/:id
// TODO: GET    /receptek/:id/adag/:fo
// TODO: POST   /receptek
// TODO: PUT    /receptek/:id
// TODO: DELETE /receptek/:id

// ----------------- Hozzávalók (beágyazott tömb) -----------------

// TODO: POST   /receptek/:id/hozzavalok
// TODO: DELETE /receptek/:id/hozzavalok/:nev

// TODO: 404-es kezelő (JSON)

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}/receptek`));
