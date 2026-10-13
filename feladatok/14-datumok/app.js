// =====================================================
// 14. feladat - Dátumkalkulátor
// Indítás: npm run f14
// A feladat leírása: feladatok/FELADATOK-2.md
// =====================================================

import express from 'express';

// TODO: import * as datum from './utils/datumEszkozok.js';

// TODO (szorgalmi): a 02-es mintapélda dátum moduljának importja
//   (husvetNapjai, punkosdNapjai) - figyelj a relatív útvonalra!

const app = express();
const PORT = 3000;

// TODO: GET /szokoev/:ev

// TODO: GET /nap/:datum                 pl. /nap/2026-10-04

// TODO: GET /honap/:ev/:honap           pl. /honap/2024/2

// TODO: GET /kulonbseg?tol=...&ig=...

// TODO: GET /karacsonyig

// TODO: GET /eletkor?szuletes=...        -> JSON

// TODO (szorgalmi): GET /unnepek/:ev    -> JSON

// TODO: 404-es kezelő

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
