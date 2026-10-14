// =====================================================
// 21. feladat MySQL-lel - Mozi jegyfoglalás
// Indítás: npm run f21-mysql
// Előtte:  1. data/mozi.sql importálása (phpMyAdmin)
//          2. .env.example lemásolása .env néven
//          3. utils/db.js elkészítése (lásd a fő README "Adatbázisos (MySQL) változatok" részét)
//             FIGYELEM: a dátumok miatt a pool beállításai közé kell: dateStrings: true
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-2.md + README.md (ebben a mappában)
//
// A mappaszerkezetet NEKED kell kialakítanod:
//   21-mozi_mysql/
//   ├── app.js
//   ├── .env                  (a .env.example másolata)
//   ├── routes/filmek.js
//   ├── routes/vetitesek.js
//   ├── routes/foglalasok.js
//   ├── utils/db.js
//   └── utils/helyek.js       (JEGYAR, helyKulcs, foglaltHelyek, ulesrend)
// =====================================================

import 'dotenv/config'; // a .env beolvasása - ez legyen az első import!
import express from 'express';

// TODO: routerek importja

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// TODO: express.json(), naplózó middleware

// TODO: GET /  -> { uzenet: 'Mozi API', vegpontok: [...] }

// TODO: routerek csatolása: /filmek, /vetitesek, /foglalasok

// TODO: 404-es kezelő, hibakezelő middleware (500)

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
