// =====================================================
// 12. feladat - Teendőlista API (önálló projekt)
// Indítás: npm run f12-mysql   (előtte: SQL importálása, .env.example -> .env, utils/db.js)
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK.md
//
// A mappaszerkezetet NEKED kell kialakítanod:
//   12-teendok_mysql/
//   ├── app.js
//   ├── .env                 (a .env.example másolata)
//   ├── routes/teendok.js
//   ├── utils/db.js          (a közös kapcsolat, a .env adataival)
//   └── data/teendok.sql     (kész)
// =====================================================

import 'dotenv/config'; // a .env beolvasása - ez legyen az első import!
import express from 'express';

const app = express();
const PORT = Number(process.env.PORT ?? 3000); // a .env-ből

// Innen a tiéd!

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
