// =====================================================
// 11. feladat - Kölcsönzések router
// Csatolás: app.use('/kolcsonzesek', ...)
// =====================================================

import { Router } from 'express';
import { olvas, ment, kovetkezoId } from '../utils/jsonDb.js';

const router = Router();
const FAJL = 'kolcsonzesek';

// Mai dátum "ÉÉÉÉ-HH-NN" formában
function maiDatum() {
  return new Date().toISOString().slice(0, 10);
}

// TODO: GET /                   konyvCim és olvasoNev mezőkkel kiegészítve; ?aktiv=true

// TODO: POST /                  { konyvId, olvasoId }
//         400: hiányzó / nem egész szám
//         404: nincs ilyen könyv / olvasó
//         409: a könyv már ki van kölcsönözve
//         201: { id, konyvId, olvasoId, datum, visszahozva: false }

// TODO: PATCH /:id/visszahoz    visszahozva: true, visszahozasDatum; ha már visszahozták: 409

export default router;
