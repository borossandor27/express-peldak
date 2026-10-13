// =====================================================
// 02. feladat - Számológép útvonal paraméterekkel
// Indítás: npm run f02
// A feladat leírása: feladatok/FELADATOK.md
//
// Emlékeztető: req.params értékei mindig SZÖVEGEK -> Number(...)
// Hibás bemenetnél: res.status(400).send('...')
// =====================================================

import express from 'express';

const app = express();
const PORT = 3000;

// TODO: GET /hatvany/:alap/:kitevo

// TODO: GET /paros/:n

// TODO: GET /nagyobb/:a/:b

// TODO: GET /faktorialis/:n   (csak 0 és 20 közötti egész szám)

// TODO: GET /osztok/:n        (szorgalmi: jelezd, ha prímszám)

// TODO: 404-es kezelő

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
