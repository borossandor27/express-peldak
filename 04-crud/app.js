// =====================================================
// 04 - Teljes CRUD egy JSON tömbön
// Indítás:  npm run 04
// Teszteléshez: 04-crud/requests.http (VS Code REST Client), Postman vagy Thunder Client
//
//   CRUD     HTTP metódus   Útvonal           Siker státusz
//   -------  -------------  ----------------  -------------
//   Create   POST           /konyvek          201 Created
//   Read     GET            /konyvek          200 OK
//   Read     GET            /konyvek/:id      200 OK
//   Update   PUT            /konyvek/:id      200 OK   (teljes csere)
//   Update   PATCH          /konyvek/:id      200 OK   (részleges módosítás)
//   Delete   DELETE         /konyvek/:id      204 No Content
// =====================================================

import express from 'express';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const app = express();
const PORT = 3000;

// Middleware: a kérés törzsében érkező JSON-t feldolgozza -> req.body
// Enélkül a req.body undefined lenne POST/PUT/PATCH esetén!
app.use(express.json());

// Express 5-ben a req.body undefined, ha a kérésnek nincs törzse, vagy a törzs nem JSON
// (hiányzik a Content-Type: application/json fejléc). Ilyenkor a const { ... } = req.body
// sor TypeError-ral elszállna. Ezért:
//   - van törzs, de nem JSON -> érthető 400-as hibaüzenet
//   - nincs törzs            -> üres objektum, és a végpont saját ellenőrzése mondja meg,
//                               mi hiányzik (a törzs nélküli PATCH végpontok is működnek)
app.use((req, res, next) => {
  if (req.body === undefined) {
    const vanTorzs = Number(req.headers['content-length'] ?? 0) > 0 || req.headers['transfer-encoding'] !== undefined;
    if (vanTorzs && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
      return res.status(400).json({
        hiba: 'A kérés törzse nem JSON. Az adatokat JSON formában küldd, Content-Type: application/json fejléccel.',
      });
    }
    req.body = {};
  }
  next();
});

// ---------- Adatok betöltése és mentése ----------
// import.meta.dirname = az aktuális fájl mappája (ES modulban nincs __dirname)
const ADAT_FAJL = join(import.meta.dirname, 'data', 'konyvek.json');

let konyvek = JSON.parse(readFileSync(ADAT_FAJL, 'utf-8'));

function mentes() {
  // null, 2 -> szépen formázott (behúzott) JSON
  writeFileSync(ADAT_FAJL, JSON.stringify(konyvek, null, 2));
}

// Következő szabad id: a legnagyobb id + 1
function kovetkezoId() {
  return konyvek.length === 0 ? 1 : Math.max(...konyvek.map((k) => k.id)) + 1;
}

// Egyszerű ellenőrzés: minden kötelező mező megvan-e és jó típusú-e
function ellenoriz(adat) {
  const hibak = [];
  if (typeof adat.cim !== 'string' || adat.cim.trim() === '') hibak.push('A cím kötelező (szöveg).');
  if (typeof adat.szerzo !== 'string' || adat.szerzo.trim() === '') hibak.push('A szerző kötelező (szöveg).');
  if (!Number.isInteger(adat.ev)) hibak.push('Az év kötelező (egész szám).');
  return hibak;
}

// =====================================================
// READ - összes
// =====================================================
app.get('/konyvek', (req, res) => {
  res.json(konyvek);
});

// =====================================================
// READ - egy elem
// =====================================================
app.get('/konyvek/:id', (req, res) => {
  const id = Number(req.params.id);
  const konyv = konyvek.find((k) => k.id === id);

  if (!konyv) {
    return res.status(404).json({ hiba: 'Nincs ilyen könyv' });
  }
  res.json(konyv);
});

// =====================================================
// CREATE - új elem
// =====================================================
app.post('/konyvek', (req, res) => {
  const hibak = ellenoriz(req.body);
  if (hibak.length > 0) {
    // 400 = Bad Request (hibás kérés)
    return res.status(400).json({ hibak });
  }

  const ujKonyv = {
    id: kovetkezoId(), // az id-t a SZERVER adja, nem a kliens!
    cim: req.body.cim,
    szerzo: req.body.szerzo,
    ev: req.body.ev,
    kiolcsonozve: req.body.kiolcsonozve ?? false, // alapértelmezett érték
  };

  konyvek.push(ujKonyv);
  mentes();

  // 201 = Created, és visszaküldjük a létrehozott elemet
  res.status(201).json(ujKonyv);
});

// =====================================================
// UPDATE - teljes csere (PUT)
// Minden mezőt el kell küldeni!
// =====================================================
app.put('/konyvek/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = konyvek.findIndex((k) => k.id === id);

  if (index === -1) {
    return res.status(404).json({ hiba: 'Nincs ilyen könyv' });
  }

  const hibak = ellenoriz(req.body);
  if (hibak.length > 0) {
    return res.status(400).json({ hibak });
  }

  konyvek[index] = {
    id, // az id nem változik
    cim: req.body.cim,
    szerzo: req.body.szerzo,
    ev: req.body.ev,
    kiolcsonozve: req.body.kiolcsonozve ?? false,
  };
  mentes();

  res.json(konyvek[index]);
});

// =====================================================
// UPDATE - részleges módosítás (PATCH)
// Csak a megadott mezők változnak.
// =====================================================
app.patch('/konyvek/:id', (req, res) => {
  const id = Number(req.params.id);
  const konyv = konyvek.find((k) => k.id === id);

  if (!konyv) {
    return res.status(404).json({ hiba: 'Nincs ilyen könyv' });
  }

  // Csak az engedélyezett mezőket írjuk felül (az id-t nem!)
  const { cim, szerzo, ev, kiolcsonozve } = req.body;
  if (cim !== undefined) konyv.cim = cim;
  if (szerzo !== undefined) konyv.szerzo = szerzo;
  if (ev !== undefined) konyv.ev = ev;
  if (kiolcsonozve !== undefined) konyv.kiolcsonozve = kiolcsonozve;

  mentes();
  res.json(konyv);
});

// =====================================================
// DELETE - törlés
// =====================================================
app.delete('/konyvek/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = konyvek.findIndex((k) => k.id === id);

  if (index === -1) {
    return res.status(404).json({ hiba: 'Nincs ilyen könyv' });
  }

  konyvek.splice(index, 1);
  // Másik megoldás: konyvek = konyvek.filter((k) => k.id !== id);
  mentes();

  // 204 = No Content (sikeres, de nincs törzs)
  res.sendStatus(204);
});

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).json({ hiba: `Nincs ilyen végpont: ${req.method} ${req.url}` });
});

app.listen(PORT, () => {
  console.log(`Szerver fut: http://localhost:${PORT}/konyvek`);
});
