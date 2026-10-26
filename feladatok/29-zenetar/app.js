// =====================================================
// 29. feladat - Zenetár (eloadok + albumok)
// Indítás: npm run f29
// Előtte:  1. data/zenetar.sql importálása (phpMyAdmin)
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

// TODO: GET /  -> { uzenet: 'Zenetár API', vegpontok: [...] }

// TODO: GET /eloadok   ?orszag=

// TODO: GET /eloadok/:id   -> az előadó + "albumok" tömb (400 / 404)

// TODO: GET /albumok   ?mufaj=  ?tol=  ?ig=   (JOIN: az előadó neve kell)

// TODO: GET /albumok/kereses?q=   (címben VAGY előadónévben, legalább 2 karakter)

// TODO: GET /mufajok

// TODO: GET /statisztika/eloadok   (az album nélküli előadó is!)

// TODO: GET /orszagok

// TODO: 404-es kezelő (JSON)

// TODO: hibakezelő middleware (500) - pl. ha nem fut a MySQL

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
