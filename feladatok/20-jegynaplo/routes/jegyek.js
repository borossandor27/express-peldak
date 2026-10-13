// =====================================================
// Jegyek router - csatolás: app.use('/jegyek', ...)
// =====================================================

import { Router } from 'express';
import { olvas, ment, kovetkezoId } from '../utils/jsonDb.js';

const router = Router();
const FAJL = 'jegyek';

// TODO: GET    /          ?diakId=  ?tantargy=

// TODO: POST   /          { diakId, tantargy, jegy, suly?, datum? }
//   jegy: 1-5 egész; suly: 1 vagy 2 (alap: 1); datum: ÉÉÉÉ-HH-NN (alap: mai nap)
//   400: hibás adat (az összes hiba egyszerre); 404: nincs ilyen diák

// TODO: PATCH  /:id       csak a jegy és a suly módosítható

// TODO: DELETE /:id

export default router;
