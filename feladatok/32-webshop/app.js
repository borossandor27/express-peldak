// =====================================================
// 32. feladat - Webshop rendelések (vasarlok, termekek, rendelesek, tetelek)
// Indítás: npm run f32
// Előtte:  1. data/webshop.sql importálása (phpMyAdmin)
//          2. .env.example lemásolása .env néven
//          3. utils/db.js elkészítése (lásd a fő README "Adatbázisos (MySQL) változatok" részét)
//             FIGYELEM: a dátum miatt a pool beállításai közé kell: dateStrings: true
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-4.md + README.md (ebben a mappában)
// =====================================================

import 'dotenv/config'; // a .env beolvasása - ez legyen az első import!
import express from 'express';

// TODO: import pool from './utils/db.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// TODO: express.json()

// TODO: GET /  -> { uzenet: 'Webshop API', vegpontok: [...] }

// TODO: GET /rendelesek   ?statusz=  ?tol=  ?ig=   (vasarlo, darab, vegosszeg)

// TODO: GET /rendelesek/:id   -> "vasarlo" objektum, "tetelek" tömb, vegosszeg

// TODO: GET /vasarlok   (rendelesDb, osszKoltes - a törölt rendelések nélkül, a rendelés nélküli vásárló is!)

// TODO: GET /vasarlok/:id/rendelesek

// TODO: GET /termekek/sosem-rendelt

// TODO: GET /statisztika/havi

// TODO: GET /statisztika/top-termekek   ?n=   (alapérték: 3)

// TODO: GET /statisztika/kategoriak

// SZORGALMI: POST /rendelesek   { vasarloId, tetelek: [{ termekId, db }] }   tranzakcióban

// TODO: 404-es kezelő (JSON)

// TODO: hibakezelő middleware (500) - pl. ha nem fut a MySQL

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
