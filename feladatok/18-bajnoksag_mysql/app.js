// =====================================================
// 18. feladat MySQL-lel - Iskolai focibajnokság
// Indítás: npm run f18-mysql
// Előtte:  1. data/bajnoksag.sql importálása (phpMyAdmin)
//          2. .env.example lemásolása .env néven
//          3. utils/db.js elkészítése (lásd a fő README "Adatbázisos (MySQL) változatok" részét)
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-2.md + README.md (ebben a mappában)
// =====================================================

import 'dotenv/config'; // a .env beolvasása - ez legyen az első import!
import express from 'express';
// TODO: import pool from './utils/db.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
app.use(express.json());

// Express 5-ben a req.body undefined, ha a kérésnek nincs törzse, vagy a törzs nem JSON
// (hiányzik a Content-Type: application/json fejléc). Ilyenkor a const { ... } = req.body
// sor TypeError-ral elszállna. Ezért:
//   - van törzs, de nem JSON -> érthető 400-as hibaüzenet
//   - nincs törzs            -> üres objektum, és a végpont saját ellenőrzése mondja meg,
//                               mi hiányzik (a törzs nélküli PATCH végpontok is működnek)
app.use((req, res, next) => {
  if (req.body === undefined) {
    const vanTorzs = Number(req.headers['content-length'] ?? 0) > 0 || req.headers['transfer-encoding'] !== undefined;
    if (vanTorzs && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
      return res.status(400).json({
        hiba: 'A kérés törzse nem JSON. Az adatokat JSON formában küldd, Content-Type: application/json fejléccel.',
      });
    }
    req.body = {};
  }
  next();
});

// TODO: MECCS_SELECT  -> a meccsek csapatnevekkel (JOIN a csapatok táblával KÉTSZER: hazai, vendég)
//   a mezők neve a válaszban: id, fordulo, hazai, vendeg, hazaiGol, vendegGol

// TODO: tabella()     -> egy lekérdezés: UNION ALL (hazai + vendég szemszög) + GROUP BY
//   + rendezés: pont, gólkülönbség, lőtt gól (mind csökkenő), utána helyezes mező

// TODO: GET /meccsek        ?fordulo=  ?csapat=

// TODO: GET /eredmenyek     (text/plain, soronként egy meccs)

// TODO: GET /tabella

// TODO: GET /csapat/:nev

// TODO: GET /statisztika

// TODO: GET /egymas-ellen?a=9.A&b=10.A

// TODO (bővítés): POST /meccsek, DELETE /meccsek/:id

// TODO: 404-es kezelő, hibakezelő middleware (500)

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
