// =====================================================
// Felhasználók kezelése - CSAK adminnak
//
//   GET   /api/felhasznalok                 felhasználók listája
//   PATCH /api/felhasznalok/:id/szerepkor   { szerepkor: 'user' | 'librarian' | 'admin' }
//
// Itt a middleware-eket nem végpontonként, hanem a router.use()-zal
// egyszerre adjuk meg: a router MINDEN végpontjára érvényesek.
// =====================================================

import { Router } from 'express';
import pool from '../utils/db.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();
const SZEREPKOROK = ['user', 'librarian', 'admin'];

router.use(authenticate, authorize('admin'));

router.get('/', async (req, res) => {
  // A jelszo_hash-t admin se kapja meg - nincs rá szüksége
  const [sorok] = await pool.query('SELECT id, nev, email, szerepkor FROM felhasznalok ORDER BY id');
  res.json(sorok);
});

router.patch('/:id/szerepkor', async (req, res) => {
  const id = Number(req.params.id);
  const { szerepkor } = req.body;

  if (!SZEREPKOROK.includes(szerepkor)) {
    return res.status(400).json({ hiba: `A szerepkor értéke: ${SZEREPKOROK.join(' | ')}` });
  }
  // Ha az utolsó admin elvenné a saját jogát, senki nem tudná visszaadni
  if (id === req.user.id) {
    return res.status(400).json({ hiba: 'A saját szerepkörödet nem módosíthatod.' });
  }

  const [eredmeny] = await pool.query('UPDATE felhasznalok SET szerepkor = ? WHERE id = ?', [szerepkor, id]);
  if (eredmeny.affectedRows === 0) return res.status(404).json({ hiba: 'Nincs ilyen felhasználó' });

  const [sorok] = await pool.query('SELECT id, nev, email, szerepkor FROM felhasznalok WHERE id = ?', [id]);
  res.json(sorok[0]);
});

export default router;
