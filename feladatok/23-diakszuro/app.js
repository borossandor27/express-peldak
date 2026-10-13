// =====================================================
// 23. feladat - Diákszűrő (query paraméterek)
// Indítás: npm run f23      Teszt: npm run t23
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-3.md
// =====================================================

import express from 'express';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const app = express();
const PORT = 3000;

const diakok = JSON.parse(readFileSync(join(import.meta.dirname, 'data', 'diakok.json'), 'utf-8'));

// TODO: szamma(ertek)  -> a query paramétert számmá alakítja; üres szövegre vagy nem számra NaN
//       (Vigyázat: Number('') === 0 !)

// GET /diakok  - EGYETLEN útvonal! Minden szűrő opcionális és kombinálható.
//   ?osztaly=13.B  ?nem=lány  ?nev=kis  ?minAtlag=4  ?maxAtlag=3.5  ?maxHianyzas=0
//   ?rendez=nev|atlag|hianyzas  ?irany=novekvo|csokkeno  ?limit=3
app.get('/diakok', (req, res) => {
  const { osztaly, nem, nev, minAtlag, maxAtlag, maxHianyzas, rendez, irany, limit } = req.query;

  // TODO 1. Ellenőrzés: ha egy paraméter meg van adva, de rossz -> 400 + { hiba: '...' }

  let eredmeny = [...diakok];

  // TODO 2. Szűrés: egymás után, if-ekkel (NEM else if!), pl.:
  //   if (osztaly !== undefined) eredmeny = eredmeny.filter(...);

  // TODO 3. Rendezés (a név szerinti rendezéshez: localeCompare(..., 'hu'))

  // TODO 4. limit (a rendezés UTÁN)

  res.json(eredmeny);
});

// TODO: GET /diakok/:id  -> egy objektum vagy 404 + { hiba: 'Nincs ilyen diák' }

// TODO: 404-es kezelő (JSON)

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}/diakok`));
