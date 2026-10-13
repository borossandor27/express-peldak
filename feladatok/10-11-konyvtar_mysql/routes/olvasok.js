// =====================================================
// Olvasók router - csatolás: app.use('/olvasok', ...)
// =====================================================

import { Router } from 'express';
import { olvas, ment, kovetkezoId } from '../utils/jsonDb.js';

const router = Router();
const FAJL = 'olvasok';

// ----------------- 10. feladat -----------------

// TODO: GET    /
// TODO: GET    /:id
// TODO: POST   /       nev: nem üres; email: tartalmaz @-ot és pontot; foglalt email -> 409
// TODO: PATCH  /:id
// TODO: DELETE /:id

// ----------------- 11. feladat -----------------

// TODO: GET /:id/kolcsonzesek   az olvasó kölcsönzései a könyvek címével kiegészítve

export default router;
