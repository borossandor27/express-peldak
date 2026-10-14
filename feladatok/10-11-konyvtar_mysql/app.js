// =====================================================
// 10. és 11. feladat - Iskolai könyvtár API routerekkel
// Indítás: npm run f10-mysql   (előtte: SQL importálása, .env.example -> .env, utils/db.js)
// Teszteléshez: requests.http
// A feladat leírása: feladatok/FELADATOK.md
//
// A utils/jsonDb.js helyett egy utils/db.js kapcsolatot (pool) használj, a .env adataival.
// A táblák bővítéséhez (email, visszahozasDatum) lásd a README.md-t.
// =====================================================

import 'dotenv/config'; // a .env beolvasása - ez legyen az első import!
import express from 'express';

// TODO: routerek importja (routes/konyvek.js, routes/olvasok.js)
// TODO (11.): routes/kolcsonzesek.js importja

const app = express();
const PORT = Number(process.env.PORT ?? 3000); // a .env-ből

// TODO: express.json() middleware

// TODO: naplózó middleware (idő, metódus, url) - ne felejtsd a next()-et!

// TODO: GET /  -> { uzenet: 'Könyvtár API', vegpontok: [...] }

// TODO: routerek csatolása: /konyvek, /olvasok, (11.) /kolcsonzesek

// TODO: 404-es kezelő (JSON)

// TODO: hibakezelő middleware (4 paraméter: err, req, res, next) -> 500

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
