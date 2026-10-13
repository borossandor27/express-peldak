// =====================================================
// Tantárgyak router - csak olvasás (GET)
//
// FELADAT a diákoknak: egészítsd ki a POST, PUT, PATCH és DELETE
// végpontokkal a diakok.js mintájára!
// (Ellenőrizd POST-nál, hogy a tanarId létező tanárra mutat-e.)
// =====================================================

import { Router } from 'express';
import { olvas } from '../utils/jsonDb.js';

const router = Router();
const FAJL = 'tantargyak';

// GET /tantargyak  (opcionális: ?min=3 -> legalább 3 órás tárgyak)
router.get('/', async (req, res) => {
  let tantargyak = await olvas(FAJL);
  if (req.query.min) {
    tantargyak = tantargyak.filter((t) => t.oraszam >= Number(req.query.min));
  }
  res.json(tantargyak);
});

// GET /tantargyak/:id  - a tanár nevével együtt
router.get('/:id', async (req, res) => {
  const tantargyak = await olvas(FAJL);
  const tantargy = tantargyak.find((t) => t.id === Number(req.params.id));
  if (!tantargy) return res.status(404).json({ hiba: 'Nincs ilyen tantárgy' });

  const tanarok = await olvas('tanarok');
  const tanar = tanarok.find((t) => t.id === tantargy.tanarId);

  // Spread operátor: az eredeti mezők + egy új mező
  res.json({ ...tantargy, tanar: tanar ? tanar.nev : 'ismeretlen' });
});

export default router;
