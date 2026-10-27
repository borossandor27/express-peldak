// =====================================================
// 35. feladat - Munkamenetek és kijelentkezés (szerveroldali tokenek)
// Indítás: npm run f35
// Előtte:  1. data/munkamenetek.sql importálása (phpMyAdmin)
//          2. .env.example lemásolása .env néven
//          3. utils/db.js elkészítése (dateStrings: true!)
// Mintapélda: 08-authentication (de itt NEM JWT-t használunk!)
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-5.md + README.md (ebben a mappában)
// =====================================================

import 'dotenv/config';
import express from 'express';
import crypto from 'node:crypto'; // beépített modul, nem kell telepíteni

// TODO: import pool from './utils/db.js';
// TODO: import bcrypt from 'bcryptjs';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
const MUNKAMENET_PERC = Number(process.env.MUNKAMENET_PERC ?? 120);

app.use(express.json());

// Segítség: egy token SHA-256 hash-e, 64 hexadecimális karakter
function tokenHash(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// TODO: GET /  -> { uzenet: 'Diákportál - munkamenetek', vegpontok: [...] }

// TODO: POST /auth/bejelentkezes   { email, jelszo, eszkoz? }
//       1. bcrypt.compare -> rossz: 401 (ugyanaz az üzenet rossz e-mailre és jelszóra)
//       2. a lejárt munkamenetek törlése (takarítás)
//       3. token = crypto.randomBytes(32).toString('hex')
//       4. INSERT: a token HASH-E, az eszköz neve, lejár = most + MUNKAMENET_PERC perc (SQL-ben: DATE_ADD(NOW(), INTERVAL ? MINUTE))
//       -> 200 { token, lejar, felhasznalo: { id, nev, email } }

// TODO: authenticate(req, res, next)
//       Bearer token -> tokenHash -> keresés a munkamenetek között (JOIN felhasznalok), CSAK ha lejar > NOW()
//       nincs ilyen / lejárt -> 401
//       van -> utoljara = NOW(), req.user = { id, nev, email }, req.munkamenetId = ..., next()

// TODO: GET /auth/en   -> { id, nev, email }

// TODO: POST /auth/kijelentkezes   -> 204, a JELENLEGI munkamenet törlése (utána ez a token 401)

// TODO: GET /auth/munkamenetek
//       -> [{ id, eszkoz, letrehozva, utoljara, lejar, jelenlegi: true/false }, ...]
//       csak a saját, még érvényes munkamenetek, utoljara szerint csökkenő sorrendben. token_hash SOHA!

// TODO: DELETE /auth/munkamenetek/:id   -> 204 | 400 hibás id | 404 nincs ilyen vagy másé

// TODO: POST /auth/kijelentkezes-mindenhol   -> { kileptetve: <db> }  (minden MÁS saját munkamenet törlése)

// TODO: PATCH /auth/jelszo   { regiJelszo, ujJelszo }
//       -> { uzenet, kileptetve: <db> }  - jelszócsere után a többi munkamenet is törlődjön!
//       400 hibás új jelszó (min. 8 karakter, betű + szám) | 401 rossz régi jelszó

// TODO: 404-es kezelő (JSON)

// TODO: hibakezelő middleware: hibás JSON -> 400, minden más -> 500

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
