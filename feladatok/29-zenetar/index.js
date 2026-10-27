// =====================================================
// 29. feladat - Zenetár (eloadok + albumok)
// Indítás: npm run f29
// Előtte:  1. data/zenetar.sql importálása (phpMyAdmin)
//          2. .env.example lemásolása .env néven
//          3. utils/db.js elkészítése (lásd a fő README "Adatbázisos (MySQL) változatok" részét)
// Teszteléshez: requests.http
// =====================================================

import 'dotenv/config'; // a .env beolvasása - ez legyen az első import!
import express from 'express';
import pool from './utils/db.js';
import albumRoute from './routes/albumRoute.js';
import eloadoRoute from './routes/eloadoRoute.js';
import statisztikaRoute from './routes/statisztikaRoute.js';
import mufajRoute from './routes/mufajRoute.js';
import orszagokRoute from './routes/orszagokRoute.js';

let vegpontok = [
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/eloadok`, leiras: 'Előadók listája (opcionális: ?orszag=)' },
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/eloadok/:id`, leiras: 'Egy előadó adatai + albumok tömb' },
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/albumok`, leiras: 'Albumok listája (opcionális: ?mufaj=  ?tol=  ?ig=)' },
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/albumok/kereses?q=`, leiras: 'Albumok keresése címben VAGY előadónévben (min. 2 karakter)' },
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/mufajok`, leiras: 'Műfajok listája' },
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/statisztika/eloadok`, leiras: 'Statisztika az előadókról (album nélküli előadó is!)' },
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/orszagok`, leiras: 'Országok listája' }
];


const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 3000);

app.use('/albumok', albumRoute);
app.use('/eloadok', eloadoRoute);
app.use('/statisztika', statisztikaRoute);
app.use('/mufajok', mufajRoute);
app.use('/orszagok', orszagokRoute);
app.use('/', (req, res) => {
    res.status(404).json(vegpontok);
});

// Központi hibakezelő: minden el nem kapott hibára 500-zal válaszol
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ hiba: 'Belső szerverhiba' });
});

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
