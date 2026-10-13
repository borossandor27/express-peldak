// =====================================================
// Könyvek router - csatolás: app.use('/konyvek', ...)
// =====================================================

import { Router } from 'express';
import { olvas, ment, kovetkezoId } from '../utils/jsonDb.js';

const router = Router();
const FAJL = 'konyvek';

// ----------------- 10. feladat -----------------

// TODO: GET    /            ?szerzo= (részleges, kisbetű-nagybetű független keresés)
// TODO: GET    /:id
// TODO: POST   /            cim, szerzo: nem üres szöveg; ev: egész, nem lehet jövőbeli
// TODO: PUT    /:id
// TODO: DELETE /:id

// ----------------- 11. feladat -----------------

// TODO: GET /elerheto        a jelenleg ki nem kölcsönzött könyvek
// TODO: (szorgalmi) DELETE /:id -> 409, ha a könyv éppen ki van kölcsönözve

export default router;
