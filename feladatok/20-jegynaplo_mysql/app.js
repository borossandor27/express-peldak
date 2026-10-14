// =====================================================
// 20. feladat MySQL-lel - Elektronikus jegynapló
// Indítás: npm run f20-mysql
// Előtte:  1. data/jegynaplo.sql importálása (phpMyAdmin)
//          2. .env.example lemásolása .env néven
//          3. utils/db.js elkészítése (lásd a fő README "Adatbázisos (MySQL) változatok" részét)
//             FIGYELEM: a dátumok miatt a pool beállításai közé kell: dateStrings: true
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-2.md + README.md (ebben a mappában)
//
// A mappaszerkezetet NEKED kell kialakítanod:
//   20-jegynaplo_mysql/
//   ├── app.js
//   ├── .env              (a .env.example másolata)
//   ├── routes/diakok.js
//   ├── routes/jegyek.js
//   ├── utils/db.js
//   └── utils/atlag.js    (átmásolhatod a 20-jegynaplo mappából)
// =====================================================

import 'dotenv/config'; // a .env beolvasása - ez legyen az első import!
import express from 'express';

// TODO: routerek importja (routes/diakok.js, routes/jegyek.js)

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// TODO: express.json(), naplózó middleware

// TODO: GET /  -> { uzenet: 'Jegynapló API', vegpontok: [...] }

// TODO: routerek csatolása: /diakok, /jegyek

// TODO: 404-es kezelő, hibakezelő middleware (500)

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
