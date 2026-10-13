// =====================================================
// 05 - Routing: több JSON erőforrás külön routerekben
// Indítás:  npm run 05
// Teszteléshez: 05-routing/requests.http
//
// Mappaszerkezet:
//   05-routing/
//   ├── app.js              <- belépési pont, itt csatoljuk a routereket
//   ├── routes/
//   │   ├── diakok.js       <- /diakok/...
//   │   ├── tanarok.js      <- /tanarok/...
//   │   └── tantargyak.js   <- /tantargyak/...
//   ├── utils/
//   │   └── jsonDb.js       <- JSON fájl olvasás / írás
//   └── data/
//       ├── diakok.json
//       ├── tanarok.json
//       └── tantargyak.json
// =====================================================

import express from 'express';

// A routerek default exporttal vannak exportálva -> szabad névvel importáljuk
import diakokRouter from './routes/diakok.js';
import tanarokRouter from './routes/tanarok.js';
import tantargyakRouter from './routes/tantargyak.js';

const app = express();
const PORT = 3000;

// ---------- Middleware-ek ----------
app.use(express.json());

// Saját naplózó middleware: minden kérésnél lefut, majd next()-tel továbbenged
app.use((req, res, next) => {
  const ido = new Date().toLocaleTimeString('hu-HU');
  console.log(`[${ido}] ${req.method} ${req.url}`);
  next(); // FONTOS! Nélküle a kérés itt "elakad"
});

// ---------- Kezdőlap ----------
app.get('/', (req, res) => {
  res.json({
    uzenet: 'Iskola API',
    vegpontok: ['/diakok', '/tanarok', '/tanarok/:id/tantargyak', '/tantargyak'],
  });
});

// ---------- Routerek csatolása ----------
// Az első paraméter az előtag (prefix): minden útvonal a routerben ehhez adódik
app.use('/diakok', diakokRouter);
app.use('/tanarok', tanarokRouter);
app.use('/tantargyak', tantargyakRouter);

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).json({ hiba: `Nincs ilyen végpont: ${req.method} ${req.url}` });
});

// ---------- Hibakezelő middleware (4 paraméter!) ----------
// Express 5-ben az async függvényekben dobott hibák automatikusan ide kerülnek
// (pl. ha egy JSON fájl hiányzik vagy hibás).
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ hiba: 'Szerverhiba', reszletek: err.message });
});

app.listen(PORT, () => {
  console.log(`Szerver fut: http://localhost:${PORT}`);
});
