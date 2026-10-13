// =====================================================
// 16. feladat - Sorszámnevek és dátum betűvel
// Indítás: npm run f16
// A feladat leírása: feladatok/FELADATOK-2.md
//
// A 06-os mintapélda számírás modulját használjuk:
//   import { szamBetuvel } from '../../06-szamiras/utils/szamiras.js';
// =====================================================

import express from 'express';

// TODO: szamBetuvel importja a 06-szamiras mappából
// TODO: sorszamnev és datumBetuvel importja a saját utils/sorszam.js modulból

const app = express();
const PORT = 3000;

// TODO: GET /sorszam/:n                 -> "huszonkettedik"  (hibánál 400, try...catch)

// TODO: GET /lista?db=5                  -> "első, második, harmadik, negyedik, ötödik"

// TODO: GET /helyezes?nevek=Anna,Béla    -> soronként: "1. Anna - első helyezett"

// TODO: GET /datum/:datum                -> "kétezer-huszonhat október negyedike"

// TODO: GET /ma                          -> "Ma kétezer-huszonhat ... van."

// TODO: GET /osszeg?a=1500&b=700         -> "ezerötszáz meg hétszáz az kétezer-kétszáz"

// TODO: 404-es kezelő

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
