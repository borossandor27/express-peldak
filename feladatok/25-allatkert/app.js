// =====================================================
// 25. feladat - Állatkert (útvonal-sorrend, objektum vagy tömb, 404)
// Indítás: npm run f25      Teszt: npm run t25
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-3.md
// =====================================================

import express from 'express';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const app = express();
const PORT = 3000;

const allatok = JSON.parse(readFileSync(join(import.meta.dirname, 'data', 'allatok.json'), 'utf-8'));

// Ez a végpont kész. Az útvonalak sorrendjén gondolkodj: hová kerüljenek a többiek?
app.get('/allatok/:id', (req, res) => {
  const allat = allatok.filter((a) => a.id == req.params.id);
  res.json(allat);
});
// ^ A fenti végpont 3 hibát is tartalmaz a feladat szerint. Melyek ezek? Javítsd ki!

// TODO: GET /allatok                  -> tömb
// TODO: GET /allatok/nevek            -> szövegtömb, magyar ábécérendben
// TODO: GET /allatok/statisztika      -> objektum: { osszes, kontinensenkent, legidosebb }
// TODO: GET /allatok/faj/:faj         -> tömb (részleges, kisbetű-nagybetű független); nincs találat: 200 + []
// TODO: GET /allatok/gondozo/:nev     -> tömb (részleges, kisbetű-nagybetű független); nincs ilyen gondozó: 404

// TODO: 404-es kezelő: minden más kérésre 404 + { hiba: 'Nincs ilyen végpont' }

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}/allatok`));
