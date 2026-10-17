// =====================================================
// Hitelesítés router (a 08-as példa egyszerűsített változata)
//
//   POST /api/auth/regisztracio   { nev, email, jelszo }  -> 201, szerepkör: user
//   POST /api/auth/bejelentkezes  { email, jelszo }        -> { token, felhasznalo }
//   GET  /api/auth/en             (token kell)
//
// A token tartalma: { id, role } - ebből dönti el az authorize middleware,
// hogy mit tehet a felhasználó.
// =====================================================

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/db.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post('/regisztracio', async (req, res) => {
  const { nev, email, jelszo } = req.body;

  const hibak = [];
  if (typeof nev !== 'string' || nev.trim() === '') hibak.push('A nev kötelező.');
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) hibak.push('Érvénytelen e-mail cím.');
  if (typeof jelszo !== 'string' || jelszo.length < 8) hibak.push('A jelszo legalább 8 karakter legyen.');
  if (hibak.length > 0) return res.status(400).json({ hibak });

  // FONTOS: a szerepkört NEM a kliens adja meg! Ha a törzsben "szerepkor": "admin"
  // is van, azt figyelmen kívül hagyjuk - mindenki "user"-ként kezd,
  // és csak egy admin léptetheti elő (lásd routes/felhasznalok.js).
  const hash = await bcrypt.hash(jelszo, 10);

  try {
    const [eredmeny] = await pool.query(
      'INSERT INTO felhasznalok (nev, email, jelszo_hash) VALUES (?, ?, ?)',
      [nev.trim(), email.toLowerCase(), hash]
    );
    res.status(201).json({ id: eredmeny.insertId, nev: nev.trim(), email: email.toLowerCase(), szerepkor: 'user' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ hiba: 'Ezzel az e-mail címmel már regisztráltak.' });
    throw err;
  }
});

router.post('/bejelentkezes', async (req, res) => {
  const { email, jelszo } = req.body;
  if (typeof email !== 'string' || typeof jelszo !== 'string') {
    return res.status(400).json({ hiba: 'Az email és a jelszo kötelező.' });
  }

  const [sorok] = await pool.query('SELECT * FROM felhasznalok WHERE email = ?', [email.toLowerCase()]);
  const f = sorok[0];
  if (!f || !(await bcrypt.compare(jelszo, f.jelszo_hash))) {
    return res.status(401).json({ hiba: 'Hibás e-mail cím vagy jelszó.' });
  }

  // A szerepkör a tokenbe kerül -> a további kérésekhez nem kell adatbázisból olvasni
  const token = jwt.sign({ id: f.id, role: f.szerepkor }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LEJARAT ?? '1h',
  });

  res.json({ token, felhasznalo: { id: f.id, nev: f.nev, email: f.email, szerepkor: f.szerepkor } });
});

router.get('/en', authenticate, async (req, res) => {
  const [sorok] = await pool.query('SELECT id, nev, email, szerepkor FROM felhasznalok WHERE id = ?', [req.user.id]);
  if (sorok.length === 0) return res.status(401).json({ hiba: 'A felhasználó már nem létezik.' });

  // A tokenben lévő szerepkör (req.user.role) és az adatbázisbeli eltérhet,
  // ha közben egy admin megváltoztatta - lásd a README "Mire figyelj?" részét.
  res.json({ ...sorok[0], szerepkorATokenben: req.user.role });
});

export default router;
