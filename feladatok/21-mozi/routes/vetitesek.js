// =====================================================
// Vetítések router - csatolás: app.use('/vetitesek', ...)
// =====================================================

import { Router } from 'express';
import { olvas } from '../utils/jsonDb.js';
// TODO: foglaltHelyek, ulesrend importja a ../utils/helyek.js-ből

const router = Router();

// TODO: GET /               ?datum=  ?filmId=   dátum és időpont szerint rendezve,
//                           minden vetítés kiegészítve: film (cím), szabadHelyek

// TODO: GET /:id            ugyanígy kiegészítve

// TODO: GET /:id/ulesrend   text/plain

export default router;
