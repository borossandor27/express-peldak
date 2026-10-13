// =====================================================
// 24. feladat - Hőmérséklet-napló (határértékek, a 0 csapdája)
// Indítás: npm run f24      Teszt: npm run t24
// ELŐSZÖR töltsd ki a VARAKOZAS.md táblázatát, csak utána kódolj!
// A feladat leírása: feladatok/FELADATOK-3.md
// =====================================================

import express from 'express';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const app = express();
const PORT = 3000;

const meresek = JSON.parse(readFileSync(join(import.meta.dirname, 'data', 'meresek.json'), 'utf-8'));

const DATUM_MINTA = /^\d{4}-\d{2}-\d{2}$/;

// TODO: szamE(s)  -> igaz, ha s nem üres szöveg és számmá alakítható

// TODO: queryHiba(q)  -> hibaüzenet (szöveg), ha valamelyik paraméter rossz, különben null
//   tol, ig: ÉÉÉÉ-HH-NN formátum (DATUM_MINTA.test(...))
//   minHo, maxHo, maxCsapadek: szám

// TODO: szur(lista, q)  -> a szűrt lista. A listázás ÉS a statisztika is ezt használja!
//   varos (kis- és nagybetű nem számít), tol, ig (a határnap is benne),
//   minHo, maxHo, maxCsapadek (a határérték is benne; a 0 is érvényes érték!)

// TODO: GET /meresek               ?varos= ?tol= ?ig= ?minHo= ?maxHo= ?maxCsapadek=
// TODO: GET /meresek/statisztika   ugyanezekkel a szűrőkkel -> { db, atlag, min, max, szarazNapok }
// TODO: GET /meresek/:id

// TODO: 404-es kezelő (JSON)

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}/meresek`));
