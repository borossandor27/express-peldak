// =====================================================
// 09 - Jogosultságkezelés (authorization): szerepkörök
// Indítás:  npm run 09
// Előtte:   1. XAMPP: MySQL indítása
//           2. phpMyAdmin: a data/konyvtar.sql, MAJD a data/felhasznalok.sql importálása
//           3. a .env.example lemásolása .env néven (JWT_SECRET kitöltése!)
// Teszteléshez: 09-authorization/requests.http
// =====================================================

import 'dotenv/config';
import express from 'express';
import pool from './utils/db.js';
import authRouter from './routes/auth.js';
import konyvekRouter from './routes/konyvek.js';
import felhasznalokRouter from './routes/felhasznalok.js';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('A .env fájlban a JWT_SECRET hiányzik vagy túl rövid (legalább 32 karakter kell).');
  process.exit(1);
}

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

// Express 5-ben a req.body undefined, ha a kérésnek nincs törzse, vagy nem JSON
// (hiányzik a Content-Type: application/json fejléc). Ilyenkor a route-ban a
// const { nev } = req.body sor TypeError-ral elszállna -> inkább érthető 400-at adunk.
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body === undefined) {
    return res.status(400).json({
      hiba: 'Hiányzik a kérés törzse. Az adatokat JSON formában küldd, Content-Type: application/json fejléccel.',
    });
  }
  next();
});

app.get('/', (req, res) => {
  res.json({
    uzenet: 'Könyvtár API szerepkörökkel',
    vegpontok: {
      'POST /api/auth/bejelentkezes': 'bárki',
      'POST /api/auth/regisztracio': 'bárki (user szerepkört kap)',
      'GET /api/auth/en': 'bejelentkezve',
      'GET /api/konyvek': 'user, librarian, admin',
      'POST /api/konyvek': 'librarian, admin',
      'DELETE /api/konyvek/:id': 'admin',
      'GET /api/felhasznalok': 'admin',
      'PATCH /api/felhasznalok/:id/szerepkor': 'admin',
    },
  });
});

app.use('/api/auth', authRouter);
app.use('/api/konyvek', konyvekRouter);
app.use('/api/felhasznalok', felhasznalokRouter);

app.use((req, res) => {
  res.status(404).json({ hiba: `Nincs ilyen végpont: ${req.method} ${req.url}` });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ hiba: 'Hibás JSON a kérés törzsében.' });
  console.error(err);
  res.status(500).json({ hiba: 'Szerverhiba' });
});

try {
  // A felhasznalok tábla a külön SQL fájlból jön - érdemes rögtön ellenőrizni
  await pool.query('SELECT 1 FROM felhasznalok LIMIT 1');
  app.listen(PORT, () => {
    console.log(`Adatbázis: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
    console.log(`Szerver fut: http://localhost:${PORT}`);
  });
} catch (err) {
  console.error(`Adatbázis hiba: ${err.message}`);
  console.error('Fut a MySQL? Jók a .env adatai? Importáltad a konyvtar.sql ÉS a felhasznalok.sql fájlt?');
  process.exit(1);
}
