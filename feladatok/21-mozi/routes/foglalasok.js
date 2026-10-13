// =====================================================
// Foglalások router - csatolás: app.use('/foglalasok', ...)
// =====================================================

import { Router } from 'express';
import { olvas, ment, kovetkezoId } from '../utils/jsonDb.js';
// TODO: JEGYAR, helyKulcs, foglaltHelyek importja

const router = Router();
const FAJL = 'foglalasok';
const MAX_HELY = 10;

// TODO: GET /        ?nev=   (részleges keresés)

// TODO: GET /:id

// TODO: POST /       { vetitesId, nev, helyek: [{ sor, szek }, ...] }
//   Az ellenőrzések sorrendje:
//     1. formai hibák (vetitesId, nev, helyek 1-10 elemű tömb)   -> 400
//     2. létezik-e a vetítés                                     -> 404
//     3. minden hely a teremben van-e, nincs-e ismétlődés        -> 400
//     4. szabad-e minden hely                                    -> 409 (sorold fel a foglaltakat!)
//   Siker: 201, az ar = helyek száma × JEGYAR

// TODO: DELETE /:id  (lemondás)

export default router;
