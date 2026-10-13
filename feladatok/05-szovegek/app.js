// =====================================================
// 05. feladat - Szövegeszközök modulokkal
// Indítás: npm run f05
// A feladat leírása: feladatok/FELADATOK.md
// =====================================================

import express from 'express';

// TODO: named importok: palindrom, szavakSzama (átnevezve: szamol), cimFormatum
// TODO: import * as eszkozok from ...   (a betuGyakorisag-hoz)
// TODO: default import: jelszoErosseg

const app = express();
const PORT = 3000;

// TODO: GET /palindrom?szoveg=...

// TODO: GET /szavak?szoveg=...

// TODO: GET /cim?szoveg=...

// TODO: GET /gyakorisag?szoveg=...   -> JSON

// TODO: GET /jelszo/:jelszo          -> JSON

// TODO: 404-es kezelő

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
