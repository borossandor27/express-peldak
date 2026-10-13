// =====================================================
// 20. feladat - Elektronikus jegynapló
// Indítás: npm run f20
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK-2.md
//
// A utils/jsonDb.js KÉSZ: olvas(nev), ment(nev, tomb), kovetkezoId(tomb)
// =====================================================

import express from 'express';

// TODO: routerek importja (routes/diakok.js, routes/jegyek.js)

const app = express();
const PORT = 3000;

// TODO: express.json(), naplózó middleware

// TODO: GET /  -> { uzenet: 'Jegynapló API', vegpontok: [...] }

// TODO: routerek csatolása: /diakok, /jegyek

// TODO: 404-es kezelő, hibakezelő middleware

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
