// =====================================================
// 22. feladat - Kvíz API (önálló projekt)
// Indítás: npm run f22
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-2.md
//
// A mappaszerkezetet NEKED kell kialakítanod:
//   22-kviz/
//   ├── app.js
//   ├── routes/
//   │   ├── kerdesek.js     (admin: CRUD, X-Admin-Kulcs fejléccel védve)
//   │   └── kviz.js         (kitöltés, ellenőrzés, toplista)
//   ├── utils/jsonDb.js     (átmásolhatod egy korábbi feladatból)
//   └── data/
//       ├── kerdesek.json   (kész)
//       └── eredmenyek.json (kész)
// =====================================================

import express from 'express';

const app = express();
const PORT = 3000;

// Innen a tiéd!

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
