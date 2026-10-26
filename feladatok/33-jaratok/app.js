// =====================================================
// 33. feladat - Repülőjáratok (repuloterek, legitarsasagok, jaratok)
// Indítás: npm run f33
// Előtte:  1. data/jaratok.sql importálása (phpMyAdmin)
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

// TODO: GET /  -> { uzenet: 'Repülőjáratok API', vegpontok: [...] }

// TODO: a járatok közös SELECT-je: a repuloterek táblát KÉTSZER kell JOIN-olni (két álnévvel),
//       az érkezést ki kell számolni (ADDTIME, SEC_TO_TIME, TIME_FORMAT)

// TODO: GET /jaratok   ?honnan=  ?hova=  ?legitarsasag=

// TODO: GET /jaratok/:jaratszam

// TODO: GET /repuloterek   (indulo, erkezo)

// TODO: GET /repuloterek/:kod

// TODO: GET /repuloterek/:kod/indulasok

// TODO: GET /legitarsasagok

// TODO: GET /utvonal?honnan=&hova=   (közvetlen + egy átszállással, 60-300 perc várakozás)

// TODO: 404-es kezelő (JSON)

// TODO: hibakezelő middleware (500) - pl. ha nem fut a MySQL

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
