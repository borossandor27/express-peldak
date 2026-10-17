// =====================================================
// Hitelesítés router: regisztráció, bejelentkezés, saját adatok
//
//   POST  /auth/regisztracio   { nev, email, jelszo }        -> 201
//   POST  /auth/bejelentkezes  { email, jelszo }              -> { token, felhasznalo }
//   GET   /auth/en             (token kell)                   -> a bejelentkezett felhasználó
//   PATCH /auth/jelszo         (token kell) { regiJelszo, ujJelszo }
// =====================================================

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/db.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// A bcrypt "költségtényezője": minél nagyobb, annál lassabb a hash-elés.
// 10 -> kb. 0,1 másodperc. A felhasználónak nem feltűnő, de egy támadónak
// milliárdnyi jelszó kipróbálása így nagyon sokáig tartana.
const BCRYPT_KOLTSEG = 10;

// A válaszba SOHA nem kerül bele a jelszo_hash!
const NYILVANOS_MEZOK = 'id, nev, email, letrehozva';

function jelszoHibak(jelszo, mezo = 'jelszo') {
  const hibak = [];
  if (typeof jelszo !== 'string' || jelszo.length < 8) {
    hibak.push(`A(z) ${mezo} legalább 8 karakter legyen.`);
  } else if (!/[A-Za-z]/.test(jelszo) || !/[0-9]/.test(jelszo)) {
    hibak.push(`A(z) ${mezo} tartalmazzon betűt és számjegyet is.`);
  }
  return hibak;
}

// Token készítése. A tokenbe csak az kerül, ami az azonosításhoz kell -
// jelszó vagy más titkos adat SOHA (a token tartalma bárki számára olvasható!).
function tokenKeszites(felhasznalo) {
  return jwt.sign({ id: felhasznalo.id, email: felhasznalo.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LEJARAT ?? '1h',
  });
}

// =====================================================
// Regisztráció
// =====================================================
router.post('/regisztracio', async (req, res) => {
  const { nev, email, jelszo } = req.body;

  const hibak = [];
  if (typeof nev !== 'string' || nev.trim() === '') hibak.push('A nev kötelező.');
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) hibak.push('Érvénytelen e-mail cím.');
  hibak.push(...jelszoHibak(jelszo));
  if (hibak.length > 0) return res.status(400).json({ hibak });

  // A jelszóból hash készül. Ugyanabból a jelszóból is mindig MÁS hash lesz,
  // mert a bcrypt véletlen "sót" (salt) is kever hozzá, és azt a hash-ben tárolja.
  const hash = await bcrypt.hash(jelszo, BCRYPT_KOLTSEG);

  try {
    const [eredmeny] = await pool.query(
      'INSERT INTO felhasznalok (nev, email, jelszo_hash) VALUES (?, ?, ?)',
      [nev.trim(), email.toLowerCase(), hash]
    );
    const [sorok] = await pool.query(`SELECT ${NYILVANOS_MEZOK} FROM felhasznalok WHERE id = ?`, [
      eredmeny.insertId,
    ]);
    res.status(201).json(sorok[0]);
  } catch (err) {
    // A UNIQUE kulcs miatt a MySQL dob hibát, ha az e-mail már foglalt
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ hiba: 'Ezzel az e-mail címmel már regisztráltak.' });
    }
    throw err; // minden más hibát a hibakezelő middleware kap meg -> 500
  }
});

// =====================================================
// Bejelentkezés
// =====================================================
router.post('/bejelentkezes', async (req, res) => {
  const { email, jelszo } = req.body;
  if (typeof email !== 'string' || typeof jelszo !== 'string') {
    return res.status(400).json({ hiba: 'Az email és a jelszo kötelező.' });
  }

  const [sorok] = await pool.query('SELECT * FROM felhasznalok WHERE email = ?', [email.toLowerCase()]);
  const felhasznalo = sorok[0];

  // A hash-ből a jelszó nem fejthető vissza, de ellenőrizni lehet:
  // a compare ugyanazzal a sóval hash-eli a beírt jelszót, és összeveti.
  const jo = felhasznalo && (await bcrypt.compare(jelszo, felhasznalo.jelszo_hash));

  // Ugyanaz az üzenet, ha nincs ilyen e-mail és ha rossz a jelszó:
  // így a támadó nem tudja kipróbálni, kik regisztráltak.
  if (!jo) return res.status(401).json({ hiba: 'Hibás e-mail cím vagy jelszó.' });

  res.json({
    token: tokenKeszites(felhasznalo),
    lejarat: process.env.JWT_LEJARAT ?? '1h',
    felhasznalo: { id: felhasznalo.id, nev: felhasznalo.nev, email: felhasznalo.email },
  });
});

// =====================================================
// Saját adatok - csak bejelentkezve
// Az authenticate middleware a route handler ELŐTT fut le.
// =====================================================
router.get('/en', authenticate, async (req, res) => {
  const [sorok] = await pool.query(`SELECT ${NYILVANOS_MEZOK} FROM felhasznalok WHERE id = ?`, [req.user.id]);

  // A token még érvényes lehet, de a felhasználót közben törölhették
  if (sorok.length === 0) return res.status(401).json({ hiba: 'A felhasználó már nem létezik.' });
  res.json(sorok[0]);
});

// =====================================================
// Jelszócsere - csak bejelentkezve, és a régi jelszót is meg kell adni
// =====================================================
router.patch('/jelszo', authenticate, async (req, res) => {
  const { regiJelszo, ujJelszo } = req.body;
  const hibak = jelszoHibak(ujJelszo, 'ujJelszo');
  if (typeof regiJelszo !== 'string') hibak.unshift('A regiJelszo kötelező.');
  if (hibak.length > 0) return res.status(400).json({ hibak });

  const [sorok] = await pool.query('SELECT jelszo_hash FROM felhasznalok WHERE id = ?', [req.user.id]);
  if (sorok.length === 0) return res.status(401).json({ hiba: 'A felhasználó már nem létezik.' });

  if (!(await bcrypt.compare(regiJelszo, sorok[0].jelszo_hash))) {
    return res.status(401).json({ hiba: 'A régi jelszó hibás.' });
  }

  const hash = await bcrypt.hash(ujJelszo, BCRYPT_KOLTSEG);
  await pool.query('UPDATE felhasznalok SET jelszo_hash = ? WHERE id = ?', [hash, req.user.id]);
  res.json({ uzenet: 'A jelszó megváltozott.' });
});

export default router;
