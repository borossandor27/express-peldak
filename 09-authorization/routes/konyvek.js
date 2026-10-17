// =====================================================
// Könyvek router - szerepkör-alapú jogosultságokkal
//
//   Végpont                    Ki használhatja?
//   GET    /api/konyvek        minden bejelentkezett felhasználó
//   GET    /api/konyvek/:id    minden bejelentkezett felhasználó
//   POST   /api/konyvek        librarian, admin
//   DELETE /api/konyvek/:id    admin
//
// A middleware-ek balról jobbra futnak:
//   authenticate      -> 401, ha nincs érvényes token     ("Ki vagy?")
//   authorize(...)    -> 403, ha nincs megfelelő szerepkör ("Szabad ezt?")
//   async (req, res)  -> csak engedélyezett kérésnél fut le
// =====================================================

import express from 'express';
import pool from '../utils/db.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// A konyvek tábla csak a szerző azonosítóját tárolja -> JOIN a nevéért
const KONYV_SELECT = `
  SELECT k.id, k.cim, k.ev, k.szerzo_id, s.szerzo
  FROM konyvek k
  JOIN szerzok s ON s.id = k.szerzo_id`;

async function egyKonyv(id) {
  const [sorok] = await pool.query(`${KONYV_SELECT} WHERE k.id = ?`, [id]);
  return sorok[0] ?? null;
}

// A MySQL a '2abc' szöveget 2-nek venné, ezért az id-t előbb ellenőrizzük
router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(404).json({ hiba: 'Nincs ilyen könyv' });
  next();
});

// Könyvek listázása: minden bejelentkezett felhasználónak
router.get('/', authenticate, async (req, res) => {
  const [sorok] = await pool.query(`${KONYV_SELECT} ORDER BY k.id`);
  res.json(sorok);
});

router.get('/:id', authenticate, async (req, res) => {
  const konyv = await egyKonyv(req.params.id);
  if (!konyv) return res.status(404).json({ hiba: 'Nincs ilyen könyv' });
  res.json(konyv);
});

// Új könyv felvétele: könyvtáros vagy admin
router.post('/', authenticate, authorize('librarian', 'admin'), async (req, res) => {
  const { cim, szerzo_id, ev } = req.body;

  const hibak = [];
  if (typeof cim !== 'string' || cim.trim() === '') hibak.push('A cim kötelező (szöveg).');
  if (!Number.isInteger(szerzo_id)) hibak.push('A szerzo_id kötelező (egész szám).');
  if (!Number.isInteger(ev) || ev > new Date().getFullYear()) hibak.push('Az ev érvényes egész szám legyen.');
  if (hibak.length > 0) return res.status(400).json({ hibak });

  const [szerzok] = await pool.query('SELECT id FROM szerzok WHERE id = ?', [szerzo_id]);
  if (szerzok.length === 0) return res.status(400).json({ hibak: ['Nincs ilyen szerző (szerzo_id).'] });

  const [eredmeny] = await pool.query('INSERT INTO konyvek (cim, szerzo_id, ev) VALUES (?, ?, ?)', [
    cim.trim(),
    szerzo_id,
    ev,
  ]);
  res.status(201).json(await egyKonyv(eredmeny.insertId));
});

// Könyv törlése: csak admin
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [eredmeny] = await pool.query('DELETE FROM konyvek WHERE id = ?', [req.params.id]);
    if (eredmeny.affectedRows === 0) return res.status(404).json({ hiba: 'Nincs ilyen könyv' });
    res.sendStatus(204);
  } catch (err) {
    // Az idegen kulcs (kolcsonzesek.konyvId) nem engedi törölni a kölcsönzött könyvet
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ hiba: 'A könyvhöz kölcsönzés tartozik, nem törölhető.' });
    }
    throw err;
  }
});

export default router;
