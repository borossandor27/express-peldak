// =====================================================
// 18. feladat - Iskolai focibajnokság
// Indítás: npm run f18
// A feladat leírása: feladatok/FELADATOK-2.md
// =====================================================

import express from 'express';
import meccsek from './data/meccsek.json' with { type: 'json' };

const app = express();
const PORT = 3000;

// TODO: csapatok()        -> a csapatnevek tömbje (egyedi, rendezett)
//   tipp: meccsek.flatMap(m => [m.hazai, m.vendeg])

// TODO: csapatStat(nev)   -> { csapat, meccs, gyozelem, dontetlen, vereseg, lott, kapott, golkulonbseg, pont }

// TODO: tabella()         -> a csapatStat-ok rendezve + helyezes mező

// TODO: GET /meccsek        ?fordulo=  ?csapat=

// TODO: GET /eredmenyek     (text/plain, soronként egy meccs)

// TODO: GET /tabella

// TODO: GET /csapat/:nev

// TODO: GET /statisztika

// TODO: GET /egymas-ellen?a=9.A&b=10.A

// TODO: 404-es kezelő (JSON)

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
