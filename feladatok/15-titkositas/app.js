// =====================================================
// 15. feladat - Titkosírások modulokkal
// Indítás: npm run f15
// A feladat leírása: feladatok/FELADATOK-2.md
// =====================================================

import express from 'express';

// TODO: import * as caesar from ...
// TODO: a morse.js default exportja (morse) és az ABC named export morseAbc néven, EGY sorban

const app = express();
const PORT = 3000;

// TODO: middleware a /caesar kezdetű útvonalakra: ha nincs ?szoveg=, akkor 400
//   app.use('/caesar', (req, res, next) => { ... });

// TODO: GET /caesar/kodol?szoveg=...&eltolas=3     (az eltolás elhagyható, alap: 3)

// TODO: GET /caesar/dekodol?szoveg=...&eltolas=3

// TODO: GET /caesar/tores?szoveg=...               -> JSON, mind a 25 eltolás

// TODO: GET /morse/abc                             -> JSON

// TODO: GET /morse/kodol?szoveg=...

// TODO: GET /morse/dekodol?kod=...

// TODO: 404-es kezelő

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
