// =====================================================
// 34. feladat - Jegyzetfüzet felhasználókkal (regisztráció, bejelentkezés, JWT)
// Indítás: npm run f34
// Előtte:  1. data/jegyzetfuzet.sql importálása (phpMyAdmin)
//          2. .env.example lemásolása .env néven (JWT_SECRET kitöltése!)
//          3. utils/db.js elkészítése (dateStrings: true!)
// Mintapélda: 08-authentication
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-5.md + README.md (ebben a mappában)
// =====================================================

import 'dotenv/config'; // a .env beolvasása - ez legyen az első import!
import express from 'express';

// TODO: import pool from './utils/db.js';
// TODO: import bcrypt from 'bcryptjs';
// TODO: import jwt from 'jsonwebtoken';

// TODO: ha a JWT_SECRET hiányzik vagy 32 karakternél rövidebb -> hibaüzenet, process.exit(1)

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

// TODO: GET /  -> { uzenet: 'Jegyzetfüzet API', nyilvanos: [...], vedett: [...] }

// ---------- Hitelesítés (nyilvános) ----------

// TODO: POST /auth/regisztracio   { nev, email, jelszo }
//       -> 201 { id, nev, email } (jelszo_hash SOHA!) | 400 { hibak: [...] } | 409 foglalt e-mail

// TODO: POST /auth/bejelentkezes   { email, jelszo }
//       -> 200 { token, felhasznalo: { id, nev, email } } | 400 | 401 (ugyanaz az üzenet rossz e-mailre és rossz jelszóra!)

// ---------- Hitelesítő middleware ----------

// TODO: authenticate(req, res, next)
//       Authorization: Bearer <token> -> jwt.verify -> req.user = { id, email } -> next()
//       hiányzó / hibás / lejárt token -> 401
//       (Tedd külön fájlba: middleware/authenticate.js)

// ---------- Védett végpontok (token kell) ----------

// TODO: GET /auth/en   -> { id, nev, email, letrehozva, jegyzetDb }

// TODO: GET /jegyzetek   ?q=   -> CSAK a saját jegyzetek, a legújabb elöl

// TODO: GET /jegyzetek/:id   -> 400 hibás id | 404 nincs ilyen VAGY másé

// TODO: POST /jegyzetek   { cim, szoveg }   -> 201 + az új jegyzet
//       A tulajdonos a TOKENBŐL jön (req.user.id), nem a kérés törzséből!

// TODO: PATCH /jegyzetek/:id   { cim?, szoveg? }   -> 200 + a módosított jegyzet (modositva = most)

// TODO: DELETE /jegyzetek/:id   -> 204 | 404

// TODO (szorgalmi): DELETE /auth/fiok   { jelszo }   -> 204, a jegyzetek is törlődnek | 401 rossz jelszó

// TODO: 404-es kezelő (JSON)

// TODO: hibakezelő middleware: hibás JSON -> 400, minden más -> 500

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
