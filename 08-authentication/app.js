// =====================================================
// 08 - Hitelesítés (authentication): regisztráció, bejelentkezés, JWT
// Előtte:   1. XAMPP: MySQL indítása
//           2. phpMyAdmin: a data/auth_pelda.sql importálása
//           3. a .env.example lemásolása .env néven (JWT_SECRET kitöltése!)
//           4. a projekt gyökerében egyszer: npm install jsonwebtoken bcryptjs
// Teszteléshez: 08-authentication/requests.http
// =====================================================

import 'dotenv/config';
import express from 'express';
import pool from './utils/db.js';
import authRouter from './routes/auth.js';
import { authenticate } from './middleware/authenticate.js';

// Titkos kulcs nélkül bárki hamisíthatna tokent -> inkább el se induljon
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

// ---------- Nyilvános végpont: bárki elérheti ----------
app.get('/', (req, res) => {
  res.json({
    uzenet: 'Hitelesítés példa',
    nyilvanos: ['GET /', 'POST /auth/regisztracio', 'POST /auth/bejelentkezes'],
    vedett: ['GET /auth/en', 'PATCH /auth/jelszo', 'GET /titkos'],
  });
});

app.use('/auth', authRouter);

// ---------- Védett végpont: csak érvényes tokennel ----------
// Az authenticate a route handler előtt fut. Ha nincs jó token, a handler
// le sem fut; ha van, a req.user-ben ott a token tartalma.
app.get('/titkos', authenticate, (req, res) => {
  res.json({ uzenet: `Szia, ${req.user.email}! Ezt csak bejelentkezve láthatod.` });
});

app.use((req, res) => {
  res.status(404).json({ hiba: `Nincs ilyen végpont: ${req.method} ${req.url}` });
});

// Rossz JSON törzs (pl. hiányzó idézőjel) -> 400, minden más -> 500
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ hiba: 'Hibás JSON a kérés törzsében.' });
  console.error(err);
  res.status(500).json({ hiba: 'Szerverhiba' });
});

try {
  await pool.query('SELECT 1');
  app.listen(PORT, () => {
    console.log(`Adatbázis: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
    console.log(`Szerver fut: http://localhost:${PORT}`);
  });
} catch (err) {
  console.error(`Nem sikerült csatlakozni az adatbázishoz: ${err.message}`);
  console.error('Fut a MySQL? Jók a .env fájl adatai? Importáltad az SQL fájlt?');
  process.exit(1);
}
