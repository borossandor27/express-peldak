// =====================================================
// 30. feladat - Szálláskereső (varosok + szallasok)
// Indítás: npm run f30
// Előtte:  1. data/szallasok.sql importálása (phpMyAdmin)
//          2. .env.example lemásolása .env néven
//          3. utils/db.js elkészítése (lásd a fő README "Adatbázisos (MySQL) változatok" részét)
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-4.md + README.md (ebben a mappában)
// =====================================================

import 'dotenv/config'; // a .env beolvasása - ez legyen az első import!
import express from 'express';

// TODO: import pool from './utils/db.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// TODO: GET /  -> { uzenet: 'Szálláskereső API', vegpontok: [...] }

// TODO: segédfüggvény: egy szállás sorából a válasz (medence: true/false, ertekeles: szám)

// TODO: GET /szallasok   ?varos=  ?minCsillag=  ?maxAr=  ?medence=true|false

// TODO: GET /szallasok/:id

// TODO: GET /varosok   ?minSzallas=   (LEFT JOIN, GROUP BY, HAVING)

// TODO: GET /varosok/:id/szallasok

// TODO: GET /orszagok

// TODO: GET /ajanlat?varos=&ej=&fo=

// TODO: GET /legjobb/:n

// TODO: 404-es kezelő (JSON)

// TODO: hibakezelő middleware (500) - pl. ha nem fut a MySQL

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
