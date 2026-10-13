// =====================================================
// 12. feladat - Teendőlista API (önálló projekt)
// Indítás: npm run f12-mysql   (előtte: az SQL importálása, npm install mysql2)
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK.md
//
// A mappaszerkezetet NEKED kell kialakítanod:
//   12-teendok/
//   ├── app.js
//   ├── routes/teendok.js
//   ├── utils/jsonDb.js      (átmásolhatod a 10-11-konyvtar mappából)
//   └── data/teendok.json    (kész)
// =====================================================

import express from 'express';

const app = express();
const PORT = 3000;

// Innen a tiéd!

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
