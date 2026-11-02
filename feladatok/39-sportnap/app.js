// =====================================================
// 39. feladat - Iskolai sportnap (osztalyok, diakok, versenyszamok, eredmenyek)
// Indítás: npm run f39
// Előtte:  1. data/sportnap.sql importálása (phpMyAdmin)
//          2. .env.example lemásolása .env néven
//          3. utils/db.js elkészítése (lásd a fő README "Adatbázisos (MySQL) változatok" részét)
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-6.md + README.md (ebben a mappában)
// =====================================================

import 'dotenv/config'; // a .env beolvasása - ez legyen az első import!
import express from 'express';

// TODO: import pool from './utils/db.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// TODO: express.json()

// TODO: GET /  -> { uzenet: 'Sportnap API', vegpontok: [...] }

// TODO: GET /versenyszamok   (indulok)

// TODO: GET /versenyszamok/:id/eredmenyek   ?nem=fiú|lány
//       rangsor helyezéssel és holtversennyel; a rendezés iránya a "jobb" oszlopból (ASC / DESC)

// TODO: GET /diakok   ?osztaly=   (versenyszamDb)

// TODO: GET /diakok/:id   -> a diák + "eredmenyek" tömb helyezéssel (allekérdezés a SELECT-ben)

// TODO: GET /osztalyok   (letszam, indulok, eredmenyDb)

// TODO: GET /pontverseny   (1. hely 5, 2. hely 3, 3. hely 1 pont)

// TODO: POST /eredmenyek   { diakId, versenyszamId, eredmeny }   400 -> 404 -> 409 -> 201 (helyezéssel)

// TODO: 404-es kezelő (JSON)

// TODO: hibakezelő middleware: hibás JSON törzs -> 400, minden más -> 500

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
