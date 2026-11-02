// =====================================================
// 37. feladat - Állatorvosi rendelő (gazdak, allatok, kezelesek)
// Indítás: npm run f37
// Előtte:  1. data/rendelo.sql importálása (phpMyAdmin)
//          2. .env.example lemásolása .env néven
//          3. utils/db.js elkészítése (lásd a fő README "Adatbázisos (MySQL) változatok" részét)
//             FIGYELEM: a dátumok miatt a pool beállításai közé kell: dateStrings: true
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-6.md + README.md (ebben a mappában)
// =====================================================

import 'dotenv/config'; // a .env beolvasása - ez legyen az első import!
import express from 'express';

// TODO: import pool from './utils/db.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// TODO: express.json()

// TODO: GET /  -> { uzenet: 'Állatorvosi rendelő API', vegpontok: [...] }

// TODO: GET /gazdak   ?varos=   (allatDb - az állat nélküli gazda is!)

// TODO: GET /gazdak/:id   -> a gazda + "allatok" tömb (400 / 404)

// TODO: GET /allatok   ?faj=   (a gazda neve kell)

// TODO: GET /allatok/kezeles-nelkul
//       Gondold végig: hová kell kerülnie a /allatok/:id-hez képest?

// TODO: GET /allatok/:id   -> az állat + "gazda" objektum + "kezelesek" tömb + osszesDij

// TODO: GET /kezelesek   ?tol=  ?ig=  ?faj=   (három tábla: kezelés, állat, gazda)

// TODO: GET /statisztika/fajok

// TODO: GET /statisztika/havi

// TODO: GET /statisztika/gazdak

// TODO: POST /kezelesek   { allatId, leiras, dij, datum? }   400 -> 404 -> 201

// TODO: 404-es kezelő (JSON)

// TODO: hibakezelő middleware: hibás JSON törzs -> 400, minden más -> 500

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
