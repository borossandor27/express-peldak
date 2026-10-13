// =====================================================
// 10. és 11. feladat - Iskolai könyvtár API routerekkel
// Indítás: npm run f10
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK.md
//
// A utils/jsonDb.js KÉSZ, használd: olvas(nev), ment(nev, tomb), kovetkezoId(tomb)
// =====================================================

import express from 'express';

// TODO: routerek importja (routes/konyvek.js, routes/olvasok.js)
// TODO (11.): routes/kolcsonzesek.js importja

const app = express();
const PORT = 3000;

// TODO: express.json() middleware

// TODO: naplózó middleware (idő, metódus, url) - ne felejtsd a next()-et!

// TODO: GET /  -> { uzenet: 'Könyvtár API', vegpontok: [...] }

// TODO: routerek csatolása: /konyvek, /olvasok, (11.) /kolcsonzesek

// TODO: 404-es kezelő (JSON)

// TODO: hibakezelő middleware (4 paraméter: err, req, res, next) -> 500

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
