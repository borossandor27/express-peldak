// =====================================================
// Diákok router - teljes CRUD
// Az app.js-ben így csatoljuk: app.use('/diakok', diakokRouter);
// Ezért itt az útvonalak RELATÍVAK: '/' valójában '/diakok',
// '/:id' valójában '/diakok/:id'.
// =====================================================

import { Router } from 'express';
import { olvas, ment, kovetkezoId } from '../utils/jsonDb.js';

const router = Router();
const FAJL = 'diakok';

// GET /diakok  (opcionális szűrés: ?osztaly=10.A)
router.get('/', async (req, res) => {
  let diakok = await olvas(FAJL);
  if (req.query.osztaly) {
    diakok = diakok.filter((d) => d.osztaly === req.query.osztaly);
  }
  res.json(diakok);
});

// GET /diakok/:id
router.get('/:id', async (req, res) => {
  const diakok = await olvas(FAJL);
  const diak = diakok.find((d) => d.id === Number(req.params.id));
  if (!diak) return res.status(404).json({ hiba: 'Nincs ilyen diák' });
  res.json(diak);
});

// POST /diakok
router.post('/', async (req, res) => {
  const { nev, osztaly } = req.body;
  if (!nev || !osztaly) {
    return res.status(400).json({ hiba: 'A nev és az osztaly kötelező' });
  }

  const diakok = await olvas(FAJL);
  const uj = { id: kovetkezoId(diakok), nev, osztaly };
  diakok.push(uj);
  await ment(FAJL, diakok);

  res.status(201).json(uj);
});

// PUT /diakok/:id
router.put('/:id', async (req, res) => {
  const { nev, osztaly } = req.body;
  if (!nev || !osztaly) {
    return res.status(400).json({ hiba: 'A nev és az osztaly kötelező' });
  }

  const diakok = await olvas(FAJL);
  const id = Number(req.params.id);
  const index = diakok.findIndex((d) => d.id === id);
  if (index === -1) return res.status(404).json({ hiba: 'Nincs ilyen diák' });

  diakok[index] = { id, nev, osztaly };
  await ment(FAJL, diakok);
  res.json(diakok[index]);
});

// PATCH /diakok/:id
router.patch('/:id', async (req, res) => {
  const diakok = await olvas(FAJL);
  const diak = diakok.find((d) => d.id === Number(req.params.id));
  if (!diak) return res.status(404).json({ hiba: 'Nincs ilyen diák' });

  if (req.body.nev !== undefined) diak.nev = req.body.nev;
  if (req.body.osztaly !== undefined) diak.osztaly = req.body.osztaly;

  await ment(FAJL, diakok);
  res.json(diak);
});

// DELETE /diakok/:id
router.delete('/:id', async (req, res) => {
  const diakok = await olvas(FAJL);
  const id = Number(req.params.id);
  const maradek = diakok.filter((d) => d.id !== id);

  if (maradek.length === diakok.length) {
    return res.status(404).json({ hiba: 'Nincs ilyen diák' });
  }

  await ment(FAJL, maradek);
  res.sendStatus(204);
});

export default router;
