// =====================================================
// 38. feladat - Projektek és munkaórák (dolgozok, projektek, munkaorak)
// Indítás: npm run f38
// Előtte:  1. data/projektek.sql importálása (phpMyAdmin)
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

// TODO: GET /  -> { uzenet: 'Projektek API', vegpontok: [...] }

// TODO: a projektek közös SELECT-je: osszOra, koltseg = SUM(ora * oradij), maradek
//       (LEFT JOIN: a munkaóra nélküli projekt is kell!)

// TODO: GET /dolgozok   (osszOra - a munkaóra nélküli dolgozó is!)

// TODO: GET /dolgozok/:id   -> a dolgozó + "projektek" tömb (projektenként az órák) + osszOra

// TODO: GET /projektek   ?ugyfel=

// TODO: GET /projektek/tullepett   (HAVING)
//       Gondold végig: hová kell kerülnie a /projektek/:id-hez képest?

// TODO: GET /projektek/:id   -> a projekt + "dolgozok" tömb (ora, koltseg)

// TODO: GET /munkaorak   ?dolgozoId=  ?projektId=  ?tol=  ?ig=

// TODO: GET /statisztika/munkakorok

// TODO: POST /munkaorak   { dolgozoId, projektId, datum, ora }   400 -> 404 -> 409 (napi 8 óra) -> 201

// TODO: 404-es kezelő (JSON)

// TODO: hibakezelő middleware: hibás JSON törzs -> 400, minden más -> 500

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
