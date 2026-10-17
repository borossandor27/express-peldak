// =====================================================
// 07 - CRUD MySQL adatbázissal, a beállítások .env fájlban (dotenv)
// Indítás:  npm run 07
// Előtte:   1. XAMPP: MySQL indítása
//           2. phpMyAdmin: a data/express_pelda.sql importálása
//           3. a .env.example lemásolása .env néven (és kitöltése)
// Teszteléshez: 07-mysql/requests.http
//
//   Ugyanazok a végpontok, mint a 04-crud példában - csak az adatok
//   nem JSON fájlban, hanem MySQL táblában vannak.
// =====================================================

// A .env beolvasása - ez legyen az ELSŐ import, hogy a process.env már kész legyen
import 'dotenv/config';
import express from 'express';
import pool from './utils/db.js';
import konyvekRouter from './routes/konyvek.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3000); // a .env-ből, alapértelmezés: 3000

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

app.use('/konyvek', konyvekRouter);

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).json({ hiba: `Nincs ilyen végpont: ${req.method} ${req.url}` });
});

// ---------- Hibakezelő (4 paraméter!) ----------
// Az Express 5 az async handlerben keletkező hibát (pl. nem fut a MySQL)
// magától ide továbbítja. A részleteket csak a konzolra írjuk, a kliensnek nem.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ hiba: 'Szerverhiba' });
});

// Indítás előtt kipróbáljuk a kapcsolatot, így rögtön kiderül, ha rossz a .env
try {
  await pool.query('SELECT 1');
  app.listen(PORT, () => {
    console.log(`Adatbázis: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
    console.log(`Szerver fut: http://localhost:${PORT}/konyvek`);
  });
} catch (err) {
  console.error(`Nem sikerült csatlakozni az adatbázishoz: ${err.message}`);
  console.error('Fut a MySQL? Jók a .env fájl adatai? Importáltad az SQL fájlt?');
  process.exit(1);
}
