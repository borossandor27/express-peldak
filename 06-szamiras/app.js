// =====================================================
// 06 - Számírás modul használata Express végpontokban
// Indítás:  npm run 06
// A modul tesztje: npm run 06-teszt
// =====================================================

import express from 'express';
import { szamBetuvel, romaiSzam, romaiSzambol } from './utils/szamiras.js';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.type('text/plain').send(
    [
      '06 - Számírás. Végpontok:',
      '',
      'GET /betuvel/2026        -> kétezer-huszonhat',
      'GET /betuvel/-1999       -> mínusz ezerkilencszázkilencvenkilenc',
      'GET /romai/2026          -> MMXXVI',
      'GET /arab/MMXXVI         -> 2026',
      'GET /szam/1848           -> minden alak JSON-ban',
      'GET /csekk?osszeg=25300  -> összeg betűvel, ahogy csekkre írnánk',
    ].join('\n')
  );
});

// A modul függvényei hibás bemenetnél RangeError-t dobnak.
// try...catch-csel elkapjuk, és 400-as választ küldünk.

app.get('/betuvel/:szam', (req, res) => {
  try {
    res.send(szamBetuvel(Number(req.params.szam)));
  } catch (hiba) {
    res.status(400).send(hiba.message);
  }
});

app.get('/romai/:szam', (req, res) => {
  try {
    res.send(romaiSzam(Number(req.params.szam)));
  } catch (hiba) {
    res.status(400).send(hiba.message);
  }
});

app.get('/arab/:romai', (req, res) => {
  try {
    res.send(String(romaiSzambol(req.params.romai)));
  } catch (hiba) {
    res.status(400).send(hiba.message);
  }
});

// Minden alak egyszerre, JSON-ban. A római alak csak 1-3999 között létezik.
app.get('/szam/:szam', (req, res) => {
  const szam = Number(req.params.szam);
  try {
    res.json({
      szam,
      betuvel: szamBetuvel(szam),
      romai: szam >= 1 && szam <= 3999 ? romaiSzam(szam) : null,
    });
  } catch (hiba) {
    res.status(400).json({ hiba: hiba.message });
  }
});

// Összeg betűvel, nagy kezdőbetűvel: "Huszonötezer-háromszáz forint"
app.get('/csekk', (req, res) => {
  const osszeg = Number(req.query.osszeg);
  if (!Number.isInteger(osszeg) || osszeg <= 0) {
    return res.status(400).send('Használat: /csekk?osszeg=25300');
  }
  const szoveg = szamBetuvel(osszeg);
  res.send(`${szoveg[0].toUpperCase()}${szoveg.slice(1)} forint`);
});

app.use((req, res) => {
  res.status(404).send('Nincs ilyen végpont.');
});

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
