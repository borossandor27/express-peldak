// =====================================================
// Filmek router (csak olvasás) - csatolás: app.use('/filmek', ...)
// =====================================================

import { Router } from 'express';
import { olvas } from '../utils/jsonDb.js';

const router = Router();

// TODO: GET /

// TODO: GET /:id     a film adatai + "vetitesek" tömb (id, datum, idopont, terem)

export default router;
