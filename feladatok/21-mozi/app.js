// =====================================================
// 21. feladat - Mozi jegyfoglalás
// Indítás: npm run f21
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-2.md
//
// A utils/jsonDb.js KÉSZ: olvas(nev), ment(nev, tomb), kovetkezoId(tomb)
// =====================================================

import express from 'express';

// TODO: a három router importja

const app = express();
const PORT = 3000;

// TODO: express.json(), naplózó middleware

// TODO: GET /

// TODO: routerek csatolása: /filmek, /vetitesek, /foglalasok

// TODO: 404-es kezelő, hibakezelő middleware

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
