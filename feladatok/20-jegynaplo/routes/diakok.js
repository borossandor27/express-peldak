// =====================================================
// Diákok router - csatolás: app.use('/diakok', ...)
// =====================================================

import { Router } from 'express';
import { olvas, ment, kovetkezoId } from '../utils/jsonDb.js';
// TODO: az atlag.js függvényeinek importja

const router = Router();

// TODO: bizonyitvany(diak, osszesJegy) segédfüggvény
//   -> { diak, osztaly, tantargyak: [{ tantargy, jegyek, atlag, zaroJegy, szoveggel }], osszAtlag }
//   (a /:id/bizonyitvany és a /rangsor is ezt használja)

// TODO: GET    /                    ?osztaly=
// TODO: GET    /rangsor             ?osztaly=        (a /:id ELŐTT!)
// TODO: GET    /:id
// TODO: GET    /:id/bizonyitvany
// TODO: POST   /                    nev: nem üres; osztaly: pl. "10.A" formátum
// TODO: DELETE /:id                 a diák jegyeit is töröld!

export default router;
