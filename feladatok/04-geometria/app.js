// =====================================================
// 04. feladat - Geometria modulokkal
// Indítás: npm run f04
// A feladat leírása: feladatok/FELADATOK.md
// =====================================================

import express from 'express';

// TODO: import * as sikidom from ...
// TODO: a kocka.js default exportja + a kockaFelszin named export egy sorban
// TODO: a pozitivSzamok függvény importja átnevezve: ervenyes

const app = express();
const PORT = 3000;

// TODO: GET /teglalap/:a/:b

// TODO: GET /kor/:r

// TODO: GET /haromszog/:a/:m

// TODO: GET /kocka/:a

// TODO: GET /fuggvenyek  -> a sikidomok modul exportjainak nevei (Object.keys)

// TODO: 404-es kezelő

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
