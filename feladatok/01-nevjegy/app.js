// =====================================================
// 01. feladat - Névjegy szerver
// Indítás: npm run f01
// A feladat leírása: feladatok/FELADATOK.md
// =====================================================

import express from 'express';

const app = express();
const PORT = 3000;

// Írd át a saját adataidra!
const NEV = 'Minta Máté';
const OSZTALY = '10.A';
const SZULETESI_EV = 2010;
const HOBBIK = ['foci', 'programozás', 'gitár'];

// TODO: GET /            -> "Üdvözöllek a névjegy oldalamon!"

// TODO: GET /nev         -> "A nevem: ..."

// TODO: GET /osztaly     -> "Osztályom: ..."

// TODO: GET /eletkor     -> az életkor kiszámítva (aktuális év - születési év)

// TODO: GET /hobbik      -> a hobbik számozott listája, soronként egy (text/plain)

// TODO: GET /hobbik/:sorszam -> az adott sorszámú hobbi, ha nincs ilyen: 404

// TODO: 404-es kezelő (a végére!)

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
