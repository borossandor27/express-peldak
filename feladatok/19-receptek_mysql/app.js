// =====================================================
// 19. feladat MySQL-lel - Receptkönyv (CRUD két összekapcsolt táblával)
// Indítás: npm run f19-mysql
// Előtte:  1. data/receptek.sql importálása (phpMyAdmin)
//          2. .env.example lemásolása .env néven
//          3. utils/db.js elkészítése (lásd a fő README "Adatbázisos (MySQL) változatok" részét)
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-2.md + README.md (ebben a mappában)
// =====================================================

import 'dotenv/config'; // a .env beolvasása - ez legyen az első import!
import express from 'express';
// TODO: import pool from './utils/db.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
app.use(express.json());

// TODO: ellenoriz(recept) -> hibák tömbje (ugyanaz, mint a JSON-os változatban,
//       + egy hozzávaló neve csak egyszer szerepelhet)

// TODO: teljesRecept(id) -> { id, nev, kategoria, adag, idoPerc, hozzavalok: [...] } vagy null
//       két lekérdezés: a recept + a hozzávalói (a mennyiseg DECIMAL -> Number!)

// TODO: GET /receptek                ?kategoria=  ?maxIdo=  ?hozzavalo=  (rövid lista)

// TODO: GET /bevasarlolista?receptek=1,3   (GROUP BY nev, egyseg + SUM)

// TODO: GET /receptek/:id

// TODO: GET /receptek/:id/adag/:fo

// TODO: POST /receptek               (tranzakció: recept + hozzávalók)

// TODO: PUT /receptek/:id            (tranzakció: módosítás + a hozzávalók cseréje)

// TODO: DELETE /receptek/:id         (ON DELETE CASCADE)

// TODO: POST /receptek/:id/hozzavalok         (ER_DUP_ENTRY -> 409)

// TODO: DELETE /receptek/:id/hozzavalok/:nev  (az utolsó nem törölhető)

// TODO: 404-es kezelő, hibakezelő middleware (500)

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}/receptek`));
