// =====================================================
// Tanárok router - teljes CRUD + kapcsolódó adatok
// Csatolás: app.use('/tanarok', tanarokRouter);
// =====================================================

import { Router } from 'express';
import { olvas, ment, kovetkezoId } from '../utils/jsonDb.js';

const router = Router();
const FAJL = 'tanarok';

// GET /tanarok
router.get('/', async (req, res) => {
  res.json(await olvas(FAJL));
});

// GET /tanarok/:id
router.get('/:id', async (req, res) => {
  const tanarok = await olvas(FAJL);
  const tanar = tanarok.find((t) => t.id === Number(req.params.id));
  if (!tanar) return res.status(404).json({ hiba: 'Nincs ilyen tanár' });
  res.json(tanar);
});

// GET /tanarok/:id/tantargyak
// Két JSON fájl összekapcsolása: a tanár által tanított tantárgyak
router.get('/:id/tantargyak', async (req, res) => {
  const id = Number(req.params.id);
  const tanarok = await olvas(FAJL);
  const tanar = tanarok.find((t) => t.id === id);
  if (!tanar) return res.status(404).json({ hiba: 'Nincs ilyen tanár' });

  const tantargyak = await olvas('tantargyak');
  res.json({
    tanar: tanar.nev,
    tantargyak: tantargyak.filter((tt) => tt.tanarId === id),
  });
});

// POST /tanarok
router.post('/', async (req, res) => {
  const { nev, email } = req.body;
  if (!nev || !email) {
    return res.status(400).json({ hiba: 'A nev és az email kötelező' });
  }

  const tanarok = await olvas(FAJL);
  const uj = { id: kovetkezoId(tanarok), nev, email };
  tanarok.push(uj);
  await ment(FAJL, tanarok);
  res.status(201).json(uj);
});

// PUT /tanarok/:id
router.put('/:id', async (req, res) => {
  const { nev, email } = req.body;
  if (!nev || !email) {
    return res.status(400).json({ hiba: 'A nev és az email kötelező' });
  }

  const tanarok = await olvas(FAJL);
  const id = Number(req.params.id);
  const index = tanarok.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ hiba: 'Nincs ilyen tanár' });

  tanarok[index] = { id, nev, email };
  await ment(FAJL, tanarok);
  res.json(tanarok[index]);
});

// PATCH /tanarok/:id
router.patch('/:id', async (req, res) => {
  const tanarok = await olvas(FAJL);
  const tanar = tanarok.find((t) => t.id === Number(req.params.id));
  if (!tanar) return res.status(404).json({ hiba: 'Nincs ilyen tanár' });

  if (req.body.nev !== undefined) tanar.nev = req.body.nev;
  if (req.body.email !== undefined) tanar.email = req.body.email;

  await ment(FAJL, tanarok);
  res.json(tanar);
});

// DELETE /tanarok/:id
router.delete('/:id', async (req, res) => {
  const tanarok = await olvas(FAJL);
  const id = Number(req.params.id);
  const index = tanarok.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ hiba: 'Nincs ilyen tanár' });

  tanarok.splice(index, 1);
  await ment(FAJL, tanarok);
  res.sendStatus(204);
});

export default router;
