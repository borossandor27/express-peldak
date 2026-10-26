// =====================================================
// 31. feladat - Szakkörök (diakok + szakkorok + jelentkezesek)
// Indítás: npm run f31
// Előtte:  1. data/szakkorok.sql importálása (phpMyAdmin)
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

// TODO: GET /  -> { uzenet: 'Szakkörök API', vegpontok: [...] }

// TODO: GET /szakkorok   ?nap=  ?vanHely=true   (jelentkezett, szabadHely)

// TODO: GET /szakkorok/:id   -> a szakkör + "diakok" tömb

// TODO: GET /diakok   ?osztaly=   (szakkorDb)

// TODO: GET /diakok/szakkor-nelkul
//       Gondold végig: hová kell kerülnie a /diakok/:id-hez képest?

// TODO: GET /diakok/:id   -> a diák + "szakkorok" tömb

// TODO: GET /utkozesek

// TODO: POST /jelentkezesek   { diakId, szakkorId }   400 -> 404 -> 409 -> 201

// TODO: DELETE /jelentkezesek/:diakId/:szakkorId   204 / 404

// TODO: 404-es kezelő (JSON)

// TODO: hibakezelő middleware (500) - pl. ha nem fut a MySQL

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
