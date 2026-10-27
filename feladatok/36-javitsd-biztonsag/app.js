// =====================================================
// 36. feladat - Javítsd ki! Biztonsági hibák
// Indítás: npm run f36
// Előtte:  1. data/biztonsag.sql importálása (phpMyAdmin)
//          2. .env.example lemásolása .env néven
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-5.md + README.md (ebben a mappában)
//
// A program elindul, és a "rendes" kérésekre jól válaszol.
// Mégis 12 biztonsági hiba van benne. Keresd meg és javítsd mindet,
// és írd be őket a HIBALISTA.md fájlba!
// =====================================================

import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './utils/db.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
const TITOK = 'titok123';

app.use(express.json());
app.use((req, res, next) => {
  req.body ??= {};
  next();
});

function authenticate(req, res, next) {
  const [tipus, token] = (req.headers.authorization ?? '').split(' ');
  if (tipus !== 'Bearer' || !token) return res.status(401).json({ hiba: 'Hiányzó token!' });

  const adatok = jwt.decode(token);
  if (!adatok) return res.status(401).json({ hiba: 'Érvénytelen token!' });
  req.user = adatok;
  next();
}

app.get('/', (req, res) => {
  res.json({
    uzenet: 'Biztonsági hibák - javítsd ki!',
    nyilvanos: ['POST /auth/regisztracio', 'POST /auth/bejelentkezes'],
    vedett: [
      'GET /auth/en',
      'PATCH /auth/jelszo',
      'PATCH /auth/profil',
      'GET /felhasznalok',
      'GET /felhasznalok/kereses?nev=',
      'DELETE /felhasznalok/:id',
    ],
  });
});

// ---------- Regisztráció ----------
app.post('/auth/regisztracio', async (req, res) => {
  const { nev, email, jelszo } = req.body;
  const hibak = [];
  if (typeof nev !== 'string' || nev.trim() === '') hibak.push('A nev kötelező.');
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) hibak.push('Érvénytelen e-mail cím.');
  if (typeof jelszo !== 'string' || jelszo.length < 8) hibak.push('A jelszo legalább 8 karakter legyen.');
  if (hibak.length > 0) return res.status(400).json({ hibak });

  const hash = await bcrypt.hash(jelszo, 10);
  try {
    const [eredmeny] = await pool.query('INSERT INTO felhasznalok (nev, email, jelszo_hash) VALUES (?, ?, ?)', [
      nev.trim(),
      email.trim().toLowerCase(),
      hash,
    ]);
    const [sorok] = await pool.query('SELECT * FROM felhasznalok WHERE id = ?', [eredmeny.insertId]);
    res.status(201).json(sorok[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ hiba: 'Ezzel az e-mail címmel már regisztráltak.' });
    throw err;
  }
});

// ---------- Bejelentkezés ----------
app.post('/auth/bejelentkezes', async (req, res) => {
  const { email, jelszo } = req.body;
  if (typeof email !== 'string' || typeof jelszo !== 'string') {
    return res.status(400).json({ hiba: 'Az email és a jelszo kötelező.' });
  }

  const [sorok] = await pool.query('SELECT * FROM felhasznalok WHERE email = ?', [email.trim().toLowerCase()]);
  if (sorok.length === 0) return res.status(404).json({ hiba: 'Nincs ilyen e-mail címmel felhasználó.' });

  const felhasznalo = sorok[0];
  if (!(await bcrypt.compare(jelszo, felhasznalo.jelszo_hash))) {
    return res.status(401).json({ hiba: 'Hibás jelszó.' });
  }

  const token = jwt.sign({ ...felhasznalo }, TITOK);
  res.json({ token, felhasznalo: { id: felhasznalo.id, nev: felhasznalo.nev, email: felhasznalo.email } });
});

// ---------- Saját adatok ----------
app.get('/auth/en', authenticate, async (req, res) => {
  const [sorok] = await pool.query('SELECT id, nev, email, szerep, letrehozva FROM felhasznalok WHERE id = ?', [
    req.user.id,
  ]);
  if (sorok.length === 0) return res.status(401).json({ hiba: 'A felhasználó már nem létezik.' });
  res.json(sorok[0]);
});

// ---------- Jelszócsere ----------
app.patch('/auth/jelszo', authenticate, async (req, res) => {
  const { regiJelszo, ujJelszo } = req.body;
  if (typeof regiJelszo !== 'string') return res.status(400).json({ hiba: 'A regiJelszo kötelező.' });
  if (typeof ujJelszo !== 'string' || ujJelszo.length < 8) {
    return res.status(400).json({ hiba: 'Az ujJelszo legalább 8 karakter legyen.' });
  }

  const [sorok] = await pool.query('SELECT jelszo_hash FROM felhasznalok WHERE id = ?', [req.user.id]);
  if (sorok.length === 0) return res.status(401).json({ hiba: 'A felhasználó már nem létezik.' });
  if (!bcrypt.compare(regiJelszo, sorok[0].jelszo_hash)) {
    return res.status(401).json({ hiba: 'A régi jelszó hibás.' });
  }

  await pool.query('UPDATE felhasznalok SET jelszo_hash = ? WHERE id = ?', [await bcrypt.hash(ujJelszo, 10), req.user.id]);
  res.json({ uzenet: 'A jelszó megváltozott.' });
});

// ---------- Profil módosítása (csak a név módosítható) ----------
app.patch('/auth/profil', authenticate, async (req, res) => {
  const mezok = Object.keys(req.body);
  if (mezok.length === 0) return res.status(400).json({ hiba: 'Nincs mit módosítani.' });
  if (req.body.nev !== undefined && (typeof req.body.nev !== 'string' || req.body.nev.trim() === '')) {
    return res.status(400).json({ hiba: 'A nev nem lehet üres.' });
  }

  const beallitasok = mezok.map((mezo) => `${mezo} = ?`).join(', ');
  await pool.query(`UPDATE felhasznalok SET ${beallitasok} WHERE id = ?`, [...Object.values(req.body), req.user.id]);

  const [sorok] = await pool.query('SELECT id, nev, email, szerep FROM felhasznalok WHERE id = ?', [req.user.id]);
  res.json(sorok[0]);
});

// ---------- Névsor: a bejelentkezett felhasználók láthatják egymás nevét ----------
app.get('/felhasznalok', authenticate, async (req, res) => {
  const [sorok] = await pool.query('SELECT * FROM felhasznalok ORDER BY nev');
  res.json(sorok);
});

app.get('/felhasznalok/kereses', authenticate, async (req, res) => {
  const nev = String(req.query.nev ?? '');
  if (nev.trim().length < 2) return res.status(400).json({ hiba: 'Legalább 2 karaktert adj meg.' });

  const [sorok] = await pool.query(`SELECT id, nev FROM felhasznalok WHERE nev LIKE '%${nev}%' ORDER BY nev`);
  res.json(sorok);
});

// ---------- Fiók törlése: mindenki a SAJÁT fiókját törölheti ----------
app.delete('/felhasznalok/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ hiba: 'Hibás azonosító.' });

  const [eredmeny] = await pool.query('DELETE FROM felhasznalok WHERE id = ?', [id]);
  if (eredmeny.affectedRows === 0) return res.status(404).json({ hiba: 'Nincs ilyen felhasználó.' });
  res.status(204).end();
});

app.use((req, res) => {
  res.status(404).json({ hiba: `Nincs ilyen végpont: ${req.method} ${req.url}` });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ hiba: 'Hibás JSON a kérés törzsében.' });
  console.error(err);
  res.status(500).json({ hiba: err.message, sql: err.sql });
});

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
