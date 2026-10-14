// =====================================================
// 06. és 07. feladat - Filmadatbázis (csak GET, JSON válaszok)
// Indítás: npm run f06-mysql   (előtte: SQL importálása, .env.example -> .env, utils/db.js)
// A feladat leírása: feladatok/FELADATOK.md
// =====================================================

import 'dotenv/config'; // a .env beolvasása - ez legyen az első import!
import express from 'express';
import filmek from './data/filmek.json' with { type: 'json' };

const app = express();
const PORT = Number(process.env.PORT ?? 3000); // a .env-ből

// ----------------- 06. feladat -----------------

// TODO: GET /filmek   ?mufaj= ?min= ?tol= ?ig= ?rendez=cim|ev|ertekeles

// TODO: GET /filmek/cimek

// TODO: GET /filmek/rendezo/:nev

// TODO: GET /filmek/:id     (404, ha nincs)
//       Gondold végig: hová kell kerülnie a /filmek/cimek-hez képest?

// ----------------- 07. feladat -----------------

// TODO: GET /statisztika

// TODO: GET /mufajok

// TODO: GET /mufajok/darab

// TODO: GET /top/:n

// TODO: GET /evtized/:ev

// TODO: 404-es kezelő (JSON)

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
